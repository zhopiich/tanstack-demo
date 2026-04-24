import { beforeEach, describe, expect, it } from 'vitest'
import { useSubmissionFilters } from './useSubmissionFilters'

describe('useSubmissionFilters', () => {
  beforeEach(() => {
    useSubmissionFilters().resetFilters()
  })

  it('starts with no filters set', () => {
    const { filters } = useSubmissionFilters()
    expect(Object.values(filters).every(v => v === undefined)).toBe(true)
  })

  it('setFilters merges new values into existing state', () => {
    const { filters, setFilters } = useSubmissionFilters()
    setFilters({ status: 'pending', type: 'article' })
    expect(filters.status).toBe('pending')
    expect(filters.type).toBe('article')
  })

  it('setFilters leaves unspecified keys untouched', () => {
    const { filters, setFilters } = useSubmissionFilters()
    setFilters({ status: 'pending' })
    setFilters({ type: 'video' })
    expect(filters.status).toBe('pending')
    expect(filters.type).toBe('video')
  })

  it('resetFilters sets all current keys to undefined', () => {
    const { filters, setFilters, resetFilters } = useSubmissionFilters()
    setFilters({ status: 'approved', type: 'image' })
    resetFilters()
    expect(filters.status).toBeUndefined()
    expect(filters.type).toBeUndefined()
  })

  it('shares state across multiple composable calls', () => {
    const a = useSubmissionFilters()
    const b = useSubmissionFilters()
    a.setFilters({ status: 'flagged' })
    expect(b.filters.status).toBe('flagged')
  })
})
