<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = computed(() => route.params.id)
</script>

<template>
  <div class="px-4 py-4">
    <h1 class="title-text text-primary-text">Order Details</h1>
    <p class="label-text text-secondary-text mt-2">Order ID: <span class="text-primary-text">{{ orderId }}</span></p>
  </div>
</template>