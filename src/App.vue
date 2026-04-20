<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import MainLayout from '@/components/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import 'vue-sonner/style.css'

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
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>
