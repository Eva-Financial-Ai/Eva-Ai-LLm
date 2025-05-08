import React, { PropsWithChildren } from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';

interface ErrorBoundaryProps extends PropsWithChildren {
  fallbackComponent?: React.ComponentType<FallbackProps>;
  onReset?: () => void;
}

// Default fallback component for error states
const DefaultFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message || 'An unexpected error occurred'}</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={resetErrorBoundary}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default logging function
const logError = (error: Error, info: React.ErrorInfo) => {
  // In a production app, you'd want to log this to a service like Sentry
  console.error('Error caught by ErrorBoundary:', error);
  console.error('Component stack:', info.componentStack || 'No component stack available');
};

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  fallbackComponent, 
  onReset 
}) => {
  const handleReset = () => {
    // Call custom reset logic if provided
    if (onReset) {
      onReset();
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallbackComponent || DefaultFallback}
      onReset={handleReset}
      onError={logError}
    >
      {children}
    </ReactErrorBoundary>
  );
};

// Loading fallback components
export const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-48">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-primary-600 text-lg">{message}</p>
    </div>
  );
};

// Simple skeleton loader
export const SkeletonLoader: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 3, 
  className = "" 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div 
          key={index} 
          className="h-4 bg-gray-200 rounded mb-3"
          style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
        ></div>
      ))}
    </div>
  );
};

export default ErrorBoundary; 