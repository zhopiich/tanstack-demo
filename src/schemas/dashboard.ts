import { z } from 'zod'
import { createDataResponseSchema, CuidSchema } from './common'
import { SubmissionTypeSchema, SubmitterTierSchema } from './submission'

export const DashboardSummarySchema = z.object({
  totalSubmissions: z.number().int().min(0),
  pendingCount: z.number().int().min(0),
  approvedCount: z.number().int().min(0),
  rejectedCount: z.number().int().min(0),
  flaggedCount: z.number().int().min(0),
})

export const DashboardByTypeSchema = z.object({
  type: SubmissionTypeSchema,
  count: z.number().int().min(0),
  approvalRate: z.number().min(0).max(1),
})

export const RecentActivitySchema = z.object({
  submissionId: CuidSchema,
  title: z.string(),
  action: z.enum(['submitted', 'approved', 'rejected', 'flagged']),
  actorName: z.string(),
  occurredAt: z.iso.datetime(),
})

export const TopSubmitterSchema = z.object({
  submitterId: CuidSchema,
  name: z.string(),
  tier: SubmitterTierSchema,
  submissionCount: z.number().int().min(0),
  approvalRate: z.number().min(0).max(1),
})

export const DashboardStatsSchema = z.object({
  summary: DashboardSummarySchema,
  byType: z.array(DashboardByTypeSchema),
  recentActivity: z.array(RecentActivitySchema),
  topSubmitters: z.array(TopSubmitterSchema),
})

export const DashboardStatsResponseSchema
  = createDataResponseSchema(DashboardStatsSchema)

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>
export type DashboardByType = z.infer<typeof DashboardByTypeSchema>
export type RecentActivity = z.infer<typeof RecentActivitySchema>
export type TopSubmitter = z.infer<typeof TopSubmitterSchema>
export type DashboardStats = z.infer<typeof DashboardStatsSchema>
