import type { ZodError } from 'zod'
import type { Content, SubmissionCreateForm, SubmissionType } from '@/schemas/submission'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSubmission } from '@/features/submission/queries/useSubmission'
import {
  useCreateSubmission,
  useUpdateSubmission,
} from '@/features/submission/queries/useSubmissionMutations'
import { SubmissionCreateFormSchema, SubmissionUpdateFormSchema } from '@/schemas/submission'

function flattenErrors(error: ZodError): Record<string, string> {
  const flat: Record<string, string> = {}
  error.issues.forEach((issue) => {
    const key = issue.path.join('.') || '_root'
    if (!flat[key])
      flat[key] = issue.message
  })
  return flat
}

export function useSubmissionForm(id?: string) {
  const router = useRouter()
  const isCreatingNew = computed(() => !id)

  const defaultContent: Record<SubmissionType, Content> = {
    article: { type: 'article', url: '', thumbnailUrl: null, wordCount: 1, readingTime: 1 },
    image: { type: 'image', url: '', thumbnailUrl: null, width: 1, height: 1 },
    video: { type: 'video', url: '', thumbnailUrl: null, duration: 1, resolution: '720p' },
    link: { type: 'link', url: '', thumbnailUrl: null, domain: '', isBehindPaywall: false },
  }

  const form = reactive<SubmissionCreateForm>({
    title: '',
    type: 'article',
    tags: [],
    content: { ...defaultContent.article },
  })

  const errors = ref<Record<string, string>>({})

  const { data: submissionData } = useSubmission(computed(() => id))
  watch(submissionData, (newData) => {
    if (!newData)
      return
    const s = newData
    Object.assign(form, {
      title: s.title,
      type: s.type,
      tags: [...s.tags],
      content: { ...s.content },
    })
  }, { immediate: true })

  watch(() => form.type, (newType) => {
    if (isCreatingNew.value) {
      form.content = { ...defaultContent[newType] }
    }
  })

  const { mutateAsync: createMutate, isPending: isCreating } = useCreateSubmission()
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateSubmission()
  const isPending = computed(() => isCreating.value || isUpdating.value)

  async function submit() {
    errors.value = {}
    try {
      const config = isCreatingNew.value
        ? { schema: SubmissionCreateFormSchema, mutate: (data: any) => createMutate(data) }
        : { schema: SubmissionUpdateFormSchema, mutate: (data: any) => updateMutate({ id: id!, body: data }) }

      const result = config.schema.safeParse({ ...form })

      if (!result.success) {
        errors.value = flattenErrors(result.error)
        return
      }

      await config.mutate(result.data)
      router.push('/submissions')
    }
    catch {
      errors.value._root = 'Something went wrong. Please try again.'
    }
  }

  return { form, errors, isPending, isCreatingNew, submit }
}
