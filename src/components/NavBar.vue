<template>
  <nav>
    <RouterLink to="/submissions">
      Submissions
    </RouterLink>

    <div class="user">
      <template v-if="authStore.isAuthenticated">
        <span>{{ authStore.user?.name }} ({{ authStore.role }})</span>
        <button :disabled="isLoggingOut" @click="handleLogout">
          {{ isLoggingOut ? 'Logging out…' : 'Logout' }}
        </button>
      </template>

      <RouterLink v-else to="/login">
        Login
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const isLoggingOut = ref(false)

async function handleLogout() {
  isLoggingOut.value = true
  try {
    await authStore.logout()
    router.push({ name: 'login' })
  }
  finally {
    isLoggingOut.value = false
  }
}
</script>

<style>
nav {
  display: flex;
  justify-content: space-between;
}

.user button{
  margin-left: 0.5rem;
}
</style>
