import React from 'react'
import { JobStatus, StepStatus } from '../types/batch'

interface BadgeProps {
  status: JobStatus | StepStatus
  className?: string
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  // Map status to badge style
  const getBadgeClass = (status: JobStatus | StepStatus): string => {
    switch (status) {
      case 'COMPLETED':
        return 'badge-success'
      case 'FAILED':
        return 'badge-danger'
      case 'ABANDONED':
        return 'badge-danger'
      case 'STOPPED':
        return 'badge-warning'
      case 'STOPPING':
        return 'badge-warning'
      case 'STARTED':
        return 'badge-info'
      case 'STARTING':
        return 'badge-info'
      default:
        return 'badge-secondary'
    }
  }

  return (
    <span className={`${getBadgeClass(status)} ${className}`}>
      {status}
    </span>
  )
}
