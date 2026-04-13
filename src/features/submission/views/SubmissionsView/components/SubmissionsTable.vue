<template>
  <DataTable :table="table" />
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Submission } from '../../../schemas/submission'
import DataTable from '@/components/DataTable.vue'

defineProps<{ table: Table<Submission> }>()
</script>
