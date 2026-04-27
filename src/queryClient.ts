import { QueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
      refetchOnWindowFocus: true,
    },
  },
})

queryClient.getMutationCache().subscribe((event) => {
  if (event.type !== 'updated')
    return
  const { status, error } = event.mutation.state
  const meta = event.mutation.options.meta

  if (status === 'success') {
    const msg = meta?.successMessage
    if (msg)
      toast.success(msg)
  }
  if (status === 'error') {
    const msg = meta?.errorMessage as string
      ?? (error instanceof Error ? error.message : 'Something went wrong')
    toast.error(msg)
  }
})
