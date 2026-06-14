<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useTransportsStore } from '@/stores/transports/transports'

const store = useTransportsStore()

const form = ref({ name: '', isActive: true })

watch(() => store.dialog.open, (val) => {
  if (val) {
    form.value = store.dialog.mode === 'edit'
      ? { name: store.dialog.item.name, isActive: store.dialog.item.isActive }
      : { name: '' }
  }
})

const submit = () => {
  if (store.dialog.mode === 'edit') {
    store.updateTransport(store.dialog.item._id, form.value)
  } else {
    store.createTransport({ name: form.value.name })
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="store.dialog.open" class="fixed inset-0 z-50 flex items-end justify-center">
      <div class="absolute inset-0 bg-black/50" @click="store.closeDialog()" />
      <div class="relative w-full bg-card-background border-t border-primary-border rounded-t-2xl p-5 z-10">

        <div class="flex items-center justify-between mb-5">
          <h2 class="title-text text-primary-text">
            {{ store.dialog.mode === 'edit' ? 'Edit Transport' : 'Create Transport' }}
          </h2>
          <button @click="store.closeDialog()">
            <X :size="20" class="text-secondary-text" />
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <div>
            <label class="label-text text-secondary-text block mb-1">Name</label>
            <input v-model="form.name" type="text" placeholder="Transport name" class="input-field w-full" />
          </div>

          <div v-if="store.dialog.mode === 'edit'" class="flex items-center justify-between">
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
            class="w-full py-3 rounded-xl bg-primary-accent text-primary-text mid-text disabled:opacity-50"
          >
            {{ store.createLoading || store.updateLoading ? 'Saving...' : store.dialog.mode === 'edit' ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>