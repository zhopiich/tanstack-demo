<template>
  <template v-if="isSelectable">
    <span class="flex items-center gap-1">
      <Select :model-value="status" :disabled="isPending" @update:model-value="handleChange">
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="o in statusOptions" :key="o" :value="o">
            {{ o }}
          </SelectItem>
        </SelectContent>
      </Select>
      <span
        v-if="isError"
        title="Failed to update status. Please try again."
        style="cursor: help"
      >⚠</span>
    </span>
  </template>
  <span v-else class="inline-block h-8 leading-8">{{ status }}</span>
</template>

<script setup lang="ts">
import type { SubmissionStatus, SubmissionStatusUpdateBody } from '../../../schemas/submission'
import { computed } from 'vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth'
import { useUpdateSubmissionStatus } from '../../../mutations/useUpdateSubmissionStatus'

type SelectableStatus = SubmissionStatusUpdateBody['status']

const props = defineProps<{
  id: string
  status: SubmissionStatus
}>()

const authStore = useAuthStore()
const { mutate, isPending, isError } = useUpdateSubmissionStatus()

const statusOptions: SelectableStatus[] = ['pending', 'flagged']

const isSelectableStatus = (val: any): val is SelectableStatus => statusOptions.includes(val)

const isSelectable = computed(
  () => authStore.role === 'admin' && isSelectableStatus(props.status),
)

function handleChange(val: unknown) {
  if (!isSelectableStatus(val) || val === props.status) {
    return
  }
  mutate({ id: props.id, status: val })
}
</script>
