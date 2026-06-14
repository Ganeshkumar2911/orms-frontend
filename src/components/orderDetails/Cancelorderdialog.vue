<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useOrderDetailsStore } from '@/stores/orders/orderDetails'
import { useRoute } from 'vue-router'

const store = useOrderDetailsStore()
const route = useRoute()

const cancelReason = ref('')
const error = ref(false)

watch(() => store.cancelDialog.open, (val) => {
  if (val) { cancelReason.value = ''; error.value = false }
})

const submit = () => {
  if (!cancelReason.value.trim()) { error.value = true; return }
  store.cancelOrder(route.params.id, { cancelReason: cancelReason.value.trim() })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.cancelDialog.open" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" @click="store.closeCancelDialog()" />
      <div class="relative w-full bg-card-background border-t border-primary-border rounded-t-2xl p-5 z-10">
        <div class="flex items-center justify-between mb-5">
          <h2 class="title-text text-primary-text">Cancel Order</h2>
          <button @click="store.closeCancelDialog()"><X :size="20" class="text-secondary-text" /></button>
        </div>
        <div class="flex flex-col gap-4">
          <div>
            <label class="label-text text-secondary-text block mb-1">Cancel Reason <span class="text-primary-red">*</span></label>
            <textarea
              v-model="cancelReason"
              rows="3"
              placeholder="Enter cancellation reason..."
              class="input-field w-full resize-none"
              @input="error = false"
            />
            <p v-if="error" class="label-text text-primary-red mt-1">Cancel reason is required</p>
          </div>
          <button
            @click="submit"
            :disabled="store.cancelLoading"
            class="w-full py-3 rounded-xl bg-primary-red text-primary-text mid-text disabled:opacity-50"
          >
            {{ store.cancelLoading ? 'Cancelling...' : 'Cancel Order' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
