<script setup>
import { useRouter } from 'vue-router'
import { Truck } from 'lucide-vue-next'

defineProps({ items: Array, loading: Boolean })

const router = useRouter()

const statusClass = {
  EXECUTED: 'text-status-executed',
  PARTIALLY_DISPATCHED: 'text-status-partial',
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <Truck :size="16" class="text-primary-accent" />
      <span class="mid-text text-primary-text">Pending Dispatch</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-2">
      <div v-for="n in 2" :key="n" class="bg-card-background border border-primary-border rounded-2xl h-14 animate-pulse" />
    </div>

    <!-- Empty -->
    <div v-else-if="!items?.length" class="bg-card-background border border-primary-border rounded-2xl px-4 py-5 flex justify-center">
      <p class="label-text text-secondary-text">No pending dispatches</p>
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
          <p class="label-text text-secondary-text">{{ order.partyName }}</p>
        </div>
        <span :class="statusClass[order.status] || 'text-secondary-text'" class="label-text">
          {{ order.status }}
        </span>
      </div>
    </div>
  </div>
</template>