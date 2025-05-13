import useSWR from 'swr'
import { apiEndpoints } from '../api/batchApi'
import { JobStatistics } from '../types/batch'

export function useJobStatistics() {
  const { data, error, isLoading, mutate } = useSWR<JobStatistics>(
    apiEndpoints.jobStatistics()
  )

  return {
    jobStatistics: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
