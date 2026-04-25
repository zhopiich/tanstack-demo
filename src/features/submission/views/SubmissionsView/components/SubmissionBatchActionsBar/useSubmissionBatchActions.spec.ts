import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import { useSharedRowSelection } from '../../composables/useRowSelection'
import { useBatchDelete, useBatchReview } from '../../exports'
import { useSubmissionBatchActions } from './useSubmissionBatchActions'

vi.mock('../../exports', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../exports')>()
  return { ...actual, useBatchReview: vi.fn(), useBatchDelete: vi.fn() }
})

vi.mock('../../composables/useRowSelection', () => ({
  useSharedRowSelection: vi.fn(),
}))

let mockBatchReview: ReturnType<typeof vi.fn>
let mockBatchDelete: ReturnType<typeof vi.fn>
let mockReset: ReturnType<typeof vi.fn>

beforeEach(() => {
  mockReset = vi.fn()
  vi.mocked(useSharedRowSelection).mockReturnValue({
    selectedIds: computed(() => ['id-1', 'id-2']),
    resetRowSelection: mockReset,
  } as unknown as ReturnType<typeof useSharedRowSelection>)

  // Simulate TanStack Query mutate triggering onSuccess synchronously.
  mockBatchReview = vi.fn().mockImplementation((_, { onSuccess } = {}) => onSuccess?.())
  mockBatchDelete = vi.fn().mockImplementation((_, { onSuccess } = {}) => onSuccess?.())

  vi.mocked(useBatchReview).mockReturnValue({
    mutate: mockBatchReview,
    isPending: ref(false),
  } as unknown as ReturnType<typeof useBatchReview>)
  vi.mocked(useBatchDelete).mockReturnValue({
    mutate: mockBatchDelete,
    isPending: ref(false),
  } as unknown as ReturnType<typeof useBatchDelete>)
})

describe('useSubmissionBatchActions', () => {
  describe('handleBatchReview', () => {
    it('calls batchReview with ids, verdict, and reason when reason is valid', () => {
      const verdict = ref<string | null>('approve')
      const reason = ref('This is a valid reason')
      const { handleBatchReview, reasonError } = useSubmissionBatchActions(verdict, reason, {})

      handleBatchReview()

      expect(mockBatchReview).toHaveBeenCalledWith(
        { ids: ['id-1', 'id-2'], verdict: 'approved', reason: 'This is a valid reason' },
        { onSuccess: expect.any(Function) },
      )
      expect(reasonError.value).toBe('')
    })

    it('maps approve verdict to approved and other to rejected', () => {
      const verdict = ref<string | null>('reject')
      const reason = ref('This is a valid reason')
      const { handleBatchReview } = useSubmissionBatchActions(verdict, reason, {})

      handleBatchReview()

      expect(mockBatchReview).toHaveBeenCalledWith(
        expect.objectContaining({ verdict: 'rejected' }),
        { onSuccess: expect.any(Function) },
      )
    })

    it('sets reasonError and skips mutation when reason is invalid', () => {
      const verdict = ref<string | null>('approve')
      const reason = ref('short')
      const { handleBatchReview, reasonError } = useSubmissionBatchActions(verdict, reason, {})

      handleBatchReview()

      expect(reasonError.value).not.toBe('')
      expect(mockBatchReview).not.toHaveBeenCalled()
    })

    it('clears stale reasonError before each call', () => {
      const verdict = ref<string | null>('approve')
      const reason = ref('short')
      const { handleBatchReview, reasonError } = useSubmissionBatchActions(verdict, reason, {})

      handleBatchReview()
      expect(reasonError.value).not.toBe('')

      reason.value = 'This is a valid reason now'
      handleBatchReview()
      expect(reasonError.value).toBe('')
    })

    it('calls resetRowSelection and onReviewSuccess on success', () => {
      const onReviewSuccess = vi.fn()
      const verdict = ref<string | null>('approve')
      const reason = ref('This is a valid reason')
      const { handleBatchReview } = useSubmissionBatchActions(verdict, reason, { onReviewSuccess })

      handleBatchReview()

      expect(mockReset).toHaveBeenCalledOnce()
      expect(onReviewSuccess).toHaveBeenCalledOnce()
    })
  })

  describe('handleBatchDelete', () => {
    it('calls batchDelete with current selectedIds', () => {
      const { handleBatchDelete } = useSubmissionBatchActions(ref(null), ref(''), {})

      handleBatchDelete()

      expect(mockBatchDelete).toHaveBeenCalledWith(
        { ids: ['id-1', 'id-2'] },
        { onSuccess: expect.any(Function) },
      )
    })

    it('calls resetRowSelection and onDeleteSuccess on success', () => {
      const onDeleteSuccess = vi.fn()
      const { handleBatchDelete } = useSubmissionBatchActions(ref(null), ref(''), { onDeleteSuccess })

      handleBatchDelete()

      expect(mockReset).toHaveBeenCalledOnce()
      expect(onDeleteSuccess).toHaveBeenCalledOnce()
    })
  })

  describe('resetReasonError', () => {
    it('clears reasonError', () => {
      const verdict = ref<string | null>('approve')
      const reason = ref('short')
      const { handleBatchReview, resetReasonError, reasonError }
        = useSubmissionBatchActions(verdict, reason, {})

      handleBatchReview()
      expect(reasonError.value).not.toBe('')

      resetReasonError()
      expect(reasonError.value).toBe('')
    })
  })
})
