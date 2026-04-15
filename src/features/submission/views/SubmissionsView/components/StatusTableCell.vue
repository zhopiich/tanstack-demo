<template>
  <select v-if="isSelectable" :value="status" @change="handleChange">
    <option v-for="o in statusOptions" :key="o" :value="o">
      {{ o }}
    </option>
  </select>
  <span v-else>{{ status }}</span>
</template>

<script setup lang="ts">
import type { SubmissionStatus, SubmissionStatusUpdateBody } from '../../../schemas/submission'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUpdateSubmissionStatus } from '../../../mutations/useUpdateSubmissionStatus'

type SelectableStatus = SubmissionStatusUpdateBody['status']

const props = defineProps<{
  id: string
  status: SubmissionStatus
}>()

const authStore = useAuthStore()
const { mutate } = useUpdateSubmissionStatus()

const statusOptions: SelectableStatus[] = ['pending', 'flagged']

const isSelectableStatus = (val: any): val is SelectableStatus => statusOptions.includes(val)

const isSelectable = computed(
  () => authStore.role === 'admin' && isSelectableStatus(props.status),
)

function handleChange(e: Event) {
  if (!(e.target instanceof HTMLSelectElement))
    return
  const newStatus = e.target.value
  if (!isSelectableStatus(newStatus))
    return
  if (newStatus !== props.status) {
    mutate({ id: props.id, status: newStatus })
  }
}
</script>
