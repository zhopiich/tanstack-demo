import type { Middleware } from 'openapi-fetch'
import type { paths } from './schema'
import createClient from 'openapi-fetch'
import { clearAccessToken, getAccessToken, setAccessToken } from './auth-token'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

let refreshPromise: Promise<boolean> | null = null

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise)
    return refreshPromise

  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  }).then(async (res) => {
    if (!res.ok)
      return false
    const data = await res.json()
    setAccessToken(data.accessToken)
    return true
  }).finally(() => { refreshPromise = null })

  return refreshPromise
}

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const token = getAccessToken()
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },
  async onResponse({ request, response }) {
    if (response.status !== 401)
      return response
    if (request.url.includes('/auth/refresh'))
      return response

    const refreshed = await tryRefresh()
    if (refreshed) {
      const newReq = request.clone()
      newReq.headers.set('Authorization', `Bearer ${getAccessToken()}`)
      const retryRes = await fetch(newReq)
      if (retryRes.ok)
        return retryRes
    }

    // Only the first failed refresh should dispatch unauthorized.
    // accessToken !== null indicates it hasn't been handled yet.
    if (getAccessToken() !== null) {
      clearAccessToken()
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return response
  },
}

export const apiClient = createClient<paths>({
  baseUrl: BASE_URL,
})

apiClient.use(authMiddleware)
