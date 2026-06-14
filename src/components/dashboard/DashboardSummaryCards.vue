<script setup>
import { Clock, Zap, Truck, CheckCircle2 } from 'lucide-vue-next'

defineProps({ summary: Object, loading: Boolean })

const cards = [
  { key: 'waitingApproval',  label: 'Waiting Approval',  icon: Clock,         color: 'text-primary-yellow' },
  { key: 'waitingExecution', label: 'Waiting Execution', icon: Zap,           color: 'text-primary-accent'   },
  { key: 'pendingDispatch',  label: 'Pending Dispatch',  icon: Truck,         color: 'text-status-partial' },
  { key: 'completedToday',   label: 'Completed Today',   icon: CheckCircle2,  color: 'text-primary-green'  },
]
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="card in cards"
      :key="card.key"
      class="bg-card-background border border-primary-border rounded-lg p-4 flex flex-col gap-2"
    >
      <div class="flex items-center justify-between">
        <component :is="card.icon" :size="18" :class="card.color" />
      </div>
      <p v-if="loading" class="w-10 h-6 bg-background rounded animate-pulse" />
      <p v-else class="title-text text-primary-text">{{ summary?.[card.key] ?? 0 }}</p>
      <p class="label-text text-secondary-text leading-tight">{{ card.label }}</p>
    </div>
  </div>
</template>