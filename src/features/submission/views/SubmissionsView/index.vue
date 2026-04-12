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
import SubmissionBatchActionsBar from './components/SubmissionBatchActionsBar'
import SubmissionsPagination from './components/SubmissionsPagination.vue'
import SubmissionsTable from './components/SubmissionsTable.vue'
import { useSharedRowSelection } from './useRowSelection'
import { useSubmissionsQuery } from './useSubmissionsQuery'
import { useSubmissionsTable } from './useSubmissionsTable'

const { selectedIds, rowSelection } = useSharedRowSelection()

const { filters, submissions, paginationMeta, isFetching, isPending, isError } = useSubmissionsQuery()

const { table } = useSubmissionsTable({ submissions, paginationMeta, filters, rowSelection })
</script>
