<template>
  <div>
    <h1>{{ isCreatingNew ? 'New Submission' : 'Edit Submission' }}</h1>

    <p v-if="errors._root">
      {{ errors._root }}
    </p>

    <form @submit.prevent="submit">
      <div>
        <label for="title">Title</label>
        <input id="title" v-model="form.title" type="text">
        <p v-if="errors.title">
          {{ errors.title }}
        </p>
      </div>

      <div v-if="isCreatingNew">
        <label for="type">Type</label>
        <select id="type" v-model="form.type">
          <option value="article">
            Article
          </option>
          <option value="image">
            Image
          </option>
          <option value="video">
            Video
          </option>
          <option value="link">
            Link
          </option>
        </select>
      </div>

      <div>
        <label for="tags">Tags (comma-separated)</label>
        <input id="tags" v-model="tagsInput" type="text">
        <p v-if="errors.tags">
          {{ errors.tags }}
        </p>
      </div>

      <fieldset>
        <legend>Content</legend>

        <div>
          <label for="url">URL</label>
          <input id="url" v-model="form.content.url" type="url">
          <p v-if="errors['content.url']">
            {{ errors['content.url'] }}
          </p>
        </div>

        <div>
          <label for="thumbnailUrl">Thumbnail URL (optional)</label>
          <input id="thumbnailUrl" v-model="form.content.thumbnailUrl" type="url">
          <p v-if="errors['content.thumbnailUrl']">
            {{ errors['content.thumbnailUrl'] }}
          </p>
        </div>

        <template v-if="form.content.type === 'article'">
          <div>
            <label for="wordCount">Word Count</label>
            <input id="wordCount" v-model.number="form.content.wordCount" type="number" min="1">
            <p v-if="errors['content.wordCount']">
              {{ errors['content.wordCount'] }}
            </p>
          </div>
          <div>
            <label for="readingTime">Reading Time (min)</label>
            <input id="readingTime" v-model.number="form.content.readingTime" type="number" min="1">
            <p v-if="errors['content.readingTime']">
              {{ errors['content.readingTime'] }}
            </p>
          </div>
        </template>

        <template v-else-if="form.content.type === 'image'">
          <div>
            <label for="width">Width (px)</label>
            <input id="width" v-model.number="form.content.width" type="number" min="1">
            <p v-if="errors['content.width']">
              {{ errors['content.width'] }}
            </p>
          </div>
          <div>
            <label for="height">Height (px)</label>
            <input id="height" v-model.number="form.content.height" type="number" min="1">
            <p v-if="errors['content.height']">
              {{ errors['content.height'] }}
            </p>
          </div>
        </template>

        <template v-else-if="form.content.type === 'video'">
          <div>
            <label for="duration">Duration (sec)</label>
            <input id="duration" v-model.number="form.content.duration" type="number" min="1">
            <p v-if="errors['content.duration']">
              {{ errors['content.duration'] }}
            </p>
          </div>
          <div>
            <label for="resolution">Resolution</label>
            <select id="resolution" v-model="form.content.resolution">
              <option value="480p">
                480p
              </option>
              <option value="720p">
                720p
              </option>
              <option value="1080p">
                1080p
              </option>
              <option value="4k">
                4K
              </option>
            </select>
          </div>
        </template>

        <template v-else-if="form.content.type === 'link'">
          <div>
            <label for="domain">Domain</label>
            <input id="domain" v-model="form.content.domain" type="text">
            <p v-if="errors['content.domain']">
              {{ errors['content.domain'] }}
            </p>
          </div>
          <div>
            <label>
              <input v-model="form.content.isBehindPaywall" type="checkbox">
              Behind Paywall
            </label>
          </div>
        </template>
      </fieldset>

      <button type="submit" :disabled="isPending">
        {{ isPending ? 'Saving…' : isCreatingNew ? 'Create' : 'Save Changes' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSubmissionForm } from './useSubmissionForm'

const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id as string | undefined)

async function onSuccess(): Promise<void> {
  await router.push({ name: 'submissions' })
}

const { form, errors, isPending, isCreatingNew, submit } = useSubmissionForm({ id, onSuccess })

const tagsInput = computed({
  get: () => form.tags.join(', '),
  set: (val: string) => {
    form.tags = val.split(',').map(t => t.trim()).filter(Boolean)
  },
})
</script>
