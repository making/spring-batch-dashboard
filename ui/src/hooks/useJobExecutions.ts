import useSWR from 'swr'
import { apiEndpoints, fetcher } from '../api/batchApi'
import { JobExecutionsParams, PageResponse, JobExecution } from '../types/batch'

export function useJobExecutions(params: JobExecutionsParams = {}) {
  const { data, error, isLoading, mutate } = useSWR<PageResponse<JobExecution>>(
    apiEndpoints.jobExecutions(params),
    fetcher
  )

  return {
    jobExecutions: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
