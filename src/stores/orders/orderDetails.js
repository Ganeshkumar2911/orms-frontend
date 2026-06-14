import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

import apiRequest from '@/api/request'
import urls from '@/api/urls'

import { useSnackbarStore } from '@/stores/snackbar/snackbar'

export const useOrderDetailsStore = defineStore(
  'orderDetails',
  () => {
    // Snackbar

    const snackbar = useSnackbarStore()

    // State

    const order = ref(null)

    const loading = ref(false)

    const approveLoading = ref(false)

    const executeLoading = ref(false)

    const dispatchLoading = ref(false)

    const cancelLoading = ref(false)

    const updateLoading = ref(false)

    const error = ref(null)

    // Dialogs

    const dispatchDialog = reactive({
      open: false,
    })

    const cancelDialog = reactive({
      open: false,
    })

    const editDialog = reactive({
      open: false,
    })

    // API Methods

    const fetchOrderDetails = (
      orderId
    ) => {
      loading.value = true

      error.value = null

      const successHandler = (res) => {
        order.value = res?.data || null

        loading.value = false
      }

      const failureHandler = (err) => {
        error.value = err

        loading.value = false

        snackbar.show(
          err?.message ||
            'Failed to fetch order.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.GET,
        urls.orders.details,
        {
          look_up_key: orderId,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const approveOrder = (
      orderId
    ) => {
      approveLoading.value = true

      const successHandler = (res) => {
        approveLoading.value = false

        snackbar.show(
          res?.message ||
            'Order approved successfully.',
          'success'
        )

        fetchOrderDetails(orderId)
      }

      const failureHandler = (err) => {
        error.value = err

        approveLoading.value = false

        snackbar.show(
          err?.message ||
            'Failed to approve order.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.PATCH,
        urls.orders.approve,
        {
          look_up_key: orderId,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const executeOrder = (
      orderId
    ) => {
      executeLoading.value = true

      const successHandler = (res) => {
        executeLoading.value = false

        snackbar.show(
          res?.message ||
            'Order executed successfully.',
          'success'
        )

        fetchOrderDetails(orderId)
      }

      const failureHandler = (err) => {
        error.value = err

        executeLoading.value = false

        snackbar.show(
          err?.message ||
            'Failed to execute order.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.PATCH,
        urls.orders.execute,
        {
          look_up_key: orderId,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const dispatchOrder = (
      orderId,
      payload
    ) => {
      dispatchLoading.value = true

      const successHandler = (res) => {
        dispatchLoading.value = false

        closeDispatchDialog()

        snackbar.show(
          res?.message ||
            'Order dispatched successfully.',
          'success'
        )

        fetchOrderDetails(orderId)
      }

      const failureHandler = (err) => {
        error.value = err

        dispatchLoading.value = false

        snackbar.show(
          err?.message ||
            'Failed to dispatch order.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.PATCH,
        urls.orders.dispatch,
        {
          look_up_key: orderId,

          data: payload,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const cancelOrder = (
      orderId,
      payload
    ) => {
      cancelLoading.value = true

      const successHandler = (res) => {
        cancelLoading.value = false

        closeCancelDialog()

        snackbar.show(
          res?.message ||
            'Order cancelled successfully.',
          'success'
        )

        fetchOrderDetails(orderId)
      }

      const failureHandler = (err) => {
        error.value = err

        cancelLoading.value = false

        snackbar.show(
          err?.message ||
            'Failed to cancel order.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.PATCH,
        urls.orders.cancel,
        {
          look_up_key: orderId,

          data: payload,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    const updateOrder = (
      orderId,
      payload
    ) => {
      updateLoading.value = true

      const successHandler = (res) => {
        updateLoading.value = false

        closeEditDialog()

        snackbar.show(
          res?.message ||
            'Order updated successfully.',
          'success'
        )

        fetchOrderDetails(orderId)
      }

      const failureHandler = (err) => {
        error.value = err

        updateLoading.value = false

        snackbar.show(
          err?.message ||
            'Failed to update order.',
          'error'
        )
      }

      apiRequest(
        urls.KEYS.PATCH,
        urls.orders.update,
        {
          look_up_key: orderId,

          data: payload,

          isTokenRequired: true,

          onSuccess: successHandler,
          onFailure: failureHandler,
        }
      )
    }

    // Dialog Methods

    const openDispatchDialog = () => {
      dispatchDialog.open = true
    }

    const closeDispatchDialog = () => {
      dispatchDialog.open = false
    }

    const openCancelDialog = () => {
      cancelDialog.open = true
    }

    const closeCancelDialog = () => {
      cancelDialog.open = false
    }

    const openEditDialog = () => {
      editDialog.open = true
    }

    const closeEditDialog = () => {
      editDialog.open = false
    }

    // Reset

    const reset = () => {
      order.value = null

      loading.value = false

      approveLoading.value = false

      executeLoading.value = false

      dispatchLoading.value = false

      cancelLoading.value = false

      updateLoading.value = false

      error.value = null

      closeDispatchDialog()

      closeCancelDialog()

      closeEditDialog()
    }

    // Return

    return {
      order,

      loading,

      approveLoading,

      executeLoading,

      dispatchLoading,

      cancelLoading,

      updateLoading,

      error,

      dispatchDialog,

      cancelDialog,

      editDialog,

      fetchOrderDetails,

      approveOrder,

      executeOrder,

      dispatchOrder,

      cancelOrder,

      updateOrder,

      openDispatchDialog,
      closeDispatchDialog,

      openCancelDialog,
      closeCancelDialog,

      openEditDialog,
      closeEditDialog,

      reset,
    }
  }
)