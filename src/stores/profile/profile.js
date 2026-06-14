import { defineStore } from 'pinia'
import { ref } from 'vue'

import apiRequest from '@/api/request'
import urls from '@/api/urls'

export const useUserStore = defineStore(
  'user',
  () => {
    // State

    const user = ref(null)

    const loading = ref(false)

    const error = ref(null)

    const isFetched = ref(false)

    // API Methods

    const fetchProfile = (force = false) => {
      if (isFetched.value && !force) return

      loading.value = true

      error.value = null

      const successHandler = (res) => {
        user.value = res?.user || null

        isFetched.value = true

        loading.value = false
      }

      const failureHandler = (err) => {
        error.value = err

        loading.value = false
      }

      apiRequest(
        urls.KEYS.GET,
        urls.auth.me,
        {
          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    // Reset

    const reset = () => {
      user.value = null

      loading.value = false

      error.value = null

      isFetched.value = false
    }

    // Return

    return {
      user,

      loading,

      error,

      isFetched,

      fetchProfile,

      reset,
    }
  }
)
