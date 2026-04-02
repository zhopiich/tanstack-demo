import type { components } from '@/api/schema'
import { z } from 'zod'
import { createDataResponseSchema, CuidSchema } from './common'

export type AuthRole = components['schemas']['AuthUser']['role']
export type AuthUser = components['schemas']['AuthUser']
export type LoginBody = components['schemas']['LoginBody']
export type AuthResponse = components['schemas']['AuthResponse']

export const AuthRoleSchema = z.enum(['admin', 'reviewer']) satisfies z.ZodType<AuthRole>

export const AuthUserSchema = z.object({
  id: CuidSchema,
  name: z.string(),
  email: z.email(),
  role: AuthRoleSchema,
}) satisfies z.ZodType<AuthUser>

export const LoginBodySchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
}) satisfies z.ZodType<LoginBody>

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: AuthUserSchema,
}) satisfies z.ZodType<AuthResponse>

export const AuthMeResponseSchema = createDataResponseSchema(AuthUserSchema)
