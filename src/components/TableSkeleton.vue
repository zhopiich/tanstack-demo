<template>
  <tr v-if="isFetching && !isPending">
    <td :colspan="table.getVisibleLeafColumns().length" class="p-0 h-0 relative border-0">
      <IndeterminateProgressBar />
    </td>
  </tr>

  <template v-if="isPending">
    <TableRow v-for="i in 3" :key="i">
      <TableCell v-for="col in table.getVisibleLeafColumns()" :key="col.id">
        <Skeleton v-if="!noSkeletonColumns?.includes(col.id)" class="h-4" :style="{ width: `${100 - 25 * (i - 1)}%` }" />
      </TableCell>
    </TableRow>
  </template>

  <template v-else>
    <slot />
  </template>
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import IndeterminateProgressBar from './IndeterminateProgressBar.vue'

defineProps<{
  table: Table<TData>
  isPending?: boolean
  isFetching?: boolean
  noSkeletonColumns?: string[]
}>()
</script>
