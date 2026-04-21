<template>
  <div class="max-w-5xl mx-auto py-8 space-y-6">
    <div class="flex items-center gap-2">
      <h1 class="text-2xl font-bold">
        Dashboard
      </h1>
      <Spinner v-if="isFetching && !isPending" class="size-5 " />
    </div>

    <p v-if="isError" class="text-sm text-destructive">
      Failed to load dashboard stats.
    </p>

    <template v-else>
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card v-for="item in summaryList" :key="item.label">
          <CardHeader>
            <CardDescription>{{ item.label }}</CardDescription>
            <CardTitle class="text-3xl tabular-nums">
              <Skeleton v-if="isPending" class="h-8 w-24" />
              <template v-else>
                {{ item.value }}
              </template>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div v-for="table in tableList" :key="table.header" class="space-y-2">
        <h2 class="text-lg font-semibold">
          {{ table.header }}
        </h2>
        <div class="rounded-md border overflow-hidden">
          <DataTable :table="table.instance" :is-pending />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import DataTable from '@/components/DataTable.vue'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { useDashboardTables } from '../composables/useDashboardTables'
import { useDashboardStats } from '../queries/useDashboardStats'

const { data: stats, isPending, isFetching, isError } = useDashboardStats()

const { byTypeTable, recentActivityTable, topSubmittersTable } = useDashboardTables(stats)

const summaryList = computed(() => {
  const s = stats.value?.summary
  return [
    { label: 'Total', value: s?.totalSubmissions },
    { label: 'Pending', value: s?.pendingCount },
    { label: 'Approved', value: s?.approvedCount },
    { label: 'Rejected', value: s?.rejectedCount },
    { label: 'Flagged', value: s?.flaggedCount },
  ]
})

interface TableItem {
  header: string
  instance: Table<any>
}

const tableList = computed<TableItem[]>(() => [
  { header: 'By Type', instance: byTypeTable },
  { header: 'Recent Activity', instance: recentActivityTable },
  { header: 'Top Submitters', instance: topSubmittersTable },
])
</script>
