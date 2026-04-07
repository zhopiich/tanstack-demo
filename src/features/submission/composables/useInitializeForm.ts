import type { MaybeRefOrGetter } from 'vue'
import type { Submission, SubmissionCreateForm } from '@/schemas/submission'
import { watch } from 'vue'
import { useSubmission } from '@/features/submission/queries/useSubmission'

function assignForm<T extends Record<string, any>, U extends T>(form: T, data: U) {
  const _form = form as Record<string, any>
  Object.keys(_form).forEach((key) => {
    if (data[key] != null) {
      _form[key] = data[key]
    }
  })
}

interface Params<T> {
  id: MaybeRefOrGetter<string | undefined>
  form: T
  defaultForm: T
}

export function useInitializeForm(params: Params<SubmissionCreateForm>) {
  const { id, form, defaultForm } = params

  const { data: submissionData } = useSubmission(id)

  function resetForm() {
    assignForm(form, defaultForm)
  }

  function syncForm(data: Submission | undefined) {
    if (!data) {
      resetForm()
      return
    }
    assignForm(form, data)
  }

  watch(submissionData, (newData) => {
    syncForm(newData)
  }, { immediate: true })

  return { resetForm, syncForm }
}
