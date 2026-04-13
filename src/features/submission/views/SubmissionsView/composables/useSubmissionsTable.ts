import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import type { Submission } from '../../../schemas/submission'
import type { SubmissionFilters } from '../exports'
import type { Pagination } from '@/schemas/common'
import { createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { computed, h } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const columnHelper = createColumnHelper<Submission>()

type AuthStore = ReturnType<typeof useAuthStore>

export function createColumns(authStore: AuthStore): ColumnDef<Submission, any>[] {
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
    columnHelper.accessor('status', { header: 'Status', enableSorting: false }),
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
      cell: ({ row }) => {
        const id = row.original.id
        const nodes = [h(RouterLink, { to: `/submissions/${id}` }, () => 'View')]
        if (authStore.role === 'admin') {
          nodes.push(h('span', ' | '))
          nodes.push(h(RouterLink, { to: `/submissions/${id}/edit` }, () => 'Edit'))
        }
        return h('span', nodes)
      },
    }),
  ]
}

interface Params {
  submissions: Ref<Submission[]>
  paginationMeta: Ref<Pagination | undefined>
  filters: SubmissionFilters
  rowSelection: Ref<RowSelectionState>
}

export function useSubmissionsTable({ submissions, paginationMeta, filters, rowSelection }: Params) {
  const authStore = useAuthStore()

  const columns = computed(() => createColumns(authStore))

  const sorting = computed<SortingState>(() =>
    filters.sortBy ? [{ id: filters.sortBy, desc: filters.sortOrder === 'desc' }] : [],
  )

  return { table: useVueTable({
    get data() { return submissions.value },
    get columns() { return columns.value },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    getRowId: row => row.id,
    manualPagination: true,
    manualSorting: true,
    get pageCount() { return paginationMeta.value?.totalPages ?? -1 },
    state: {
      get sorting() { return sorting.value },
      get pagination() {
        return { pageIndex: (filters.page ?? 1) - 1, pageSize: filters.pageSize ?? 10 }
      },
      get rowSelection() { return rowSelection.value },
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting.value) : updater
      const first = next[0]
      if (first) {
        filters.sortBy = first.id as SubmissionFilters['sortBy']
        filters.sortOrder = first.desc ? 'desc' : 'asc'
      }
      else {
        delete filters.sortBy
        delete filters.sortOrder
      }
      filters.page = 1
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: (filters.page ?? 1) - 1, pageSize: filters.pageSize ?? 10 }
      const next = typeof updater === 'function' ? updater(current) : updater
      filters.page = next.pageIndex + 1
      filters.pageSize = next.pageSize
    },
    onRowSelectionChange: (updater) => {
      rowSelection.value = typeof updater === 'function' ? updater(rowSelection.value) : updater
    },
  }) }
}
