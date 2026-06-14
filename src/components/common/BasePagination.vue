<script setup>
const props = defineProps({
  pagination: Object,
})
const emit = defineEmits(['change'])
</script>

<template>
  <div
    v-if="pagination?.totalPages > 1"
    class="flex items-center justify-center gap-4 py-2"
  >
    <button
      @click="emit('change', pagination.currentPage - 1)"
      :disabled="pagination.currentPage === 1"
      class="label-text text-primary-accent disabled:text-secondary-text"
    >
      Prev
    </button>
    <span class="label-text text-secondary-text">
      {{ pagination.currentPage }} / {{ pagination.totalPages }}
    </span>
    <button
      @click="emit('change', pagination.currentPage + 1)"
      :disabled="pagination.currentPage === pagination.totalPages"
      class="label-text text-primary-accent disabled:text-secondary-text"
    >
      Next
    </button>
  </div>
</template>