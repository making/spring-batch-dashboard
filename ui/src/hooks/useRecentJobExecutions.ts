import useSWR from 'swr'
import { apiEndpoints } from '../api/batchApi'
import { RecentJobExecution } from '../types/batch'

/**
 * Hook to fetch recent job executions data
 * 
 * @param days Optional number of days to fetch data for (defaults to 60)
 * @returns Object containing the fetched data and loading/error states
 */
export function useRecentJobExecutions(days?: number) {
  const { data, error, isLoading, mutate } = useSWR<RecentJobExecution[]>(
    apiEndpoints.recentExecutions(days)
  )

  return {
    recentJobExecutions: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
