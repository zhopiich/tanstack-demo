<template>
  <div>
    <span>{{ selectedIdsLength }} selected</span>

    <template v-if="verdict === null">
      <button @click="verdict = 'approve'">
        Approve
      </button>
      <button @click="verdict = 'reject'">
        Reject
      </button>
      <button v-if="authStore.role === 'admin'" :disabled="isDeleting" @click="actions.handleBatchDelete">
        Delete
      </button>
    </template>

    <template v-else>
      <input
        v-model="reason"
        type="text"
        placeholder="Reason (min 10 characters)"
      >
      <p v-if="reasonError">
        {{ reasonError }}
      </p>
      <button :disabled="isReviewing" @click="actions.handleBatchReview">
        {{ isReviewing ? 'Submitting…' : `Confirm ${verdict}` }}
      </button>
      <button @click="cancelReview">
        Cancel
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSubmissionBatchActions } from './useSubmissionBatchActions'

defineProps<{ selectedIdsLength: number }>()

const authStore = useAuthStore()

const verdict = ref<'approve' | 'reject' | null>(null)
const reason = ref('')

function resetVerdictAndReason() {
  verdict.value = null
  reason.value = ''
}

const { reasonError, isReviewing, isDeleting, ...actions }
  = useSubmissionBatchActions(
    verdict,
    reason,
    { onReviewSuccess: resetVerdictAndReason },
  )

function cancelReview() {
  resetVerdictAndReason()
  actions.resetReasonError()
}
</script>
