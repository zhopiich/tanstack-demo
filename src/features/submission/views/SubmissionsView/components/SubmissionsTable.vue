<template>
  <div class="overflow-hidden rounded-md border">
    <DataTable :table :is-pending :is-fetching :no-skeleton-columns />
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Submission } from '../../../schemas/submission'
import DataTable from '@/components/DataTable.vue'

defineProps<{
  table: Table<Submission>
  isPending?: boolean
  isFetching?: boolean
}>()

const noSkeletonColumns = ['select', 'actions']
</script>
