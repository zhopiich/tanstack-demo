import type { RowSelectionState } from '@tanstack/vue-table'
import type { Submission } from '../../../schemas/submission'
import type { SubmissionFilters } from '../exports'
import { useVueTable } from '@tanstack/vue-table'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useSubmissionsTable } from './useSubmissionsTable'

vi.mock('@tanstack/vue-table', () => ({
  createColumnHelper: () => ({ display: vi.fn(), accessor: vi.fn() }),
  getCoreRowModel: vi.fn(),
  useVueTable: vi.fn(),
}))

vi.mock('../components/ActionsTableCell', () => ({ default: {} }))
vi.mock('../components/SelectColumn/SelectAllHeader.vue', () => ({ default: {} }))
vi.mock('../components/SelectColumn/SelectRowCell.vue', () => ({ default: {} }))
vi.mock('../components/StatusTableCell.vue', () => ({ default: {} }))

let capturedOptions: any

function setup() {
  const submissions = ref<Submission[]>([])
  const totalPages = ref<number | undefined>(undefined)
  const rowSelection = ref<RowSelectionState>({})
  const page = ref(1)
  const pageSize = ref(10)
  const sortBy = ref<SubmissionFilters['sortBy'] | undefined>(undefined)
  const sortOrder = ref<SubmissionFilters['sortOrder'] | undefined>(undefined)
  const setSorting = vi.fn()
  const setPagination = vi.fn()

  useSubmissionsTable(
    { submissions, totalPages },
    { rowSelection, page, pageSize, sortBy, sortOrder, setSorting, setPagination },
  )

  return { rowSelection, page, pageSize, sortBy, sortOrder, setSorting, setPagination }
}

describe('useSubmissionsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useVueTable).mockImplementation((options: any) => {
      capturedOptions = options
      return {} as any
    })
  })

  describe('state.sorting', () => {
    it('returns [] when sortBy is undefined', () => {
      setup()
      expect(capturedOptions.state.sorting).toEqual([])
    })

    it('returns ascending entry when sortOrder is asc', () => {
      const { sortBy, sortOrder } = setup()
      sortBy.value = 'score'
      sortOrder.value = 'asc'
      expect(capturedOptions.state.sorting).toEqual([{ id: 'score', desc: false }])
    })

    it('returns descending entry when sortOrder is desc', () => {
      const { sortBy, sortOrder } = setup()
      sortBy.value = 'createdAt'
      sortOrder.value = 'desc'
      expect(capturedOptions.state.sorting).toEqual([{ id: 'createdAt', desc: true }])
    })
  })

  describe('state.pagination.pageIndex', () => {
    it('returns 0 when page is 1', () => {
      setup()
      expect(capturedOptions.state.pagination.pageIndex).toBe(0)
    })

    it('returns 2 when page is 3', () => {
      const { page } = setup()
      page.value = 3
      expect(capturedOptions.state.pagination.pageIndex).toBe(2)
    })
  })

  describe('onSortingChange', () => {
    it('calls setSorting(undefined, undefined) when sorting clears', () => {
      const { setSorting } = setup()
      capturedOptions.onSortingChange([])
      expect(setSorting).toHaveBeenCalledWith(undefined, undefined)
    })

    it('calls setSorting with id and asc when desc is false', () => {
      const { setSorting } = setup()
      capturedOptions.onSortingChange([{ id: 'score', desc: false }])
      expect(setSorting).toHaveBeenCalledWith('score', 'asc')
    })

    it('calls setSorting with id and desc when desc is true', () => {
      const { setSorting } = setup()
      capturedOptions.onSortingChange([{ id: 'createdAt', desc: true }])
      expect(setSorting).toHaveBeenCalledWith('createdAt', 'desc')
    })

    it('handles function updater', () => {
      const { setSorting } = setup()
      capturedOptions.onSortingChange(() => [{ id: 'score', desc: true }])
      expect(setSorting).toHaveBeenCalledWith('score', 'desc')
    })
  })

  describe('onPaginationChange', () => {
    it('converts 0-based pageIndex to 1-based page', () => {
      const { setPagination } = setup()
      capturedOptions.onPaginationChange({ pageIndex: 2, pageSize: 20 })
      expect(setPagination).toHaveBeenCalledWith(3, 20)
    })

    it('handles function updater', () => {
      const { setPagination } = setup()
      capturedOptions.onPaginationChange(() => ({ pageIndex: 0, pageSize: 10 }))
      expect(setPagination).toHaveBeenCalledWith(1, 10)
    })
  })

  describe('onRowSelectionChange', () => {
    it('sets rowSelection to the given value', () => {
      const { rowSelection } = setup()
      capturedOptions.onRowSelectionChange({ 'id-1': true })
      expect(rowSelection.value).toEqual({ 'id-1': true })
    })

    it('handles function updater and merges into existing selection', () => {
      const { rowSelection } = setup()
      rowSelection.value = { 'id-1': true }
      capturedOptions.onRowSelectionChange((prev: RowSelectionState) => ({ ...prev, 'id-2': true }))
      expect(rowSelection.value).toEqual({ 'id-1': true, 'id-2': true })
    })
  })
})
