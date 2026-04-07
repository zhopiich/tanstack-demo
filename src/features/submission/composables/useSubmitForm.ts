import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { ZodError } from 'zod'
import type { SubmissionCreateForm } from '@/schemas/submission'
import { computed, ref, toValue } from 'vue'
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

interface Params<T> {
  id: MaybeRefOrGetter<string | undefined>
  form: T
  isCreatingNew: ComputedRef<boolean>
  onSuccess?: () => void | Promise<void>
}

export function useSubmitForm<T extends SubmissionCreateForm>(params: Params<T>) {
  const { id, form, isCreatingNew, onSuccess } = params

  const errors = ref<Record<string, string>>({})

  const { mutateAsync: createMutate, isPending: isCreating } = useCreateSubmission()
  const { mutateAsync: updateMutate, isPending: isUpdating } = useUpdateSubmission()
  const isPending = computed(() => isCreating.value || isUpdating.value)

  async function submit() {
    errors.value = {}
    try {
      const config = isCreatingNew.value
        ? { schema: SubmissionCreateFormSchema, mutate: (data: any) => createMutate(data) }
        : { schema: SubmissionUpdateFormSchema, mutate: (data: any) => updateMutate({ id: toValue(id)!, body: data }) }

      const result = config.schema.safeParse({ ...form })

      if (!result.success) {
        errors.value = flattenErrors(result.error)
        return
      }

      await config.mutate(result.data)
      await onSuccess?.()
    }
    catch {
      errors.value._root = 'Something went wrong. Please try again.'
    }
  }

  return { errors, isPending, submit }
}
