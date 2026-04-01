import { z } from 'zod'
import { createDataResponseSchema, CuidSchema } from './common'

export const AuthRoleSchema = z.enum(['admin', 'reviewer'])

export const AuthUserSchema = z.object({
  id: CuidSchema,
  name: z.string(),
  email: z.email(),
  role: AuthRoleSchema,
})

export const LoginBodySchema = z.object({
  email: z.email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const AuthResponseSchema = z.object({
  token: z.string(),
  user: AuthUserSchema,
})

export const AuthMeResponseSchema = createDataResponseSchema(AuthUserSchema)

export type AuthRole = z.infer<typeof AuthRoleSchema>
export type AuthUser = z.infer<typeof AuthUserSchema>
export type LoginBody = z.infer<typeof LoginBodySchema>
