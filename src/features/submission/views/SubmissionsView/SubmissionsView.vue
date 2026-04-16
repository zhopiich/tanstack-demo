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

      <SubmissionsFilterBar v-model:status="status" v-model:type="type" v-model:search="search" />

      <SubmissionBatchActionsBar
        v-if="selectedIds.length > 0"
        :selected-ids-length="selectedIds.length"
      />

      <SubmissionsTable v-if="!isPending" :table />

      <SubmissionsPagination
        v-if="pagination"
        :table
        :page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SubmissionBatchActionsBar from './components/SubmissionBatchActionsBar'
import SubmissionsFilterBar from './components/SubmissionsFilterBar.vue'
import SubmissionsPagination from './components/SubmissionsPagination.vue'
import SubmissionsTable from './components/SubmissionsTable.vue'
import { useSubmissionsView } from './useSubmissionsView'

const authStore = useAuthStore()

const { pagination, selectedIds, table, status, type, search, ...query } = useSubmissionsView()

const { isFetching, isPending, isError } = query
</script>
