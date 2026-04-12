import type { RowSelectionState } from '@tanstack/vue-table'
import { createSharedComposable } from '@vueuse/core'
import { computed, readonly, ref } from 'vue'

function useRowSelection() {
  const rowSelection = ref<RowSelectionState>({})
  const selectedIds = computed(() =>
    Object.keys(rowSelection.value).filter(id => rowSelection.value[id]),
  )

  function resetRowSelection() {
    rowSelection.value = {}
  }

  return { rowSelection, selectedIds: readonly(selectedIds), resetRowSelection }
}

export const useSharedRowSelection = createSharedComposable(useRowSelection)
