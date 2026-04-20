<template>
  <span
    @mouseenter="onEnter(id)"
    @mouseleave="onLeave"
    @vue:unmounted="onLeave"
  >
    <RouterLink :to="`/submissions/${id}`" class="text-sm px-2 py-1 hover:underline">
      View
    </RouterLink>

    <template v-if="authStore.role === 'admin'">
      <RouterLink :to="`/submissions/${id}/edit`" class="text-sm px-2 py-1 hover:underline">
        Edit
      </RouterLink>
    </template>
  </span>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHoverPrefetch } from './useHoverPrefetch'

defineProps<{
  id: string | number
}>()

const authStore = useAuthStore()

const { onEnter, onLeave } = useHoverPrefetch()
</script>
