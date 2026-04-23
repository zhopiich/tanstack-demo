import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import { usePaginationRouteQuery } from './usePaginationRouteQuery'

const mockQuery = reactive<Record<string, string | undefined>>({})
const mockReplace = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: mockQuery }),
  useRouter: () => ({ replace: mockReplace }),
}))

describe('usePaginationRouteQuery', () => {
  beforeEach(() => {
    Object.keys(mockQuery).forEach(k => delete mockQuery[k])
    mockReplace.mockClear()
  })

  it('returns defaults when query is empty', () => {
    const { page, pageSize, sortBy, sortOrder } = usePaginationRouteQuery()
    expect(page.value).toBe(1)
    expect(pageSize.value).toBe(10)
    expect(sortBy.value).toBeUndefined()
    expect(sortOrder.value).toBeUndefined()
  })

  it('parses page and pageSize as numbers from query', () => {
    Object.assign(mockQuery, { page: '3', pageSize: '25' })
    const { page, pageSize } = usePaginationRouteQuery()
    expect(page.value).toBe(3)
    expect(pageSize.value).toBe(25)
  })

  it('reads sortBy and sortOrder from query', () => {
    Object.assign(mockQuery, { sortBy: 'createdAt', sortOrder: 'desc' })
    const { sortBy, sortOrder } = usePaginationRouteQuery()
    expect(sortBy.value).toBe('createdAt')
    expect(sortOrder.value).toBe('desc')
  })

  it('updates computed refs reactively when query changes', () => {
    const { page, sortBy } = usePaginationRouteQuery()
    expect(page.value).toBe(1)
    expect(sortBy.value).toBeUndefined()

    mockQuery.page = '5'
    mockQuery.sortBy = 'score'

    expect(page.value).toBe(5)
    expect(sortBy.value).toBe('score')
  })

  it('setSorting replaces query with new sort params and resets page to 1', () => {
    Object.assign(mockQuery, { page: '3', pageSize: '25' })
    const { setSorting } = usePaginationRouteQuery()
    setSorting('createdAt', 'asc')
    expect(mockReplace).toHaveBeenCalledWith({
      query: { page: '1', pageSize: '25', sortBy: 'createdAt', sortOrder: 'asc' },
    })
  })

  it('setPagination replaces query with stringified page and pageSize', () => {
    Object.assign(mockQuery, { sortBy: 'score', sortOrder: 'desc' })
    const { setPagination } = usePaginationRouteQuery()
    setPagination(2, 20)
    expect(mockReplace).toHaveBeenCalledWith({
      query: { sortBy: 'score', sortOrder: 'desc', page: '2', pageSize: '20' },
    })
  })
})
