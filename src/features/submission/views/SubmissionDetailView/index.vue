<template>
  <div>
    <p v-if="isError">
      Failed to load submission.
    </p>

    <template v-else-if="isPending && !submission">
      <p>Loading…</p>
    </template>

    <template v-else-if="submission">
      <div>
        <h1>{{ submission.title }}</h1>
        <p>{{ submission.type }}</p>
        <p>{{ submission.status }}</p>
      </div>

      <section>
        <h2>Details</h2>
        <p>Submitter: {{ submission.submitter.name }}</p>
        <p>Score: {{ submission.score }}</p>
        <p>Flags: {{ submission.flagCount }}</p>
        <p>Tags: {{ submission.tags.join(', ') || '—' }}</p>
        <p>Created: {{ new Date(submission.createdAt).toLocaleString() }}</p>
        <p>Updated: {{ new Date(submission.updatedAt).toLocaleString() }}</p>
      </section>

      <section>
        <h2>Content</h2>
        <p>URL: {{ submission.content.url }}</p>
        <p v-if="submission.content.thumbnailUrl">
          Thumbnail: {{ submission.content.thumbnailUrl }}
        </p>

        <template v-if="submission.content.type === 'article'">
          <p>Word Count: {{ submission.content.wordCount }}</p>
          <p>Reading Time: {{ submission.content.readingTime }} min</p>
        </template>

        <template v-else-if="submission.content.type === 'image'">
          <p>Dimensions: {{ submission.content.width }} × {{ submission.content.height }}</p>
        </template>

        <template v-else-if="submission.content.type === 'video'">
          <p>Duration: {{ submission.content.duration }}s</p>
          <p>Resolution: {{ submission.content.resolution }}</p>
        </template>

        <template v-else-if="submission.content.type === 'link'">
          <p>Domain: {{ submission.content.domain }}</p>
          <p>Paywall: {{ submission.content.isBehindPaywall ? 'Yes' : 'No' }}</p>
        </template>
      </section>

      <section v-if="submission.review">
        <h2>Review</h2>
        <p>Verdict: {{ submission.review.verdict }}</p>
        <p>Reason: {{ submission.review.reason }}</p>
        <p>Reviewed: {{ new Date(submission.review.reviewedAt).toLocaleString() }}</p>
      </section>

      <div>
        <router-link :to="`/submissions/${submission.id}/edit`">
          Edit
        </router-link>
        <button :disabled="isDeleting" @click="handleDelete">
          {{ isDeleting ? 'Deleting…' : 'Delete' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSubmission } from '../../queries/useSubmission'
import { useDeleteSubmission } from '../../queries/useSubmissionMutations'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string | undefined)

const { data: submission, isPending, isError } = useSubmission(id)

const { mutate: deleteSubmission, isPending: isDeleting } = useDeleteSubmission()

function handleDelete() {
  if (!submission.value)
    return
  deleteSubmission(submission.value.id, {
    onSuccess: () => router.push({ name: 'submissions' }),
  })
}
</script>
