import { defineStore } from 'pinia'
import { ref } from 'vue'

import apiRequest from '@/api/request'
import urls from '@/api/urls'
import authToken from '@/common/authToken'

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

    const logout = (onSuccess, onFailure) => {
      loading.value = true
      apiRequest(
        urls.KEYS.POST,
        urls.auth.logout,
        {
          onSuccess: (res) => {
            authToken.removeToken()
            reset()
            loading.value = false
            if (onSuccess) onSuccess(res)
          },
          onFailure: (err) => {
            // Clear token and reset state anyway to prevent user being stuck
            authToken.removeToken()
            reset()
            loading.value = false
            if (onFailure) onFailure(err)
          }
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

      logout,

      reset,
    }
  }
)
