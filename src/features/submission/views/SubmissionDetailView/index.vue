<template>
  <div class="max-w-2xl mx-auto py-8 space-y-4">
    <p v-if="isError" class="text-sm text-destructive">
      Failed to load submission.
    </p>

    <p v-else-if="isPending && !submission" class="text-sm text-muted-foreground">
      Loading…
    </p>

    <template v-else-if="submission">
      <Card>
        <CardHeader>
          <CardTitle>{{ submission.title }}</CardTitle>
          <div class="flex gap-2 text-sm text-muted-foreground">
            <span>{{ submission.type }}</span>
            <span>·</span>
            <span>{{ submission.status }}</span>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt class="text-muted-foreground">
              Submitter
            </dt>
            <dd>{{ submission.submitter.name }}</dd>
            <dt class="text-muted-foreground">
              Score
            </dt>
            <dd>{{ submission.score }}</dd>
            <dt class="text-muted-foreground">
              Flags
            </dt>
            <dd>{{ submission.flagCount }}</dd>
            <dt class="text-muted-foreground">
              Tags
            </dt>
            <dd>{{ submission.tags.join(', ') || '—' }}</dd>
            <dt class="text-muted-foreground">
              Created
            </dt>
            <dd>{{ new Date(submission.createdAt).toLocaleString() }}</dd>
            <dt class="text-muted-foreground">
              Updated
            </dt>
            <dd>{{ new Date(submission.updatedAt).toLocaleString() }}</dd>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt class="text-muted-foreground">
              URL
            </dt>
            <dd class="truncate">
              {{ submission.content.url }}
            </dd>
            <template v-if="submission.content.thumbnailUrl">
              <dt class="text-muted-foreground">
                Thumbnail
              </dt>
              <dd class="truncate">
                {{ submission.content.thumbnailUrl }}
              </dd>
            </template>

            <template v-if="submission.content.type === 'article'">
              <dt class="text-muted-foreground">
                Word Count
              </dt>
              <dd>{{ submission.content.wordCount }}</dd>
              <dt class="text-muted-foreground">
                Reading Time
              </dt>
              <dd>{{ submission.content.readingTime }} min</dd>
            </template>

            <template v-else-if="submission.content.type === 'image'">
              <dt class="text-muted-foreground">
                Dimensions
              </dt>
              <dd>{{ submission.content.width }} × {{ submission.content.height }}</dd>
            </template>

            <template v-else-if="submission.content.type === 'video'">
              <dt class="text-muted-foreground">
                Duration
              </dt>
              <dd>{{ submission.content.duration }}s</dd>
              <dt class="text-muted-foreground">
                Resolution
              </dt>
              <dd>{{ submission.content.resolution }}</dd>
            </template>

            <template v-else-if="submission.content.type === 'link'">
              <dt class="text-muted-foreground">
                Domain
              </dt>
              <dd>{{ submission.content.domain }}</dd>
              <dt class="text-muted-foreground">
                Paywall
              </dt>
              <dd>{{ submission.content.isBehindPaywall ? 'Yes' : 'No' }}</dd>
            </template>
          </dl>
        </CardContent>
      </Card>

      <Card v-if="submission.review">
        <CardHeader>
          <CardTitle>Review</CardTitle>
        </CardHeader>
        <CardContent>
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
            <dt class="text-muted-foreground">
              Verdict
            </dt>
            <dd>{{ submission.review.verdict }}</dd>
            <dt class="text-muted-foreground">
              Reason
            </dt>
            <dd>{{ submission.review.reason }}</dd>
            <dt class="text-muted-foreground">
              Reviewer
            </dt>
            <dd>{{ submission.review.reviewer.name }} ({{ submission.review.reviewer.email }})</dd>
            <dt class="text-muted-foreground">
              Reviewed
            </dt>
            <dd>{{ new Date(submission.review.reviewedAt).toLocaleString() }}</dd>
          </dl>
        </CardContent>
      </Card>

      <div v-if="authStore.role === 'admin'" class="flex gap-2">
        <Button as-child variant="outline">
          <RouterLink :to="`/submissions/${submission.id}/edit`">
            Edit
          </RouterLink>
        </Button>
        <Button variant="destructive" :disabled="isDeleting" @click="handleDelete">
          {{ isDeleting ? 'Deleting…' : 'Delete' }}
        </Button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'
import { useSubmission } from '../../queries/useSubmission'
import { useDeleteSubmission } from '../../queries/useSubmissionMutations'

const authStore = useAuthStore()

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
