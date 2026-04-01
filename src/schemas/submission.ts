import { z } from 'zod'
import {
  createDataResponseSchema,
  createListResponseSchema,
  CuidSchema,
} from './common'

// Enums

export const SubmissionStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'flagged',
])

export const SubmissionTypeSchema = z.enum([
  'article',
  'image',
  'video',
  'link',
])

export const SubmitterTierSchema = z.enum(['free', 'pro', 'verified'])

export const VideoResolutionSchema = z.enum(['480p', '720p', '1080p', '4k'])

export const ReviewVerdictSchema = z.enum(['approved', 'rejected'])

// Submitter

export const SubmitterSchema = z.object({
  id: CuidSchema,
  name: z.string(),
  email: z.email(),
  tier: SubmitterTierSchema,
})

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
})

export const VideoContentSchema = z.object({
  type: z.literal('video'),
  ...BaseContentSchema,
  duration: z.number().int().min(1),
  resolution: VideoResolutionSchema,
})

export const ImageContentSchema = z.object({
  type: z.literal('image'),
  ...BaseContentSchema,
  width: z.number().int().min(1),
  height: z.number().int().min(1),
})

export const LinkContentSchema = z.object({
  type: z.literal('link'),
  ...BaseContentSchema,
  domain: z.string(),
  isBehindPaywall: z.boolean(),
})

export const ContentSchema = z.discriminatedUnion('type', [
  ArticleContentSchema,
  VideoContentSchema,
  ImageContentSchema,
  LinkContentSchema,
])

// Review

export const ReviewSchema = z.object({
  reviewerId: CuidSchema,
  verdict: ReviewVerdictSchema,
  reason: z.string().min(10, 'Review must be at least 10 characters'),
  reviewedAt: z.iso.datetime(),
})

// Submission

export const SubmissionSchema = z
  .object({
    id: CuidSchema,
    title: z.string().min(1).max(100),
    type: SubmissionTypeSchema,
    status: SubmissionStatusSchema,
    submitter: SubmitterSchema,
    content: ContentSchema,
    tags: z.array(z.string()).max(5),
    review: ReviewSchema.nullable(),
    score: z.number().int().min(0).max(100),
    flagCount: z.number().int().min(0),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .superRefine((data, ctx) => {
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
  type: SubmissionTypeSchema,
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
  content: ContentSchema,
})

export const SubmissionUpdateFormSchema = SubmissionCreateFormSchema.partial()

export const BatchReviewFormSchema = z.object({
  ids: z.array(CuidSchema).min(1, 'Please select at least one record'),
  verdict: ReviewVerdictSchema,
  reason: z.string().min(10, 'Review must be at least 10 characters'),
})

export const BatchDeleteFormSchema = z.object({
  ids: z.array(CuidSchema).min(1, 'Please select at least one record'),
})

//

export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>
export type SubmissionType = z.infer<typeof SubmissionTypeSchema>
export type SubmitterTier = z.infer<typeof SubmitterTierSchema>
export type VideoResolution = z.infer<typeof VideoResolutionSchema>
export type ReviewVerdict = z.infer<typeof ReviewVerdictSchema>
export type Submitter = z.infer<typeof SubmitterSchema>
export type ArticleContent = z.infer<typeof ArticleContentSchema>
export type VideoContent = z.infer<typeof VideoContentSchema>
export type ImageContent = z.infer<typeof ImageContentSchema>
export type LinkContent = z.infer<typeof LinkContentSchema>
export type Content = z.infer<typeof ContentSchema>
export type Review = z.infer<typeof ReviewSchema>
export type Submission = z.infer<typeof SubmissionSchema>
export type SubmissionCreateForm = z.infer<typeof SubmissionCreateFormSchema>
export type SubmissionUpdateForm = z.infer<typeof SubmissionUpdateFormSchema>
export type BatchReviewForm = z.infer<typeof BatchReviewFormSchema>
export type BatchDeleteForm = z.infer<typeof BatchDeleteFormSchema>
