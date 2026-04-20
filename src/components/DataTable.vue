<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead
          v-for="header in table.getFlatHeaders()"
          :key="header.id"
          :class="header.column.getCanSort() ? 'cursor-pointer select-none' : ''"
          @click="header.column.getToggleSortingHandler()?.($event)"
        >
          <span class="flex items-center gap-1">
            <FlexRender
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
            <template v-if="header.column.getCanSort()">
              <ArrowUp v-if="header.column.getIsSorted() === 'asc'" class="size-4" />
              <ArrowDown v-else-if="header.column.getIsSorted() === 'desc'" class="size-4" />
              <ArrowUpDown v-else class="size-4 opacity-30" />
            </template>
          </span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableSkeleton :table :is-fetching :is-pending :no-skeleton-columns>
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </TableCell>
        </TableRow>
      </TableSkeleton>
    </TableBody>
  </Table>
</template>

<script setup lang="ts" generic="TData">
import type { Table as TableInstance } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-vue-next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import TableSkeleton from './TableSkeleton.vue'

defineProps<{
  table: TableInstance<TData>
  isPending?: boolean
  isFetching?: boolean
  noSkeletonColumns?: string[]
}>()
</script>
