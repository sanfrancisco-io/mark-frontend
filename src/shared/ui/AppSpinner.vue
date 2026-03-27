<template>
  <div class="spinner" :style="{ width: size, height: size }" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: string }>(), { size: '32px' })
</script>

<style scoped>
.spinner {
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
