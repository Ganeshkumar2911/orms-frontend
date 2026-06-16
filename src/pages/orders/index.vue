<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, Search, Plus, X } from 'lucide-vue-next'
import { useOrdersStore } from '@/stores/orders/orders'

import CreateOrderDialog from '@/components/orders/CreateOrderDialog.vue'

const store = useOrdersStore()
const router = useRouter()

const openOrder = (id) => {
  router.push({ name: 'order-details', params: { id } })
}

const statusOptions = [
  { label: 'Created', value: 'CREATED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Executed', value: 'EXECUTED' },
  // { label: 'Partial Dispatch', value: 'PARTIALLY_DISPATCHED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const statusClass = {
  CREATED: 'bg-status-created text-slate-900 border-transparent',
  APPROVED: 'bg-status-approved text-white border-transparent',
  EXECUTED: 'bg-status-executed text-white border-transparent',
  // PARTIALLY_DISPATCHED: 'bg-status-partial text-slate-900 border-transparent',
  COMPLETED: 'bg-status-completed text-white border-transparent',
  CANCELLED: 'bg-status-cancelled text-white border-transparent',
}

const cardStatusClass = {
  CREATED: 'border-l-status-created',
  APPROVED: 'border-l-status-approved',
  EXECUTED: 'border-l-status-executed',
  PARTIAL: 'border-l-status-partial',
  // PARTIALLY_DISPATCHED: 'border-l-status-partial',
  COMPLETED: 'border-l-status-completed',
  CANCELLED: 'border-l-status-cancelled',
}

const statusLabels = {
  CREATED: 'Created',
  APPROVED: 'Approved',
  EXECUTED: 'Executed',
  PARTIAL: 'Partial',
  // PARTIALLY_DISPATCHED: 'Partial',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

let filterTimeout = null
const onFilterChange = (isDate = false) => {
  if (isDate) {
    const from = store.filters.fromDate
    const to = store.filters.toDate
    // Only call API if both are selected or both are empty
    if ((from && !to) || (!from && to)) return
  }
  if (filterTimeout) clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    store.applyFilters()
  }, 500)
}

const hasFilters = computed(() => {
  return !!(
    store.filters.search ||
    store.filters.status ||
    store.filters.partyId ||
    store.filters.fromDate ||
    store.filters.toDate
  )
})

const clearAllFilters = () => {
  store.filters.search = ''
  store.filters.status = ''
  store.filters.partyId = ''
  store.filters.fromDate = ''
  store.filters.toDate = ''
  store.applyFilters()
}

onMounted(() => {
  // Clear any filters from previous pages
  store.filters.search = ''
  store.filters.status = ''
  store.filters.partyId = ''
  store.filters.fromDate = ''
  store.filters.toDate = ''
  store.fetchOrders()
})
</script>

<template>
  <div class="px-4 py-4 flex flex-col gap-4">

    <!-- Top Bar -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1">
        <Search
          :size="16"
          class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text"
        />
        <input
          v-model="store.filters.search"
          type="text"
          placeholder="Search order number..."
          class="input-field !pl-10 h-10 w-full"
          @input="onFilterChange"
        />
      </div>
      <button
        @click="store.openCreateDialog()"
        class="flex items-center gap-1 bg-primary-accent text-white px-3 py-2 rounded-lg text-xs shrink-0 h-10"
      >
        <Plus :size="16" />
        New
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3">
      <div class="flex gap-2">
        <!-- Status -->
        <BaseSelect
          v-model="store.filters.status"
          :options="statusOptions"
          placeholder="All Statuses"
          class="flex-1"
          :allow-all="true"
          @update:modelValue="onFilterChange"
        />

        <!-- Party -->
        <BaseSelect
          v-model="store.filters.partyId"
          :options="store.partyOptions"
          :is-loading="store.partyOptionsLoading"
          placeholder="All Parties"
          class="flex-1"
          :searchable="true"
          :allow-all="true"
          @search="store.fetchPartyOptions($event)"
          @update:modelValue="onFilterChange"
        />
      </div>

      <!-- Date Range & Clear Filters -->
      <div class="flex gap-2 items-end">
        <div class="flex-1 min-w-0">
          <label class="label-text text-secondary-text block mb-1">From</label>
          <input
            v-model="store.filters.fromDate"
            type="date"
            class="input-field w-full text-xs sm:text-sm px-2 sm:px-3 h-10"
            @change="onFilterChange(true)"
          />
        </div>
        <div class="flex-1 min-w-0">
          <label class="label-text text-secondary-text block mb-1">To</label>
          <input
            v-model="store.filters.toDate"
            type="date"
            class="input-field w-full text-xs sm:text-sm px-2 sm:px-3 h-10"
            @change="onFilterChange(true)"
          />
        </div>
        <!-- Clear Filters (inline) -->
        <button
          v-if="hasFilters"
          @click="clearAllFilters"
          class="h-10 px-2.5 rounded-lg border border-primary-red/25 text-primary-red hover:bg-primary-red/5 font-semibold text-xs shrink-0 flex items-center gap-1 transition-all duration-150 cursor-pointer"
          title="Clear all filters"
        >
          <X :size="14" />
          Clear
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex flex-col gap-3">
      <div v-for="n in 4" :key="n" class="bg-card-background border border-primary-border rounded-2xl h-24 animate-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="!store.records.length" class="flex flex-col items-center justify-center gap-2 py-16">
      <ShoppingCart :size="36" class="text-secondary-text" />
      <p class="normal-text text-secondary-text">No orders found</p>
    </div>

    <!-- Cards -->
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="order in store.records"
        :key="order._id"
        @click="openOrder(order._id)"
        class="bg-card-background border-y border-r border-l-4 border-y-primary-border border-r-primary-border rounded-r-lg rounded-l-[3px] px-4 py-3 flex flex-col gap-2 transition-all duration-200 cursor-pointer hover:shadow-sm hover:border-y-primary-accent/30 hover:border-r-primary-accent/30"
        :class="cardStatusClass[order.status] || 'border-l-secondary-text'"
      >
        <!-- Row 1: Order Number + Status -->
        <div class="flex items-center justify-between">
          <span class="mid-text text-primary-text font-medium">{{ order.orderNumber }}</span>
          <span :class="statusClass[order.status] || 'border-primary-border'" class=" text-sm px-2 py-0.5 border rounded-lg font-bold">
            {{ statusLabels[order.status] || order.status }}
          </span>
        </div>

        <!-- Row 2: Party & Transport -->
        <div class="flex flex-col gap-0.5">
          <p class="label-text text-secondary-text">Party: <span class="text-primary-text font-medium">{{ order.party?.name }}</span></p>
          <p class="label-text text-secondary-text">Transport: <span class="text-primary-text font-medium">{{ order.transport?.name }}</span></p>
        </div>

        <!-- Row 3: Date -->
        <p class="label-text text-secondary-text">{{ formatDate(order.createdAt) }}</p>
      </div>
    </div>

    <BasePagination :pagination="{ currentPage: store.pagination.page, totalPages: store.pagination.total_pages }" @change="store.changePage($event)" />

  </div>

  <CreateOrderDialog />
</template>
