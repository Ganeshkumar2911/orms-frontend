import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import apiRequest from '@/api/request'
import urls from '@/api/urls'

import { useSnackbarStore } from '@/stores/snackbar/snackbar'

export const useDashboardStore = defineStore(
  'dashboard',
  () => {
    // Snackbar

    const snackbar = useSnackbarStore()

    // State

    const loading = ref(false)

    const error = ref(null)

    const needsAttention = ref([])

    const pendingDispatch = ref([])

    // Summary

    const summary = reactive({
      waitingApproval: 0,
      waitingExecution: 0,
      pendingDispatch: 0,
      completedToday: 0,
    })

    // API Methods

    const fetchDashboard = () => {
      loading.value = true

      error.value = null

      const successHandler = (res) => {
        Object.assign(summary, {
          waitingApproval:
            res?.summary?.waitingApproval || 0,

          waitingExecution:
            res?.summary?.waitingExecution || 0,

          pendingDispatch:
            res?.summary?.pendingDispatch || 0,

          completedToday:
            res?.summary?.completedToday || 0,
        })

        needsAttention.value =
          res?.needsAttention || []

        pendingDispatch.value =
          res?.pendingDispatch || []

        loading.value = false
      }

      const failureHandler = (err) => {
        error.value = err

        loading.value = false

        snackbar.show(
          err?.message ||
            'Failed to fetch dashboard.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.GET,
        urls.dashboard.summary,
        {
          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    // Reset

    const reset = () => {
      loading.value = false

      error.value = null

      needsAttention.value = []

      pendingDispatch.value = []

      Object.assign(summary, {
        waitingApproval: 0,
        waitingExecution: 0,
        pendingDispatch: 0,
        completedToday: 0,
      })
    }

    // Return

    return {
      loading,

      error,

      summary,

      needsAttention,

      pendingDispatch,

      fetchDashboard,

      reset,
    }
  }
)