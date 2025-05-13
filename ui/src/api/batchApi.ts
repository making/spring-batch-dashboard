// API fetcher utility function
import { 
  JobInstancesParams, 
  JobExecutionsParams 
} from '../types/batch'
import httpClient from './httpClient'

// Global fetcher with error handling using httpClient
export const fetcher = async <T>(url: string): Promise<T> => {
  return httpClient.get<T>(url);
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
  jobInstances: (params: JobInstancesParams = {}) => `/api/job_instances${buildQueryString(params)}`,
  
  // GET job instance detail by ID
  jobInstanceDetail: (jobInstanceId: number) => `/api/job_instances/${jobInstanceId}`,
  
  // GET job executions with optional filtering
  jobExecutions: (params: JobExecutionsParams = {}) => `/api/job_executions${buildQueryString(params)}`,
  
  // GET job execution detail by ID
  jobExecutionDetail: (jobExecutionId: number) => `/api/job_executions/${jobExecutionId}`,
  
  // GET step execution detail by ID
  stepExecutionDetail: (stepExecutionId: number) => `/api/step_executions/${stepExecutionId}`,
  
  // GET job statistics
  jobStatistics: () => `/api/statistics/jobs`,
  
  // GET specific job statistics
  jobSpecificStatistics: (jobName: string) => `/api/statistics/jobs/${jobName}`,
  
  // GET recent job executions statistics 
  recentExecutions: (days?: number) => `/api/statistics/recent_executions${days ? buildQueryString({ days }) : ''}`
}

// Mock API response handler - to simulate network delay - no longer used
export async function mockApiResponse<T>(data: T, delay = 300): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay)
  })
}

// Note: The mock fetch override and dummy data generators have been removed.
// The application now uses real API endpoints.

