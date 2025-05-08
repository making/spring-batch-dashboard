import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`
          ${sizeClasses[size]} 
          border-gray-300 
          border-t-primary-600 
          dark:border-gray-700 
          dark:border-t-primary-400 
          rounded-full 
          animate-spin 
          ${className}
        `}
      />
    </div>
  )
}
