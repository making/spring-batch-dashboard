import useSWR from 'swr'
import { apiEndpoints } from '../api/batchApi'
import { JobExecutionDetail } from '../types/batch'

export function useJobExecutionDetail(jobExecutionId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<JobExecutionDetail>(
    jobExecutionId ? apiEndpoints.jobExecutionDetail(jobExecutionId) : null
  )

  return {
    jobExecutionDetail: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
