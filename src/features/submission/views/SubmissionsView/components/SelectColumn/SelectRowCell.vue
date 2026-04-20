<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Submission } from '../../exports'
import { Checkbox } from '@/components/ui/checkbox'

defineProps<{ row: Row<Submission> }>()
</script>

<template>
  <Checkbox
    :model-value="row.getIsSelected()"
    :disabled="!row.getCanSelect()"
    @update:model-value="val => row.toggleSelected(!!val)"
  />
</template>
