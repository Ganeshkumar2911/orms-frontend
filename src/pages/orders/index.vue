<script setup>
import { ref, onMounted } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'
import { useOrdersStore } from '@/stores/orders/orders'

import CreateOrderDialog from '@/components/orders/CreateOrderDialog.vue'

const store = useOrdersStore()

const statusOptions = [
  { label: 'Created', value: 'CREATED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Executed', value: 'EXECUTED' },
  { label: 'Partial', value: 'PARTIAL' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const statusClass = {
  CREATED: 'text-status-created',
  APPROVED: 'text-status-approved',
  EXECUTED: 'text-status-executed',
  PARTIAL: 'text-status-partial',
  COMPLETED: 'text-status-completed',
  CANCELLED: 'text-status-cancelled',
}

const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const onFilterChange = () => store.applyFilters()

onMounted(() => store.fetchOrders())
</script>

<template>
  <div class="px-4 py-4 flex flex-col gap-4">

    <!-- Top Bar -->
    <div class="flex items-center justify-between">
      <h1 class="title-text text-primary-text">Orders</h1>
      <button
        @click="store.openCreateDialog()"
        class="bg-primary-accent text-primary-text px-3 py-2 rounded-xl label-text"
      >
        + New
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3">

      <!-- Search -->
      <input
        v-model="store.filters.search"
        type="text"
        placeholder="Search order number..."
        class="input-field w-full"
        @input="onFilterChange"
      />

      <!-- Status -->
      <BaseSelect
        v-model="store.filters.status"
        :options="statusOptions"
        placeholder="All Statuses"
        :allow-all="true"
        @update:modelValue="onFilterChange"
      />

      <!-- Party -->
      <BaseSelect
        v-model="store.filters.partyId"
        :options="store.partyOptions"
        :is-loading="store.partyOptionsLoading"
        placeholder="All Parties"
        :searchable="true"
        :allow-all="true"
        @search="store.fetchPartyOptions($event)"
        @update:modelValue="onFilterChange"
      />

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
        class="bg-card-background border border-primary-border rounded-2xl px-4 py-3 flex flex-col gap-2"
      >
        <!-- Row 1: Order Number + Status -->
        <div class="flex items-center justify-between">
          <span class="mid-text text-primary-text">{{ order.orderNumber }}</span>
          <span
            class="label-text px-2 py-0.5 rounded-full border"
            :class="statusClass[order.status] || 'text-secondary-text'"
          >
            {{ order.status }}
          </span>
        </div>

        <!-- Row 2: Party & Transport -->
        <div class="flex flex-col gap-0.5">
          <p class="label-text text-secondary-text">Party: <span class="text-primary-text">{{ order.party?.name }}</span></p>
          <p class="label-text text-secondary-text">Transport: <span class="text-primary-text">{{ order.transport?.name }}</span></p>
        </div>

        <!-- Row 3: Date -->
        <p class="label-text text-secondary-text">{{ formatDate(order.createdAt) }}</p>
      </div>
    </div>

    <BasePagination :pagination="store.pagination" @change="store.fetchOrders({ page: $event })" />

  </div>

  <CreateOrderDialog />
</template>