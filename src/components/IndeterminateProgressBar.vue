<template>
  <div class="absolute inset-x-0 top-0 h-px overflow-hidden z-10">
    <div class="bar h-full bg-primary animate-indeterminate" />
  </div>
</template>

<script setup lang="ts">
const scale = 3
</script>

<style scoped>
@keyframes indeterminate {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(calc(v-bind(scale) * 100%)); }
}

.animate-indeterminate {
  animation: indeterminate 1.25s linear infinite;
}

.bar {
 width: calc(1 / v-bind(scale) * 100%)
}
</style>
