import useSWR from 'swr'
import { apiEndpoints, fetcher } from '../api/batchApi'
import { JobExecutionDetail } from '../types/batch'

export function useJobExecutionDetail(jobExecutionId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<JobExecutionDetail>(
    jobExecutionId ? apiEndpoints.jobExecutionDetail(jobExecutionId) : null,
    fetcher
  )

  return {
    jobExecutionDetail: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
