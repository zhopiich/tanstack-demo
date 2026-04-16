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
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SubmissionBatchActionsBar from './components/SubmissionBatchActionsBar'
import SubmissionsPagination from './components/SubmissionsPagination.vue'
import SubmissionsTable from './components/SubmissionsTable.vue'
import { useSharedRowSelection } from './composables/useRowSelection'
import { useSubmissionsQuery } from './composables/useSubmissionsQuery'
import { useSubmissionsTable } from './composables/useSubmissionsTable'

const authStore = useAuthStore()

const { selectedIds, rowSelection } = useSharedRowSelection()

const { filters, page, pageSize, sortBy, sortOrder, submissions, paginationMeta, isFetching, isPending, isError } = useSubmissionsQuery()

const { table } = useSubmissionsTable({ submissions, paginationMeta, filters, page, pageSize, sortBy, sortOrder, rowSelection })
</script>
