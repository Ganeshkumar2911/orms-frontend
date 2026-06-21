<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Moon, Sun, ArrowLeft, LogOut } from 'lucide-vue-next'
import BottomNav from '@/components/common/BottomNav.vue'
import { getTheme, toggleTheme } from '@/utils/theme'
import { useUserStore } from '@/stores/profile/profile'
import apiRequest from '@/api/request'
import urls from '@/api/urls'
import { useSnackbarStore } from '@/stores/snackbar/snackbar'
import { getFCMToken } from '@/utils/fcm'

const userStore = useUserStore()
const snackbar = useSnackbarStore()

const route = useRoute()
const router = useRouter()
const theme = ref(getTheme() || 'light')
const logoutConfirm = ref({ show: false })
const logoutLoading = ref(false)

onMounted(() => {
  userStore.fetchProfile()
  saveFCMToken()
})

const saveFCMToken = async () => {
  const token = await getFCMToken()

  // alert(token || "TOKEN IS NULL");alert(`Secure Context: ${window.isSecureContext}`);

  if (!token) return

  const successHandler = () => {
    snackbar.show('FCM token saved successfully', 'success')
  }

  const failureHandler = (err) => {
    snackbar.show(err?.message || 'Failed to save FCM token', 'error')
  }

  apiRequest(
    urls.KEYS.POST,
    urls.auth.saveFMC,
    {
      data: {
        token: token,
      },
      isTokenRequired: true,
      onSuccess: successHandler,
      onFailure: failureHandler,
    }
  )
}

const handleThemeToggle = () => {
  theme.value = toggleTheme()
}

const goBack = () => {
  router.back()
}

const openLogoutDialog = () => {
  logoutConfirm.value.show = true
}

const closeLogoutDialog = () => {
  logoutConfirm.value.show = false
}

const handleLogout = () => {
  logoutLoading.value = true

  const successHandler = () => {
    logoutLoading.value = false
    closeLogoutDialog()
    userStore.reset()
    router.push({ name: 'login' })
    snackbar.show('Logged out successfully', 'success')
  }

  const failureHandler = (err) => {
    logoutLoading.value = false
    snackbar.show(err?.message || 'Failed to logout', 'error')
  }

  apiRequest(
    urls.KEYS.POST,
    urls.auth.logout,
    {
      isTokenRequired: true,
      onSuccess: successHandler,
      onFailure: failureHandler,
    }
  )
}

// Premium dynamic greeting
const getGreeting = () => {
  const hr = new Date().getHours()
  if (hr < 12) return 'Good Morning'
  if (hr < 17) return 'Good Afternoon'
  return 'Good Evening'
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-card-background border-b border-primary-border h-16 flex items-center justify-between px-4">
      <div class="flex items-center gap-3 min-w-0">
        <button
          v-if="route.meta?.showBackButton"
          type="button"
          @click="goBack"
          class="rounded-xl border border-primary-border bg-transparent p-2 text-primary-text transition hover:bg-primary-border/10 shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft :size="18" />
        </button>
        <div class="flex flex-col justify-center min-w-0">
          <h1 class="title-text text-primary-text truncate leading-tight">
            {{ route.meta?.title || 'OMS' }}
          </h1>
          <p 
            v-if="userStore.user" 
            class="text-[11px] text-secondary-text font-medium leading-none mt-1.5 truncate animate-fade-in"
          >
            {{ getGreeting() }}, {{ userStore.user.name }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="handleThemeToggle"
          class="rounded-xl border border-primary-border bg-transparent p-2 text-primary-text transition hover:bg-primary-border/10 shrink-0"
          aria-label="Toggle theme"
        >
          <component
            :is="theme === 'dark' ? Sun : Moon"
            :size="18"
          />
        </button>
        <button
          type="button"
          @click="openLogoutDialog"
          class="rounded-xl border border-primary-border bg-transparent p-2 text-primary-red transition hover:bg-primary-border/10 shrink-0"
          aria-label="Logout"
        >
          <LogOut :size="18" />
        </button>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 pt-16 pb-16 overflow-y-auto">
      <RouterView />
    </main>

    <!-- Bottom Nav -->
    <BottomNav />

  </div>

  <!-- Logout Confirmation Modal -->
  <Teleport to="body">
    <div v-if="logoutConfirm.show" class="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-black/50" @click="closeLogoutDialog" />
      <div class="relative bg-card-background border border-primary-border rounded-2xl p-5 w-full max-w-sm flex flex-col gap-4 z-10">
        <p class="mid-text text-primary-text text-center">Are you sure you want to logout?</p>
        <div class="flex gap-3">
          <button
            @click="closeLogoutDialog"
            :disabled="logoutLoading"
            class="flex-1 py-2.5 rounded-xl border border-primary-border label-text text-secondary-text disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            @click="handleLogout"
            :disabled="logoutLoading"
            class="flex-1 py-2.5 rounded-xl bg-primary-red text-white text-sm disabled:opacity-50"
          >
            {{ logoutLoading ? 'Logging out...' : 'Logout' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
