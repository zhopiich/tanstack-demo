<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
  <div>
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          autocomplete="email"
        >
      </div>
      <div>
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
        >
      </div>
      <p v-if="error">
        {{ error }}
      </p>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in…' : 'Login' }}
      </button>
    </form>
  </div>
</template>
