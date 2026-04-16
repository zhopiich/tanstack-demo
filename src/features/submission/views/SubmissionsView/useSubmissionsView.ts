import { computed } from 'vue'
import { useSubmissions } from '../../queries/useSubmissions'
import { useSharedRowSelection } from './composables/useRowSelection'
import { useSubmissionsRouteQuery } from './composables/useSubmissionsRouteQuery'
import { useSubmissionsTable } from './composables/useSubmissionsTable'

export function useSubmissionsView() {
  const { page, pageSize, sortBy, sortOrder, status, type, search } = useSubmissionsRouteQuery()

  const filters = computed(() => ({
    page: page.value,
    pageSize: pageSize.value,
    sortBy: sortBy.value,
    sortOrder: sortOrder.value,
    status: status.value,
    type: type.value,
    search: search.value,
  }))

  const { data, isFetching, isPending, isError } = useSubmissions(filters)

  const submissions = computed(() => data.value?.data ?? [])
  const pagination = computed(() => data.value?.pagination)

  const { selectedIds, rowSelection } = useSharedRowSelection()

  const { table } = useSubmissionsTable(
    { submissions, totalPages: () => pagination.value?.totalPages },
    { rowSelection, page, pageSize, sortBy, sortOrder },
  )

  return { isFetching, isPending, isError, pagination, selectedIds, table, status, type, search }
}
