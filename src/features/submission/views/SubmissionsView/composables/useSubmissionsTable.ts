import type { ColumnDef, RowSelectionState, SortingState, Table } from '@tanstack/vue-table'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Submission } from '../../../schemas/submission'
import type { SubmissionFilters } from '../exports'
import { createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { computed, h, toValue } from 'vue'
import ActionsTableCell from '../components/ActionsTableCell'
import SelectAllHeader from '../components/SelectColumn/SelectAllHeader.vue'
import SelectRowCell from '../components/SelectColumn/SelectRowCell.vue'
import StatusTableCell from '../components/StatusTableCell.vue'

const columnHelper = createColumnHelper<Submission>()

export function createColumns(): ColumnDef<Submission, any>[] {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => h(SelectAllHeader, { table }),
      cell: ({ row }) => h(SelectRowCell, { row }),
    }),
    columnHelper.accessor('title', { header: 'Title', enableSorting: false }),
    columnHelper.accessor('type', { header: 'Type', enableSorting: false }),
    columnHelper.accessor('status', {
      header: 'Status',
      meta: { headerClass: 'text-center', cellClass: 'text-center' },
      enableSorting: false,
      cell: ({ row }) => h(StatusTableCell, {
        id: row.original.id,
        status: row.original.status,
      }),
    }),
    columnHelper.accessor(row => row.submitter.name, {
      id: 'submitter',
      header: 'Submitter',
      meta: { headerClass: 'text-center' },
      enableSorting: false,
    }),
    columnHelper.accessor('score', {
      header: 'Score',
      meta: { cellClass: 'text-right' },
      enableSorting: true,
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      meta: { cellClass: 'text-right' },
      enableSorting: true,
      cell: info => new Date(info.getValue()).toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      meta: { headerClass: 'text-center' },
      cell: ({ row }) => h(ActionsTableCell, {
        id: row.original.id,
      }),
    }),
  ]
}

interface Source {
  submissions: Ref<Submission[]>
  totalPages: MaybeRefOrGetter<number | undefined>
}

interface TableControl {
  rowSelection: Ref<RowSelectionState>
  page: Ref<number>
  pageSize: Ref<number>
  sortBy: Ref<SubmissionFilters['sortBy'] | undefined>
  sortOrder: Ref<SubmissionFilters['sortOrder'] | undefined>
  setSorting: (sortBy: SubmissionFilters['sortBy'] | undefined, sortOrder: SubmissionFilters['sortOrder'] | undefined) => void
  setPagination: (page: number, pageSize: number) => void
}

export function useSubmissionsTable(
  { submissions, totalPages }: Source,
  { rowSelection, page, pageSize, sortBy, sortOrder, setSorting, setPagination }: TableControl,
): { table: Table<Submission> } {
  const columns = createColumns()

  const sorting = computed<SortingState>(() => sortBy.value
    ? [{ id: sortBy.value, desc: sortOrder.value === 'desc' }]
    : [],
  )

  const pageIndex = computed(() => (page.value ?? 1) - 1)

  return { table: useVueTable({
    get data() { return submissions.value },
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: row => row.id,
    manualPagination: true,
    manualSorting: true,
    get pageCount() { return toValue(totalPages) ?? -1 },
    state: {
      get sorting() { return sorting.value },
      get pagination() {
        return { pageIndex: pageIndex.value, pageSize: pageSize.value }
      },
      get rowSelection() { return rowSelection.value },
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting.value) : updater
      const first = next[0]
      setSorting(
        first ? first.id as SubmissionFilters['sortBy'] : undefined,
        first ? (first.desc ? 'desc' : 'asc') : undefined,
      )
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: pageIndex.value, pageSize: pageSize.value }
      const next = typeof updater === 'function' ? updater(current) : updater
      setPagination(next.pageIndex + 1, next.pageSize)
    },
    onRowSelectionChange: (updater) => {
      rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    },
  }) }
}
