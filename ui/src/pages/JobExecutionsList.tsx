import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card } from '../components/Card'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { Pagination } from '../components/Pagination'
import { StatusBadge } from '../components/StatusBadge'
import { DateTime } from '../components/DateTime'
import { useJobExecutions } from '../hooks/useJobExecutions'
import { JobExecutionsParams, JobStatus } from '../types/batch'
import { useSearchState } from "../context/SearchStateContext"

const JOB_STATUSES: JobStatus[] = [
  'COMPLETED',
  'FAILED',
  'ABANDONED',
  'STARTED',
  'STOPPING',
  'STOPPED',
  'STARTING',
  'UNKNOWN'
]

const JobExecutionsList = () => {
  const { searchState, setJobExecutionsState } = useSearchState();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize params with URL params or saved state
  const initialParams = { ...searchState.jobExecutions };
  
  // Check if jobName is in URL params
  const urlJobName = searchParams.get("jobName");
  if (urlJobName) {
    initialParams.jobName = urlJobName;
  }
  
  // State for filter and pagination
  const [params, setParams] = useState<JobExecutionsParams>(initialParams);
  
  // State for filter form - initialize with URL params or saved state
  const [jobNameFilter, setJobNameFilter] = useState(urlJobName || initialParams.jobName || '');
  const [statusFilter, setStatusFilter] = useState<JobStatus | ''>(initialParams.status || '');
  const [startDateFrom, setStartDateFrom] = useState(initialParams.startDateFrom || '');
  const [startDateTo, setStartDateTo] = useState(initialParams.startDateTo || '');
  
  // Fetch job executions with current params
  const {
    jobExecutions,
    isLoading,
    isError,
    error
  } = useJobExecutions(params)
  
  // Update context when params change
  useEffect(() => {
    setJobExecutionsState(params);
  }, [params, setJobExecutionsState]);
  
  // Sync URL with params when they change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (params.jobName) {
      newSearchParams.set("jobName", params.jobName);
    }
    
    // Only update if search params have changed
    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams);
    }
  }, [params, setSearchParams, searchParams]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }))
  }
  
  // Handle filter submission
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setParams(prev => ({
      ...prev,
      jobName: jobNameFilter || undefined,
      status: statusFilter as JobStatus || undefined,
      startDateFrom: startDateFrom || undefined,
      startDateTo: startDateTo || undefined,
      page: 0 // Reset to first page when filtering
    }))
  }
  
  // Handle filter reset
  const handleFilterReset = () => {
    setJobNameFilter('')
    setStatusFilter('')
    setStartDateFrom('')
    setStartDateTo('')
    setParams({
      page: 0,
      size: 20,
      sort: 'startTime,desc'
    })
    
    // Clear URL parameters
    setSearchParams(new URLSearchParams())
  }
  
  // Loading state
  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }
  
  // Error state
  if (isError) {
    return <ErrorMessage error={error} />
  }
  
  return (
    <div>
      <div className="mb-6">
        <Card title="Filters">
          <form onSubmit={handleFilterSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="jobName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Name
                </label>
                <input
                  type="text"
                  id="jobName"
                  className="input w-full"
                  value={jobNameFilter}
                  onChange={(e) => setJobNameFilter(e.target.value)}
                  placeholder="Filter by job name"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="select w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as JobStatus | '')}
                >
                  <option value="">All Statuses</option>
                  {JOB_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="startDateFrom" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date From
                </label>
                <input
                  type="datetime-local"
                  id="startDateFrom"
                  className="input w-full"
                  value={startDateFrom}
                  onChange={(e) => setStartDateFrom(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="startDateTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date To
                </label>
                <input
                  type="datetime-local"
                  id="startDateTo"
                  className="input w-full"
                  value={startDateTo}
                  onChange={(e) => setStartDateTo(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button type="submit" className="btn-primary">
                Apply Filters
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleFilterReset}
              >
                Reset
              </button>
            </div>
          </form>
        </Card>
      </div>
      
      <Card title="Job Executions">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">ID</th>
                <th className="table-header-cell">Job Name</th>
                <th className="table-header-cell">Instance ID</th>
                <th className="table-header-cell">Create Time</th>
                <th className="table-header-cell">Start Time</th>
                <th className="table-header-cell">End Time</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {jobExecutions?.content.map((execution) => (
                <tr key={execution.jobExecutionId} className="table-row">
                  <td className="table-cell">
                    <Link 
                      to={`/job-executions/${execution.jobExecutionId}`}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {execution.jobExecutionId}
                    </Link>
                  </td>
                  <td className="table-cell">{execution.jobName}</td>
                  <td className="table-cell">
                    <Link 
                      to={`/job-instances/${execution.jobInstanceId}`}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {execution.jobInstanceId}
                    </Link>
                  </td>
                  <td className="table-cell">
                    <DateTime date={execution.createTime} />
                  </td>
                  <td className="table-cell">
                    <DateTime date={execution.startTime} />
                  </td>
                  <td className="table-cell">
                    {execution.endTime ? (
                      <DateTime date={execution.endTime} />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={execution.status} />
                  </td>
                  <td className="table-cell">
                    <Link 
                      to={`/job-executions/${execution.jobExecutionId}`}
                      className="btn btn-outline py-1 px-2 text-xs"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
              
              {/* No results message */}
              {jobExecutions?.content.length === 0 && (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500 dark:text-gray-400">
                    No job executions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {jobExecutions && (
          <div className="mt-4">
            <Pagination
              currentPage={jobExecutions.page}
              totalPages={jobExecutions.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </Card>
    </div>
  )
}

export default JobExecutionsList
