import type { SubmissionFilters } from '../exports'
import { useRouteQuery } from '@vueuse/router'
import { watch } from 'vue'

export function useSubmissionsRouteQuery() {
  const page = useRouteQuery('page', '1', { transform: Number })
  const pageSize = useRouteQuery('pageSize', '10', { transform: Number })
  const sortBy = useRouteQuery<SubmissionFilters['sortBy'] | undefined>('sortBy', undefined)
  const sortOrder = useRouteQuery<SubmissionFilters['sortOrder'] | undefined>('sortOrder', undefined)

  const status = useRouteQuery<SubmissionFilters['status'] | undefined>('status', undefined)
  const type = useRouteQuery<SubmissionFilters['type'] | undefined>('type', undefined)
  const tier = useRouteQuery<SubmissionFilters['tier'] | undefined>('tier', undefined)
  const search = useRouteQuery<string | undefined>('search', undefined)

  watch([status, type, tier, search], () => page.value = 1)

  return {
    page,
    pageSize,
    sortBy,
    sortOrder,
    status,
    type,
    tier,
    search,
  }
}
