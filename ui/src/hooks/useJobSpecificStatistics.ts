import useSWR from 'swr'
import { apiEndpoints, fetcher } from '../api/batchApi'
import { JobSpecificStatistics } from '../types/batch'

export function useJobSpecificStatistics(jobName: string | null) {
  const { data, error, isLoading, mutate } = useSWR<JobSpecificStatistics>(
    jobName ? apiEndpoints.jobSpecificStatistics(jobName) : null,
    fetcher
  )

  return {
    jobSpecificStatistics: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
