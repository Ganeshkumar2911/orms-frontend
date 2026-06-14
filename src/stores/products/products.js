import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'

import apiRequest from '@/api/request'
import urls from '@/api/urls'

import { useSnackbarStore } from '@/stores/snackbar/snackbar'

export const useProductsStore = defineStore(
  'products',
  () => {
    // Snackbar

    const snackbar = useSnackbarStore()

    // State

    const records = ref([])

    const loading = ref(false)

    const search = ref('')

    const createLoading = ref(false)

    const updateLoading = ref(false)

    const error = ref(null)

    const isFetched = ref(false)

    const open = ref(false)

    const mode = ref('create')

    const item = ref(null)

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

    let searchTimeout = null
    watch(search, () => {
      if (searchTimeout) clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        pagination.page = 1
        fetchProducts(true)
      }, 500)
    })

    const fetchProducts = (force = false) => {
      if (isFetched.value && !force) return

      loading.value = true

      error.value = null

      const successHandler = (res) => {
        records.value = res?.data || []

        Object.assign(summary, {
          total: res?.totalProducts || 0,
        })

        Object.assign(pagination, {
          page: res?.currentPage || 1,
          per_page: pagination.per_page,
          total_items: res?.totalProducts || 0,
          total_pages: res?.totalPages || 1,
        })

        isFetched.value = true

        loading.value = false
      }

      const failureHandler = (err) => {
        error.value = err

        loading.value = false

        snackbar.show(
          err?.message || 'Failed to fetch products.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.GET,
        urls.products.list,
        {
          params: {
            page: pagination.page,
            limit: pagination.per_page,
            search: search.value,
          },

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const createProduct = (payload) => {
      createLoading.value = true

      const successHandler = (res) => {
        createLoading.value = false

        snackbar.show(
          res?.message || 'Product created successfully.',
          'success'
        )

        isFetched.value = false

        fetchProducts(true)

        open.value = false
      }

      const failureHandler = (err) => {
        error.value = err

        createLoading.value = false

        snackbar.show(
          err?.message || 'Failed to create product.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.POST,
        urls.products.create,
        {
          data: payload,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const updateProduct = (
      productId,
      payload
    ) => {
      updateLoading.value = true

      const successHandler = (res) => {
        updateLoading.value = false

        snackbar.show(
          res?.message || 'Product updated successfully.',
          'success'
        )

        isFetched.value = false

        fetchProducts(true)

        open.value = false
      }

      const failureHandler = (err) => {
        error.value = err

        updateLoading.value = false

        snackbar.show(
          err?.message || 'Failed to update product.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.PATCH,
        urls.products.update,
        {
          look_up_key: productId,

          data: payload,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    // Reset

    const reset = () => {
      records.value = []

      loading.value = false

      search.value = ''

      createLoading.value = false

      updateLoading.value = false

      error.value = null

      isFetched.value = false

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
      search,
      createLoading,
      updateLoading,
      error,
      isFetched,
      open,
      mode,
      item,
      summary,
      pagination,
      fetchProducts,
      createProduct,
      updateProduct,
      reset,
    }
  }
)
