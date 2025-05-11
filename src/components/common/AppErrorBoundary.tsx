import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to monitoring service
    console.error('Error caught by AppErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
    
    // In production, you would send this to your error tracking service
    // e.g., Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // sendToErrorTrackingService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-center text-xl font-bold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-center text-gray-600 mb-6">
              We've encountered an unexpected error in the application. Our team has been notified.
            </p>

            <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-auto max-h-32">
              <p className="text-sm font-mono text-red-600">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.errorInfo && (
              <div className="bg-gray-100 p-4 rounded-md mb-4 overflow-auto max-h-32">
                <p className="text-sm font-mono text-gray-700">
                  {this.state.errorInfo.componentStack}
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <button
                onClick={this.handleReset}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition duration-150 ease-in-out"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-150 ease-in-out"
              >
                Go to home page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary; 