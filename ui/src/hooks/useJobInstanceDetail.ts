import useSWR from 'swr'
import { apiEndpoints } from '../api/batchApi'
import { JobInstanceDetail } from '../types/batch'

export function useJobInstanceDetail(jobInstanceId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<JobInstanceDetail>(
    jobInstanceId ? apiEndpoints.jobInstanceDetail(jobInstanceId) : null
  )

  return {
    jobInstanceDetail: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
