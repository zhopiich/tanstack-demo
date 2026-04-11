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

      <table v-if="!isPending">
        <thead>
          <tr>
            <th
              v-for="header in table.getFlatHeaders()"
              :key="header.id"
              :style="header.column.getCanSort() ? 'cursor: pointer; user-select: none;' : ''"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <span v-if="header.column.getIsSorted() === 'asc'">↑</span>
              <span v-else-if="header.column.getIsSorted() === 'desc'">↓</span>
              <span v-else-if="header.column.getCanSort()">↕</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in table.getRowModel().rows" :key="row.id">
            <td v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </tbody>
      </table>

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
import { FlexRender } from '@tanstack/vue-table'
import { ref } from 'vue'
import { useBatchDelete, useBatchReview } from '../../queries/useSubmissionMutations'
import { BatchReviewFormSchema } from '../../schemas/submission'
import { useSubmissionRowSelection } from './useSubmissionRowSelection'
import { useSubmissionsQuery } from './useSubmissionsQuery'
import { useSubmissionsTable } from './useSubmissionsTable'

const batchReviewVerdict = ref<'approve' | 'reject' | null>(null)
const reason = ref('')
const reasonError = ref('')

function cancelBatchReview() {
  batchReviewVerdict.value = null
  reason.value = ''
  reasonError.value = ''
}

const { rowSelection, selectedIds, resetOnSuccess } = useSubmissionRowSelection(cancelBatchReview)

const { mutate: batchReview, isPending: isBatchReviewing } = useBatchReview()
const { mutate: batchDelete, isPending: isBatchDeleting } = useBatchDelete()

function handleBatchReview() {
  reasonError.value = ''
  const result = BatchReviewFormSchema.shape.reason.safeParse(reason.value)
  if (!result.success) {
    reasonError.value = result.error.issues[0]?.message ?? 'Invalid reason'
    return
  }
  batchReview(
    { ids: selectedIds.value, verdict: batchReviewVerdict.value === 'approve' ? 'approved' : 'rejected', reason: reason.value },
    { onSuccess: () => {
      resetOnSuccess(() => {
        rowSelection.value = {}
        batchReviewVerdict.value = null
        reason.value = ''
      })
    } },
  )
}

// TODO: confirm with modal
function handleBatchDelete() {
  batchDelete(
    { ids: selectedIds.value },
    { onSuccess: () => {
      resetOnSuccess(() => rowSelection.value = {})
    } },
  )
}

const { filters, submissions, paginationMeta, isFetching, isPending, isError } = useSubmissionsQuery()
const { table } = useSubmissionsTable({ submissions, paginationMeta, filters, rowSelection })
</script>
