<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  }
  catch (e: unknown) {
    const err = e as { message?: string }
    error.value = err.message ?? 'Login failed'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="max-w-sm space-y-4 px-2">
      <h1 class="text-2xl font-semibold">
        Login
      </h1>
      <form class="space-y-3" @submit.prevent="handleSubmit">
        <Input id="email" v-model="email" type="email" required autocomplete="email" placeholder="Email" />
        <Input id="password" v-model="password" type="password" required autocomplete="current-password" placeholder="Password" />
        <p v-if="error" class="text-sm text-destructive">
          {{ error }}
        </p>
        <div class="flex justify-end">
          <button type="submit" :disabled="loading">
            {{ loading ? 'Logging in…' : 'Login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
