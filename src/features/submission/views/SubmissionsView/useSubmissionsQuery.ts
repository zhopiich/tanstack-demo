import type { SubmissionFilters } from '../../queries/keys'
import { computed, reactive } from 'vue'
import { useSubmissions } from '../../queries/useSubmissions'

export function useSubmissionsQuery() {
  const filters = reactive<SubmissionFilters>({ page: 1, pageSize: 10 })
  const { data, isFetching, isPending, isError } = useSubmissions(() => ({ ...filters }))

  const submissions = computed(() => data.value?.data ?? [])
  const paginationMeta = computed(() => data.value?.pagination)

  return { filters, submissions, paginationMeta, isFetching, isPending, isError }
}
