import type { SubmissionFilters } from '../exports'
import { useRouteQuery } from '@vueuse/router'

export function useSubmissionsRouteQuery() {
  const page = useRouteQuery('page', '1', { transform: Number })
  const pageSize = useRouteQuery('pageSize', '10', { transform: Number })
  const sortBy = useRouteQuery<SubmissionFilters['sortBy'] | undefined>('sortBy', undefined)
  const sortOrder = useRouteQuery<SubmissionFilters['sortOrder'] | undefined>('sortOrder', undefined)

  return { page, pageSize, sortBy, sortOrder }
}
