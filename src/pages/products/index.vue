<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Package } from 'lucide-vue-next'
import { useProductsStore } from '@/stores/products/products'
import ProductDialog from '@/components/products/ProductDialog.vue'
import BasePagination from '@/components/common/BasePagination.vue'

const store = useProductsStore()

const openCreate = () => {
  store.mode = 'create'
  store.item = null
  store.open = true
}
const openEdit = (item) => {
  store.mode = 'edit'
  store.item = item
  store.open = true
}

const goToPage = (page) => {
  store.pagination.page = page
  store.fetchProducts(true)
}

onMounted(() => store.fetchProducts())
</script>

<template>
  <div class="px-4 py-4 flex flex-col gap-4">

    <!-- Top Bar -->
    <div class="flex items-center justify-end">
      <button
        @click="openCreate"
        class="flex items-center gap-1 bg-primary-blue text-white px-3 py-2 rounded-lg text-xs"
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
        class="bg-card-background border border-primary-border rounded-lg px-4 py-3 flex items-center justify-between active:opacity-70 transition-opacity cursor-pointer"
      >
        <div class="flex flex-col gap-0.5">
          <p class="mid-text text-primary-text">{{ product.name }}</p>
        </div>
        <span
          :class="product.isActive ? 'text-primary-green' : 'text-primary-red'"
          class="label-text px-2 py-0.5"
          :style="product.isActive ? 'border-color: var(--color-primary-green)' : 'border-color: var(--color-primary-red)'"
        >
          {{ product.isActive ? 'Active' : 'Inactive' }}
        </span>
      </div>
    </div>

    <!-- Pagination -->
    <BasePagination
      :pagination="{ currentPage: store.pagination.page, totalPages: store.pagination.total_pages }"
      @change="goToPage($event)"
    />

  </div>

  <!-- Dialog -->
  <ProductDialog
    :mode="store.mode"
    :item="store.item"
  />
</template>
