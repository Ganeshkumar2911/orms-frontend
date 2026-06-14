<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Moon, Sun } from 'lucide-vue-next'
import BottomNav from '@/components/common/BottomNav.vue'
import { getTheme, toggleTheme } from '@/utils/theme'
import { useUserStore } from '@/stores/profile/profile'

const userStore = useUserStore()

const route = useRoute()
const theme = ref(getTheme() || 'light')

onMounted(() => {
  userStore.fetchProfile()
})


const handleThemeToggle = () => {
  theme.value = toggleTheme()
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-card-background border-b border-primary-border h-14 flex items-center justify-between px-4">
      <h1 class="title-text text-primary-text truncate">
        {{ route.meta?.title || 'OMS' }}
      </h1>

      <button
        type="button"
        @click="handleThemeToggle"
        class="ml-4 rounded-xl border border-primary-border bg-transparent p-2 text-primary-text transition hover:bg-primary-border/10"
        aria-label="Toggle theme"
      >
        <component
          :is="theme === 'dark' ? Sun : Moon"
          :size="18"
        />
      </button>
    </header>

    <!-- Content -->
    <main class="flex-1 pt-14 pb-16 overflow-y-auto">
      <RouterView />
    </main>

    <!-- Bottom Nav -->
    <BottomNav />

  </div>
</template>