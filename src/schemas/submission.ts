import type { components } from '@/api/schema'
import { z } from 'zod'

export type SubmissionType = components['schemas']['SubmissionType']
export type SubmitterTier = components['schemas']['SubmitterTier']

export const SubmissionTypeSchema = z.enum([
  'article',
  'image',
  'video',
  'link',
]) satisfies z.ZodType<SubmissionType>

export const SubmitterTierSchema
  = z.enum(['free', 'pro', 'verified']) satisfies z.ZodType<SubmitterTier>
