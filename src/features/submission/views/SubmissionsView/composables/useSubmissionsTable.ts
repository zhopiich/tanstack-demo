import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/vue-table'
import type { ComputedRef, Ref } from 'vue'
import type { Submission } from '../../../schemas/submission'
import type { SubmissionFilters } from '../exports'
import type { Pagination } from '@/schemas/common'
import { createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { computed, h } from 'vue'
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

interface Params {
  submissions: Ref<Submission[]>
  paginationMeta: Ref<Pagination | undefined>
  filters: ComputedRef<SubmissionFilters>
  page: Ref<number>
  pageSize: Ref<number>
  sortBy: Ref<SubmissionFilters['sortBy'] | null>
  sortOrder: Ref<SubmissionFilters['sortOrder'] | null>
  rowSelection: Ref<RowSelectionState>
}

export function useSubmissionsTable({ submissions, paginationMeta, filters, page, pageSize, sortBy, sortOrder, rowSelection }: Params) {
  const columns = createColumns()

  const sorting = computed<SortingState>(() =>
    sortBy.value ? [{ id: sortBy.value, desc: sortOrder.value === 'desc' }] : [],
  )

  return { table: useVueTable({
    get data() { return submissions.value },
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: row => row.id,
    manualPagination: true,
    manualSorting: true,
    get pageCount() { return paginationMeta.value?.totalPages ?? -1 },
    state: {
      get sorting() { return sorting.value },
      get pagination() {
        return { pageIndex: (filters.value.page ?? 1) - 1, pageSize: filters.value.pageSize ?? 10 }
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
        sortBy.value = null
        sortOrder.value = null
      }
      page.value = 1
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: (filters.value.page ?? 1) - 1, pageSize: filters.value.pageSize ?? 10 }
      const next = typeof updater === 'function' ? updater(current) : updater
      page.value = next.pageIndex + 1
      pageSize.value = next.pageSize
    },
    onRowSelectionChange: (updater) => {
      rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    },
  }) }
}
