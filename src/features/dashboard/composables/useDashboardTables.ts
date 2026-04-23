import type { ColumnDef, Table } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import type { DashboardByType, DashboardStats, RecentActivity, TopSubmitter } from '../schemas/dashboard'
import { createColumnHelper, getCoreRowModel, useVueTable } from '@tanstack/vue-table'
import { computed, h } from 'vue'
import { RouterLink } from 'vue-router'

const getPercentage = (n: number) => `${(n * 100).toFixed(0)}%`

const byTypeHelper = createColumnHelper<DashboardByType>()
const byTypeColumns = [
  byTypeHelper.accessor('type', { header: 'Type' }),
  byTypeHelper.accessor('count', {
    header: 'Count',
    meta: { headerClass: 'text-right', cellClass: 'text-right' },
  }),
  byTypeHelper.accessor('approvalRate', {
    header: 'Approval Rate',
    meta: { headerClass: 'text-right', cellClass: 'text-right' },
    cell: info => getPercentage(info.getValue()),
  }),
]

const activityHelper = createColumnHelper<RecentActivity>()
const recentActivityColumns = [
  activityHelper.accessor('title', {
    header: 'Title',
    cell: info => h(RouterLink, { to: `/submissions/${info.row.original.submissionId}` }, () => info.getValue()),
  }),
  activityHelper.accessor('action', {
    header: 'Action',
    meta: { headerClass: 'text-center', cellClass: 'text-center' },
  }),
  activityHelper.accessor('actorName', { header: 'Actor' }),
  activityHelper.accessor('occurredAt', {
    header: 'Time',
    meta: { headerClass: 'text-right', cellClass: 'text-right' },
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
]

const submitterHelper = createColumnHelper<TopSubmitter>()
const topSubmittersColumns = [
  submitterHelper.accessor('name', { header: 'Name' }),
  submitterHelper.accessor('tier', {
    header: 'Tier',
    meta: { headerClass: 'text-center', cellClass: 'text-center' },
  }),
  submitterHelper.accessor('submissionCount', {
    header: 'Submissions',
    meta: { headerClass: 'text-right', cellClass: 'text-right' },
  }),
  submitterHelper.accessor('approvalRate', {
    header: 'Approval Rate',
    meta: { headerClass: 'text-right', cellClass: 'text-right' },
    cell: info => getPercentage(info.getValue()),
  }),
]

function createStaticTable<T>(
  data: Ref<T[]>,
  columns: ColumnDef<T, any>[],
  rowIdKey: keyof T,
): Table<T> {
  return useVueTable({
    get data() { return data.value },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => String(row[rowIdKey]),
    enableSorting: false,
  })
}

export function useDashboardTables(stats: Ref<DashboardStats | undefined>) {
  const byTypeTable = createStaticTable(
    computed(() => stats.value?.byType ?? []),
    byTypeColumns,
    'type',
  )

  const recentActivityTable = createStaticTable(
    computed(() => stats.value?.recentActivity ?? []),
    recentActivityColumns,
    'submissionId',
  )

  const topSubmittersTable = createStaticTable(
    computed(() => stats.value?.topSubmitters ?? []),
    topSubmittersColumns,
    'submitterId',
  )

  const hasData = computed(() => stats.value !== undefined)

  return { byTypeTable, recentActivityTable, topSubmittersTable, hasData }
}
