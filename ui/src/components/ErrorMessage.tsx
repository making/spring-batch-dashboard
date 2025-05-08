import React from 'react'

type ErrorMessageProps = {
  error: Error | unknown
  className?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className = '' }) => {
  // Helper to format error message
  const formatErrorMessage = (error: Error | unknown): string => {
    if (error instanceof Error) {
      return error.message
    }
    
    if (typeof error === 'string') {
      return error
    }
    
    return 'An unknown error occurred'
  }

  return (
    <div className={`bg-danger-50 text-danger-700 p-4 rounded-md dark:bg-danger-900 dark:text-danger-200 ${className}`}>
      <p className="font-semibold">Error:</p>
      <p>{formatErrorMessage(error)}</p>
    </div>
  )
}
