import type { Ref } from 'vue'
import { ref } from 'vue'
import { useSharedRowSelection } from '../../composables/useRowSelection'
import { BatchReviewFormSchema, useBatchDelete, useBatchReview } from '../../exports'

interface Options {
  onReviewSuccess?: () => void
  onDeleteSuccess?: () => void
}

export function useSubmissionBatchActions(
  verdict: Ref<string | null>,
  reason: Ref<string>,
  options: Options,
) {
  const { selectedIds, resetRowSelection } = useSharedRowSelection()

  const reasonError = ref('')

  function resetReasonError() {
    reasonError.value = ''
  }

  const { mutate: batchReview, isPending: isReviewing } = useBatchReview()
  const { mutate: batchDelete, isPending: isDeleting } = useBatchDelete()

  function handleBatchReview() {
    resetReasonError()
    const result = BatchReviewFormSchema.shape.reason.safeParse(reason.value)
    if (!result.success) {
      reasonError.value = result.error.issues[0]?.message ?? 'Invalid reason'
      return
    }
    batchReview(
      {
        ids: [...selectedIds.value],
        verdict: verdict.value === 'approve' ? 'approved' : 'rejected',
        reason: reason.value,
      },
      { onSuccess: () => {
        resetRowSelection()
        options.onReviewSuccess?.()
      } },
    )
  }

  // TODO: confirm with modal
  function handleBatchDelete() {
    batchDelete(
      { ids: [...selectedIds.value] },
      { onSuccess: () => {
        resetRowSelection()
        options.onDeleteSuccess?.()
      } },
    )
  }

  return {
    reasonError,
    isReviewing,
    isDeleting,
    resetReasonError,
    handleBatchReview,
    handleBatchDelete,
  }
}
