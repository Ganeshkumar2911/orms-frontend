<script setup>
import { ref, watch, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useOrderDetailsStore } from '@/stores/orders/orderDetails'
import { useRoute } from 'vue-router'

const store = useOrderDetailsStore()
const route = useRoute()

const dispatchItems = ref([])

watch(() => store.dispatchDialog.open, (val) => {
  if (val) {
    dispatchItems.value = (store.order?.items || []).map(item => ({
      product: item.product._id,
      productName: item.product.name,
      orderedQty: item.orderedQty,
      dispatchedQty: item.dispatchedQty,
      pendingQty: item.orderedQty - item.dispatchedQty,
      dispatchQty: 0,
    }))
  }
})

const errors = ref({})

const validate = () => {
  const e = {}
  let hasAny = false
  dispatchItems.value.forEach((item, i) => {
    const qty = Number(item.dispatchQty)
    if (qty < 0 || qty > item.pendingQty) e[i] = `Max ${item.pendingQty}`
    if (qty > 0) hasAny = true
  })
  if (!hasAny) e.global = 'At least one item must have dispatch qty > 0'
  errors.value = e
  return !Object.keys(e).length
}

const submit = () => {
  if (!validate()) return
  const items = dispatchItems.value
    .filter(i => Number(i.dispatchQty) > 0)
    .map(i => ({ product: i.product, dispatchQty: Number(i.dispatchQty) }))
  store.dispatchOrder(route.params.id, { items })
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.dispatchDialog.open" class="fixed inset-0 z-50 flex flex-col justify-end">
      <div class="absolute inset-0 bg-black/50" @click="store.closeDispatchDialog()" />
      <div class="relative bg-card-background border-t border-primary-border rounded-t-2xl z-10 flex flex-col max-h-[85vh]">

        <div class="flex items-center justify-between px-5 pt-5 pb-3 border-b border-primary-border">
          <h2 class="title-text text-primary-text">Dispatch Order</h2>
          <button @click="store.closeDispatchDialog()"><X :size="20" class="text-secondary-text" /></button>
        </div>

        <div class="overflow-y-auto px-5 py-4 flex flex-col gap-3">
          <p v-if="errors.global" class="label-text text-primary-red">{{ errors.global }}</p>

          <div
            v-for="(item, i) in dispatchItems"
            :key="item.product"
            class="bg-card-background border border-primary-border rounded-2xl p-3 flex flex-col gap-2"
          >
            <p class="mid-text text-primary-text">{{ item.productName }}</p>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div>
                <p class="label-text text-secondary-text">Ordered</p>
                <p class="normal-text text-primary-text">{{ item.orderedQty }}</p>
              </div>
              <div>
                <p class="label-text text-secondary-text">Dispatched</p>
                <p class="normal-text text-primary-text">{{ item.dispatchedQty }}</p>
              </div>
              <div>
                <p class="label-text text-secondary-text">Pending</p>
                <p class="normal-text text-primary-yellow">{{ item.pendingQty }}</p>
              </div>
            </div>
            <div>
              <label class="label-text text-secondary-text block mb-1">Dispatch Qty</label>
              <input
                v-model="item.dispatchQty"
                type="number"
                min="0"
                :max="item.pendingQty"
                class="input-field w-full"
                @input="errors[i] = null"
              />
              <p v-if="errors[i]" class="label-text text-primary-red mt-1">{{ errors[i] }}</p>
            </div>
          </div>
        </div>

        <div class="px-5 py-4 border-t border-primary-border">
          <button
            @click="submit"
            :disabled="store.dispatchLoading"
            class="w-full py-3 rounded-xl bg-primary-accent text-primary-text mid-text disabled:opacity-50"
          >
            {{ store.dispatchLoading ? 'Dispatching...' : 'Dispatch' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>