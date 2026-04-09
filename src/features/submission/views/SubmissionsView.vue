<template>
  <div>
    <h1>Submissions</h1>

    <p v-if="isError">
      Failed to load submissions.
    </p>

    <template v-else>
      <p v-if="isFetching">
        Loading…
      </p>

      <table v-if="!isPending">
        <thead>
          <tr>
            <th
              v-for="header in table.getFlatHeaders()"
              :key="header.id"
              :style="header.column.getCanSort() ? 'cursor: pointer; user-select: none;' : ''"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <span v-if="header.column.getIsSorted() === 'asc'">↑</span>
              <span v-else-if="header.column.getIsSorted() === 'desc'">↓</span>
              <span v-else-if="header.column.getCanSort()">↕</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="paginationMeta">
        <button :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          Prev
        </button>
        <span>Page {{ paginationMeta.page }} / {{ paginationMeta.totalPages }}</span>
        <button :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          Next
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { RowSelectionState, SortingState } from '@tanstack/vue-table'
import type { SubmissionFilters } from '../queries/keys'
import type { components } from '@/api/schema'
import { createColumnHelper, FlexRender, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { computed, h, reactive, ref } from 'vue'
import { useSubmissions } from '../queries/useSubmissions'

type Submission = components['schemas']['Submission']

const filters = reactive<SubmissionFilters>({ page: 1, pageSize: 10 })

const { data, isFetching, isPending, isError } = useSubmissions(() => ({ ...filters }))

const submissions = computed(() => data.value?.data ?? [])
const paginationMeta = computed(() => data.value?.pagination)

const rowSelection = ref<RowSelectionState>({})

const columnHelper = createColumnHelper<Submission>()

const columns = [
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
]

const sorting = computed<SortingState>(() =>
  filters.sortBy ? [{ id: filters.sortBy, desc: filters.sortOrder === 'desc' }] : [],
)

const table = useVueTable({
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
})
</script>
