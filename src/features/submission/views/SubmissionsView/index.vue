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

      <div v-if="selectedIds.length > 0">
        <span>{{ selectedIds.length }} selected</span>

        <template v-if="batchReviewVerdict === null">
          <button @click="batchReviewVerdict = 'approve'">
            Approve
          </button>
          <button @click="batchReviewVerdict = 'reject'">
            Reject
          </button>
          <button :disabled="isBatchDeleting" @click="handleBatchDelete">
            Delete
          </button>
        </template>

        <template v-else>
          <input
            v-model="reason"
            type="text"
            placeholder="Reason (min 10 characters)"
          >
          <p v-if="reasonError">
            {{ reasonError }}
          </p>
          <button :disabled="isBatchReviewing" @click="handleBatchReview">
            {{ isBatchReviewing ? 'Submitting…' : `Confirm ${batchReviewVerdict}` }}
          </button>
          <button @click="cancelBatchReview">
            Cancel
          </button>
        </template>
      </div>

      <SubmissionsTable v-if="!isPending" :table="table" />

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
import SubmissionsTable from './components/SubmissionsTable.vue'
import { useSubmissionBatchActions } from './useSubmissionBatchActions'
import { useSubmissionsQuery } from './useSubmissionsQuery'
import { useSubmissionsTable } from './useSubmissionsTable'

const {
  rowSelection,
  selectedIds,
  batchReviewVerdict,
  reason,
  reasonError,
  isBatchReviewing,
  isBatchDeleting,
  handleBatchReview,
  handleBatchDelete,
  cancelBatchReview,
} = useSubmissionBatchActions()

const { filters, submissions, paginationMeta, isFetching, isPending, isError } = useSubmissionsQuery()

const { table } = useSubmissionsTable({ submissions, paginationMeta, filters, rowSelection })
</script>
