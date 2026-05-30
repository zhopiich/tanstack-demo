import type { MaybeRefOrGetter } from 'vue'
import type { Submission, SubmissionCreateForm } from '../../schemas/submission'
import { toRaw, toValue, watch } from 'vue'
import { useSubmission } from '../../queries/useSubmission'

function assignForm<T extends Record<string, any>, U extends Omit<T, 'submitterEmail'>>(form: T, data: U) {
  const _form = form as Record<string, any>
  Object.keys(_form).forEach((key) => {
    const plainValue = toValue(data[key])
    if (plainValue != null) {
      _form[key] = (typeof plainValue === 'object')
        ? structuredClone(toRaw(plainValue))
        : plainValue
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
