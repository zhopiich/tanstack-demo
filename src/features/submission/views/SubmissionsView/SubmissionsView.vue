<template>
  <div class="w-full max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold mb-8">
        Submissions
      </h1>

      <div v-if="authStore.role === 'admin'">
        <Button as-child variant="outline" size="sm">
          <RouterLink to="/submissions/new">
            <Plus class="size-4" />
            New Submission
          </RouterLink>
        </Button>
      </div>
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
import { Plus } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import SubmissionBatchActionsBar from './components/SubmissionBatchActionsBar'
import SubmissionsFilterBar from './components/SubmissionsFilterBar.vue'
import SubmissionsPagination from './components/SubmissionsPagination.vue'
import SubmissionsTable from './components/SubmissionsTable.vue'
import { useSubmissionsView } from './useSubmissionsView'

const authStore = useAuthStore()

const { pagination, selectedIds, table, ...query } = useSubmissionsView()

const { isFetching, isPending, isError } = query
</script>
