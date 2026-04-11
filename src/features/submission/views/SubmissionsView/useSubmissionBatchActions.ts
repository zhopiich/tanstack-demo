import { ref } from 'vue'
import { useBatchDelete, useBatchReview } from '../../queries/useSubmissionMutations'
import { BatchReviewFormSchema } from '../../schemas/submission'
import { useSubmissionRowSelection } from './useSubmissionRowSelection'

export function useSubmissionBatchActions() {
  const batchReviewVerdict = ref<'approve' | 'reject' | null>(null)
  const reason = ref('')
  const reasonError = ref('')

  function cancelBatchReview() {
    batchReviewVerdict.value = null
    reason.value = ''
    reasonError.value = ''
  }

  const { rowSelection, selectedIds, resetOnSuccess } = useSubmissionRowSelection(cancelBatchReview)

  const { mutate: batchReview, isPending: isBatchReviewing } = useBatchReview()
  const { mutate: batchDelete, isPending: isBatchDeleting } = useBatchDelete()

  function handleBatchReview() {
    reasonError.value = ''
    const result = BatchReviewFormSchema.shape.reason.safeParse(reason.value)
    if (!result.success) {
      reasonError.value = result.error.issues[0]?.message ?? 'Invalid reason'
      return
    }
    batchReview(
      {
        ids: selectedIds.value,
        verdict: batchReviewVerdict.value === 'approve' ? 'approved' : 'rejected',
        reason: reason.value,
      },
      { onSuccess: () => resetOnSuccess(() => {
        rowSelection.value = {}
        batchReviewVerdict.value = null
        reason.value = ''
      }) },
    )
  }

  // TODO: confirm with modal
  function handleBatchDelete() {
    batchDelete(
      { ids: selectedIds.value },
      { onSuccess: () => resetOnSuccess(() => (rowSelection.value = {})) },
    )
  }

  return {
    rowSelection,
    selectedIds,
    batchReviewVerdict,
    reason,
    reasonError,
    isBatchReviewing,
    isBatchDeleting,
    handleBatchReview,
    handleBatchDelete,
    cancelBatchReview,
  }
}
