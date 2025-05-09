// Job Instance types
export interface JobInstance {
  jobInstanceId: number
  jobName: string
  jobKey: string
  version: number
  latestExecution?: JobExecutionSummary
}

export interface JobExecutionSummary {
  jobExecutionId: number
  startTime: string
  endTime?: string
  status: JobStatus
}

export interface JobInstanceDetail extends JobInstance {
  executions: JobExecution[]
}

// Job Execution types
export interface JobExecution {
  jobExecutionId: number
  jobInstanceId: number
  jobName: string
  createTime: string
  startTime: string
  endTime?: string
  status: JobStatus
  exitCode: string
  exitMessage?: string
  lastUpdated: string
  parameters: JobParameter[]
}

export interface JobExecutionDetail extends JobExecution {
  steps: StepExecutionSummary[]
}

export interface JobParameter {
  name: string
  type: string
  value: string
  identifying: boolean
}

// Step Execution types
export interface StepExecutionSummary {
  stepExecutionId: number
  stepName: string
  status: StepStatus
  readCount: number
  writeCount: number
  filterCount: number
  startTime: string
  endTime?: string
}

export interface StepExecutionDetail extends StepExecutionSummary {
  jobExecutionId: number
  version: number
  createTime: string
  commitCount: number
  readSkipCount: number
  writeSkipCount: number
  processSkipCount: number
  rollbackCount: number
  exitCode: string
  exitMessage?: string
  lastUpdated: string
}

// Statistics types
export interface JobStatistics {
  totalJobs: number
  jobsByStatus: Record<JobStatus, number>
  recentJobStatuses: DailyJobStats[]
}

export interface DailyJobStats {
  date: string
  completed: number
  failed: number
  abandoned: number
}

export interface JobSpecificStatistics {
  jobName: string
  totalExecutions: number
  executionsByStatus: Record<JobStatus, number>
  averageDuration: number // in seconds
  lastExecutionTime: string
  successRate: number // percentage
}

export interface RecentJobExecution {
  jobName: string
  executions: number
}

// Pagination types
export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

// Common types
export type JobStatus = 
  | 'COMPLETED' 
  | 'STARTING' 
  | 'STARTED' 
  | 'STOPPING' 
  | 'STOPPED' 
  | 'FAILED' 
  | 'ABANDONED' 
  | 'UNKNOWN'

export type StepStatus = 
  | 'COMPLETED' 
  | 'STARTING' 
  | 'STARTED' 
  | 'STOPPING' 
  | 'STOPPED' 
  | 'FAILED' 
  | 'ABANDONED' 
  | 'UNKNOWN'

// Request params
export interface JobInstancesParams {
  jobName?: string
  page?: number
  size?: number
  sort?: string
  [key: string]: string | number | undefined
}

export interface JobExecutionsParams {
  jobName?: string
  status?: JobStatus
  startDateFrom?: string
  startDateTo?: string
  page?: number
  size?: number
  sort?: string
  [key: string]: string | number | undefined
}

// Error response
export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}
