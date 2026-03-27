<template>
  <button class="btn" :class="`btn--${variant}`" :disabled="disabled" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}>()
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--primary { background: #3b82f6; color: #fff; }
.btn--primary:hover:not(:disabled) { background: #2563eb; }
.btn--secondary { background: #f3f4f6; color: #111827; }
.btn--secondary:hover:not(:disabled) { background: #e5e7eb; }
.btn--danger { background: #ef4444; color: #fff; }
.btn--danger:hover:not(:disabled) { background: #dc2626; }
</style>
