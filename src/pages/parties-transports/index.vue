<script setup>
import { ref, onMounted } from 'vue'
import { Users, Truck } from 'lucide-vue-next'
import { usePartiesStore } from '@/stores/parties/parties'
import { useTransportsStore } from '@/stores/transports/transports'
import PartyDialog from '@/components/parties/PartyDialog.vue'
import TransportDialog from '@/components/transports/TransportDialog.vue'
import BasePagination from '@/components/common/BasePagination.vue'

const partiesStore = usePartiesStore()
const transportsStore = useTransportsStore()

const activeTab = ref('parties')

const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'parties' && !partiesStore.isFetched) partiesStore.fetchParties()
  if (tab === 'transports' && !transportsStore.isFetched) transportsStore.fetchTransports()
}

const goToPartiesPage = (page) => {
  partiesStore.pagination.page = page
  partiesStore.fetchParties(true)
}

const goToTransportsPage = (page) => {
  transportsStore.pagination.page = page
  transportsStore.fetchTransports(true)
}

onMounted(() => partiesStore.fetchParties())
</script>

<template>
  <div class="px-4 py-4 flex flex-col gap-4">

    <!-- Segmented Toggle -->
    <div class="flex bg-card-background border border-primary-border rounded-xl p-1 gap-1">
      <button
        @click="switchTab('parties')"
        :class="activeTab === 'parties' ? 'bg-primary-blue text-white' : 'text-secondary-text'"
        class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg mid-text transition-all"
      >
        <Users :size="16" />
        Parties
      </button>
      <button
        @click="switchTab('transports')"
        :class="activeTab === 'transports' ? 'bg-primary-blue text-primary-text' : 'text-secondary-text'"
        class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg mid-text transition-all"
      >
        <Truck :size="16" />
        Transports
      </button>
    </div>

    <!-- ── PARTIES ── -->
    <template v-if="activeTab === 'parties'">
      <div class="flex items-center justify-end">
        <!-- <span class="title-text text-white">Parties</span> -->
        <button
          @click="partiesStore.openCreateDialog()"
          class="bg-primary-blue text-white px-3 py-2 rounded-lg text-xs"
        >
          + New
        </button>
      </div>

      <!-- Loading -->
      <div v-if="partiesStore.loading" class="flex flex-col gap-3">
        <div v-for="n in 3" :key="n" class="bg-card-background border border-primary-border rounded-2xl h-16 animate-pulse" />
      </div>

      <!-- Empty -->
      <div v-else-if="!partiesStore.records.length" class="flex flex-col items-center justify-center gap-2 py-16">
        <Users :size="36" class="text-secondary-text" />
        <p class="normal-text text-secondary-text">No parties found</p>
      </div>

      <!-- Cards -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="party in partiesStore.records"
          :key="party._id"
          @click="partiesStore.openEditDialog(party)"
          class="bg-card-background border border-primary-border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
        >
          <div class="flex flex-col gap-0.5">
            <p class="mid-text text-primary-text">{{ party.name }}</p>
            <p class="label-text text-secondary-text">{{ party.address }}</p>
          </div>
          <span
            :class="party.isActive ? 'text-primary-green' : 'text-primary-red'"
            class="label-text"
          >
            {{ party.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <BasePagination :pagination="{ currentPage: partiesStore.pagination.page, totalPages: partiesStore.pagination.total_pages }" @change="goToPartiesPage($event)" />
    </template>

    <!-- ── TRANSPORTS ── -->
    <template v-if="activeTab === 'transports'">
      <div class="flex items-center justify-end">
        <!-- <span class="title-text text-white">Transports</span> -->
        <button
          @click="transportsStore.openCreateDialog()"
          class="bg-primary-blue text-white px-3 py-2 rounded-lg text-xs"
        >
          + New
        </button>
      </div>

      <!-- Loading -->
      <div v-if="transportsStore.loading" class="flex flex-col gap-3">
        <div v-for="n in 3" :key="n" class="bg-card-background border border-primary-border rounded-2xl h-16 animate-pulse" />
      </div>

      <!-- Empty -->
      <div v-else-if="!transportsStore.records.length" class="flex flex-col items-center justify-center gap-2 py-16">
        <Truck :size="36" class="text-secondary-text" />
        <p class="normal-text text-secondary-text">No transports found</p>
      </div>

      <!-- Cards -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="transport in transportsStore.records"
          :key="transport._id"
          @click="transportsStore.openEditDialog(transport)"
          class="bg-card-background border border-primary-border rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer active:opacity-70 transition-opacity"
        >
          <p class="mid-text text-primary-text">{{ transport.name }}</p>
          <span
            :class="transport.isActive ? 'text-primary-green' : 'text-primary-red'"
            class="label-text"
          >
            {{ transport.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>

      <BasePagination :pagination="{ currentPage: transportsStore.pagination.page, totalPages: transportsStore.pagination.total_pages }" @change="goToTransportsPage($event)" />
    </template>

  </div>

  <PartyDialog />
  <TransportDialog />
</template>
