<template>
  <div class="grid grid-cols-3 items-center text-sm">
    <span class="text-muted-foreground">Total: {{ total }}</span>

    <div class="flex justify-center items-center gap-2">
      <Select
        :model-value="String(table.getState().pagination.pageSize)"
        @update:model-value="val => table.setPageSize(Number(val))"
      >
        <SelectTrigger class="min-w-20" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="size in pageSizeOptions" :key="size" :value="String(size)">
            {{ size }}
          </SelectItem>
        </SelectContent>
      </Select>
      <span class="text-muted-foreground">per page</span>
    </div>

    <div class="flex justify-end items-center gap-2">
      <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
        Prev
      </Button>
      <span class="text-muted-foreground">{{ page }} / {{ totalPages }}</span>
      <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
        Next
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Submission } from '../../../schemas/submission'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

defineProps<{
  table: Table<Submission>
  page: number
  totalPages: number
  total: number
}>()

const pageSizeOptions = [5, 10, 20, 50, 100]
</script>
