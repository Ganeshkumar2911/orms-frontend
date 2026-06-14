<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products/products'

const props = defineProps({
  open: Boolean,
  mode: String, // 'create' | 'edit'
  item: Object,
})

const emit = defineEmits(['close'])

const store = useProductsStore()

const form = ref({ name: '', isActive: true })

watch(() => props.open, (val) => {
  if (val) {
    form.value = props.mode === 'edit'
      ? { name: props.item.name, isActive: props.item.isActive }
      : { name: '', isActive: true }
  }
})

const submit = () => {
  if (props.mode === 'edit') {
    store.updateProduct(props.item._id, form.value, () => emit('close'))
  } else {
    store.createProduct(form.value, () => emit('close'))
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="emit('close')" />

      <!-- Sheet -->
      <div class="relative w-full bg-card-background border-t border-primary-border rounded-t-2xl p-5 z-10">
        <!-- Header -->
        <div class="flex items-center justify-between mb-5">
          <h2 class="title-text text-primary-text">
            {{ mode === 'edit' ? 'Edit Product' : 'Create Product' }}
          </h2>
          <button @click="emit('close')">
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

          <div class="flex items-center justify-between">
            <span class="normal-text text-primary-text">Active</span>
            <button
              @click="form.isActive = !form.isActive"
              :class="form.isActive ? 'bg-primary-green' : 'bg-card-background border border-primary-border'"
              class="w-12 h-6 rounded-full relative transition-all"
            >
              <span
                :class="form.isActive ? 'translate-x-6' : 'translate-x-1'"
                class="absolute top-1 w-4 h-4 rounded-full bg-card-background transition-transform"
              />
            </button>
          </div>

          <button
            @click="submit"
            :disabled="store.createLoading || store.updateLoading || !form.name.trim()"
            class="w-full py-3 rounded-xl bg-primary-blue text-primary-text mid-text disabled:opacity-50"
          >
            <span v-if="store.createLoading || store.updateLoading">Saving...</span>
            <span v-else>{{ mode === 'edit' ? 'Update' : 'Create' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>