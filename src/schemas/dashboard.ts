import type { components } from '@/api/schema'
import { z } from 'zod'
import { createDataResponseSchema, CuidSchema } from './common'
import { SubmissionTypeSchema, SubmitterTierSchema } from './submission'

export type DashboardSummary = components['schemas']['DashboardSummary']
export type DashboardByType = components['schemas']['DashboardByType']
export type RecentActivity = components['schemas']['RecentActivity']
export type TopSubmitter = components['schemas']['TopSubmitter']
export type DashboardStats = components['schemas']['DashboardStats']

export const DashboardSummarySchema = z.object({
  totalSubmissions: z.number().int().min(0),
  pendingCount: z.number().int().min(0),
  approvedCount: z.number().int().min(0),
  rejectedCount: z.number().int().min(0),
  flaggedCount: z.number().int().min(0),
}) satisfies z.ZodType<DashboardSummary>

export const DashboardByTypeSchema = z.object({
  type: SubmissionTypeSchema,
  count: z.number().int().min(0),
  approvalRate: z.number().min(0).max(1),
}) satisfies z.ZodType<DashboardByType>

export const RecentActivitySchema = z.object({
  submissionId: CuidSchema,
  title: z.string(),
  action: z.enum(['submitted', 'approved', 'rejected', 'flagged']),
  actorName: z.string(),
  occurredAt: z.iso.datetime(),
}) satisfies z.ZodType<RecentActivity>

export const TopSubmitterSchema = z.object({
  submitterId: CuidSchema,
  name: z.string(),
  tier: SubmitterTierSchema,
  submissionCount: z.number().int().min(0),
  approvalRate: z.number().min(0).max(1),
}) satisfies z.ZodType<TopSubmitter>

export const DashboardStatsSchema = z.object({
  summary: DashboardSummarySchema,
  byType: z.array(DashboardByTypeSchema),
  recentActivity: z.array(RecentActivitySchema),
  topSubmitters: z.array(TopSubmitterSchema),
}) satisfies z.ZodType<DashboardStats>

export const DashboardStatsResponseSchema
  = createDataResponseSchema(DashboardStatsSchema)
