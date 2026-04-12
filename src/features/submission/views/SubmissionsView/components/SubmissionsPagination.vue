<template>
  <div>
    <button :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
      Prev
    </button>
    <span>Page {{ page }} / {{ totalPages }}</span>
    <button :disabled="!table.getCanNextPage()" @click="table.nextPage()">
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Submission } from '../../../schemas/submission'

defineProps<{
  table: Table<Submission>
  page: number
  totalPages: number
}>()
</script>
