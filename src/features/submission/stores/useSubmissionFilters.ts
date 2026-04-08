import type { SubmissionFilters } from '../queries/keys'
import { reactive, readonly } from 'vue'

interface FilterState {
  filters: SubmissionFilters
}

const state = reactive<FilterState>({
  filters: {},
})

export function useSubmissionFilters() {
  const setFilters = (newFilters: SubmissionFilters) => {
    Object.assign(state.filters, newFilters)
  }

  const resetFilters = () => {
    Object.assign(
      state.filters,
      Object.keys(state.filters)
        .reduce((acc, key) => ({ ...acc, [key]: undefined }), {}),
    )
  }

  return {
    filters: readonly(state.filters),
    setFilters,
    resetFilters,
  }
}
