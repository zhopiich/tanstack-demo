<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <NavBar class="sticky top-0 z-50" />

    <main class="flex-1 relative">
      <div class="max-w-4xl mx-auto px-4 lg:px-0">
        <slot />
      </div>
    </main>

    <Toaster rich-colors position="top-center" />
  </div>
</template>
