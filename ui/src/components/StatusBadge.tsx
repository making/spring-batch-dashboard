import React from 'react'
import { JobStatus, StepStatus } from '../types/batch'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  HelpCircle 
} from 'lucide-react'

interface BadgeProps {
  status: JobStatus | StepStatus
  className?: string
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  // Map status to badge style and icon
  const getStatusInfo = (status: JobStatus | StepStatus): { badgeClass: string, icon: React.ReactNode } => {
    switch (status) {
      case 'COMPLETED':
        return { badgeClass: 'badge-success', icon: <CheckCircle size={14} /> }
      case 'FAILED':
        return { badgeClass: 'badge-danger', icon: <XCircle size={14} /> }
      case 'ABANDONED':
        return { badgeClass: 'badge-danger', icon: <XCircle size={14} /> }
      case 'STOPPED':
        return { badgeClass: 'badge-warning', icon: <Pause size={14} /> }
      case 'STOPPING':
        return { badgeClass: 'badge-warning', icon: <AlertTriangle size={14} /> }
      case 'STARTED':
        return { badgeClass: 'badge-info', icon: <Play size={14} /> }
      case 'STARTING':
        return { badgeClass: 'badge-info', icon: <RotateCcw size={14} /> }
      default:
        return { badgeClass: 'badge-secondary', icon: <HelpCircle size={14} /> }
    }
  }

  const { badgeClass, icon } = getStatusInfo(status)

  return (
    <span className={`${badgeClass} ${className} flex items-center gap-1`}>
      {icon}
      <span>{status}</span>
    </span>
  )
}
