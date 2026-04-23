import type { FilterPatch } from './useFiltersRouteQuery.ts'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { useFiltersRouteQuery } from './useFiltersRouteQuery'

const mockQuery = reactive<FilterPatch>({})
const mockReplace = vi.fn()

function resetQuery() {
  (Object.keys(mockQuery) as Array<keyof FilterPatch>).forEach((key) => {
    delete mockQuery[key]
  })
};

function patchQuery(patch: FilterPatch & { page?: string }) {
  Object.assign(mockQuery, patch)
}

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: mockQuery }),
  useRouter: () => ({ replace: mockReplace }),
}))

describe('useFiltersRouteQuery', () => {
  beforeEach(() => {
    resetQuery()
    mockReplace.mockClear()
  })

  it('returns undefined for all filters when query is empty', () => {
    const { status, type, tier, search } = useFiltersRouteQuery()
    expect(status.value).toBeUndefined()
    expect(type.value).toBeUndefined()
    expect(tier.value).toBeUndefined()
    expect(search.value).toBeUndefined()
  })

  it('reflects each filter from the route query', () => {
    const { status, type, tier, search } = useFiltersRouteQuery()
    patchQuery({ status: 'pending', type: 'article', tier: 'pro', search: 'hello' })
    expect(status.value).toBe('pending')
    expect(type.value).toBe('article')
    expect(tier.value).toBe('pro')
    expect(search.value).toBe('hello')
  })

  it('reflects route query changes reactively', () => {
    const { status, type } = useFiltersRouteQuery()
    patchQuery({ status: 'pending', type: 'article' })
    expect(status.value).toBe('pending')
    expect(type.value).toBe('article')
    patchQuery({ status: 'flagged' })
    expect(status.value).toBe('flagged')
    expect(type.value).toBe('article')
  })

  it('activeCount counts only truthy filter values', () => {
    const { activeCount } = useFiltersRouteQuery()
    patchQuery({ status: 'pending', type: 'article' })
    expect(activeCount.value).toBe(2)
  })

  it('activeCount is 0 when all filters are absent', () => {
    const { activeCount } = useFiltersRouteQuery()
    expect(activeCount.value).toBe(0)
  })

  it('setFilters calls router.replace with merged query and resets page to 1', () => {
    const { setFilters } = useFiltersRouteQuery()
    patchQuery({ status: 'pending', page: '3' })
    setFilters({ type: 'video' })
    expect(mockReplace).toHaveBeenCalledWith({
      query: { status: 'pending', page: '1', type: 'video' },
    })
  })

  it('reset clears all filter keys', () => {
    const { reset } = useFiltersRouteQuery()
    patchQuery({ status: 'pending', type: 'article', tier: 'pro', search: 'hi' })
    reset()
    expect(mockReplace).toHaveBeenCalledWith({
      query: {
        status: undefined,
        type: undefined,
        tier: undefined,
        search: undefined,
        page: '1',
      },
    })
  })
})
