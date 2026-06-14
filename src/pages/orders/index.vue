<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, Search, Plus } from 'lucide-vue-next'
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
  { label: 'Partial', value: 'PARTIAL' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const statusClass = {
  CREATED: 'text-status-created border-status-created/30 bg-status-created/5',
  APPROVED: 'text-status-approved border-status-approved/30 bg-status-approved/5',
  EXECUTED: 'text-status-executed border-status-executed/30 bg-status-executed/5',
  PARTIAL: 'text-status-partial border-status-partial/30 bg-status-partial/5',
  PARTIALLY_DISPATCHED: 'text-status-partial border-status-partial/30 bg-status-partial/5',
  COMPLETED: 'text-status-completed border-status-completed/30 bg-status-completed/5',
  CANCELLED: 'text-status-cancelled border-status-cancelled/30 bg-status-cancelled/5',
}

const cardStatusClass = {
  CREATED: 'border-l-status-created',
  APPROVED: 'border-l-status-approved',
  EXECUTED: 'border-l-status-executed',
  PARTIAL: 'border-l-status-partial',
  PARTIALLY_DISPATCHED: 'border-l-status-partial',
  COMPLETED: 'border-l-status-completed',
  CANCELLED: 'border-l-status-cancelled',
}

const statusLabels = {
  CREATED: 'Created',
  APPROVED: 'Approved',
  EXECUTED: 'Executed',
  PARTIAL: 'Partial',
  PARTIALLY_DISPATCHED: 'Partial',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

let filterTimeout = null
const onFilterChange = () => {
  if (filterTimeout) clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    store.applyFilters()
  }, 500)
}

onMounted(() => store.fetchOrders())
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

      <!-- Date Range -->
      <div class="flex gap-2">
        <div class="flex-1">
          <label class="label-text text-secondary-text block mb-1">From</label>
          <input
            v-model="store.filters.fromDate"
            type="date"
            class="input-field w-full"
            @change="onFilterChange"
          />
        </div>
        <div class="flex-1">
          <label class="label-text text-secondary-text block mb-1">To</label>
          <input
            v-model="store.filters.toDate"
            type="date"
            class="input-field w-full"
            @change="onFilterChange"
          />
        </div>
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
          <span
            class="label-text px-2 py-0.5 rounded-lg border font-semibold"
            :class="statusClass[order.status] || 'text-secondary-text border-primary-border'"
          >
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

    <BasePagination :pagination="store.pagination" @change="store.fetchOrders({ page: $event })" />

  </div>

  <CreateOrderDialog />
</template>