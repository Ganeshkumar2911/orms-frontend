<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Package } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products/products'
import ProductDialog from '@/components/products/ProductDialog.vue'

const store = useProductsStore()

const dialog = ref({ open: false, mode: 'create', item: null })

const openCreate = () => { dialog.value = { open: true, mode: 'create', item: null } }
const openEdit = (item) => { dialog.value = { open: true, mode: 'edit', item } }
const closeDialog = () => {
  dialog.value.open = false
  store.fetchProducts()
}

const goToPage = (page) => store.fetchProducts({ page })

onMounted(() => store.fetchProducts())
</script>

<template>
  <div class="px-4 py-4 flex flex-col gap-4">

    <!-- Top Bar -->
    <div class="flex items-center justify-between">
      <h1 class="title-text text-primary-text">Products</h1>
      <button
        @click="openCreate"
        class="flex items-center gap-1 bg-primary-blue text-primary-text px-3 py-2 rounded-xl label-text"
      >
        <Plus :size="16" />
        New
      </button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex flex-col gap-3">
      <div
        v-for="n in 4" :key="n"
        class="bg-card-background border border-primary-border rounded-2xl h-16 animate-pulse"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!store.records.length"
      class="flex flex-col items-center justify-center gap-3 py-20"
    >
      <Package :size="40" class="text-secondary-text" />
      <p class="normal-text text-secondary-text">No products found</p>
    </div>

    <!-- Cards -->
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="product in store.records"
        :key="product._id"
        @click="openEdit(product)"
        class="bg-card-background border border-primary-border rounded-2xl px-4 py-3 flex items-center justify-between active:opacity-70 transition-opacity cursor-pointer"
      >
        <div class="flex flex-col gap-0.5">
          <p class="mid-text text-primary-text">{{ product.name }}</p>
        </div>
        <span
          :class="product.isActive ? 'text-primary-green' : 'text-primary-red'"
          class="label-text px-2 py-0.5 rounded-full border"
          :style="product.isActive ? 'border-color: var(--color-primary-green)' : 'border-color: var(--color-primary-red)'"
        >
          {{ product.isActive ? 'Active' : 'Inactive' }}
        </span>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="store.pagination?.total_pages > 1"
      class="flex items-center justify-center gap-3 pt-2"
    >
      <button
        @click="goToPage(store.pagination.current_page - 1)"
        :disabled="store.pagination.current_page === 1"
        class="label-text text-primary-blue disabled:text-secondary-text"
      >
        Prev
      </button>
      <span class="label-text text-secondary-text">
        {{ store.pagination.current_page }} / {{ store.pagination.total_pages }}
      </span>
      <button
        @click="goToPage(store.pagination.current_page + 1)"
        :disabled="store.pagination.current_page === store.pagination.total_pages"
        class="label-text text-primary-blue disabled:text-secondary-text"
      >
        Next
      </button>
    </div>

  </div>

  <!-- Dialog -->
  <ProductDialog
    :open="dialog.open"
    :mode="dialog.mode"
    :item="dialog.item"
    @close="closeDialog"
  />
</template>