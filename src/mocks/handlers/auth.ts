import type { components } from '@/api/schema'
import { http, HttpResponse } from 'msw'
import { db } from '../db'
import { resolveToken } from '../utils/resolveToken'

type LoginBody = components['schemas']['LoginBody']
type AuthResponse = components['schemas']['AuthResponse']
type ErrorResponse = components['schemas']['ErrorResponse']
type EmptyParams = Record<string, never>

function createToken(userId: string): string {
  return btoa(userId)
}

export const authHandlers = [
  http.post<EmptyParams, LoginBody>(
    '/api/auth/login',
    async ({ request }) => {
      const body = await request.json()
      const userRecord = db.authUsers.find(u => u.email === body.email)

      if (!userRecord || userRecord.password !== body.password) {
        const error: ErrorResponse = {
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        }
        return HttpResponse.json(error, { status: 401 })
      }

      const { password: _, ...user } = userRecord
      const token = createToken(user.id)
      db.tokens.add(token)
      const response: AuthResponse = { token, user }
      return HttpResponse.json(response)
    },
  ),

  http.post('/api/auth/logout', ({ request }) => {
    const prefix = 'Bearer '
    const authHeader = request.headers.get('Authorization')
    if (authHeader?.startsWith(prefix)) {
      db.tokens.delete(authHeader.slice(prefix.length))
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/auth/me', ({ request }) => {
    const user = resolveToken(request)
    if (!user) {
      const error: ErrorResponse = {
        error: { code: 'UNAUTHORIZED', message: 'Invalid or missing token.' },
      }
      return HttpResponse.json(error, { status: 401 })
    }
    return HttpResponse.json({ data: user })
  }),
]
