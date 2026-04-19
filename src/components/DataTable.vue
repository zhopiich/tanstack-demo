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
          <FlexRender
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
          <span v-if="header.column.getIsSorted() === 'asc'">↑</span>
          <span v-else-if="header.column.getIsSorted() === 'desc'">↓</span>
          <span v-else-if="header.column.getCanSort()">↕</span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
        <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
          <FlexRender
            :render="cell.column.columnDef.cell"
            :props="cell.getContext()"
          />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts" generic="TData">
import type { Table as TableInstance } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

defineProps<{ table: TableInstance<TData> }>()
</script>
