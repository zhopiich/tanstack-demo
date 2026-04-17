import type { SubmissionFilters } from '../exports'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function usePaginationRouteQuery() {
  const route = useRoute()
  const router = useRouter()

  const page = computed(() => Number(route.query.page ?? '1'))
  const pageSize = computed(() => Number(route.query.pageSize ?? '10'))
  const sortBy = computed(() => route.query.sortBy as SubmissionFilters['sortBy'] | undefined)
  const sortOrder = computed(() => route.query.sortOrder as SubmissionFilters['sortOrder'] | undefined)

  function setSorting(
    newSortBy: SubmissionFilters['sortBy'] | undefined,
    newSortOrder: SubmissionFilters['sortOrder'] | undefined,
  ) {
    router.replace({
      query: { ...route.query, sortBy: newSortBy, sortOrder: newSortOrder, page: '1' },
    })
  }

  function setPagination(newPage: number, newPageSize: number) {
    router.replace({
      query: { ...route.query, page: String(newPage), pageSize: String(newPageSize) },
    })
  }

  return { page, pageSize, sortBy, sortOrder, setSorting, setPagination }
}
