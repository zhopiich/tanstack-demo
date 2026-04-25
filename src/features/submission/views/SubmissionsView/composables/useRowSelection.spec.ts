import { beforeEach, describe, expect, it } from 'vitest'
import { useSharedRowSelection } from './useRowSelection'

describe('useSharedRowSelection', () => {
  beforeEach(() => {
    useSharedRowSelection().resetRowSelection()
  })

  it('initializes with empty selection', () => {
    const { rowSelection, selectedIds } = useSharedRowSelection()
    expect(rowSelection.value).toEqual({})
    expect(selectedIds.value).toEqual([])
  })

  it('selectedIds includes only rows selected as true', () => {
    const { rowSelection, selectedIds } = useSharedRowSelection()
    rowSelection.value = { a: true, b: false, c: true }
    expect(selectedIds.value).toEqual(['a', 'c'])
  })

  it('resetRowSelection clears all selections', () => {
    const { rowSelection, selectedIds, resetRowSelection } = useSharedRowSelection()
    rowSelection.value = { x: true }
    resetRowSelection()
    expect(rowSelection.value).toEqual({})
    expect(selectedIds.value).toEqual([])
  })

  it('shares state across multiple composable calls', () => {
    const a = useSharedRowSelection()
    const b = useSharedRowSelection()
    a.rowSelection.value = { id: true }
    expect(b.rowSelection.value).toEqual({ id: true })
    expect(b.selectedIds.value).toEqual(['id'])
  })
})
