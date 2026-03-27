<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'success' | 'warning' }>(), { variant: 'default' })
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}
.badge--default { background: #e5e7eb; color: #374151; }
.badge--success { background: #d1fae5; color: #065f46; }
.badge--warning { background: #fef3c7; color: #92400e; }
</style>
