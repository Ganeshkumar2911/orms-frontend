<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'

import apiRequest from '@/api/request'
import urls from '@/api/urls'

import { useSnackbarStore } from '@/stores/snackbar/snackbar'

const router = useRouter()

const snackbar = useSnackbarStore()

const email = ref('')
const password = ref('')

const showPassword = ref(false)

const loginLoading = ref(false)

const emailError = computed(() => {
  if (!email.value) return ''

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return emailRegex.test(email.value)
    ? ''
    : 'Please enter a valid email address.'
})

const login = () => {
  if (!email.value || !password.value) {
    snackbar.show(
      'Please fill all required fields.',
      'error'
    )

    return
  }

  if (emailError.value) {
    snackbar.show(
      'Please enter a valid email address.',
      'error'
    )

    return
  }

  loginLoading.value = true

  const successHandler = (res) => {
    loginLoading.value = false

    snackbar.show(
      res?.message || 'Login successful.',
      'success'
    )

    router.replace('/orders')
  }

  const failureHandler = (err) => {
    loginLoading.value = false

    snackbar.show(
      err?.message || 'Login failed.',
      'error'
    )
  }

  apiRequest(
    urls.KEYS.POST,
    urls.auth.login,
    {
      data: {
        email: email.value.trim(),
        password: password.value,
      },

      onSuccess: successHandler,
      onFailure: failureHandler,
    }
  )
}
</script>

<template>
  <div
    class="min-h-screen bg-background px-5 flex items-center"
  >
    <div class="w-full max-w-md mx-auto">
      <div class="mb-8">
        <h1 class="title-text text-primary-text">
          Welcome Back
        </h1>

        <p class="sub-text text-secondary-text mt-1">
          Sign in to continue managing orders.
        </p>
      </div>

      <div
        class="bg-card-background border border-primary-border rounded-2xl p-5"
      >
        <div class="space-y-4">
          <div>
            <label class="label-text block mb-2">
              Email Address
            </label>

            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="input-field"
              @keyup.enter="login"
            />

            <p
              v-if="emailError"
              class="text-primary-red text-xs mt-1"
            >
              {{ emailError }}
            </p>
          </div>

          <div>
            <label class="label-text block mb-2">
              Password
            </label>

            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="input-field pr-12"
                @keyup.enter="login"
              />

              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text"
                @click="showPassword = !showPassword"
              >
                <Eye
                  v-if="!showPassword"
                  :size="18"
                />

                <EyeOff
                  v-else
                  :size="18"
                />
              </button>
            </div>
          </div>

          <button
            class="w-full bg-primary-accent text-white rounded-xl py-3 font-medium disabled:opacity-50"
            :disabled="
              loginLoading ||
              !email ||
              !password ||
              !!emailError
            "
            @click="login"
          >
            {{ loginLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </div>
      </div>

      <p
        class="sub-text text-secondary-text text-center mt-6"
      >
        Order Management System
      </p>
    </div>
  </div>
</template>
