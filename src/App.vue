<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { Toaster } from '@/components/ui/sonner'
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
  <NavBar />
  <RouterView />
  <Toaster rich-colors position="top-center" />
</template>

<style scoped>
</style>
