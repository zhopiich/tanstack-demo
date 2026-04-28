import type { DashboardStats } from '../schemas/dashboard'
import { useVueTable } from '@tanstack/vue-table'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useDashboardTables } from './useDashboardTables'

vi.mock('@tanstack/vue-table', () => ({
  createColumnHelper: () => ({ accessor: vi.fn() }),
  getCoreRowModel: vi.fn(),
  useVueTable: vi.fn(),
}))

vi.mock('vue-router', () => ({ RouterLink: {} }))

const mockStats: DashboardStats = {
  summary: {
    totalSubmissions: 10,
    pendingCount: 2,
    approvedCount: 5,
    rejectedCount: 2,
    flaggedCount: 1,
  },
  byType: [{ type: 'article', count: 5, approvalRate: 0.8 }],
  recentActivity: [{
    submissionId: 'cuid1',
    title: 'Test',
    action: 'approved',
    actorName: 'Admin',
    occurredAt: '2024-01-01T00:00:00.000Z',
  }],
  topSubmitters: [{
    submitterId: 'cuid2',
    name: 'Alice',
    tier: 'pro',
    submissionCount: 3,
    approvalRate: 0.9,
  }],
}

describe('useDashboardTables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useVueTable).mockReturnValue({} as any)
  })

  describe('hasData', () => {
    it('is false when stats is undefined', () => {
      const { hasData } = useDashboardTables(ref(undefined))
      expect(hasData.value).toBe(false)
    })

    it('is true when stats is defined', () => {
      const { hasData } = useDashboardTables(ref(mockStats))
      expect(hasData.value).toBe(true)
    })

    it('updates reactively when stats changes', () => {
      const stats = ref<DashboardStats | undefined>(undefined)
      const { hasData } = useDashboardTables(stats)
      expect(hasData.value).toBe(false)
      stats.value = mockStats
      expect(hasData.value).toBe(true)
    })
  })

  describe('byType table data', () => {
    it('returns [] when stats is undefined', () => {
      useDashboardTables(ref(undefined))
      const options = vi.mocked(useVueTable).mock.calls[0]![0]
      expect(options.data).toEqual([])
    })

    it('returns stats.byType when stats is defined', () => {
      useDashboardTables(ref(mockStats))
      const options = vi.mocked(useVueTable).mock.calls[0]![0]
      expect(options.data).toEqual(mockStats.byType)
    })
  })

  describe('recentActivity table data', () => {
    it('returns [] when stats is undefined', () => {
      useDashboardTables(ref(undefined))
      const options = vi.mocked(useVueTable).mock.calls[1]![0]
      expect(options.data).toEqual([])
    })

    it('returns stats.recentActivity when stats is defined', () => {
      useDashboardTables(ref(mockStats))
      const options = vi.mocked(useVueTable).mock.calls[1]![0]
      expect(options.data).toEqual(mockStats.recentActivity)
    })
  })

  describe('topSubmitters table data', () => {
    it('returns [] when stats is undefined', () => {
      useDashboardTables(ref(undefined))
      const options = vi.mocked(useVueTable).mock.calls[2]![0]
      expect(options.data).toEqual([])
    })

    it('returns stats.topSubmitters when stats is defined', () => {
      useDashboardTables(ref(mockStats))
      const options = vi.mocked(useVueTable).mock.calls[2]![0]
      expect(options.data).toEqual(mockStats.topSubmitters)
    })
  })
})
