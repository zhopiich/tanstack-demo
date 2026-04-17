import type { SubmissionFilters } from '../exports'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type FilterPatch = Partial<
  Pick<SubmissionFilters, 'status' | 'type' | 'tier' | 'search'>
>

export function useFiltersRouteQuery() {
  const route = useRoute()
  const router = useRouter()

  const status = computed(() => route.query.status as SubmissionFilters['status'] | undefined)
  const type = computed(() => route.query.type as SubmissionFilters['type'] | undefined)
  const tier = computed(() => route.query.tier as SubmissionFilters['tier'] | undefined)
  const search = computed(() => route.query.search as string | undefined)

  const activeCount = computed(() =>
    [status.value, type.value, tier.value, search.value].filter(Boolean).length,
  )

  function setFilters(patch: FilterPatch) {
    router.replace({
      query: { ...route.query, page: '1', ...patch },
    })
  }

  function reset() {
    router.replace({
      query: {
        ...route.query,
        page: '1',
        status: undefined,
        type: undefined,
        tier: undefined,
        search: undefined,
      },
    })
  }

  return { status, type, tier, search, activeCount, setFilters, reset }
}
