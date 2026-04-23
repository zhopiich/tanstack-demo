<template>
  <div class="py-8">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold mb-8">
        Submissions
      </h1>

      <NewSubmissionButton v-if="authStore.role === 'admin'" />
    </div>

    <div class="flex flex-col gap-2">
      <p v-if="isError">
        Failed to load submissions.
      </p>

      <template v-else>
        <div class="flex flex-col gap-2">
          <SubmissionsFilterBar />

          <SubmissionsTable :table :is-pending :is-fetching />

          <SubmissionsPagination
            v-if="pagination"
            :table
            :page="pagination.page"
            :total-pages="pagination.totalPages"
            :total="pagination.total"
          />

          <SubmissionBatchActionsBar
            v-if="selectedIds.length > 0"
            :selected-ids-length="selectedIds.length"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import NewSubmissionButton from './components/NewSubmissionButton.vue'
import SubmissionBatchActionsBar from './components/SubmissionBatchActionsBar'
import SubmissionsFilterBar from './components/SubmissionsFilterBar.vue'
import SubmissionsPagination from './components/SubmissionsPagination.vue'
import SubmissionsTable from './components/SubmissionsTable.vue'
import { useSubmissionsView } from './useSubmissionsView'

const authStore = useAuthStore()

const { pagination, selectedIds, table, ...query } = useSubmissionsView()

const { isFetching, isPending, isError } = query
</script>
