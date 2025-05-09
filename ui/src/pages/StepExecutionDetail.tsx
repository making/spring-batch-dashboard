// StepExecutionDetail component
import { useParams, Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { StatusBadge } from '../components/StatusBadge'
import { DateTime } from '../components/DateTime'
import { useStepExecutionDetail } from '../hooks/useStepExecutionDetail'
import { parseISO, differenceInSeconds } from 'date-fns'

const StepExecutionDetail = () => {
  // Get step execution ID from URL params
  const { stepExecutionId } = useParams<{ stepExecutionId: string }>()
  const id = stepExecutionId ? parseInt(stepExecutionId) : null
  
  // Fetch step execution detail
  const {
    stepExecutionDetail,
    isLoading,
    isError,
    error
  } = useStepExecutionDetail(id)
  
  // Loading state
  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }
  
  // Error state
  if (isError) {
    return <ErrorMessage error={error} />
  }
  
  if (!stepExecutionDetail) {
    return <div>No step execution details found.</div>
  }
  
  // Calculate duration in seconds
  const getDuration = () => {
    if (!stepExecutionDetail.startTime) return 'N/A'
    
    const startTime = parseISO(stepExecutionDetail.startTime)
    const endTime = stepExecutionDetail.endTime 
      ? parseISO(stepExecutionDetail.endTime)
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
      {/* Step Execution Info */}
      <Card title="Step Execution Details">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
            <p className="font-medium">{stepExecutionDetail.stepExecutionId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Step Name</p>
            <p className="font-medium">{stepExecutionDetail.stepName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Job Execution ID</p>
            <p className="font-medium">
              <Link 
                to={`/job-executions/${stepExecutionDetail.jobExecutionId}`}
                className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
              >
                {stepExecutionDetail.jobExecutionId}
              </Link>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Create Time</p>
            <p className="font-medium">
              <DateTime date={stepExecutionDetail.createTime} />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Start Time</p>
            <p className="font-medium">
              <DateTime date={stepExecutionDetail.startTime} />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">End Time</p>
            <p className="font-medium">
              {stepExecutionDetail.endTime ? (
                <DateTime date={stepExecutionDetail.endTime} />
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
              <StatusBadge status={stepExecutionDetail.status} />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Exit Code</p>
            <p className="font-medium">{stepExecutionDetail.exitCode}</p>
          </div>
          {stepExecutionDetail.exitMessage && (
            <div className="md:col-span-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">Exit Message</p>
              <p className="font-medium">{stepExecutionDetail.exitMessage}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="font-medium">
              <DateTime date={stepExecutionDetail.lastUpdated} />
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Version</p>
            <p className="font-medium">{stepExecutionDetail.version}</p>
          </div>
        </div>
      </Card>
      
      {/* Step Execution Metrics */}
      <Card title="Step Execution Metrics">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">Read Count</h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stepExecutionDetail.readCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">Write Count</h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stepExecutionDetail.writeCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">Filter Count</h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stepExecutionDetail.filterCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">Commit Count</h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stepExecutionDetail.commitCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">Read Skip Count</h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stepExecutionDetail.readSkipCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">Process Skip Count</h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stepExecutionDetail.processSkipCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">Write Skip Count</h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stepExecutionDetail.writeSkipCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold">Rollback Count</h3>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {stepExecutionDetail.rollbackCount}
            </p>
          </div>
        </div>
      </Card>
      
      {/* No Step Execution Context section anymore as it's no longer included in the API response */}
      
      <div className="flex gap-4">
        <Link to={`/job-executions/${stepExecutionDetail.jobExecutionId}`} className="btn-outline">
          Back to Job Execution
        </Link>
      </div>
    </div>
  )
}

export default StepExecutionDetail
