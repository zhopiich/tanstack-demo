<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <NavBar class="sticky top-0 z-50" />

    <main class="flex-1 flex flex-col *:flex-1">
      <slot />
    </main>

    <Toaster rich-colors position="top-center" />
  </div>
</template>
