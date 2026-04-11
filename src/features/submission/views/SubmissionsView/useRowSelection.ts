import type { RowSelectionState } from '@tanstack/vue-table'
import { createSharedComposable } from '@vueuse/core'
import { computed, ref } from 'vue'

export function useRowSelection() {
  const rowSelection = ref<RowSelectionState>({})
  const selectedIds = computed(() =>
    Object.keys(rowSelection.value).filter(id => rowSelection.value[id]),
  )

  return { rowSelection, selectedIds }
}

export const useSharedRowSelection = createSharedComposable(useRowSelection)
