import type { components } from '@/api/schema'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiClient, clearToken, setToken } from '@/api/client'
import { queryClient } from '@/queryClient'

type AuthUser = components['schemas']['AuthUser']

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const role = computed(() => user.value?.role ?? null)

  async function login(email: string, password: string): Promise<void> {
    const { data, error } = await apiClient.POST(
      '/auth/login',
      { body: { email, password } },
    )
    if (error)
      throw error
    setToken(data.token)
    user.value = data.user
  }

  async function logout(): Promise<void> {
    await apiClient.POST('/auth/logout')
    clearToken()
    user.value = null
    queryClient.clear()
  }

  async function fetchMe(): Promise<void> {
    const { data, error } = await apiClient.GET('/auth/me')
    if (error) {
      clearToken()
      user.value = null
      return
    }
    user.value = data.data
  }

  function reset(): void {
    user.value = null
    queryClient.clear()
  }

  return { user, isAuthenticated, role, login, logout, fetchMe, reset }
})
