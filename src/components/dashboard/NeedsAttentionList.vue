<script setup>
import { useRouter } from 'vue-router'
import { AlertTriangle, Clock } from 'lucide-vue-next'

defineProps({ items: Array, loading: Boolean })

const router = useRouter()

const statusClass = {
  CREATED: 'text-status-created',
  APPROVED: 'text-status-approved',
  EXECUTED: 'text-status-executed',
  // PARTIALLY_DISPATCHED: 'text-status-partial',
  COMPLETED: 'text-status-completed',
  CANCELLED: 'text-status-cancelled',
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <AlertTriangle :size="16" class="text-primary-yellow" />
      <span class="mid-text text-primary-text">Needs Attention</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-2">
      <div v-for="n in 2" :key="n" class="bg-card-background border border-primary-border rounded-2xl h-14 animate-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="!items?.length" class="bg-card-background border border-primary-border rounded-2xl px-4 py-5 flex justify-center">
      <p class="label-text text-secondary-text">All orders are on track</p>
    </div>

    <!-- List -->
    <div v-else class="flex flex-col gap-2">
      <div
        v-for="order in items"
        :key="order.orderId"
        @click="router.push(`/orders/${order.orderId}`)"
        class="bg-card-background border border-primary-border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
      >
        <div class="flex flex-col gap-0.5">
          <p class="normal-text text-primary-text">{{ order.orderNumber }}</p>
          <span :class="statusClass[order.status]" class="label-text">{{ order.status }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Clock :size="13" class="text-primary-yellow" />
          <span class="label-text text-primary-yellow">{{ order.daysWaiting }}d</span>
        </div>
      </div>
    </div>
  </div>
</template>