import React from 'react';

export interface FormWrapperProps {
  /**
   * Form title
   */
  title?: string;
  /**
   * Form description
   */
  description?: string;
  /**
   * Form content
   */
  children: React.ReactNode;
  /**
   * Submit button text
   */
  submitText?: string;
  /**
   * Cancel button text
   */
  cancelText?: string;
  /**
   * Form submit handler
   */
  onSubmit?: (e: React.FormEvent) => void;
  /**
   * Cancel button handler
   */
  onCancel?: () => void;
  /**
   * Is the form submitting
   */
  isSubmitting?: boolean;
  /**
   * Max width of the form
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Additional actions to render in the footer
   */
  additionalActions?: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  description,
  children,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onSubmit,
  onCancel,
  isSubmitting = false,
  maxWidth = 'md',
  additionalActions,
  className = '',
}) => {
  const maxWidthClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'w-full',
  };

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden"
      >
        {/* Form Header */}
        {(title || description) && (
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            {title && <h2 className="text-xl font-semibold text-gray-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
        )}

        {/* Form Content */}
        <div className="px-6 py-5 space-y-6">{children}</div>

        {/* Form Actions */}
        {(onSubmit || onCancel || additionalActions) && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
            {additionalActions && <div className="mr-auto">{additionalActions}</div>}

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {cancelText}
              </button>
            )}

            {onSubmit && (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-primary-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  submitText
                )}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default FormWrapper;
