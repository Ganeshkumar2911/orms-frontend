import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import apiRequest from '@/api/request'
import urls from '@/api/urls'

import { useSnackbarStore } from '@/stores/snackbar/snackbar'

export const useOrdersStore = defineStore(
  'orders',
  () => {
    // Snackbar

    const snackbar = useSnackbarStore()

    // State

    const records = ref([])

    const loading = ref(false)

    const createLoading = ref(false)

    const partyOptionsLoading = ref(false)

    const transportOptionsLoading = ref(false)

    const productOptionsLoading = ref(false)

    const error = ref(null)

    // Dialog

    const dialog = reactive({
      open: false,
      item: null,
    })

    // Filters

    const filters = reactive({
      search: '',
      status: '',
      partyId: '',
      fromDate: '',
      toDate: '',
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

    const fetchOrders = () => {
      loading.value = true

      error.value = null

      const successHandler = (res) => {
        records.value = res?.data || []

        Object.assign(summary, {
          total: res?.totalOrders || 0,
        })

        Object.assign(pagination, {
          page: res?.currentPage || 1,
          per_page: pagination.per_page,
          total_items: res?.totalOrders || 0,
          total_pages: res?.totalPages || 1,
        })

        loading.value = false
      }

      const failureHandler = (err) => {
        error.value = err

        loading.value = false

        snackbar.show(
          err?.message || 'Failed to fetch orders.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.GET,
        urls.orders.list,
        {
          params: {
            page: pagination.page,
            limit: pagination.per_page,

            search: filters.search || undefined,
            status: filters.status || undefined,
            partyId: filters.partyId || undefined,
            fromDate: filters.fromDate || undefined,
            toDate: filters.toDate || undefined,
          },

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const createOrder = (payload) => {
      createLoading.value = true

      const successHandler = (res) => {
        createLoading.value = false

        closeDialog()

        snackbar.show(
          res?.message || 'Order created successfully.',
          'success'
        )

        fetchOrders()
      }

      const failureHandler = (err) => {
        error.value = err

        createLoading.value = false

        snackbar.show(
          err?.message || 'Failed to create order.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.POST,
        urls.orders.create,
        {
          data: payload,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    // Search Dropdown Methods

    const fetchPartyOptions = (
      searchQuery = ''
    ) => {
      partyOptionsLoading.value = true

      return new Promise((resolve) => {
        const successHandler = (res) => {
          partyOptionsLoading.value = false

          resolve(
            (res?.data || []).map((item) => ({
              label: item.name,
              value: item._id,
              isActive: item.isActive,
            }))
          )
        }

        const failureHandler = () => {
          partyOptionsLoading.value = false

          resolve([])
        }

        apiRequest(
          urls.KEYS.GET,
          urls.parties.list,
          {
            params: {
              search: searchQuery,
              page: 1,
              limit: 20,
            },

            isTokenRequired: true,

            onSuccess: successHandler,
            onFailure: failureHandler,
          }
        )
      })
    }

    const fetchTransportOptions = (
      searchQuery = ''
    ) => {
      transportOptionsLoading.value = true

      return new Promise((resolve) => {
        const successHandler = (res) => {
          transportOptionsLoading.value = false

          resolve(
            (res?.data || []).map((item) => ({
              label: item.name,
              value: item._id,
              isActive: item.isActive,
            }))
          )
        }

        const failureHandler = () => {
          transportOptionsLoading.value = false

          resolve([])
        }

        apiRequest(
          urls.KEYS.GET,
          urls.transports.list,
          {
            params: {
              search: searchQuery,
              page: 1,
              limit: 20,
            },

            isTokenRequired: true,

            onSuccess: successHandler,
            onFailure: failureHandler,
          }
        )
      })
    }

    const fetchProductOptions = (
      searchQuery = ''
    ) => {
      productOptionsLoading.value = true

      return new Promise((resolve) => {
        const successHandler = (res) => {
          productOptionsLoading.value = false

          resolve(
            (res?.data || []).map((item) => ({
              label: item.name,
              value: item._id,
              isActive: item.isActive,
            }))
          )
        }

        const failureHandler = () => {
          productOptionsLoading.value = false

          resolve([])
        }

        apiRequest(
          urls.KEYS.GET,
          urls.products.list,
          {
            params: {
              search: searchQuery,
              page: 1,
              limit: 20,
            },

            isTokenRequired: true,

            onSuccess: successHandler,
            onFailure: failureHandler,
          }
        )
      })
    }

    // Filter Methods

    const applyFilters = () => {
      pagination.page = 1

      fetchOrders()
    }

    // Dialog Methods

    const openCreateDialog = () => {
      dialog.open = true
      dialog.item = null
    }

    const closeDialog = () => {
      dialog.open = false
      dialog.item = null
    }

    // Pagination Methods

    const changePage = (page) => {
      pagination.page = page

      fetchOrders()
    }

    // Reset

    const reset = () => {
      records.value = []

      loading.value = false

      createLoading.value = false

      partyOptionsLoading.value = false

      transportOptionsLoading.value = false

      productOptionsLoading.value = false

      error.value = null

      closeDialog()

      Object.assign(filters, {
        search: '',
        status: '',
        partyId: '',
        fromDate: '',
        toDate: '',
      })

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

      partyOptionsLoading,
      transportOptionsLoading,
      productOptionsLoading,

      error,

      dialog,

      filters,

      summary,

      pagination,

      fetchOrders,

      createOrder,

      fetchPartyOptions,
      fetchTransportOptions,
      fetchProductOptions,

      applyFilters,

      openCreateDialog,
      closeDialog,

      changePage,

      reset,
    }
  }
)