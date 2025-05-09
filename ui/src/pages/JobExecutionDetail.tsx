// No longer need useState since we don't have tabs anymore
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { StatusBadge } from '../components/StatusBadge'
import { DateTime } from '../components/DateTime'
import { useJobExecutionDetail } from '../hooks/useJobExecutionDetail'
import { parseISO, differenceInSeconds } from 'date-fns'

const JobExecutionDetail = () => {
  // No need for tabs anymore as we only have parameters
  
  // Get job execution ID from URL params
  const { jobExecutionId } = useParams<{ jobExecutionId: string }>()
  const id = jobExecutionId ? parseInt(jobExecutionId) : null
  const navigate = useNavigate()
  
  // Fetch job execution detail
  const {
    jobExecutionDetail,
    isLoading,
    isError,
    error
  } = useJobExecutionDetail(id)
  
  // Loading state
  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }
  
  // Error state
  if (isError) {
    return <ErrorMessage error={error} />
  }
  
  if (!jobExecutionDetail) {
    return <div>No job execution details found.</div>
  }
  
  // Calculate duration in seconds
  const getDuration = () => {
    if (!jobExecutionDetail.startTime) return 'N/A'
    
    const startTime = parseISO(jobExecutionDetail.startTime)
    const endTime = jobExecutionDetail.endTime 
      ? parseISO(jobExecutionDetail.endTime)
      : new Date()
    
    const durationSeconds = differenceInSeconds(endTime, startTime)
    
    // Format duration
    const hours = Math.floor(durationSeconds / 3600)
    const minutes = Math.floor((durationSeconds % 3600) / 60)
    const seconds = durationSeconds % 60
    
    // Add leading zeros
    const formatTime = (value: number) => value.toString().padStart(2, '0')
    
    return `${hours ? hours + 'h ' : ''}${formatTime(minutes)}m ${formatTime(seconds)}s`
  }
  
  return (
    <div className="space-y-6">
      {/* Job Execution Info */}
      <Card title="Job Execution Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
            <p className="font-medium">{jobExecutionDetail.jobExecutionId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Job Name</p>
            <p className="font-medium">{jobExecutionDetail.jobName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Instance ID</p>
            <p className="font-medium">
              <Link 
                to={`/job-instances/${jobExecutionDetail.jobInstanceId}`}
                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {jobExecutionDetail.jobInstanceId}
              </Link>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create Time</p>
            <p className="font-medium">
              <DateTime date={jobExecutionDetail.createTime} />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Start Time</p>
            <p className="font-medium">
              <DateTime date={jobExecutionDetail.startTime} />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">End Time</p>
            <p className="font-medium">
              {jobExecutionDetail.endTime ? (
                <DateTime date={jobExecutionDetail.endTime} />
              ) : (
                <span className="text-gray-500 dark:text-gray-400">-</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
            <p className="font-medium">{getDuration()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="font-medium">
              <StatusBadge status={jobExecutionDetail.status} />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Exit Code</p>
            <p className="font-medium">{jobExecutionDetail.exitCode}</p>
          </div>
          {jobExecutionDetail.exitMessage && (
            <div className="md:col-span-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Exit Message</p>
              <p className="font-medium">{jobExecutionDetail.exitMessage}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="font-medium">
              <DateTime date={jobExecutionDetail.lastUpdated} />
            </p>
          </div>
        </div>
      </Card>
      
      {/* Steps Table */}
      <Card title="Step Executions">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">ID</th>
                <th className="table-header-cell">Step Name</th>
                <th className="table-header-cell">Start Time</th>
                <th className="table-header-cell">End Time</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Read</th>
                <th className="table-header-cell">Filter</th>
                <th className="table-header-cell">Write</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {jobExecutionDetail.steps.map((step) => (
                <tr key={step.stepExecutionId} className="table-row">
                  <td className="table-cell">
                    <Link 
                      to={`/step-executions/${step.stepExecutionId}`}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      {step.stepExecutionId}
                    </Link>
                  </td>
                  <td className="table-cell">{step.stepName}</td>
                  <td className="table-cell">
                    <DateTime date={step.startTime} />
                  </td>
                  <td className="table-cell">
                    {step.endTime ? (
                      <DateTime date={step.endTime} />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={step.status} />
                  </td>
                  <td className="table-cell">{step.readCount}</td>
                  <td className="table-cell">{step.filterCount}</td>
                  <td className="table-cell">{step.writeCount}</td>
                  <td className="table-cell">
                    <Link 
                      to={`/step-executions/${step.stepExecutionId}`}
                      className="btn btn-outline py-1 px-2 text-xs"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
              
              {/* No steps message */}
              {jobExecutionDetail.steps.length === 0 && (
                <tr>
                  <td colSpan={9} className="table-cell text-center py-8 text-gray-500 dark:text-gray-400">
                    No step executions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Parameters */}
      <Card title="Parameters">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Type</th>
                <th className="table-header-cell">Value</th>
                <th className="table-header-cell">Identifying</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {jobExecutionDetail.parameters.map((param, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell">{param.name}</td>
                  <td className="table-cell">{param.type}</td>
                  <td className="table-cell">
                    <div className="max-w-xs truncate" title={param.value}>
                      {param.value}
                    </div>
                  </td>
                  <td className="table-cell">
                    {param.identifying ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
              
              {/* No parameters message */}
              {jobExecutionDetail.parameters.length === 0 && (
                <tr>
                  <td colSpan={4} className="table-cell text-center py-8 text-gray-500 dark:text-gray-400">
                    No parameters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/job-executions')} 
          className="btn-outline"
        >
          Back to Job Executions
        </button>
        <Link to={`/job-instances/${jobExecutionDetail.jobInstanceId}`} className="btn-outline">
          View Job Instance
        </Link>
      </div>
    </div>
  )
}

export default JobExecutionDetail
