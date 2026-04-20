<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'
import type { Submission } from '../../exports'
import { computed } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps<{ table: Table<Submission> }>()

const checked = computed(() => {
  if (props.table.getIsSomePageRowsSelected())
    return 'indeterminate'

  return props.table.getIsAllPageRowsSelected()
})
</script>

<template>
  <Checkbox
    :model-value="checked"
    @update:model-value="val => table.toggleAllPageRowsSelected(!!val)"
  />
</template>
