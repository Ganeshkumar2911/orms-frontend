<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, ShoppingCart } from 'lucide-vue-next'
import { useOrdersStore } from '@/stores/orders/orders'
import BasePagination from '@/components/common/BasePagination.vue'

const route = useRoute()
const router = useRouter()
const store = useOrdersStore()

// Map route type → status param + label
const typeMap = {
  'waiting-approval':  { status: 'CREATED',   label: 'Waiting Approval'  },
  'waiting-execution': { status: 'APPROVED',  label: 'Waiting Execution' },
  'pending-dispatch':  { status: 'PENDING',   label: 'Pending Dispatch'  },
  'completed-today':   { status: 'DISPATCHED',label: 'Completed Today'   },
}

const type = computed(() => route.params.type)
const config = computed(() => typeMap[type.value] || { status: '', label: 'Orders' })

const statusClass = {
  CREATED:              'text-status-created',
  APPROVED:             'text-status-approved',
  EXECUTED:             'text-status-executed',
  PARTIALLY_DISPATCHED: 'text-status-partial',
  COMPLETED:            'text-status-completed',
  CANCELLED:            'text-status-cancelled',
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const openOrder = (id) => router.push({ name: 'order-details', params: { id } })

const load = (page = 1) => {
  store.filters.status = config.value.status
  store.pagination.page = page
  store.fetchOrders()
}

onMounted(() => load())
</script>

<template>
  <div class="px-4 py-4 flex flex-col gap-4">

    <!-- Header -->
    <div class="flex items-center gap-3">
      <h1 class="title-text text-primary-text">{{ config.label }}</h1>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex flex-col gap-3">
      <div v-for="n in 5" :key="n" class="bg-card-background border border-primary-border rounded-2xl h-20 animate-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="!store.records.length" class="flex flex-col items-center justify-center gap-2 py-20">
      <ShoppingCart :size="36" class="text-secondary-text" />
      <p class="normal-text text-secondary-text">No orders found</p>
    </div>

    <!-- Cards -->
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="order in store.records"
        :key="order._id"
        @click="openOrder(order._id)"
        class="bg-card-background border border-primary-border rounded-2xl px-4 py-3 flex flex-col gap-2 cursor-pointer active:opacity-70 transition-opacity"
      >
        <div class="flex items-center justify-between">
          <span class="mid-text text-primary-text">{{ order.orderNumber }}</span>
          <span :class="statusClass[order.status]" class="label-text">{{ order.status }}</span>
        </div>
        <p class="label-text text-secondary-text">Party: <span class="text-primary-text">{{ order.party?.name }}</span></p>
        <p class="label-text text-secondary-text">{{ formatDate(order.createdAt) }}</p>
      </div>
    </div>

    <BasePagination :pagination="{ currentPage: store.pagination.page, totalPages: store.pagination.total_pages }" @change="load($event)" />

  </div>
</template>
