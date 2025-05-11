/**
 * Standardized API Error Handler
 * 
 * This utility provides a consistent way to handle API errors throughout the application.
 */

export interface ApiError {
  status: number;
  code: string;
  message: string;
  details?: Record<string, any>;
  originalError?: any;
}

export class ApiErrorHandler {
  /**
   * Formats error responses into a standardized format
   */
  static formatError(error: any): ApiError {
    // Handle fetch/axios errors
    if (error.response) {
      // Axios error style
      return {
        status: error.response.status,
        code: error.response.data?.code || 'API_ERROR',
        message: error.response.data?.message || 'An error occurred while communicating with the server',
        details: error.response.data?.details,
        originalError: error
      };
    } else if (error.status && error.statusText) {
      // Fetch error style
      return {
        status: error.status,
        code: 'API_ERROR',
        message: error.statusText || 'An error occurred while communicating with the server',
        originalError: error
      };
    } else if (error instanceof Error) {
      // Javascript error
      return {
        status: 500,
        code: 'CLIENT_ERROR',
        message: error.message || 'An unexpected client error occurred',
        originalError: error
      };
    }

    // Unknown error format - standardize it
    return {
      status: 500,
      code: 'UNKNOWN_ERROR',
      message: error?.message || 'An unknown error occurred',
      originalError: error
    };
  }

  /**
   * User-friendly error message based on error type
   */
  static getUserFriendlyMessage(error: ApiError): string {
    switch (error.status) {
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource could not be found.';
      case 422:
        return 'The form contains errors. Please check your inputs.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'The server encountered an error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }

  /**
   * Handle API errors in a standardized way
   */
  static handleError(error: any, setError?: (error: ApiError) => void, showToast?: (message: string, type: 'error') => void) {
    const formattedError = this.formatError(error);
    
    // Log all errors to console for debugging
    console.error('API Error:', formattedError);
    
    // Set error state if a setter is provided
    if (setError) {
      setError(formattedError);
    }
    
    // Show toast notification if available
    if (showToast) {
      showToast(this.getUserFriendlyMessage(formattedError), 'error');
    }
    
    return formattedError;
  }
}

/**
 * Custom hook for API error handling
 */
export const useApiErrorHandler = () => {
  return {
    handleError: ApiErrorHandler.handleError,
    getUserFriendlyMessage: ApiErrorHandler.getUserFriendlyMessage,
    formatError: ApiErrorHandler.formatError
  };
}; 