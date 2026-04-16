import type { BatchDeleteForm, BatchReviewForm, SubmissionCreateForm, SubmissionUpdateForm } from '../schemas/submission'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiClient } from '@/api/client'
import { dashboardKeys } from '@/queryKeys/dashboard'
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
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
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

export function useDeleteSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await apiClient.DELETE('/submissions/{id}', {
        params: { path: { id } },
      })
      if (error)
        throw error
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() })
      queryClient.removeQueries({ queryKey: submissionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}

export function useBatchReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: BatchReviewForm) => {
      const { data, error } = await apiClient.POST('/submissions/batch-review', { body })
      if (error)
        throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}

export function useBatchDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: BatchDeleteForm) => {
      const { data, error } = await apiClient.POST('/submissions/batch-delete', { body })
      if (error)
        throw error
      return data
    },
    onSuccess: (_, { ids }) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() })
      for (const id of ids) {
        queryClient.removeQueries({ queryKey: submissionKeys.detail(id) })
      }
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}
