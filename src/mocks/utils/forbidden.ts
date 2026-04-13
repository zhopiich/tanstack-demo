import type { components } from '@/api/schema'
import { HttpResponse } from 'msw'

type ErrorResponse = components['schemas']['ErrorResponse']

export function forbidden() {
  const error: ErrorResponse = { error: { code: 'FORBIDDEN', message: 'Insufficient permissions.' } }
  return HttpResponse.json(error, { status: 403 })
}
