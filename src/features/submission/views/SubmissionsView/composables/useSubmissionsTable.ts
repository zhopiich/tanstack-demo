import type { ColumnDef, RowSelectionState, SortingState, Table } from '@tanstack/vue-table'
import type { MaybeRefOrGetter, Ref } from 'vue'
import type { Submission } from '../../../schemas/submission'
import type { SubmissionFilters } from '../exports'
import { createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { computed, h, toValue } from 'vue'
import ActionsTableCell from '../components/ActionsTableCell'
import StatusTableCell from '../components/StatusTableCell.vue'

const columnHelper = createColumnHelper<Submission>()

export function createColumns(): ColumnDef<Submission, any>[] {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => h('input', {
        type: 'checkbox',
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected(),
        onChange: table.getToggleAllPageRowsSelectedHandler(),
      }),
      cell: ({ row }) => h('input', {
        type: 'checkbox',
        checked: row.getIsSelected(),
        disabled: !row.getCanSelect(),
        onChange: row.getToggleSelectedHandler(),
      }),
    }),
    columnHelper.accessor('title', { header: 'Title', enableSorting: false }),
    columnHelper.accessor('type', { header: 'Type', enableSorting: false }),
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => h(StatusTableCell, {
        id: row.original.id,
        status: row.original.status,
      }),
    }),
    columnHelper.accessor(row => row.submitter.name, {
      id: 'submitter',
      header: 'Submitter',
      enableSorting: false,
    }),
    columnHelper.accessor('score', { header: 'Score', enableSorting: true }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
      enableSorting: true,
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => h(ActionsTableCell, {
        id: row.original.id,
      }),
    }),
  ]
}

export type ToRefs<T extends object> = {
  [K in keyof T]: Ref<T[K]>
}

interface Source {
  submissions: Ref<Submission[]>
  totalPages: MaybeRefOrGetter<number | undefined>
}

interface TableState {
  rowSelection: RowSelectionState
  page: number
  pageSize: number
  sortBy: SubmissionFilters['sortBy']
  sortOrder: SubmissionFilters['sortOrder']
}
type TableStateRefs = ToRefs<TableState>

export function useSubmissionsTable(
  { submissions, totalPages }: Source,
  { rowSelection, page, pageSize, sortBy, sortOrder }: TableStateRefs,
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
      if (first) {
        sortBy.value = first.id as SubmissionFilters['sortBy']
        sortOrder.value = first.desc ? 'desc' : 'asc'
      }
      else {
        sortBy.value = undefined
        sortOrder.value = undefined
      }
      page.value = 1
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: pageIndex.value, pageSize: pageSize.value }
      const next = typeof updater === 'function' ? updater(current) : updater
      page.value = next.pageIndex + 1
      pageSize.value = next.pageSize
    },
    onRowSelectionChange: (updater) => {
      rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    },
  }) }
}
