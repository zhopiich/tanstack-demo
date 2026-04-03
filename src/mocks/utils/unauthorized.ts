import type { components } from '@/api/schema'
import { HttpResponse } from 'msw'

type ErrorResponse = components['schemas']['ErrorResponse']

export function unauthorized() {
  const error: ErrorResponse = { error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } }
  return HttpResponse.json(error, { status: 401 })
}
