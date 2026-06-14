<script setup>
import { onMounted } from 'vue'
import { useDashboardStore } from '@/stores/dashboard/dashboard'
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards.vue'
import NeedsAttentionList from '@/components/dashboard/NeedsAttentionList.vue'
import PendingDispatchList from '@/components/dashboard/PendingDispatchList.vue'

const store = useDashboardStore()

onMounted(() => store.fetchDashboard())
</script>

<template>
  <div class="px-4 py-4 flex flex-col gap-5">

    <DashboardSummaryCards :summary="store.summary" :loading="store.loading" />

    <NeedsAttentionList :items="store.needsAttention" :loading="store.loading" />

    <PendingDispatchList :items="store.pendingDispatch" :loading="store.loading" />

  </div>
</template>