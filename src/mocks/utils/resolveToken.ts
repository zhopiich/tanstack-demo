import type { components } from '@/api/schema'
import { db } from '../db'

type AuthUser = components['schemas']['AuthUser']

export function resolveToken(request: Request): AuthUser | null {
  const prefix = 'Bearer '
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith(prefix))
    return null

  const token = authHeader.slice(prefix.length)
  let userId: string
  try {
    userId = atob(token)
  }
  catch {
    return null
  }

  if (!db.tokens.has(token))
    return null

  const userRecord = db.authUsers.find(u => u.id === userId)
  if (!userRecord)
    return null

  const { password: _, ...user } = userRecord
  return user
}
