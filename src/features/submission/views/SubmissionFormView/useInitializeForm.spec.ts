import type { Submission, SubmissionCreateForm } from '../../schemas/submission'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useSubmission } from '../../queries/useSubmission'
import { useInitializeForm } from './useInitializeForm'

vi.mock('../../queries/useSubmission', () => ({ useSubmission: vi.fn() }))

function getDefaultForm(): SubmissionCreateForm {
  return {
    title: '',
    type: 'article',
    tags: [],
    content: { type: 'article', url: '', thumbnailUrl: null, wordCount: 0, readingTime: 0 },
  }
}

const mockSubmission: Submission = {
  id: 'sub-1',
  title: 'From Server',
  type: 'video',
  status: 'pending',
  submitter: { id: 'user-1', name: 'Test User', email: 'test@example.com', tier: 'pro' },
  content: {
    type: 'video',
    url: 'https://example.com/video',
    thumbnailUrl: null,
    duration: 120,
    resolution: '1080p',
  },
  tags: ['tag1', 'tag2'],
  review: null,
  score: 75,
  flagCount: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

let mockData: ReturnType<typeof ref<Submission | undefined>>

describe('useInitializeForm', () => {
  beforeEach(() => {
    mockData = ref<Submission | undefined>(undefined)
    vi.mocked(useSubmission).mockReturnValue({
      data: mockData,
    } as unknown as ReturnType<typeof useSubmission>)
  })

  it('syncForm assigns matching keys from submission data', () => {
    const form = getDefaultForm()
    const { syncForm } = useInitializeForm({ id: ref('sub-1'), form, defaultForm: getDefaultForm() })

    syncForm(mockSubmission)

    expect(form.title).toBe('From Server')
    expect(form.type).toBe('video')
    expect(form.tags).toEqual(['tag1', 'tag2'])
  })

  it('resetForm restores all fields to defaultForm values', () => {
    const form = getDefaultForm()
    const { resetForm } = useInitializeForm({ id: ref(undefined), form, defaultForm: getDefaultForm() })

    form.title = 'Dirty'
    form.tags = ['x']
    resetForm()

    expect(form.title).toBe('')
    expect(form.tags).toEqual([])
  })

  it('syncs form immediately when data is already available on creation', () => {
    mockData.value = mockSubmission
    const form = getDefaultForm()
    useInitializeForm({ id: ref('sub-1'), form, defaultForm: getDefaultForm() })

    expect(form.title).toBe('From Server')
    expect(form.type).toBe('video')
  })

  it('re-syncs form when data changes', async () => {
    const form = getDefaultForm()
    useInitializeForm({ id: ref('sub-1'), form, defaultForm: getDefaultForm() })

    mockData.value = mockSubmission
    await nextTick()

    expect(form.title).toBe('From Server')
  })
})
