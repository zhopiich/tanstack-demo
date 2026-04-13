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
  byTypeHelper.accessor('count', { header: 'Count' }),
  byTypeHelper.accessor('approvalRate', {
    header: 'Approval Rate',
    cell: info => getPercentage(info.getValue()),
  }),
]

const activityHelper = createColumnHelper<RecentActivity>()
const recentActivityColumns = [
  activityHelper.accessor('title', {
    header: 'Title',
    cell: info => h(RouterLink, { to: `/submissions/${info.row.original.submissionId}` }, () => info.getValue()),
  }),
  activityHelper.accessor('action', { header: 'Action' }),
  activityHelper.accessor('actorName', { header: 'Actor' }),
  activityHelper.accessor('occurredAt', {
    header: 'Time',
    cell: info => new Date(info.getValue()).toLocaleString(),
  }),
]

const submitterHelper = createColumnHelper<TopSubmitter>()
const topSubmittersColumns = [
  submitterHelper.accessor('name', { header: 'Name' }),
  submitterHelper.accessor('tier', { header: 'Tier' }),
  submitterHelper.accessor('submissionCount', { header: 'Submissions' }),
  submitterHelper.accessor('approvalRate', {
    header: 'Approval Rate',
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
