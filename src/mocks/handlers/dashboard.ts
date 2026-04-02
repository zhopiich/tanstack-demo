import type { components } from '@/api/schema'
import { http, HttpResponse } from 'msw'
import { db } from '../db'

export const dashboardHandlers = [
  http.get('/api/dashboard/stats', () => {
    const all = db.submissions

    const summary: components['schemas']['DashboardSummary'] = {
      totalSubmissions: all.length,
      pendingCount: all.filter(s => s.status === 'pending').length,
      approvedCount: all.filter(s => s.status === 'approved').length,
      rejectedCount: all.filter(s => s.status === 'rejected').length,
      flaggedCount: all.filter(s => s.status === 'flagged').length,
    }

    const types = ['article', 'video', 'image', 'link'] as const
    const byType: components['schemas']['DashboardByType'][] = types.map((type) => {
      const items = all.filter(s => s.type === type)
      const approved = items.filter(s => s.status === 'approved').length
      return {
        type,
        count: items.length,
        approvalRate: items.length > 0 ? Number((approved / items.length).toFixed(2)) : 0,
      }
    })

    const recentActivity: components['schemas']['RecentActivity'][] = [...all]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
      .map(s => ({
        submissionId: s.id,
        title: s.title,
        action: s.status === 'pending' ? 'submitted' : s.status,
        actorName: s.submitter.name,
        occurredAt: s.updatedAt,
      }))

    const submitterMap
      = new Map<string, {
        name: string
        tier: components['schemas']['SubmitterTier']
        count: number
        approved: number
      }>()
    for (const s of all) {
      const { id, name, tier } = s.submitter
      const entry = submitterMap.get(id) ?? { name, tier, count: 0, approved: 0 }
      entry.count++
      if (s.status === 'approved')
        entry.approved++
      submitterMap.set(id, entry)
    }

    const topSubmitters: components['schemas']['TopSubmitter'][]
      = Array.from(submitterMap.entries(), ([submitterId, data]) => ({
        submitterId,
        name: data.name,
        tier: data.tier,
        submissionCount: data.count,
        approvalRate: data.count > 0 ? Number((data.approved / data.count).toFixed(2)) : 0,
      }))
        .sort((a, b) => b.submissionCount - a.submissionCount)
        .slice(0, 5)

    const stats: components['schemas']['DashboardStats']
      = { summary, byType, recentActivity, topSubmitters }
    return HttpResponse.json({ data: stats })
  }),
]
