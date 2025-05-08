// API fetcher utility function
import { 
  JobInstancesParams, 
  JobExecutionsParams, 
  PageResponse, 
  JobInstance, 
  JobInstanceDetail, 
  JobExecution, 
  JobExecutionDetail, 
  StepExecutionDetail, 
  JobStatistics,
  JobSpecificStatistics,
  JobStatus,
  JobParameter,
  StepExecutionSummary,
  ApiError
} from '../types/batch'

// Global fetcher with error handling
export const fetcher = async (url: string) => {
  const response = await fetch(url)
  
  if (!response.ok) {
    const error: ApiError = await response.json()
    throw error
  }
  
  return response.json()
}

// Construct query string from params
const buildQueryString = (params: Record<string, string | number | undefined>): string => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
  
  return query ? `?${query}` : ''
}

// API endpoints
export const apiEndpoints = {
  // GET job instances with optional filtering
  jobInstances: (params: JobInstancesParams = {}) => `/api/batch/job_instances${buildQueryString(params)}`,
  
  // GET job instance detail by ID
  jobInstanceDetail: (jobInstanceId: number) => `/api/batch/job_instances/${jobInstanceId}`,
  
  // GET job executions with optional filtering
  jobExecutions: (params: JobExecutionsParams = {}) => `/api/batch/job_executions${buildQueryString(params)}`,
  
  // GET job execution detail by ID
  jobExecutionDetail: (jobExecutionId: number) => `/api/batch/job_executions/${jobExecutionId}`,
  
  // GET step execution detail by ID
  stepExecutionDetail: (stepExecutionId: number) => `/api/batch/step_executions/${stepExecutionId}`,
  
  // GET job statistics
  jobStatistics: () => `/api/batch/statistics/jobs`,
  
  // GET specific job statistics
  jobSpecificStatistics: (jobName: string) => `/api/batch/statistics/jobs/${jobName}`
}

// ============ DUMMY DATA GENERATORS ============

// Random job names for testing
const JOB_NAMES = [
  'dataImportJob',
  'customerProcessingJob',
  'transactionReportJob',
  'productSyncJob',
  'archiveDataJob',
  'emailNotificationJob',
  'fileExportJob',
  'dataValidationJob'
]

// Status options with weighted probability
const JOB_STATUSES = [
  { status: 'COMPLETED', weight: 75 },
  { status: 'FAILED', weight: 15 },
  { status: 'ABANDONED', weight: 5 },
  { status: 'STOPPED', weight: 5 }
]

// Get random status based on weight
function getRandomStatus(): JobStatus {
  const totalWeight = JOB_STATUSES.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight
  
  for (const statusObj of JOB_STATUSES) {
    random -= statusObj.weight
    if (random <= 0) {
      return statusObj.status as JobStatus
    }
  }
  
  return 'COMPLETED' // Fallback
}

// Generate random date within last 30 days
function getRandomDate(maxDaysAgo = 30) {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * maxDaysAgo)
  const result = new Date(now)
  result.setDate(result.getDate() - daysAgo)
  return result.toISOString()
}

// Get random job parameters based on job name
function getRandomJobParameters(jobName: string): JobParameter[] {
  const commonParams = [
    {
      name: 'run.id',
      type: 'LONG',
      value: String(Math.floor(Math.random() * 10000)),
      identifying: true
    }
  ]
  
  const specificParams: Record<string, JobParameter[]> = {
    dataImportJob: [
      {
        name: 'input.file',
        type: 'STRING',
        value: 'data/import-' + Math.floor(Math.random() * 1000) + '.csv',
        identifying: true
      },
      {
        name: 'chunk.size',
        type: 'INTEGER',
        value: '100',
        identifying: false
      }
    ],
    customerProcessingJob: [
      {
        name: 'customer.type',
        type: 'STRING',
        value: ['premium', 'standard', 'basic'][Math.floor(Math.random() * 3)],
        identifying: true
      }
    ],
    transactionReportJob: [
      {
        name: 'date.from',
        type: 'DATE',
        value: getRandomDate(60),
        identifying: true
      },
      {
        name: 'date.to',
        type: 'DATE',
        value: getRandomDate(30),
        identifying: true
      }
    ]
  }
  
  return [
    ...commonParams,
    ...(specificParams[jobName] || [])
  ]
}

// Generate random step executions for a job
function generateRandomSteps(jobExecutionId: number, count = 3): StepExecutionSummary[] {
  const steps: StepExecutionSummary[] = []
  const stepNames = [
    'extractDataStep',
    'processDataStep',
    'validateDataStep',
    'transformDataStep',
    'loadDataStep',
    'sendNotificationStep',
    'cleanupStep'
  ]
  
  const startTime = new Date(getRandomDate(30))
  
  for (let i = 0; i < count; i++) {
    const stepStatus = i < count - 1 ? 'COMPLETED' : getRandomStatus()
    const readCount = Math.floor(Math.random() * 1000)
    const filterCount = Math.floor(Math.random() * 100)
    const writeCount = readCount - filterCount
    
    // Each step takes 1-5 minutes
    const stepStartTime = new Date(startTime)
    stepStartTime.setMinutes(stepStartTime.getMinutes() + (i * 2))
    
    let stepEndTime = null
    if (stepStatus !== 'STARTED') {
      stepEndTime = new Date(stepStartTime)
      stepEndTime.setMinutes(stepEndTime.getMinutes() + 1 + Math.floor(Math.random() * 4))
    }
    
    steps.push({
      stepExecutionId: jobExecutionId * 100 + i + 1,
      stepName: stepNames[i % stepNames.length],
      status: stepStatus as JobStatus,
      readCount,
      writeCount,
      filterCount,
      startTime: stepStartTime.toISOString(),
      endTime: stepEndTime ? stepEndTime.toISOString() : undefined
    })
    
    // If a step fails, don't add more steps
    if (stepStatus !== 'COMPLETED') {
      break
    }
  }
  
  return steps
}

// ========= MOCK API FUNCTIONS ===========

// Generate dummy job instances for list view
export function generateDummyJobInstances(params: JobInstancesParams = {}): PageResponse<JobInstance> {
  const { jobName, page = 0, size = 20 } = params
  
  const filteredJobNames = jobName 
    ? [jobName] 
    : JOB_NAMES
  
  // Create array of dummy instances
  const totalItems = 150 // Total number of job instances
  const totalPages = Math.ceil(totalItems / size)
  
  const items: JobInstance[] = Array.from({ length: Math.min(size, totalItems - page * size) }, (_, index) => {
    const itemIndex = page * size + index
    const instanceId = totalItems - itemIndex
    const selectedJobName = filteredJobNames[itemIndex % filteredJobNames.length]
    
    // Generate latest execution data
    const status = getRandomStatus()
    const startTime = getRandomDate()
    let endTime = undefined
    
    if (status !== 'STARTED') {
      const startDate = new Date(startTime)
      const endDate = new Date(startDate)
      endDate.setMinutes(startDate.getMinutes() + Math.floor(Math.random() * 30) + 1)
      endTime = endDate.toISOString()
    }
    
    return {
      jobInstanceId: instanceId,
      jobName: selectedJobName,
      jobKey: `${selectedJobName}_${instanceId}`,
      version: 1,
      latestExecution: {
        jobExecutionId: instanceId * 10,
        startTime,
        endTime,
        status
      }
    }
  })
  
  return {
    content: items,
    page,
    size,
    totalElements: totalItems,
    totalPages
  }
}

// Generate dummy job instance detail with executions
export function generateDummyJobInstanceDetail(jobInstanceId: number): JobInstanceDetail {
  const jobIndex = jobInstanceId % JOB_NAMES.length
  const jobName = JOB_NAMES[jobIndex]
  
  // Generate base job instance
  const jobInstance: JobInstanceDetail = {
    jobInstanceId,
    jobName,
    jobKey: `${jobName}_${jobInstanceId}`,
    version: 1,
    executions: []
  }
  
  // Add 1-3 job executions (retries)
  const executionCount = Math.min(3, Math.max(1, Math.floor(Math.random() * 3)))
  
  for (let i = 0; i < executionCount; i++) {
    const jobExecutionId = jobInstanceId * 10 + i
    const createTime = getRandomDate(30)
    
    // For all but the last execution, status is FAILED (retries)
    const status = i < executionCount - 1 ? 'FAILED' : getRandomStatus()
    
    const startTime = new Date(createTime)
    startTime.setSeconds(startTime.getSeconds() + 10) // Start 10 seconds after creation
    
    let endTime = undefined
    let exitMessage = undefined
    
    if (status !== 'STARTED') {
      const endDate = new Date(startTime)
      endDate.setMinutes(startTime.getMinutes() + Math.floor(Math.random() * 30) + 1)
      endTime = endDate.toISOString()
      
      if (status === 'FAILED') {
        exitMessage = [
          'Error reading input file', 
          'Database connection timeout', 
          'Data validation failed'
        ][Math.floor(Math.random() * 3)]
      }
    }
    
    jobInstance.executions.push({
      jobExecutionId,
      jobInstanceId,
      jobName,
      createTime,
      startTime: startTime.toISOString(),
      endTime,
      status,
      exitCode: status,
      exitMessage,
      lastUpdated: endTime || new Date().toISOString(),
      parameters: getRandomJobParameters(jobName)
    })
  }
  
  // Sort executions by ID descending (newest first)
  jobInstance.executions.sort((a, b) => b.jobExecutionId - a.jobExecutionId)
  
  return jobInstance
}

// Generate dummy job executions for list view
export function generateDummyJobExecutions(params: JobExecutionsParams = {}): PageResponse<JobExecution> {
  const { 
    jobName, 
    status, 
    startDateFrom, 
    startDateTo, 
    page = 0, 
    size = 20 
  } = params
  
  // Create array of dummy executions
  const totalItems = 200 // Total number of job executions
  const totalPages = Math.ceil(totalItems / size)
  
  const items: JobExecution[] = Array.from({ length: Math.min(size, totalItems - page * size) }, (_, index) => {
    const itemIndex = page * size + index
    const executionId = totalItems - itemIndex
    const instanceId = Math.floor(executionId / 10) + 1
    
    // Select job name based on filter or random
    const selectedJobName = jobName || JOB_NAMES[instanceId % JOB_NAMES.length]
    
    // Generate random status or use filter value
    const executionStatus = status || getRandomStatus()
    
    // Create dates
    const createTime = getRandomDate(30)
    const startTime = new Date(createTime)
    startTime.setSeconds(startTime.getSeconds() + 10) // Start 10 seconds after creation
    
    let endTime = undefined
    let exitMessage = undefined
    
    if (executionStatus !== 'STARTED') {
      const endDate = new Date(startTime)
      endDate.setMinutes(startTime.getMinutes() + Math.floor(Math.random() * 30) + 1)
      endTime = endDate.toISOString()
      
      if (executionStatus === 'FAILED') {
        exitMessage = [
          'Error reading input file', 
          'Database connection timeout', 
          'Data validation failed'
        ][Math.floor(Math.random() * 3)]
      }
    }
    
    return {
      jobExecutionId: executionId,
      jobInstanceId: instanceId,
      jobName: selectedJobName,
      createTime,
      startTime: startTime.toISOString(),
      endTime,
      status: executionStatus,
      exitCode: executionStatus,
      exitMessage,
      lastUpdated: endTime || new Date().toISOString(),
      parameters: getRandomJobParameters(selectedJobName)
    }
  })
  
  // Filter by date if needed
  const filteredItems = items.filter(item => {
    if (startDateFrom && new Date(item.startTime) < new Date(startDateFrom)) {
      return false
    }
    if (startDateTo && new Date(item.startTime) > new Date(startDateTo)) {
      return false
    }
    return true
  })
  
  return {
    content: filteredItems,
    page,
    size,
    totalElements: totalItems,
    totalPages
  }
}

// Generate dummy job execution detail with steps
export function generateDummyJobExecutionDetail(jobExecutionId: number): JobExecutionDetail {
  const instanceId = Math.floor(jobExecutionId / 10) + 1
  const jobName = JOB_NAMES[instanceId % JOB_NAMES.length]
  
  const createTime = getRandomDate(30)
  const startTime = new Date(createTime)
  startTime.setSeconds(startTime.getSeconds() + 10)
  
  const status = getRandomStatus()
  
  let endTime = undefined
  let exitMessage = undefined
  
  if (status !== 'STARTED') {
    const endDate = new Date(startTime)
    endDate.setMinutes(startTime.getMinutes() + Math.floor(Math.random() * 30) + 1)
    endTime = endDate.toISOString()
    
    if (status === 'FAILED') {
      exitMessage = [
        'Error reading input file', 
        'Database connection timeout', 
        'Data validation failed'
      ][Math.floor(Math.random() * 3)]
    }
  }
  
  // Generate steps (more for successful jobs, fewer for failed ones)
  const stepCount = status === 'COMPLETED' ? 
    3 + Math.floor(Math.random() * 3) : 
    1 + Math.floor(Math.random() * 3)
  
  return {
    jobExecutionId,
    jobInstanceId: instanceId,
    jobName,
    createTime,
    startTime: startTime.toISOString(),
    endTime,
    status,
    exitCode: status,
    exitMessage,
    lastUpdated: endTime || new Date().toISOString(),
    parameters: getRandomJobParameters(jobName),
    steps: generateRandomSteps(jobExecutionId, stepCount),
    context: {
      shortContext: `Context for job ${jobName}`,
      serializedContext: JSON.stringify({
        batch_job_id: jobExecutionId,
        job_name: jobName,
        parameters: getRandomJobParameters(jobName).reduce((obj, param) => {
          obj[param.name] = param.value
          return obj
        }, {} as Record<string, string>)
      }, null, 2)
    }
  }
}

// Generate dummy step execution detail
export function generateDummyStepExecutionDetail(stepExecutionId: number): StepExecutionDetail {
  const jobExecutionId = Math.floor(stepExecutionId / 100)
  const instanceId = Math.floor(jobExecutionId / 10) + 1
  // const jobName = JOB_NAMES[instanceId % JOB_NAMES.length]
  
  const stepNames = [
    'extractDataStep',
    'processDataStep',
    'validateDataStep',
    'transformDataStep',
    'loadDataStep',
    'sendNotificationStep',
    'cleanupStep'
  ]
  
  const stepIndex = stepExecutionId % 100
  const stepName = stepNames[stepIndex % stepNames.length]
  
  const status = getRandomStatus()
  const readCount = Math.floor(Math.random() * 1000)
  const filterCount = Math.floor(Math.random() * 100)
  const writeCount = readCount - filterCount
  const commitCount = Math.floor(writeCount / 10)
  
  const createTime = getRandomDate(30)
  const startTime = new Date(createTime)
  startTime.setSeconds(startTime.getSeconds() + 10)
  
  let endTime = undefined
  let exitMessage = undefined
  
  if (status !== 'STARTED') {
    const endDate = new Date(startTime)
    endDate.setMinutes(startTime.getMinutes() + Math.floor(Math.random() * 10) + 1)
    endTime = endDate.toISOString()
    
    if (status === 'FAILED') {
      exitMessage = [
        'Error reading input data',
        'Connection timeout',
        'Data validation exception'
      ][Math.floor(Math.random() * 3)]
    }
  }
  
  return {
    stepExecutionId,
    jobExecutionId,
    stepName,
    version: 3,
    status,
    readCount,
    writeCount,
    filterCount,
    commitCount,
    rollbackCount: status === 'FAILED' ? Math.floor(Math.random() * 3) + 1 : 0,
    readSkipCount: Math.floor(Math.random() * 10),
    processSkipCount: Math.floor(Math.random() * 5),
    writeSkipCount: Math.floor(Math.random() * 5),
    startTime: startTime.toISOString(),
    endTime,
    exitCode: status,
    exitMessage,
    createTime,
    lastUpdated: endTime || new Date().toISOString(),
    context: {
      shortContext: `Context for step ${stepName}`,
      serializedContext: JSON.stringify({
        step_name: stepName,
        read_count: readCount,
        write_count: writeCount,
        filter_count: filterCount,
        status: status
      }, null, 2)
    }
  }
}

// Generate dummy job statistics
export function generateDummyJobStatistics(): JobStatistics {
  // Generate job status counts
  const jobsByStatus: Record<JobStatus, number> = {
    'COMPLETED': 80,
    'FAILED': 15,
    'ABANDONED': 5,
    'STARTED': 0,
    'STARTING': 0,
    'STOPPED': 0,
    'STOPPING': 0,
    'UNKNOWN': 0
  }
  
  // Generate recent job status data (last 30 days)
  const recentJobStatuses = Array.from({ length: 30 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - index))
    
    return {
      date: date.toISOString().split('T')[0],
      completed: Math.floor(Math.random() * 10),
      failed: Math.floor(Math.random() * 3),
      abandoned: Math.floor(Math.random() * 2)
    }
  })
  
  return {
    totalJobs: JOB_NAMES.length,
    jobsByStatus,
    recentJobStatuses
  }
}

// Generate dummy job specific statistics
export function generateDummyJobSpecificStatistics(jobName: string): JobSpecificStatistics {
  // Status counts specific to this job
  const executionsByStatus: Record<JobStatus, number> = {
    'COMPLETED': 45,
    'FAILED': 5,
    'ABANDONED': 0,
    'STARTED': 0,
    'STARTING': 0,
    'STOPPED': 0,
    'STOPPING': 0,
    'UNKNOWN': 0
  }
  
  return {
    jobName,
    totalExecutions: 50,
    executionsByStatus,
    averageDuration: 300, // 5 minutes in seconds
    lastExecutionTime: getRandomDate(7), // Within last week
    successRate: 90.0
  }
}

// Mock API response handler - to simulate network delay
export async function mockApiResponse<T>(data: T, delay = 300): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay)
  })
}

// Override fetch for API mocking
// This would normally be done with a service worker or a library like MSW
// But for simplicity, we're using a global override
const originalFetch = window.fetch
window.fetch = async (url: string | URL | Request, options?: RequestInit) => {
  const urlString = url.toString()
  
  // Only intercept our API calls
  if (!urlString.startsWith('/api/batch')) {
    return originalFetch(url, options)
  }
  
  // Add a small delay to simulate network
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Handle different API endpoints
  if (urlString.match(/\/job_instances(\?|$)/)) {
    // Job instances list endpoint
    const params = new URL(urlString, window.location.origin).searchParams
    const jobName = params.get('jobName') || undefined
    const page = parseInt(params.get('page') || '0')
    const size = parseInt(params.get('size') || '20')
    
    const response = generateDummyJobInstances({ jobName, page, size })
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (urlString.match(/\/job_instances\/\d+$/)) {
    // Job instance detail endpoint
    const jobInstanceId = parseInt(urlString.split('/').pop() || '0')
    const response = generateDummyJobInstanceDetail(jobInstanceId)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (urlString.match(/\/job_executions(\?|$)/)) {
    // Job executions list endpoint
    const params = new URL(urlString, window.location.origin).searchParams
    const jobName = params.get('jobName') || undefined
    const status = (params.get('status') || undefined) as JobStatus | undefined
    const startDateFrom = params.get('startDateFrom') || undefined
    const startDateTo = params.get('startDateTo') || undefined
    const page = parseInt(params.get('page') || '0')
    const size = parseInt(params.get('size') || '20')
    
    const response = generateDummyJobExecutions({ 
      jobName, status, startDateFrom, startDateTo, page, size 
    })
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (urlString.match(/\/job_executions\/\d+$/)) {
    // Job execution detail endpoint
    const jobExecutionId = parseInt(urlString.split('/').pop() || '0')
    const response = generateDummyJobExecutionDetail(jobExecutionId)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (urlString.match(/\/step_executions\/\d+$/)) {
    // Step execution detail endpoint
    const stepExecutionId = parseInt(urlString.split('/').pop() || '0')
    const response = generateDummyStepExecutionDetail(stepExecutionId)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (urlString.endsWith('/statistics/jobs')) {
    // Job statistics endpoint
    const response = generateDummyJobStatistics()
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  if (urlString.match(/\/statistics\/jobs\/[^/]+$/)) {
    // Specific job statistics endpoint
    const jobName = urlString.split('/').pop() || ''
    const response = generateDummyJobSpecificStatistics(jobName)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Default: return 404 for unknown endpoints
  return new Response(JSON.stringify({
    timestamp: new Date().toISOString(),
    status: 404,
    error: 'Not Found',
    message: `Endpoint ${urlString} not found`,
    path: urlString
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  })
}
