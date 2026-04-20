<template>
  <div class="max-w-xl mx-auto py-8 space-y-6">
    <h1 class="text-2xl font-bold">
      {{ isCreatingNew ? 'New Submission' : 'Edit Submission' }}
    </h1>

    <p v-if="errors._root" class="text-sm text-destructive">
      {{ errors._root }}
    </p>

    <form @submit.prevent="submit">
      <FieldGroup>
        <Field>
          <FieldLabel for="title">
            Title
          </FieldLabel>
          <Input id="title" v-model="form.title" type="text" />
          <FieldError :errors="[errors.title]" />
        </Field>

        <Field v-if="isCreatingNew">
          <FieldLabel for="type">
            Type
          </FieldLabel>
          <Select id="type" v-model="form.type">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">
                Article
              </SelectItem>
              <SelectItem value="image">
                Image
              </SelectItem>
              <SelectItem value="video">
                Video
              </SelectItem>
              <SelectItem value="link">
                Link
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel for="tags">
            Tags (comma-separated)
          </FieldLabel>
          <Input id="tags" v-model="tagsInput" type="text" />
          <FieldError :errors="[errors.tags]" />
        </Field>

        <FieldSet>
          <FieldLegend>Content</FieldLegend>
          <FieldGroup>
            <Field>
              <FieldLabel for="url">
                URL
              </FieldLabel>
              <Input id="url" v-model="form.content.url" type="url" />
              <FieldError :errors="[errors['content.url']]" />
            </Field>

            <Field>
              <FieldLabel for="thumbnailUrl">
                Thumbnail URL (optional)
              </FieldLabel>
              <Input id="thumbnailUrl" v-model="thumbnailUrl" type="url" />
              <FieldError :errors="[errors['content.thumbnailUrl']]" />
            </Field>

            <template v-if="form.content.type === 'article'">
              <Field>
                <FieldLabel for="wordCount">
                  Word Count
                </FieldLabel>
                <Input id="wordCount" v-model.number="form.content.wordCount" type="number" min="1" />
                <FieldError :errors="[errors['content.wordCount']]" />
              </Field>
              <Field>
                <FieldLabel for="readingTime">
                  Reading Time (min)
                </FieldLabel>
                <Input id="readingTime" v-model.number="form.content.readingTime" type="number" min="1" />
                <FieldError :errors="[errors['content.readingTime']]" />
              </Field>
            </template>

            <template v-else-if="form.content.type === 'image'">
              <Field>
                <FieldLabel for="width">
                  Width (px)
                </FieldLabel>
                <Input id="width" v-model.number="form.content.width" type="number" min="1" />
                <FieldError :errors="[errors['content.width']]" />
              </Field>
              <Field>
                <FieldLabel for="height">
                  Height (px)
                </FieldLabel>
                <Input id="height" v-model.number="form.content.height" type="number" min="1" />
                <FieldError :errors="[errors['content.height']]" />
              </Field>
            </template>

            <template v-else-if="form.content.type === 'video'">
              <Field>
                <FieldLabel for="duration">
                  Duration (sec)
                </FieldLabel>
                <Input id="duration" v-model.number="form.content.duration" type="number" min="1" />
                <FieldError :errors="[errors['content.duration']]" />
              </Field>
              <Field>
                <FieldLabel for="resolution">
                  Resolution
                </FieldLabel>
                <Select id="resolution" v-model="form.content.resolution">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="480p">
                      480p
                    </SelectItem>
                    <SelectItem value="720p">
                      720p
                    </SelectItem>
                    <SelectItem value="1080p">
                      1080p
                    </SelectItem>
                    <SelectItem value="4k">
                      4K
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </template>

            <template v-else-if="form.content.type === 'link'">
              <Field>
                <FieldLabel for="domain">
                  Domain
                </FieldLabel>
                <Input id="domain" v-model="form.content.domain" type="text" />
                <FieldError :errors="[errors['content.domain']]" />
              </Field>
              <Field orientation="horizontal">
                <Checkbox v-model="form.content.isBehindPaywall" />
                <FieldLabel>Behind Paywall</FieldLabel>
              </Field>
            </template>
          </FieldGroup>
        </FieldSet>

        <Field v-if="isCreatingNew">
          <FieldLabel for="submitterEmail">
            Submitter Email (optional)
          </FieldLabel>
          <Input id="submitterEmail" v-model="form.submitterEmail" type="email" />
          <FieldError :errors="[errors.submitterEmail]" />
        </Field>

        <Button type="submit" :disabled="isPending">
          {{ isPending ? 'Saving…' : isCreatingNew ? 'Create' : 'Save Changes' }}
        </Button>
      </FieldGroup>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const thumbnailUrl = computed({
  get: () => form.content.thumbnailUrl ?? '',
  set: (val: string) => { form.content.thumbnailUrl = val || null },
})
</script>
