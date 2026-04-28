import type { AuthUser } from '@/schemas/auth'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient, clearToken, setToken } from '@/api/client'
import { queryClient } from '@/queryClient'
import { useAuthStore } from './auth'

vi.mock('@/api/client', () => ({
  apiClient: { GET: vi.fn(), POST: vi.fn() },
  clearToken: vi.fn(),
  setToken: vi.fn(),
}))

vi.mock('@/queryClient', () => ({
  queryClient: { clear: vi.fn() },
}))

const mockUser: AuthUser = {
  id: 'u-1',
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('isAuthenticated', () => {
    it('is false initially', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
    })

    it('is true when user is set', () => {
      const store = useAuthStore()
      store.user = mockUser
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('role', () => {
    it('is null initially', () => {
      const store = useAuthStore()
      expect(store.role).toBeNull()
    })

    it('returns the user role when user is set', () => {
      const store = useAuthStore()
      store.user = mockUser
      expect(store.role).toBe('admin')
    })
  })

  describe('fetchMe', () => {
    it('sets user on success', async () => {
      vi.mocked(apiClient.GET).mockResolvedValue({ data: { data: mockUser }, error: undefined } as any)
      const store = useAuthStore()
      await store.fetchMe()
      expect(store.user).toEqual(mockUser)
    })

    it('clears token and sets user to null on error', async () => {
      vi.mocked(apiClient.GET).mockResolvedValue({ data: undefined, error: new Error('401') } as any)
      const store = useAuthStore()
      store.user = mockUser
      await store.fetchMe()
      expect(store.user).toBeNull()
      expect(clearToken).toHaveBeenCalled()
    })
  })

  describe('login', () => {
    it('sets token and user on success', async () => {
      vi.mocked(apiClient.POST).mockResolvedValue({ data: { token: 'tok', user: mockUser }, error: undefined } as any)
      const store = useAuthStore()
      await store.login('alice@example.com', 'password')
      expect(setToken).toHaveBeenCalledWith('tok')
      expect(store.user).toEqual(mockUser)
    })

    it('throws on error', async () => {
      const err = new Error('invalid credentials')
      vi.mocked(apiClient.POST).mockResolvedValue({ data: undefined, error: err } as any)
      const store = useAuthStore()
      await expect(store.login('alice@example.com', 'wrong')).rejects.toThrow('invalid credentials')
    })
  })

  describe('logout', () => {
    it('clears user, token, and query cache', async () => {
      vi.mocked(apiClient.POST).mockResolvedValue({} as any)
      const store = useAuthStore()
      store.user = mockUser
      await store.logout()
      expect(store.user).toBeNull()
      expect(clearToken).toHaveBeenCalled()
      expect(queryClient.clear).toHaveBeenCalled()
    })
  })

  describe('reset', () => {
    it('clears user and query cache', () => {
      const store = useAuthStore()
      store.user = mockUser
      store.reset()
      expect(store.user).toBeNull()
      expect(queryClient.clear).toHaveBeenCalled()
    })
  })
})
