<template>
  <table>
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
</template>

<script setup lang="ts" generic="TData">
import type { Table } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'

defineProps<{ table: Table<TData> }>()
</script>
