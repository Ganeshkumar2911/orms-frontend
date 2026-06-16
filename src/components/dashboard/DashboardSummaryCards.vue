<script setup>
import { useRouter } from 'vue-router'
import { Clock, Zap, Truck, CheckCircle2 } from 'lucide-vue-next'

defineProps({ summary: Object, loading: Boolean })

const router = useRouter()

const cards = [
  { key: 'waitingApproval',  label: 'Waiting Approval',  icon: Clock,        color: 'text-primary-yellow', route: 'waiting-approval'  },
  { key: 'waitingExecution', label: 'Waiting Execution', icon: Zap,          color: 'text-primary-accent',   route: 'waiting-execution' },
  { key: 'pendingDispatch',  label: 'Pending Dispatch',  icon: Truck,        color: 'text-status-partial', route: 'pending-dispatch'  },
  { key: 'completedToday',   label: 'Completed Today',   icon: CheckCircle2, color: 'text-primary-green',  route: 'completed-today'   },
]

const go = (route) => router.push(`/dashboard/${route}`)
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="card in cards"
      :key="card.key"
      @click="go(card.route)"
      class="bg-card-background border border-primary-border rounded-2xl p-4 flex flex-col gap-2 cursor-pointer active:opacity-70 transition-opacity"
    >
      <component :is="card.icon" :size="18" :class="card.color" />
      <p v-if="loading" class="w-10 h-6 bg-background rounded animate-pulse" />
      <p v-else class="title-text text-primary-text">{{ summary?.[card.key] ?? 0 }}</p>
      <p class="label-text text-secondary-text leading-tight">{{ card.label }}</p>
    </div>
  </div>
</template>