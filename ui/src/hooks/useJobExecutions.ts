import useSWR from 'swr'
import { apiEndpoints } from '../api/batchApi'
import { JobExecutionsParams, PageResponse, JobExecution } from '../types/batch'

export function useJobExecutions(params: JobExecutionsParams = {}) {
  const { data, error, isLoading, mutate } = useSWR<PageResponse<JobExecution>>(
    apiEndpoints.jobExecutions(params)
  )

  return {
    jobExecutions: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
