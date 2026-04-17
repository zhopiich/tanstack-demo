import type { DashboardStats } from '../schemas/dashboard'
import { useQuery } from '@tanstack/vue-query'
import { apiClient } from '@/api/client'
import { dashboardKeys } from './keys'

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<{ data: DashboardStats }> => {
      const { data, error } = await apiClient.GET('/dashboard/stats')
      if (error)
        throw error
      return data
    },
    select: raw => raw.data,
    refetchInterval: 1000 * 30,
    refetchIntervalInBackground: false,
  })
}
