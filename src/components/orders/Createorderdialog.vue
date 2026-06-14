<script setup>
import { ref, watch } from 'vue'
import { X, Plus, Trash2 } from 'lucide-vue-next'
import { useOrdersStore } from '@/stores/orders/orders'
import BaseSelect from '@/components/common/BaseSelect.vue'

const store = useOrdersStore()

const form = ref({ party: null, transport: null, items: [] })
const errors = ref({})

watch(() => store.dialog.open, (val) => {
  if (val) {
    form.value = { party: null, transport: null, items: [] }
    errors.value = {}
  }
})

const addItem = () => {
  form.value.items.push({ product: null, orderedQty: '', price: '' })
}

const removeItem = (i) => {
  form.value.items.splice(i, 1)
}

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
  store.createOrder(payload)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.dialog.open" class="fixed inset-0 z-50 flex flex-col justify-end">
      <div class="absolute inset-0 bg-black/50" @click="store.closeDialog()" />

      <div class="relative bg-card-background border-t border-primary-border rounded-t-2xl z-10 flex flex-col max-h-[90vh]">

        <!-- Header -->
        <div class="flex items-center justify-between px-5 pt-5 pb-3 border-b border-primary-border">
          <h2 class="title-text text-primary-text">Create Order</h2>
          <button @click="store.closeDialog()">
            <X :size="20" class="text-secondary-text" />
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="overflow-y-auto px-5 py-4 flex flex-col gap-5">

          <!-- Party -->
          <div>
            <label class="label-text text-secondary-text block mb-1">Party <span class="text-primary-red">*</span></label>
            <BaseSelect
              v-model="form.party"
              :options="store.partyOptions"
              :is-loading="store.partyOptionsLoading"
              placeholder="Search party..."
              :searchable="true"
              @search="store.fetchPartyOptions($event)"
            />
            <p v-if="errors.party" class="label-text text-primary-red mt-1">Required</p>
          </div>

          <!-- Transport -->
          <div>
            <label class="label-text text-secondary-text block mb-1">Transport <span class="text-primary-red">*</span></label>
            <BaseSelect
              v-model="form.transport"
              :options="store.transportOptions"
              :is-loading="store.transportOptionsLoading"
              placeholder="Search transport..."
              :searchable="true"
              @search="store.fetchTransportOptions($event)"
            />
            <p v-if="errors.transport" class="label-text text-primary-red mt-1">Required</p>
          </div>

          <!-- Items -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="mid-text text-primary-text">Items</span>
              <button
                @click="addItem"
                class="flex items-center gap-1 label-text text-primary-accent"
              >
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
                  <button @click="removeItem(i)">
                    <Trash2 :size="15" class="text-primary-red" />
                  </button>
                </div>

                <div>
                  <label class="label-text text-secondary-text block mb-1">Product <span class="text-primary-red">*</span></label>
                  <BaseSelect
                    v-model="item.product"
                    :options="store.productOptions"
                    :is-loading="store.productOptionsLoading"
                    placeholder="Search product..."
                    :searchable="true"
                    variant="surface"
                    @search="store.fetchProductOptions($event)"
                  />
                  <p v-if="errors[`product_${i}`]" class="label-text text-primary-red mt-1">Required</p>
                </div>

                <div class="flex gap-2">
                  <div class="flex-1">
                    <label class="label-text text-secondary-text block mb-1">Qty <span class="text-primary-red">*</span></label>
                    <input
                      v-model="item.orderedQty"
                      type="number"
                      min="1"
                      placeholder="0"
                      class="input-field w-full"
                    />
                    <p v-if="errors[`qty_${i}`]" class="label-text text-primary-red mt-1">Required</p>
                  </div>
                  <div class="flex-1">
                    <label class="label-text text-secondary-text block mb-1">Price <span class="text-primary-red">*</span></label>
                    <input
                      v-model="item.price"
                      type="number"
                      min="1"
                      placeholder="0.00"
                      class="input-field w-full"
                    />
                    <p v-if="errors[`price_${i}`]" class="label-text text-primary-red mt-1">Required</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-4 border-t border-primary-border">
          <button
            @click="submit"
            :disabled="store.createLoading"
            class="w-full py-3 rounded-xl bg-primary-accent text-primary-text mid-text disabled:opacity-50"
          >
            {{ store.createLoading ? 'Creating...' : 'Create Order' }}
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>