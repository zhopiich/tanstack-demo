import type { RowSelectionState } from '@tanstack/vue-table'
import { computed, nextTick, ref, watch } from 'vue'

export function useSubmissionRowSelection(onSelectionCleared?: () => void) {
  const rowSelection = ref<RowSelectionState>({})
  const selectedIds = computed(() =>
    Object.keys(rowSelection.value).filter(id => rowSelection.value[id]),
  )

  // Internal flag to suppress the watcher during programmatic resets triggered
  // by mutation success callbacks.
  const isMutationInternalReset = ref(false)

  // When the selection is cleared externally (e.g. user unchecks all),
  // notify the parent so it can cancel any pending batch review.
  watch(rowSelection, (newVal) => {
    if (isMutationInternalReset.value)
      return
    if (Object.keys(newVal).length === 0)
      onSelectionCleared?.()
  }, { deep: true })

  function resetOnSuccess(callback?: () => void) {
    isMutationInternalReset.value = true
    callback?.()
    nextTick(() => (isMutationInternalReset.value = false))
  }

  return { rowSelection, selectedIds, resetOnSuccess }
}
