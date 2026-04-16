<template>
  <div class="pagination">
    <span>Total: {{ total }}</span>

    <select
      :value="table.getState().pagination.pageSize"
      @change="table.setPageSize(Number(($event.target as HTMLSelectElement).value))"
    >
      <option v-for="size in pageSizeOptions" :key="size" :value="size">
        {{ size }} / page
      </option>
    </select>

    <span>
      <button :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
        Prev
      </button>
      <span>Page {{ page }} / {{ totalPages }}</span>
      <button :disabled="!table.getCanNextPage()" @click="table.nextPage()">
        Next
      </button>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Submission } from '../../../schemas/submission'

defineProps<{
  table: Table<Submission>
  page: number
  totalPages: number
  total: number
}>()

const pageSizeOptions = [5, 10, 20, 50, 100]
</script>

<style>
.pagination > *:not(:last-child) {
  margin-right: 1rem;
}
</style>
