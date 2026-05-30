import type { components } from '@/api/schema'
import { z } from 'zod'
import { createDataResponseSchema, createListResponseSchema, CuidSchema } from '@/schemas/common'
import { SubmitterTierSchema } from '@/schemas/submission'

export type SubmissionStatus = components['schemas']['SubmissionStatus']
export type VideoResolution = components['schemas']['VideoResolution']
export type ReviewVerdict = components['schemas']['ReviewVerdict']
export type Submitter = components['schemas']['Submitter']
export type ArticleContent = components['schemas']['ArticleContent']
export type VideoContent = components['schemas']['VideoContent']
export type ImageContent = components['schemas']['ImageContent']
export type LinkContent = components['schemas']['LinkContent']
export type Content = components['schemas']['Content']
export type Review = components['schemas']['Review']
export type Submission = components['schemas']['Submission']
export type SubmissionCreateForm = components['schemas']['SubmissionCreateBody']
export type SubmissionUpdateForm = components['schemas']['SubmissionUpdateBody']
export type BatchReviewForm = components['schemas']['BatchReviewBody']
export type BatchDeleteForm = components['schemas']['BatchDeleteBody']
export type SubmissionStatusUpdateBody = components['schemas']['SubmissionStatusUpdateBody']

// Enums

export const SubmissionStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'flagged',
]) satisfies z.ZodType<SubmissionStatus>

export const VideoResolutionSchema
  = z.enum(['480p', '720p', '1080p', '4k']) satisfies z.ZodType<VideoResolution>

export const ReviewVerdictSchema
  = z.enum(['approved', 'rejected']) satisfies z.ZodType<ReviewVerdict>

// Submitter

export const SubmitterSchema = z.object({
  id: CuidSchema,
  name: z.string(),
  email: z.email(),
  tier: SubmitterTierSchema,
}) satisfies z.ZodType<Submitter>

// Content (Discriminated Union)

const BaseContentSchema = {
  url: z.url(),
  thumbnailUrl: z.url().nullable(),
}

export const ArticleContentSchema = z.object({
  type: z.literal('article'),
  ...BaseContentSchema,
  wordCount: z.number().int().min(1),
  readingTime: z.number().int().min(1),
}) satisfies z.ZodType<ArticleContent>

export const VideoContentSchema = z.object({
  type: z.literal('video'),
  ...BaseContentSchema,
  duration: z.number().int().min(1),
  resolution: VideoResolutionSchema,
}) satisfies z.ZodType<VideoContent>

export const ImageContentSchema = z.object({
  type: z.literal('image'),
  ...BaseContentSchema,
  width: z.number().int().min(1),
  height: z.number().int().min(1),
}) satisfies z.ZodType<ImageContent>

export const LinkContentSchema = z.object({
  type: z.literal('link'),
  ...BaseContentSchema,
  domain: z.string(),
  isBehindPaywall: z.boolean(),
}) satisfies z.ZodType<LinkContent>

export const ContentSchema = z.discriminatedUnion('type', [
  ArticleContentSchema,
  VideoContentSchema,
  ImageContentSchema,
  LinkContentSchema,
]) satisfies z.ZodType<Content>

// Review

export const ReviewSchema = z.object({
  reviewer: z.object({
    name: z.string(),
    email: z.email(),
  }),
  verdict: ReviewVerdictSchema,
  reason: z.string().min(10, 'Review must be at least 10 characters'),
  reviewedAt: z.iso.datetime(),
}) satisfies z.ZodType<Review>

// Submission

const SubmissionSchemaBase = z
  .object({
    id: CuidSchema,
    title: z.string().min(1).max(100),
    status: SubmissionStatusSchema,
    submitter: SubmitterSchema,
    content: ContentSchema,
    tags: z.array(z.string()).max(5),
    review: ReviewSchema.nullable(),
    score: z.number().int().min(0).max(100),
    flagCount: z.number().int().min(0),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }) satisfies z.ZodType<Submission>

export const SubmissionSchema
  = SubmissionSchemaBase.superRefine((data, ctx) => {
    const needsReview = ['approved', 'rejected'].includes(data.status)
    const hasReview = data.review !== null

    if (needsReview && !hasReview) {
      ctx.addIssue({
        code: 'custom',
        message: 'review is required when status is approved or rejected',
        path: ['review'],
      })
    }

    if (!needsReview && hasReview) {
      ctx.addIssue({
        code: 'custom',
        message: 'review must be null when status is pending or flagged',
        path: ['review'],
      })
    }
  })

// API Response

export const SubmissionListResponseSchema
  = createListResponseSchema(SubmissionSchema)

export const SubmissionDetailResponseSchema
  = createDataResponseSchema(SubmissionSchema)

// Form

export const SubmissionCreateFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
  content: ContentSchema,
  submitterEmail: z.email('Invalid email'),
}) satisfies z.ZodType<SubmissionCreateForm>

export const SubmissionUpdateFormSchema
  = SubmissionCreateFormSchema.omit({ submitterEmail: true }).partial() satisfies z.ZodType<SubmissionUpdateForm>

export const BatchReviewFormSchema = z.object({
  ids: z.array(CuidSchema).min(1, 'Please select at least one record'),
  verdict: ReviewVerdictSchema,
  reason: z.string().min(10, 'Review must be at least 10 characters'),
}) satisfies z.ZodType<BatchReviewForm>

export const BatchDeleteFormSchema = z.object({
  ids: z.array(CuidSchema).min(1, 'Please select at least one record'),
}) satisfies z.ZodType<BatchDeleteForm>

export const SubmissionStatusUpdateBodySchema = z.object({
  status: z.enum(['pending', 'flagged']),
}) satisfies z.ZodType<SubmissionStatusUpdateBody>
