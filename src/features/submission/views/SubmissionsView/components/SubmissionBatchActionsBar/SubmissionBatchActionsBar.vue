<template>
  <div class="flex flex-col gap-2 mt-1">
    <Textarea v-if="verdict != null" v-model="reason" placeholder="Reason (min 10 characters)" />

    <div class="flex items-center gap-1">
      <span class="text-sm text-muted-foreground mr-auto">{{ selectedIdsLength }} selected</span>

      <template v-if="verdict === null">
        <Button variant="outline" @click="verdict = 'approve'">
          Approve
        </Button>
        <Button variant="outline" @click="verdict = 'reject'">
          Reject
        </Button>
        <Button v-if="authStore.role === 'admin'" :disabled="isDeleting" @click="confirmOpen = true">
          Delete
        </Button>
      </template>

      <template v-else>
        <p v-if="reasonError" class="text-sm text-destructive">
          {{ reasonError }}
        </p>
        <Button variant="outline" @click="cancelReview">
          Cancel
        </Button>
        <Button :disabled="isReviewing" @click="actions.handleBatchReview">
          {{ isReviewing ? 'Submitting…' : `Confirm ${verdict}` }}
        </Button>
      </template>
    </div>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Delete submissions?"
      :description="`${selectedIdsLength} submission${selectedIdsLength > 1 ? 's' : ''} will be permanently deleted.`"
      @confirm="actions.handleBatchDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/stores/auth'
import { useSubmissionBatchActions } from './useSubmissionBatchActions'

defineProps<{ selectedIdsLength: number }>()

const authStore = useAuthStore()

const confirmOpen = ref(false)

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
