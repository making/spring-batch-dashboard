// JobInstanceDetail component
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { StatusBadge } from "../components/StatusBadge";
import { DateTime } from "../components/DateTime";
import { useJobInstanceDetail } from "../hooks/useJobInstanceDetail";

const JobInstanceDetail = () => {
  // Get job instance ID from URL params
  const { jobInstanceId } = useParams<{ jobInstanceId: string }>();
  const id = jobInstanceId ? parseInt(jobInstanceId) : null;
  const navigate = useNavigate();

  // Fetch job instance detail
  const { jobInstanceDetail, isLoading, isError, error } = useJobInstanceDetail(id);

  // Loading state
  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  // Error state
  if (isError) {
    return <ErrorMessage error={error} />;
  }

  if (!jobInstanceDetail) {
    return <div>No job instance details found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Job Instance Info */}
      <Card title="Job Instance Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
            <p className="font-medium">{jobInstanceDetail.jobInstanceId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Job Name</p>
            <p className="font-medium">{jobInstanceDetail.jobName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Job Key</p>
            <p className="font-medium break-all">{jobInstanceDetail.jobKey}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Version</p>
            <p className="font-medium">{jobInstanceDetail.version}</p>
          </div>
        </div>
      </Card>

      {/* Job Executions Table */}
      <Card title="Job Executions">
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">ID</th>
                <th className="table-header-cell">Create Time</th>
                <th className="table-header-cell">Start Time</th>
                <th className="table-header-cell">End Time</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Exit Code</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {jobInstanceDetail.executions.map((execution) => (
                <tr key={execution.jobExecutionId} className="table-row">
                  <td className="table-cell">
                    <Link to={`/job-executions/${execution.jobExecutionId}`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
                      {execution.jobExecutionId}
                    </Link>
                  </td>
                  <td className="table-cell">
                    <DateTime date={execution.createTime} />
                  </td>
                  <td className="table-cell">
                    <DateTime date={execution.startTime} />
                  </td>
                  <td className="table-cell">{execution.endTime ? <DateTime date={execution.endTime} /> : <span className="text-gray-500 dark:text-gray-400">-</span>}</td>
                  <td className="table-cell">
                    <StatusBadge status={execution.status} />
                  </td>
                  <td className="table-cell">
                    <div className="group relative">
                      <div>{execution.exitCode}</div>
                      {execution.exitMessage && <div className="hidden group-hover:block absolute left-0 top-full z-10 p-2 bg-white dark:bg-gray-800 shadow-lg rounded border border-gray-200 dark:border-gray-700 text-xs max-w-md">{execution.exitMessage}</div>}
                    </div>
                  </td>
                  <td className="table-cell">
                    <Link to={`/job-executions/${execution.jobExecutionId}`} className="btn btn-outline py-1 px-2 text-xs">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}

              {/* No executions message */}
              {jobInstanceDetail.executions.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-cell text-center py-8 text-gray-500 dark:text-gray-400">
                    No job executions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/job-instances')}
          className="btn-outline"
        >
          Back to Job Instances
        </button>
      </div>
    </div>
  );
};

export default JobInstanceDetail;
