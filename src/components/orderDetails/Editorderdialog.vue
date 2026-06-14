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
    <div v-if="store.editDialog.open" class="fixed inset-0 z-50 flex flex-col justify-end">
      <div class="absolute inset-0 bg-black/50" @click="store.closeEditDialog()" />
      <div class="relative bg-card-background border-t border-primary-border rounded-t-2xl z-10 flex flex-col max-h-[90vh]">

        <div class="flex items-center justify-between px-5 pt-5 pb-3 border-b border-primary-border">
          <h2 class="title-text text-primary-text">Edit Order</h2>
          <button @click="store.closeEditDialog()"><X :size="20" class="text-secondary-text" /></button>
        </div>

        <div class="overflow-y-auto px-5 py-4 flex flex-col gap-5">

          <div>
            <label class="label-text text-secondary-text block mb-1">Party <span class="text-primary-red">*</span></label>
            <BaseSelect
              v-model="form.party"
              :options="ordersStore.partyOptions"
              :is-loading="ordersStore.partyOptionsLoading"
              placeholder="Search party..."
              :searchable="true"
              @search="ordersStore.fetchPartyOptions($event)"
            />
            <p v-if="errors.party" class="label-text text-primary-red mt-1">Required</p>
          </div>

          <div>
            <label class="label-text text-secondary-text block mb-1">Transport <span class="text-primary-red">*</span></label>
            <BaseSelect
              v-model="form.transport"
              :options="ordersStore.transportOptions"
              :is-loading="ordersStore.transportOptionsLoading"
              placeholder="Search transport..."
              :searchable="true"
              @search="ordersStore.fetchTransportOptions($event)"
            />
            <p v-if="errors.transport" class="label-text text-primary-red mt-1">Required</p>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="mid-text text-primary-text">Items</span>
              <button @click="addItem" class="flex items-center gap-1 label-text text-primary-accent">
                <Plus :size="14" /> Add Item
              </button>
            </div>
            <p v-if="errors.items" class="label-text text-primary-red mb-2">{{ errors.items }}</p>

            <div class="flex flex-col gap-3">
              <div
                v-for="(item, i) in form.items"
                :key="i"
                class="bg-card-background border border-primary-border rounded-2xl p-3 flex flex-col gap-3"
              >
                <div class="flex items-center justify-between">
                  <span class="label-text text-secondary-text">Item {{ i + 1 }}</span>
                  <button @click="removeItem(i)"><Trash2 :size="15" class="text-primary-red" /></button>
                </div>
                <div>
                  <label class="label-text text-secondary-text block mb-1">Product <span class="text-primary-red">*</span></label>
                  <BaseSelect
                    v-model="item.product"
                    :options="ordersStore.productOptions"
                    :is-loading="ordersStore.productOptionsLoading"
                    placeholder="Search product..."
                    :searchable="true"
                    variant="surface"
                    @search="ordersStore.fetchProductOptions($event)"
                  />
                  <p v-if="errors[`product_${i}`]" class="label-text text-primary-red mt-1">Required</p>
                </div>
                <div class="flex gap-2">
                  <div class="flex-1">
                    <label class="label-text text-secondary-text block mb-1">Qty <span class="text-primary-red">*</span></label>
                    <input v-model="item.orderedQty" type="number" min="1" placeholder="0" class="input-field w-full" />
                    <p v-if="errors[`qty_${i}`]" class="label-text text-primary-red mt-1">Required</p>
                  </div>
                  <div class="flex-1">
                    <label class="label-text text-secondary-text block mb-1">Price <span class="text-primary-red">*</span></label>
                    <input v-model="item.price" type="number" min="1" placeholder="0.00" class="input-field w-full" />
                    <p v-if="errors[`price_${i}`]" class="label-text text-primary-red mt-1">Required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 py-4 border-t border-primary-border">
          <button
            @click="submit"
            :disabled="store.updateLoading"
            class="w-full py-3 rounded-xl bg-primary-accent text-primary-text mid-text disabled:opacity-50"
          >
            {{ store.updateLoading ? 'Updating...' : 'Update Order' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>