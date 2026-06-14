<script setup>
import { useRouter, useRoute } from 'vue-router'
import { Home, ShoppingCart, Package, User, Truck } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const tabs = [
  { name: 'Home', icon: Home, path: '/dashboard' },
  { name: 'Orders', icon: ShoppingCart, path: '/orders' },
  { name: 'Products', icon: Package, path: '/products' },
  { name: 'P & T', icon: Truck, path: '/parties-transports' },
]

const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-card-background border-t border-primary-border flex items-center justify-around h-16">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      @click="router.push(tab.path)"
      class="flex flex-col items-center justify-center flex-1 h-full gap-1"
    >
      <component
        :is="tab.icon"
        :size="22"
        :class="isActive(tab.path) ? 'text-primary-accent' : 'text-secondary-text'"
      />
      <span
        class="label-text"
        :class="isActive(tab.path) ? 'text-primary-accent' : 'text-secondary-text'"
      >
        {{ tab.name }}
      </span>
    </button>
  </nav>
</template>
