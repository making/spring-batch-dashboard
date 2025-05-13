import useSWR from 'swr'
import { apiEndpoints } from '../api/batchApi'
import { StepExecutionDetail } from '../types/batch'

export function useStepExecutionDetail(stepExecutionId: number | null) {
  const { data, error, isLoading, mutate } = useSWR<StepExecutionDetail>(
    stepExecutionId ? apiEndpoints.stepExecutionDetail(stepExecutionId) : null
  )

  return {
    stepExecutionDetail: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  }
}
