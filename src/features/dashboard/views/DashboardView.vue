<template>
  <div>
    <h1>Dashboard</h1>

    <p v-if="isError">
      Failed to load dashboard stats.
    </p>

    <p v-else-if="isPending">
      Loading…
    </p>

    <template v-else-if="stats">
      <section>
        <h2>Summary</h2>
        <ul>
          <li v-for="item in summaryList" :key="item.label">
            {{ item.label }}: {{ item.value }}
          </li>
        </ul>
      </section>

      <section>
        <h2>By Type</h2>
        <DataTable :table="byTypeTable" />
      </section>

      <section>
        <h2>Recent Activity</h2>
        <DataTable :table="recentActivityTable" />
      </section>

      <section>
        <h2>Top Submitters</h2>
        <DataTable :table="topSubmittersTable" />
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DataTable from '@/components/DataTable.vue'
import { useDashboardTables } from '../composables/useDashboardTables'
import { useDashboardStats } from '../queries/useDashboardStats'

const { data: stats, isPending, isError } = useDashboardStats()

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
</script>
