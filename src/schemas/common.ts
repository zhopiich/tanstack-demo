import type { components } from '@/api/schema'
import { z } from 'zod'

export type Pagination = components['schemas']['Pagination']
export type ErrorResponse = components['schemas']['ErrorResponse']

export const CuidSchema = z.string().regex(
  /^c[a-z0-9]{24}$/,
  'Invalid cuid format',
)

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
}) satisfies z.ZodType<Pagination>

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
}) satisfies z.ZodType<ErrorResponse>

/**
 * Wraps a single data object for API responses
 */
export function createDataResponseSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.object({ data: schema })
}

/**
 * Wraps a list of items with pagination metadata for API responses
 */
export function createListResponseSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    data: z.array(schema),
    pagination: PaginationSchema,
  })
}
