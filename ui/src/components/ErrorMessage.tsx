import { AuthenticationError } from '../api/httpClient'

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

  // Check if it's an authentication error (401)
  const isAuthError = error instanceof AuthenticationError

  return (
    <div className={`bg-danger-50 text-danger-700 p-4 rounded-md dark:bg-danger-900 dark:text-danger-200 ${className}`}>
      <p className="font-semibold">{isAuthError ? 'Authentication Required:' : 'Error:'}</p>
      <p>{formatErrorMessage(error)}</p>
      
      {/* Show login button for authentication errors */}
      {isAuthError && (
        <a 
          href="/login"
          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-danger-600 hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
        >
          Go to Login
        </a>
      )}
    </div>
  )
}
