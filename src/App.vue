<template>
  <div>
    <router-view />
    <Snackbar />
  </div>
</template>

<script setup>
import Snackbar from '@/components/common/snackbar.vue'
import { onMounted } from "vue";
import { getFCMToken } from "@/utils/fcm";

// onMounted(async () => {
//   const token = await getFCMToken();
// });
</script>
