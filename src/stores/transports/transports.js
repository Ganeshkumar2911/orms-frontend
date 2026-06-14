import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import apiRequest from '@/api/request'
import urls from '@/api/urls'

import { useSnackbarStore } from '@/stores/snackbar/snackbar'

export const useTransportsStore = defineStore(
  'transports',
  () => {
    // Snackbar

    const snackbar = useSnackbarStore()

    // State

    const records = ref([])

    const loading = ref(false)

    const createLoading = ref(false)

    const updateLoading = ref(false)

    const error = ref(null)

    const isFetched = ref(false)

    // Dialog

    const dialog = reactive({
      open: false,
      mode: 'create',
      item: null,
    })

    // Summary

    const summary = reactive({
      total: 0,
    })

    // Pagination

    const pagination = reactive({
      page: 1,
      per_page: 10,
      total_items: 0,
      total_pages: 1,
    })

    // API Methods

    const fetchTransports = (force = false) => {
      if (isFetched.value && !force) return

      loading.value = true

      error.value = null

      const successHandler = (res) => {
        records.value = res?.data || []

        Object.assign(summary, {
          total: res?.totalTransports || 0,
        })

        Object.assign(pagination, {
          page: res?.currentPage || 1,
          per_page: pagination.per_page,
          total_items: res?.totalTransports || 0,
          total_pages: res?.totalPages || 1,
        })

        isFetched.value = true

        loading.value = false
      }

      const failureHandler = (err) => {
        error.value = err

        loading.value = false

        snackbar.show(
          err?.message || 'Failed to fetch transports.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.GET,
        urls.transports.list,
        {
          params: {
            page: pagination.page,
            limit: pagination.per_page,
          },

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const createTransport = (payload) => {
      createLoading.value = true

      const successHandler = (res) => {
        createLoading.value = false

        closeDialog()

        snackbar.show(
          res?.message || 'Transport created successfully.',
          'success'
        )

        isFetched.value = false

        fetchTransports(true)
      }

      const failureHandler = (err) => {
        error.value = err

        createLoading.value = false

        snackbar.show(
          err?.message || 'Failed to create transport.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.POST,
        urls.transports.create,
        {
          data: payload,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const updateTransport = (
      transportId,
      payload
    ) => {
      updateLoading.value = true

      const successHandler = (res) => {
        updateLoading.value = false

        closeDialog()

        snackbar.show(
          res?.message || 'Transport updated successfully.',
          'success'
        )

        isFetched.value = false

        fetchTransports(true)
      }

      const failureHandler = (err) => {
        error.value = err

        updateLoading.value = false

        snackbar.show(
          err?.message || 'Failed to update transport.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.PATCH,
        urls.transports.update,
        {
          look_up_key: transportId,

          data: payload,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    // Dialog Methods

    const openCreateDialog = () => {
      dialog.open = true
      dialog.mode = 'create'
      dialog.item = null
    }

    const openEditDialog = (item) => {
      dialog.open = true
      dialog.mode = 'edit'
      dialog.item = item
    }

    const closeDialog = () => {
      dialog.open = false
      dialog.mode = 'create'
      dialog.item = null
    }

    // Reset

    const reset = () => {
      records.value = []

      loading.value = false
      createLoading.value = false
      updateLoading.value = false

      error.value = null

      isFetched.value = false

      closeDialog()

      Object.assign(summary, {
        total: 0,
      })

      Object.assign(pagination, {
        page: 1,
        per_page: 10,
        total_items: 0,
        total_pages: 1,
      })
    }

    // Return

    return {
      records,

      loading,
      createLoading,
      updateLoading,

      error,

      isFetched,

      dialog,

      summary,

      pagination,

      fetchTransports,

      createTransport,

      updateTransport,

      openCreateDialog,
      openEditDialog,
      closeDialog,

      reset,
    }
  }
)
