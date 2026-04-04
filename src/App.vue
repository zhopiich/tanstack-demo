<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  window.addEventListener('auth:unauthorized', () => {
    authStore.reset()
    router.push('/login')
  })
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
