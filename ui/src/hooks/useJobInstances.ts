import useSWR from 'swr'
import { apiEndpoints } from '../api/batchApi'
import { JobInstancesParams, PageResponse, JobInstance } from '../types/batch'

export function useJobInstances(params: JobInstancesParams = {}) {
  const { data, error, isLoading, mutate } = useSWR<PageResponse<JobInstance>>(
    apiEndpoints.jobInstances(params)
  )

  return {
    jobInstances: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
