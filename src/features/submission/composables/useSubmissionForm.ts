import type { MaybeRefOrGetter } from 'vue'
import type { Content, SubmissionCreateForm } from '../schemas/submission'
import type { SubmissionType } from '@/schemas/submission'
import { computed, reactive, toValue, watch } from 'vue'
import { useInitializeForm } from './useInitializeForm'
import { useSubmitForm } from './useSubmitForm'

const defaultContent: Record<SubmissionType, Content> = {
  article: { type: 'article', url: '', thumbnailUrl: null, wordCount: 1, readingTime: 1 },
  image: { type: 'image', url: '', thumbnailUrl: null, width: 1, height: 1 },
  video: { type: 'video', url: '', thumbnailUrl: null, duration: 1, resolution: '720p' },
  link: { type: 'link', url: '', thumbnailUrl: null, domain: '', isBehindPaywall: false },
}

const defaultForm: SubmissionCreateForm = {
  title: '',
  type: 'article',
  tags: [],
  content: { ...defaultContent.article },
}

interface Params {
  id: MaybeRefOrGetter<string | undefined>
  onSuccess?: () => void | Promise<void>
}

export function useSubmissionForm(params: Params) {
  const { id, onSuccess } = params

  const isCreatingNew = computed(() => !toValue(id))

  const form = reactive(structuredClone(defaultForm))

  useInitializeForm({ id, form, defaultForm })
  const { errors, isPending, submit } = useSubmitForm({ id, form, isCreatingNew, onSuccess })

  watch(() => form.type, (newType) => {
    if (isCreatingNew.value) {
      form.content = { ...defaultContent[newType] }
    }
  })

  return { form, isCreatingNew, errors, isPending, submit }
}
