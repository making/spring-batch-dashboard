import { Component, ErrorInfo, ReactNode } from 'react';
import { AuthenticationError } from '../api/httpClient';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isAuthError: boolean;
}

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in the component tree
 * Has special handling for 401 Unauthorized errors
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      isAuthError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if the error is related to authentication (401)
    const isAuthError = error instanceof AuthenticationError;

    // Update state with error details
    return {
      hasError: true,
      error,
      isAuthError,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    const { hasError, error, isAuthError } = this.state;

    if (hasError) {
      // For authentication errors, display login button
      if (isAuthError) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                Authentication Required
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {error?.message || 'You need to log in to access this resource.'}
              </p>
              <a
                href="/login"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </a>
            </div>
          </div>
        );
      }

      // For other errors, display a fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            {error && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto">
                <p className="font-mono text-sm text-gray-800 dark:text-gray-200">
                  {error.toString()}
                </p>
              </div>
            )}
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
