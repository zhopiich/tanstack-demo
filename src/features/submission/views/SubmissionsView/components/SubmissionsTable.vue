<template>
  <DataTable :table="table" />
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { components } from '@/api/schema'
import DataTable from '@/components/DataTable.vue'

type Submission = components['schemas']['Submission']

defineProps<{
  table: Table<Submission>
}>()
</script>
