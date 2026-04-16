<template>
  <div>
    <h1>Submissions</h1>

    <RouterLink v-if="authStore.role === 'admin'" to="/submissions/new">
      New Submission
    </RouterLink>

    <p v-if="isError">
      Failed to load submissions.
    </p>

    <template v-else>
      <p v-if="isFetching">
        Loading…
      </p>

      <SubmissionBatchActionsBar
        v-if="selectedIds.length > 0"
        :selected-ids-length="selectedIds.length"
      />

      <SubmissionsTable v-if="!isPending" :table="table" />

      <SubmissionsPagination
        v-if="paginationMeta"
        :table="table"
        :page="paginationMeta.page"
        :total-pages="paginationMeta.totalPages"
        :total="paginationMeta.total"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSubmissions } from '../../queries/useSubmissions'
import SubmissionBatchActionsBar from './components/SubmissionBatchActionsBar'
import SubmissionsPagination from './components/SubmissionsPagination.vue'
import SubmissionsTable from './components/SubmissionsTable.vue'
import { useSharedRowSelection } from './composables/useRowSelection'
import { useSubmissionsRouteQuery } from './composables/useSubmissionsRouteQuery'
import { useSubmissionsTable } from './composables/useSubmissionsTable'

const authStore = useAuthStore()

const { filters, page, pageSize, sortBy, sortOrder } = useSubmissionsRouteQuery()
const { selectedIds, rowSelection } = useSharedRowSelection()
const { data, isFetching, isPending, isError } = useSubmissions(() => ({ ...filters.value }))

const submissions = computed(() => data.value?.data ?? [])
const paginationMeta = computed(() => data.value?.pagination)

const { table } = useSubmissionsTable(
  { submissions, totalPages: () => paginationMeta.value?.totalPages },
  { rowSelection, page, pageSize, sortBy, sortOrder },
)
</script>
