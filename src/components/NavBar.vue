<template>
  <nav class="h-14 border-b bg-background">
    <div class="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
      <div class="flex items-center gap-1">
        <Button as-child variant="ghost">
          <RouterLink to="/submissions">
            Submissions
          </RouterLink>
        </Button>
        <Button as-child variant="ghost">
          <RouterLink to="/dashboard">
            Dashboard
          </RouterLink>
        </Button>
      </div>

      <div class="flex items-center gap-3">
        <template v-if="authStore.isAuthenticated">
          <span class="text-sm text-muted-foreground">
            {{ authStore.user?.name }} ({{ authStore.role }})
          </span>
          <Button :disabled="isLoggingOut" @click="handleLogout">
            {{ isLoggingOut ? 'Logging out…' : 'Logout' }}
          </Button>
        </template>

        <Button v-else as-child variant="ghost">
          <RouterLink to="/login">
            Login
          </RouterLink>
        </Button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
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
