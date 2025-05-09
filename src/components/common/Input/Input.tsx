import React, { forwardRef, InputHTMLAttributes } from 'react';
import tokens from '../../../styles/tokens';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label text
   */
  label?: string;
  /**
   * Helper text displayed below the input
   */
  helperText?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Input size
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Label position
   */
  labelPosition?: 'top' | 'left';
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Leading icon component
   */
  leadingIcon?: React.ReactNode;
  /**
   * Trailing icon component
   */
  trailingIcon?: React.ReactNode;
  /**
   * Custom ClassName for the input container
   */
  containerClassName?: string;
}

/**
 * Input component for forms with various customization options
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      label,
      helperText,
      error,
      size = 'medium',
      labelPosition = 'top',
      required = false,
      leadingIcon,
      trailingIcon,
      containerClassName = '',
      className = '',
      ...rest
    },
    ref
  ) => {
    const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Determine size classes
    const sizeClasses = {
      small: 'px-2 py-1 text-xs',
      medium: 'px-3 py-2 text-sm',
      large: 'px-4 py-3 text-base',
    };

    // Base input classes
    const inputBaseClasses =
      'block w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500';

    // State-specific classes
    const stateClasses = error
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 text-gray-900 placeholder-gray-400';

    // Label classes
    const labelClasses = 'text-sm font-medium text-gray-700';

    // Padding for icons
    const hasLeadingIcon = leadingIcon ? 'pl-10' : '';
    const hasTrailingIcon = trailingIcon ? 'pr-10' : '';

    // Label position classes
    const labelContainerClasses =
      labelPosition === 'left' ? 'flex items-center mb-0' : 'block mb-1';

    const labelPositionClasses = labelPosition === 'left' ? 'mr-4 w-32 text-right' : '';

    const inputContainerClasses = labelPosition === 'left' ? 'flex-1' : 'w-full';

    return (
      <div className={`mb-4 ${containerClassName}`}>
        {label && (
          <div className={labelContainerClasses}>
            <label htmlFor={inputId} className={`${labelClasses} ${labelPositionClasses}`}>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {labelPosition === 'left' && (
              <div className={inputContainerClasses}>
                <div className="relative">
                  {leadingIcon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {leadingIcon}
                    </div>
                  )}

                  <input
                    ref={ref}
                    id={inputId}
                    name={name}
                    className={`${inputBaseClasses} ${stateClasses} ${sizeClasses[size]} ${hasLeadingIcon} ${hasTrailingIcon} ${className}`}
                    required={required}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                      error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                    }
                    {...rest}
                  />

                  {trailingIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {trailingIcon}
                    </div>
                  )}
                </div>

                {helperText && !error && (
                  <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-500">
                    {helperText}
                  </p>
                )}

                {error && (
                  <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
                    {error}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {labelPosition === 'top' && (
          <>
            <div className="relative">
              {leadingIcon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {leadingIcon}
                </div>
              )}

              <input
                ref={ref}
                id={inputId}
                name={name}
                className={`${inputBaseClasses} ${stateClasses} ${sizeClasses[size]} ${hasLeadingIcon} ${hasTrailingIcon} ${className}`}
                required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={
                  error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                }
                {...rest}
              />

              {trailingIcon && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {trailingIcon}
                </div>
              )}
            </div>

            {helperText && !error && (
              <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-500">
                {helperText}
              </p>
            )}

            {error && (
              <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
                {error}
              </p>
            )}
          </>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
