import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { StatusBadge } from '../components/StatusBadge'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useJobStatistics } from '../hooks/useJobStatistics'
import { useJobInstances } from '../hooks/useJobInstances'
import { useJobExecutions } from '../hooks/useJobExecutions'
import { DateTime } from '../components/DateTime'

const Dashboard = () => {
  // Fetch job statistics
  const { jobStatistics, isLoading: statsLoading, isError: statsError, error: statsErrorData } = useJobStatistics()
  
  // Fetch recent job instances (first page)
  const { 
    jobInstances: recentInstances,
    isLoading: instancesLoading,
    isError: instancesError,
    error: instancesErrorData
  } = useJobInstances({ page: 0, size: 5 })
  
  // Fetch recent job executions (first page)
  const {
    jobExecutions: recentExecutions,
    isLoading: executionsLoading,
    isError: executionsError,
    error: executionsErrorData
  } = useJobExecutions({ page: 0, size: 5 })
  
  // Loading state
  if (statsLoading || instancesLoading || executionsLoading) {
    return <LoadingSpinner size="lg" />
  }
  
  // Error state
  if (statsError) {
    return <ErrorMessage error={statsErrorData} />
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Statistics Card */}
      <Card title="Job Statistics" className="md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold">Total Jobs</h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {jobStatistics?.totalJobs || 0}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold">Completed</h3>
            <p className="text-3xl font-bold text-success-600 dark:text-success-400">
              {jobStatistics?.jobsByStatus.COMPLETED || 0}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold">Failed</h3>
            <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">
              {jobStatistics?.jobsByStatus.FAILED || 0}
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <Link to="/statistics" className="btn-primary inline-block">
            View Details
          </Link>
        </div>
      </Card>
      
      {/* Recent Job Instances */}
      <Card title="Recent Job Instances">
        {instancesError ? (
          <ErrorMessage error={instancesErrorData} />
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">ID</th>
                    <th className="table-header-cell">Job Name</th>
                    <th className="table-header-cell">Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {recentInstances?.content.map((instance) => (
                    <tr key={instance.jobInstanceId} className="table-row">
                      <td className="table-cell">
                        <Link 
                          to={`/job-instances/${instance.jobInstanceId}`}
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          {instance.jobInstanceId}
                        </Link>
                      </td>
                      <td className="table-cell">{instance.jobName}</td>
                      <td className="table-cell">
                        {instance.latestExecution && (
                          <StatusBadge status={instance.latestExecution.status} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link to="/job-instances" className="btn-outline inline-block">
                View All Job Instances
              </Link>
            </div>
          </>
        )}
      </Card>
      
      {/* Recent Job Executions */}
      <Card title="Recent Job Executions">
        {executionsError ? (
          <ErrorMessage error={executionsErrorData} />
        ) : (
          <>
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">ID</th>
                    <th className="table-header-cell">Job Name</th>
                    <th className="table-header-cell">Start Time</th>
                    <th className="table-header-cell">Status</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {recentExecutions?.content.map((execution) => (
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
                        <DateTime date={execution.startTime} />
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={execution.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link to="/job-executions" className="btn-outline inline-block">
                View All Job Executions
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

export default Dashboard
