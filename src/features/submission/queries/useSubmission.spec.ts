import type { Submission } from '../schemas/submission'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useSubmission } from './useSubmission'

vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(),
  useQueryClient: vi.fn(),
}))

vi.mock('@/api/client', () => ({
  apiClient: { GET: vi.fn() },
}))

vi.mock('../stores/useSubmissionFilters', () => ({
  useSubmissionFilters: () => ({ filters: ref({}) }),
}))

const mockSubmission: Submission = {
  id: 'sub-1',
  title: 'Test',
  status: 'pending',
  submitter: { id: 'u-1', name: 'User', email: 'u@example.com', tier: 'pro' },
  content: {
    type: 'article',
    url: 'https://example.com',
    thumbnailUrl: null,
    wordCount: 100,
    readingTime: 5,
  },
  tags: [],
  review: null,
  score: 50,
  flagCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

let capturedOptions: any
const mockQueryClient = {
  getQueryData: vi.fn(),
  getQueryState: vi.fn(),
}

describe('useSubmission — initialData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient as any)
    vi.mocked(useQuery).mockImplementation((options: any) => {
      capturedOptions = options
      return {} as any
    })
  })

  it('returns matching submission from list cache', () => {
    const other = { ...mockSubmission, id: 'other' }
    mockQueryClient.getQueryData.mockReturnValue({ data: [other, mockSubmission] })

    useSubmission(ref('sub-1'))

    expect(capturedOptions.initialData()).toEqual({ data: mockSubmission })
  })

  it('returns undefined when list cache is empty', () => {
    mockQueryClient.getQueryData.mockReturnValue(undefined)

    useSubmission(ref('sub-1'))

    expect(capturedOptions.initialData()).toBeUndefined()
  })

  it('returns undefined when no submission in list matches the id', () => {
    const other = { ...mockSubmission, id: 'other' }
    mockQueryClient.getQueryData.mockReturnValue({ data: [other] })

    useSubmission(ref('sub-1'))

    expect(capturedOptions.initialData()).toBeUndefined()
  })

  it('initialDataUpdatedAt returns list cache dataUpdatedAt', () => {
    mockQueryClient.getQueryState.mockReturnValue({ dataUpdatedAt: 12345 })

    useSubmission(ref('sub-1'))

    expect(capturedOptions.initialDataUpdatedAt()).toBe(12345)
  })

  it('initialDataUpdatedAt returns undefined when list cache has no state', () => {
    mockQueryClient.getQueryState.mockReturnValue(undefined)

    useSubmission(ref('sub-1'))

    expect(capturedOptions.initialDataUpdatedAt()).toBeUndefined()
  })

  it('query is disabled when id is undefined', () => {
    useSubmission(ref(undefined))

    expect(capturedOptions.enabled.value).toBe(false)
  })

  it('query is enabled when id is provided', () => {
    useSubmission(ref('sub-1'))

    expect(capturedOptions.enabled.value).toBe(true)
  })
})
