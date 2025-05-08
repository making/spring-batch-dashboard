import useSWR from 'swr'
import { apiEndpoints, fetcher } from '../api/batchApi'
import { JobInstancesParams, PageResponse, JobInstance } from '../types/batch'

export function useJobInstances(params: JobInstancesParams = {}) {
  const { data, error, isLoading, mutate } = useSWR<PageResponse<JobInstance>>(
    apiEndpoints.jobInstances(params),
    fetcher
  )

  return {
    jobInstances: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
