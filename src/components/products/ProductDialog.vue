<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products/products'

const props = defineProps({
  mode: String, // 'create' | 'edit'
  item: Object,
})

const store = useProductsStore()

const form = ref({ name: '', isActive: true })

watch(() => store.open, (val) => {
  if (val) {
    form.value = props.mode === 'edit'
      ? { name: props.item.name, isActive: props.item.isActive }
      : { name: '', isActive: true }
  }
})

const submit = () => {
  if (props.mode === 'edit') {
    store.updateProduct(props.item._id, form.value)
  } else {
    store.createProduct(form.value)
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.open" class="fixed inset-0 z-50 flex items-end justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="store.open = false" />

      <!-- Sheet -->
      <div class="relative w-full bg-card-background border-t border-primary-border rounded-t-2xl p-5 z-10">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <h2 class="title-text text-primary-text">
            {{ mode === 'edit' ? 'Edit Product' : 'Create Product' }}
          </h2>
          <button @click="store.open = false">
            <X :size="20" class="text-secondary-text" />
          </button>
        </div>

        <!-- Form -->
        <div class="flex flex-col gap-4">
          <div>
            <label class="label-text text-secondary-text block mb-1">Product Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Enter product name"
              class="input-field w-full"
            />
          </div>

          <div v-if="mode === 'edit'" class="flex items-center justify-between">
            <span class="normal-text text-primary-text">Status</span>

            <button
              type="button"
              role="switch"
              :aria-checked="form.isActive"
              @click="form.isActive = !form.isActive"
              class="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-accent"
              :class="form.isActive ? 'bg-green-500' : 'bg-gray-300'"
            >
              <span
                class="inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300"
                :class="form.isActive ? 'translate-x-8' : 'translate-x-1'"
              />
            </button>
          </div>

          <button
            @click="submit"
            :disabled="store.createLoading || store.updateLoading || !form.name.trim()"
            class="w-full py-3 rounded-lg bg-primary-accent text-white mid-text disabled:opacity-50"
          >
            <span v-if="store.createLoading || store.updateLoading">Saving...</span>
            <span v-else>{{ mode === 'edit' ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
