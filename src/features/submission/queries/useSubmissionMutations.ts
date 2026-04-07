import type { SubmissionCreateForm, SubmissionUpdateForm } from '@/schemas/submission'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiClient } from '@/api/client'
import { submissionKeys } from './keys'

export function useCreateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: SubmissionCreateForm) => {
      const { data, error } = await apiClient.POST('/submissions', { body })
      if (error)
        throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() })
    },
  })
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, body }: { id: string, body: SubmissionUpdateForm }) => {
      const { data, error } = await apiClient.PATCH('/submissions/{id}', {
        params: { path: { id } },
        body,
      })
      if (error)
        throw error
      return data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: submissionKeys.detail(id) })
    },
  })
}
