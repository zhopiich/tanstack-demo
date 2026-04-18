import type {
  SubmissionStatusUpdateBody as StatusUpdateBody,
  Submission,
} from '../schemas/submission'
import type { ApiResponse } from '@/types/api'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { apiClient } from '@/api/client'
import { dashboardKeys } from '@/queryKeys/dashboard'
import { submissionKeys } from '../queries/keys'

export function useUpdateSubmissionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    meta: { successMessage: 'Status updated', errorMessage: 'Failed to update status' },
    mutationFn: async ({ id, status }: { id: string } & StatusUpdateBody) => {
      const { data, error } = await apiClient.PATCH('/submissions/{id}/status', {
        params: { path: { id } },
        body: { status },
      })
      if (error)
        throw error
      return data.data
    },
    onMutate: async ({ id, status: newStatus }) => {
      await queryClient.cancelQueries({ queryKey: submissionKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: submissionKeys.lists() })

      const previousDetail = queryClient.getQueryData<{ data: Submission }>(submissionKeys.detail(id))
      const previousLists = queryClient.getQueriesData<ApiResponse<Submission>>({ queryKey: submissionKeys.lists() })

      queryClient.setQueryData<{ data: Submission }>(
        submissionKeys.detail(id),
        old => old ? { data: { ...old.data, newStatus } } : old,
      )

      queryClient.setQueriesData<ApiResponse<Submission>>(
        { queryKey: submissionKeys.lists() },
        old => old
          ? { ...old, data: old.data.map(s => s.id === id ? { ...s, newStatus } : s) }
          : old,
      )

      return { previousDetail, previousLists }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(submissionKeys.detail(id), context.previousDetail)
      }
      for (const [queryKey, data] of context?.previousLists ?? []) {
        queryClient.setQueryData(queryKey, data)
      }
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: submissionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
    },
  })
}
