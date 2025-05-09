// Statistics component
import { useParams, Link } from 'react-router-dom'
import { Card } from '../components/Card'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useJobStatistics } from '../hooks/useJobStatistics'
import { useJobSpecificStatistics } from '../hooks/useJobSpecificStatistics'
import { useRecentJobExecutions } from '../hooks/useRecentJobExecutions'

const Statistics = () => {
  // Get job name from URL if available (for specific job stats)
  const { jobName } = useParams<{ jobName?: string }>()
  
  // Fetch global job statistics
  const { 
    jobStatistics, 
    isLoading: globalStatsLoading, 
    isError: globalStatsError,
    error: globalStatsErrorData
  } = useJobStatistics()
  
  // Fetch job-specific statistics if jobName is provided
  const {
    jobSpecificStatistics,
    isLoading: specificStatsLoading,
    isError: specificStatsError,
    error: specificStatsErrorData
  } = useJobSpecificStatistics(jobName || null)
  
  // Fetch recent job executions data (last 60 days)
  const {
    recentJobExecutions,
    isLoading: recentExecutionsLoading,
    isError: recentExecutionsError,
    error: recentExecutionsErrorData
  } = useRecentJobExecutions()
  
  // Loading state
  const isLoading = globalStatsLoading || (jobName && specificStatsLoading) || (!jobName && recentExecutionsLoading)
  if (isLoading) {
    return <LoadingSpinner size="lg" />
  }
  
  // Error state
  if (globalStatsError) {
    return <ErrorMessage error={globalStatsErrorData} />
  }
  
  if (jobName && specificStatsError) {
    return <ErrorMessage error={specificStatsErrorData} />
  }
  
  if (!jobName && recentExecutionsError) {
    return <ErrorMessage error={recentExecutionsErrorData} />
  }
  
  // No data state
  if (!jobStatistics) {
    return <div>No statistics data available.</div>
  }
  
  // Function to format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  }
  
  return (
    <div className="space-y-6">
      {/* Global statistics */}
      {!jobName && (
        <>
          <Card title="Job Statistics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold">Total Jobs</h3>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {jobStatistics.totalJobs}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold">Completed</h3>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                  {jobStatistics.jobsByStatus.COMPLETED}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold">Failed</h3>
                <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">
                  {jobStatistics.jobsByStatus.FAILED}
                </p>
              </div>
            </div>
          </Card>
          
          <Card title="Recent Job Statistics">
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Date</th>
                    <th className="table-header-cell">Completed</th>
                    <th className="table-header-cell">Failed</th>
                    <th className="table-header-cell">Abandoned</th>
                    <th className="table-header-cell">Total</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {jobStatistics.recentJobStatuses.map((dailyStat, index) => (
                    <tr key={index} className="table-row">
                      <td className="table-cell">{formatDate(dailyStat.date)}</td>
                      <td className="table-cell">
                        <span className="text-success-600 dark:text-success-400 font-medium">
                          {dailyStat.completed}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-danger-600 dark:text-danger-400 font-medium">
                          {dailyStat.failed}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className="text-warning-600 dark:text-warning-400 font-medium">
                          {dailyStat.abandoned}
                        </span>
                      </td>
                      <td className="table-cell font-medium">
                        {dailyStat.completed + dailyStat.failed + dailyStat.abandoned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
      
      {/* Job-specific statistics */}
      {jobName && jobSpecificStatistics && (
        <>
          <Card title={`Statistics for ${jobSpecificStatistics.jobName}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold">Total Executions</h3>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {jobSpecificStatistics.totalExecutions}
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold">Success Rate</h3>
                <p className="text-3xl font-bold text-success-600 dark:text-success-400">
                  {jobSpecificStatistics.successRate.toFixed(1)}%
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold">Avg. Duration</h3>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {Math.floor(jobSpecificStatistics.averageDuration / 60)} min {Math.floor(jobSpecificStatistics.averageDuration % 60)} sec
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold">Last Execution</h3>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  {new Date(jobSpecificStatistics.lastExecutionTime).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
          
          <Card title="Execution Status Distribution">
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Status</th>
                    <th className="table-header-cell">Count</th>
                    <th className="table-header-cell">Percentage</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {Object.entries(jobSpecificStatistics.executionsByStatus)
                    .filter(([, count]) => count > 0)
                    .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
                    .map(([status, count]) => (
                      <tr key={status} className="table-row">
                        <td className="table-cell">
                          <span className={`
                            ${status === 'COMPLETED' ? 'text-success-600 dark:text-success-400' : ''}
                            ${status === 'FAILED' ? 'text-danger-600 dark:text-danger-400' : ''}
                            ${status === 'ABANDONED' ? 'text-warning-600 dark:text-warning-400' : ''}
                            font-medium
                          `}>
                            {status}
                          </span>
                        </td>
                        <td className="table-cell">{count}</td>
                        <td className="table-cell">
                          {((count as number) / jobSpecificStatistics.totalExecutions * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
          
          <div className="flex gap-4">
            <Link to="/statistics" className="btn-outline">
              Back to Global Statistics
            </Link>
            <Link to={`/job-instances?jobName=${jobSpecificStatistics.jobName}`} className="btn-outline">
              View Job Instances
            </Link>
            <Link to={`/job-executions?jobName=${jobSpecificStatistics.jobName}`} className="btn-primary">
              View Job Executions
            </Link>
          </div>
        </>
      )}
      
      {/* Job list table (only on global stats page) */}
      {!jobName && jobStatistics && recentJobExecutions && (
        <Card title="Jobs">
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Job Name</th>
                  <th className="table-header-cell">Executions Count (60 days)</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {recentJobExecutions.length === 0 ? (
                  <tr className="table-row">
                    <td colSpan={3} className="table-cell text-center">No job execution data available for the last 60 days</td>
                  </tr>
                ) : (
                  recentJobExecutions.map((job) => (
                    <tr key={job.jobName} className="table-row">
                      <td className="table-cell">{job.jobName}</td>
                      <td className="table-cell">{job.executions}</td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <Link 
                            to={`/statistics/${job.jobName}`}
                            className="btn btn-outline py-1 px-2 text-xs"
                          >
                            Statistics
                          </Link>
                          <Link 
                            to={`/job-instances?jobName=${job.jobName}`}
                            className="btn btn-outline py-1 px-2 text-xs"
                          >
                            Instances
                          </Link>
                          <Link 
                            to={`/job-executions?jobName=${job.jobName}`}
                            className="btn btn-outline py-1 px-2 text-xs"
                          >
                            Executions
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Statistics
