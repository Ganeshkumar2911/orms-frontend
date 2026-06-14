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
      class="flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative"
    >
      <!-- Active indicator pill at top -->
      <span
        class="absolute top-0 h-0.5 w-8 rounded-full transition-all duration-300"
        :class="isActive(tab.path) ? 'bg-primary-accent' : 'bg-transparent'"
      />

      <!-- Icon with background pill when active -->
      <div
        class="px-4 py-1 rounded-lg transition-all duration-200"
      >
        <component
          :is="tab.icon"
          :size="20"
          :class="isActive(tab.path) ? 'text-primary-accent' : 'text-secondary-text'"
        />
      </div>

      <!-- Label -->
      <span
        class="text-[10px] transition-all duration-200"
        :class="isActive(tab.path) ? 'text-primary-accent font-bold' : 'text-secondary-text font-medium'"
      >
        {{ tab.name }}
      </span>
    </button>
  </nav>
</template>
