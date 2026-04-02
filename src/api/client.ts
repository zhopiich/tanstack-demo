import type { Middleware } from 'openapi-fetch'
import type { paths } from './schema'
import createClient from 'openapi-fetch'

const TOKEN_KEY = 'auth_token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string): void => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = (): void => localStorage.removeItem(TOKEN_KEY)

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = getToken()
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },
  async onResponse({ response }) {
    if (response.status === 401) {
      clearToken()
    }
    return response
  },
}

export const apiClient = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api',
})

apiClient.use(authMiddleware)
