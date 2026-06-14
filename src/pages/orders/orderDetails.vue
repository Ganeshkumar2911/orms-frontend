<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  CheckCircle2, Circle, XCircle, User, Package,
  Truck, MapPin, Calendar, AlertTriangle
} from 'lucide-vue-next'

import { useOrderDetailsStore } from '@/stores/orders/orderDetails'
import { useUserStore } from '@/stores/profile/profile'

import CancelOrderDialog from '@/components/orderDetails/CancelOrderDialog.vue'
import DispatchOrderDialog from '@/components/orderDetails/DispatchOrderDialog.vue'
import EditOrderDialog from '@/components/orderDetails/EditOrderDialog.vue'

const route = useRoute()
const store = useOrderDetailsStore()
const userStore = useUserStore()

onMounted(() => store.fetchOrderDetails(route.params.id))

const order = computed(() => store.order)
const role = computed(() => userStore.user?.role)
const status = computed(() => order.value?.status)

// ── Permissions ──────────────────────────────────────────────────────────────
const canApprove = computed(() =>
  role.value === 'deepak_admin' && status.value === 'CREATED'
)
const canExecute = computed(() =>
  role.value === 'naveen_admin' && status.value === 'APPROVED'
)
const canDispatch = computed(() =>
  ['naveen_admin', 'naveen_staff'].includes(role.value) &&
  ['EXECUTED', 'PARTIALLY_DISPATCHED'].includes(status.value)
)
const canCancel = computed(() =>
  ['deepak_admin', 'naveen_admin'].includes(role.value) &&
  ['CREATED', 'APPROVED', 'EXECUTED'].includes(status.value)
)
const canEdit = computed(() =>
  ['deepak_admin', 'deepak_staff'].includes(role.value) &&
  ['CREATED', 'APPROVED', 'EXECUTED'].includes(status.value)
)

const hasActions = computed(() =>
  canApprove.value || canExecute.value || canDispatch.value || canCancel.value || canEdit.value
)

// ── Progress Tracker ──────────────────────────────────────────────────────────
const stages = ['CREATED', 'APPROVED', 'EXECUTED', 'PARTIALLY_DISPATCHED', 'COMPLETED']
const stageLabels = {
  CREATED: 'Created',
  APPROVED: 'Approved',
  EXECUTED: 'Executed',
  PARTIALLY_DISPATCHED: 'Dispatching',
  COMPLETED: 'Completed',
}

const currentStageIndex = computed(() => stages.indexOf(status.value))

const stageState = (i) => {
  if (i < currentStageIndex.value) return 'done'
  if (i === currentStageIndex.value) return 'active'
  return 'pending'
}

// ── Status badge ──────────────────────────────────────────────────────────────
const statusClass = {
  CREATED: 'text-status-created',
  APPROVED: 'text-status-approved',
  EXECUTED: 'text-status-executed',
  PARTIALLY_DISPATCHED: 'text-status-partial',
  COMPLETED: 'text-status-completed',
  CANCELLED: 'text-status-cancelled',
}

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

// ── Confirm helper ────────────────────────────────────────────────────────────
const confirmAction = ref({ show: false, message: '', cb: null })

const showConfirm = (message, cb) => {
  confirmAction.value = { show: true, message, cb }
}
const doConfirm = () => {
  confirmAction.value.cb?.()
  confirmAction.value.show = false
}
</script>

<template>
  <div class="px-4 py-4 pb-32 flex flex-col gap-4">

    <!-- Loading -->
    <template v-if="store.loading">
      <div v-for="n in 4" :key="n" class="bg-card-background border border-primary-border rounded-2xl h-24 animate-pulse" />
    </template>

    <!-- Data -->
    <template v-else-if="order">

      <!-- ── Progress Tracker / Cancelled ─────────────────────── -->
      <div class="bg-card-background border border-primary-border rounded-lg p-4">
        <!-- Cancelled State -->
        <template v-if="status === 'CANCELLED'">
          <div class="flex flex-col items-center gap-2 py-2">
            <XCircle :size="36" class="text-primary-red" />
            <p class="title-text text-primary-red">Order Cancelled</p>
          </div>
        </template>

        <!-- Normal Progress -->
        <template v-else>
          <p class="label-text text-secondary-text mb-4">Order Progress</p>
          <div class="flex items-start justify-between relative">
            <!-- Connector line -->
            <div class="absolute top-4 left-4 right-4 h-0.5 bg-primary-border z-0" />

            <div
              v-for="(stage, i) in stages"
              :key="stage"
              class="flex flex-col items-center gap-1.5 z-10 flex-1"
            >
              <!-- Icon -->
              <div
                :class="{
                  'bg-primary-green text-primary-text': stageState(i) === 'done',
                  'bg-primary-accent text-primary-text': stageState(i) === 'active',
                  'bg-card-background border-2 border-primary-border text-secondary-text': stageState(i) === 'pending',
                }"
                class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              >
                <CheckCircle2 v-if="stageState(i) === 'done'" :size="16" />
                <Circle v-else :size="14" :fill="stageState(i) === 'active' ? 'currentColor' : 'none'" />
              </div>
              <!-- Label -->
              <span
                class="label-text text-center leading-tight"
                :class="{
                  'text-primary-green': stageState(i) === 'done',
                  'text-primary-accent': stageState(i) === 'active',
                  'text-secondary-text': stageState(i) === 'pending',
                }"
                style="font-size: 9px; max-width: 52px;"
              >
                {{ stageLabels[stage] }}
              </span>
            </div>
          </div>
        </template>
      </div>

      <!-- ── Order Info ─────────────────────────────────────────── -->
      <div class="bg-card-background border border-primary-border rounded-lg p-4 flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="title-text text-primary-text">{{ order.orderNumber }}</span>
          <span :class="statusClass[status]" class="label-text px-2 py-0.5 border rounded-full" style="border-color: currentColor;">
            {{ status }}
          </span>
        </div>
        <div class="flex flex-col gap-2">
          <div class="flex items-start gap-2">
            <User :size="15" class="text-secondary-text mt-0.5 shrink-0" />
            <div>
              <p class="mid-text text-primary-text">{{ order.party.name }}</p>
              <p class="label-text text-secondary-text">{{ order.party.address }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Truck :size="15" class="text-secondary-text shrink-0" />
            <p class="normal-text text-primary-text">{{ order.transport.name }}</p>
          </div>
          <div class="flex items-center gap-2">
            <Calendar :size="15" class="text-secondary-text shrink-0" />
            <p class="normal-text text-secondary-text">{{ formatDate(order.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- ── Items ──────────────────────────────────────────────── -->
      <div class="bg-card-background border border-primary-border rounded-lg p-4 flex flex-col gap-3">
        <div class="flex items-center gap-2 mb-1">
          <Package :size="16" class="text-secondary-text" />
          <span class="mid-text text-primary-text">Items ({{ order.items.length }})</span>
        </div>

        <div
          v-for="(item, i) in order.items"
          :key="item.product._id"
          class="border border-primary-border rounded-lg p-3 flex flex-col gap-2"
        >
          <p class="normal-text text-primary-text">{{ item.product.name }}</p>
          <div class="grid grid-cols-4 gap-1 text-center">
            <div>
              <p class="label-text text-secondary-text">Ordered</p>
              <p class="mid-text text-primary-text">{{ item.orderedQty }}</p>
            </div>
            <div>
              <p class="label-text text-secondary-text">Dispatched</p>
              <p class="mid-text text-primary-green">{{ item.dispatchedQty }}</p>
            </div>
            <div>
              <p class="label-text text-secondary-text">Pending</p>
              <p class="mid-text text-primary-yellow">{{ item.orderedQty - item.dispatchedQty }}</p>
            </div>
            <div>
              <p class="label-text text-secondary-text">Price</p>
              <p class="mid-text text-primary-text">₹{{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Created By ──────────────────────────────────────────── -->
      <div class="bg-card-background border border-primary-border rounded-lg p-4 flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-primary-accent flex items-center justify-center shrink-0">
          <User :size="16" class="text-primary-text" />
        </div>
        <div>
          <p class="normal-text text-primary-text">{{ order.createdBy?.name }}</p>
          <p class="label-text text-secondary-text">{{ order.createdBy?.role }}</p>
        </div>
      </div>

      <!-- ── Cancellation Card ───────────────────────────────────── -->
      <div
        v-if="status === 'CANCELLED' && (order.cancelReason || order.cancelledBy)"
        class="bg-card-background border border-primary-red rounded-2xl p-4 flex flex-col gap-2"
      >
        <div class="flex items-center gap-2 mb-1">
          <AlertTriangle :size="15" class="text-primary-red" />
          <span class="mid-text text-primary-red">Cancellation Info</span>
        </div>
        <p v-if="order.cancelReason" class="normal-text text-primary-text">{{ order.cancelReason }}</p>
        <p v-if="order.cancelledBy" class="label-text text-secondary-text">By: {{ order.cancelledBy?.name }}</p>
        <p v-if="order.cancelledAt" class="label-text text-secondary-text">{{ formatDate(order.cancelledAt) }}</p>
      </div>

    </template>

    <!-- Empty -->
    <div v-else-if="!store.loading" class="flex flex-col items-center justify-center gap-2 py-20">
      <Package :size="36" class="text-secondary-text" />
      <p class="normal-text text-secondary-text">Order not found</p>
    </div>

  </div>

  <!-- ── Fixed Bottom Actions ───────────────────────────────────── -->
  <div
    v-if="order && hasActions"
    class="fixed bottom-16 left-0 right-0 z-40 bg-card-background border-t border-primary-border px-4 py-3 flex gap-2"
  >
    <button
      v-if="canEdit"
      @click="store.openEditDialog()"
      class="flex-1 py-2.5 rounded-lg border border-primary-border mid-text text-primary-text"
    >
      Edit
    </button>
    <button
      v-if="canCancel"
      @click="store.openCancelDialog()"
      class="flex-1 py-2.5 rounded-lg border border-primary-red mid-text text-primary-red font-bold capitalize"
    >
      Cancel
    </button>
    <button
      v-if="canDispatch"
      @click="store.openDispatchDialog()"
      class="flex-1 py-2.5 rounded-lg bg-primary-accent mid-text text-primary-text"
    >
      Dispatch
    </button>
    <button
      v-if="canApprove"
      @click="showConfirm('Approve this order?', () => store.approveOrder(route.params.id))"
      :disabled="store.approveLoading"
      class="flex-1 py-2.5 rounded-lg bg-primary-green mid-text text-primary-text disabled:opacity-50"
    >
      {{ store.approveLoading ? '...' : 'Approve' }}
    </button>
    <button
      v-if="canExecute"
      @click="showConfirm('Execute this order?', () => store.executeOrder(route.params.id))"
      :disabled="store.executeLoading"
      class="flex-1 py-2.5 rounded-xl bg-primary-accent mid-text text-primary-text disabled:opacity-50"
    >
      {{ store.executeLoading ? '...' : 'Execute' }}
    </button>
  </div>

  <!-- ── Confirm Modal ──────────────────────────────────────────── -->
  <Teleport to="body">
    <div v-if="confirmAction.show" class="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-black/50" @click="confirmAction.show = false" />
      <div class="relative bg-card-background border border-primary-border rounded-2xl p-5 w-full max-w-sm flex flex-col gap-4 z-10">
        <p class="mid-text text-primary-text text-center">{{ confirmAction.message }}</p>
        <div class="flex gap-3">
          <button
            @click="confirmAction.show = false"
            class="flex-1 py-2.5 rounded-xl border border-primary-border label-text text-secondary-text"
          >
            No
          </button>
          <button
            @click="doConfirm"
            class="flex-1 py-2.5 rounded-xl bg-primary-accent text-white text-sm"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <CancelOrderDialog />
  <DispatchOrderDialog />
  <EditOrderDialog />
</template>
