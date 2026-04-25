import type { Submission } from '../schemas/submission'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { dashboardKeys } from '@/queryKeys/dashboard'
import { submissionKeys } from '../queries/keys'
import { useUpdateSubmissionStatus } from './useUpdateSubmissionStatus'

vi.mock('@tanstack/vue-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}))

vi.mock('@/api/client', () => ({
  apiClient: { PATCH: vi.fn() },
}))

const mockSubmission: Submission = {
  id: 'sub-1',
  title: 'Test',
  type: 'article',
  status: 'pending',
  submitter: { id: 'u-1', name: 'User', email: 'u@example.com', tier: 'pro' },
  content: { type: 'article', url: 'https://example.com', thumbnailUrl: null, wordCount: 100, readingTime: 5 },
  tags: [],
  review: null,
  score: 50,
  flagCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

let capturedOptions: any
const mockQueryClient = {
  cancelQueries: vi.fn().mockResolvedValue(undefined),
  getQueryData: vi.fn(),
  getQueriesData: vi.fn(),
  setQueryData: vi.fn(),
  setQueriesData: vi.fn(),
  invalidateQueries: vi.fn().mockResolvedValue(undefined),
}

beforeEach(() => {
  vi.clearAllMocks()
  mockQueryClient.cancelQueries.mockResolvedValue(undefined)
  mockQueryClient.invalidateQueries.mockResolvedValue(undefined)

  vi.mocked(useQueryClient).mockReturnValue(mockQueryClient as any)
  vi.mocked(useMutation).mockImplementation((options: any) => {
    capturedOptions = options
    return { mutate: vi.fn(), isPending: ref(false) } as any
  })

  useUpdateSubmissionStatus()
})

describe('useUpdateSubmissionStatus', () => {
  describe('onMutate', () => {
    it('cancels detail and list queries before optimistic update', async () => {
      await capturedOptions.onMutate({ id: 'sub-1', status: 'approved' })

      expect(mockQueryClient.cancelQueries).toHaveBeenCalledWith({
        queryKey: submissionKeys.detail('sub-1'),
      })
      expect(mockQueryClient.cancelQueries).toHaveBeenCalledWith({
        queryKey: submissionKeys.lists(),
      })
    })

    it('returns snapshots of previous detail and list data', async () => {
      const previousDetail = { data: { ...mockSubmission } }
      const previousLists = [[submissionKeys.lists(), { data: [mockSubmission] }]]
      mockQueryClient.getQueryData.mockReturnValue(previousDetail)
      mockQueryClient.getQueriesData.mockReturnValue(previousLists)

      const context = await capturedOptions.onMutate({ id: 'sub-1', status: 'approved' })

      expect(context.previousDetail).toBe(previousDetail)
      expect(context.previousLists).toBe(previousLists)
    })

    it('applies new status to detail cache via updater', async () => {
      const oldDetail = { data: { ...mockSubmission, status: 'pending' } }
      mockQueryClient.getQueryData.mockReturnValue(oldDetail)

      await capturedOptions.onMutate({ id: 'sub-1', status: 'approved' })

      expect(mockQueryClient.setQueryData).toHaveBeenCalled()
      const [key, updater] = mockQueryClient.setQueryData.mock.calls[0]!
      expect(key).toEqual(submissionKeys.detail('sub-1'))
      expect(updater(oldDetail)).toEqual({ data: { ...mockSubmission, status: 'approved' } })
    })

    it('applies new status to matching submission in list cache via updater', async () => {
      mockQueryClient.getQueriesData.mockReturnValue([])

      await capturedOptions.onMutate({ id: 'sub-1', status: 'flagged' })

      expect(mockQueryClient.setQueriesData).toHaveBeenCalled()
      const [filter, updater] = mockQueryClient.setQueriesData.mock.calls[0]!
      expect(filter).toEqual({ queryKey: submissionKeys.lists() })

      const other = { ...mockSubmission, id: 'other-id' }
      const oldList = { data: [{ ...mockSubmission }, other] }
      const result = updater(oldList)
      expect(result.data[0].status).toBe('flagged')
      expect(result.data[1].status).toBe('pending')
    })
  })

  describe('onError', () => {
    it('restores detail cache from context snapshot', () => {
      const previousDetail = { data: { ...mockSubmission } }
      const context = { previousDetail, previousLists: [] }

      capturedOptions.onError(new Error('server error'), { id: 'sub-1', status: 'approved' }, context)

      expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(
        submissionKeys.detail('sub-1'),
        previousDetail,
      )
    })

    it('restores each list entry from context snapshot', () => {
      const listKey = submissionKeys.lists()
      const listData = { data: [mockSubmission] }
      const context = { previousDetail: undefined, previousLists: [[listKey, listData]] }

      capturedOptions.onError(new Error('server error'), { id: 'sub-1', status: 'approved' }, context)

      expect(mockQueryClient.setQueryData).toHaveBeenCalledWith(listKey, listData)
    })
  })

  describe('onSettled', () => {
    it('invalidates detail, list, and dashboard queries', async () => {
      await capturedOptions.onSettled(undefined, null, { id: 'sub-1', status: 'approved' })

      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: submissionKeys.detail('sub-1'),
      })
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: submissionKeys.lists(),
      })
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: dashboardKeys.all,
      })
    })
  })
})
