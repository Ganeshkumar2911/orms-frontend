<script setup>
import { ref, watch } from 'vue'
import { X, Plus, Trash2 } from 'lucide-vue-next'
import { useOrderDetailsStore } from '@/stores/orders/orderDetails'
import { useOrdersStore } from '@/stores/orders/orders'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { useRoute } from 'vue-router'

const store = useOrderDetailsStore()
const ordersStore = useOrdersStore()
const route = useRoute()

const form = ref({ party: null, transport: null, items: [] })
const errors = ref({})

watch(() => store.editDialog.open, (val) => {
  if (val && store.order) {
    form.value = {
      party: store.order.party._id,
      transport: store.order.transport._id,
      items: store.order.items.map(i => ({
        product: i.product._id,
        orderedQty: i.orderedQty,
        price: i.price,
      })),
    }
    errors.value = {}
    // Pre-fetch data for select dropdowns to avoid empty lists initially
    ordersStore.fetchPartyOptions()
    ordersStore.fetchTransportOptions()
    ordersStore.fetchProductOptions()
  }
})

const addItem = () => form.value.items.push({ product: null, orderedQty: '', price: '' })
const removeItem = (i) => form.value.items.splice(i, 1)

const validate = () => {
  const e = {}
  if (!form.value.party) e.party = true
  if (!form.value.transport) e.transport = true
  if (!form.value.items.length) e.items = 'Add at least one item'
  form.value.items.forEach((item, i) => {
    if (!item.product) e[`product_${i}`] = true
    if (!item.orderedQty || Number(item.orderedQty) <= 0) e[`qty_${i}`] = true
    if (!item.price || Number(item.price) <= 0) e[`price_${i}`] = true
  })
  errors.value = e
  return !Object.keys(e).length
}

const submit = () => {
  if (!validate()) return
  const payload = {
    party: form.value.party,
    transport: form.value.transport,
    items: form.value.items.map(i => ({
      product: i.product,
      orderedQty: Number(i.orderedQty),
      price: Number(i.price),
    })),
  }
  store.updateOrder(route.params.id, payload)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.editDialog.open" class="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" @click="store.closeEditDialog()" />

      <div class="relative bg-card-background border-t sm:border border-primary-border rounded-t-2xl sm:rounded-2xl z-10 flex flex-col w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] shadow-2xl transition-all duration-300">

        <div class="flex items-center justify-between px-5 pt-5 pb-3 border-b border-primary-border">
          <h2 class="title-text text-primary-text font-bold">Edit Order</h2>
          <button @click="store.closeEditDialog()" class="cursor-pointer">
            <X :size="20" class="text-secondary-text hover:text-primary-text transition-colors" />
          </button>
        </div>

        <div class="overflow-y-auto px-5 py-4 flex flex-col gap-5">

          <!-- Party & Transport (Responsive Grid) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Party -->
            <div>
              <label class="label-text text-secondary-text block mb-1.5 font-semibold">Party <span class="text-primary-red">*</span></label>
              <BaseSelect
                v-model="form.party"
                :options="ordersStore.partyOptions"
                :is-loading="ordersStore.partyOptionsLoading"
                placeholder="Search party..."
                :searchable="true"
                @search="ordersStore.fetchPartyOptions($event)"
              />
              <p v-if="errors.party" class="label-text text-primary-red mt-1 font-semibold">Required</p>
            </div>

            <!-- Transport -->
            <div>
              <label class="label-text text-secondary-text block mb-1.5 font-semibold">Transport <span class="text-primary-red">*</span></label>
              <BaseSelect
                v-model="form.transport"
                :options="ordersStore.transportOptions"
                :is-loading="ordersStore.transportOptionsLoading"
                placeholder="Search transport..."
                :searchable="true"
                @search="ordersStore.fetchTransportOptions($event)"
              />
              <p v-if="errors.transport" class="label-text text-primary-red mt-1 font-semibold">Required</p>
            </div>
          </div>

          <!-- Items -->
          <div class="border-t border-primary-border/60 pt-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="mid-text text-primary-text font-bold">Order Items</span>
                <span class="bg-primary-accent/10 text-primary-accent text-[11px] px-2 py-0.5 rounded-full font-bold">
                  {{ form.items.length }}
                </span>
              </div>
              <button
                type="button"
                @click="addItem"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary-accent/30 text-[12px] font-semibold text-primary-accent hover:bg-primary-accent/5 transition-all duration-150 cursor-pointer"
              >
                <Plus :size="14" /> Add Item
              </button>
            </div>

            <p v-if="errors.items" class="label-text text-primary-red mb-3 font-semibold">{{ errors.items }}</p>

            <div class="flex flex-col gap-4">
              <div
                v-for="(item, i) in form.items"
                :key="i"
                class="bg-background/40 border border-primary-border rounded-xl p-4 flex flex-col gap-4 relative hover:border-primary-accent/20 transition-all duration-200"
              >
                <!-- Card Header -->
                <div class="flex items-center justify-between pb-2 border-b border-primary-border/65">
                  <span class="label-text text-secondary-text font-bold text-[11px] uppercase tracking-wider">Item #{{ i + 1 }}</span>
                  <button
                    v-if="form.items.length > 1"
                    type="button"
                    @click="removeItem(i)"
                    class="text-primary-red hover:bg-primary-red/5 p-1 rounded-lg transition-colors duration-150 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>

                <!-- Product -->
                <div>
                  <label class="label-text text-secondary-text block mb-1.5 font-semibold">Product <span class="text-primary-red">*</span></label>
                  <BaseSelect
                    v-model="item.product"
                    :options="ordersStore.productOptions"
                    :is-loading="ordersStore.productOptionsLoading"
                    placeholder="Search product..."
                    :searchable="true"
                    variant="surface"
                    @search="ordersStore.fetchProductOptions($event)"
                  />
                  <p v-if="errors[`product_${i}`]" class="label-text text-primary-red mt-1 font-semibold">Required</p>
                </div>

                <!-- Qty & Price -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="label-text text-secondary-text block mb-1.5 font-semibold">Quantity <span class="text-primary-red">*</span></label>
                    <input
                      v-model="item.orderedQty"
                      type="number"
                      min="1"
                      placeholder="0"
                      class="input-field w-full bg-background"
                    />
                    <p v-if="errors[`qty_${i}`]" class="label-text text-primary-red mt-1 font-semibold">Required</p>
                  </div>
                  <div>
                    <label class="label-text text-secondary-text block mb-1.5 font-semibold">Price <span class="text-primary-red">*</span></label>
                    <input
                      v-model="item.price"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      class="input-field w-full bg-background"
                    />
                    <p v-if="errors[`price_${i}`]" class="label-text text-primary-red mt-1 font-semibold">Required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 py-4 border-t border-primary-border bg-card-background rounded-b-2xl">
          <button
            @click="submit"
            :disabled="store.updateLoading"
            class="w-full py-3 rounded-xl bg-primary-accent text-primary-text font-bold mid-text disabled:opacity-50 transition-all cursor-pointer"
          >
            {{ store.updateLoading ? 'Updating...' : 'Update Order' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>