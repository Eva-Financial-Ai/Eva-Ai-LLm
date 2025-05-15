import React, { forwardRef, InputHTMLAttributes } from 'react';
import tokens from '../tokens';

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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Label position
   */
  labelPosition?: 'top' | 'left' | 'floating';
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
  /**
   * Whether to use dark theme styling
   */
  darkMode?: boolean;
  /**
   * Whether the field is in a loading state
   */
  isLoading?: boolean;
  /**
   * Input variant
   */
  variant?: 'outlined' | 'filled' | 'underlined';
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
      size = 'md',
      labelPosition = 'top',
      required = false,
      leadingIcon,
      trailingIcon,
      containerClassName = '',
      className = '',
      darkMode = false,
      isLoading = false,
      variant = 'outlined',
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const inputId = id || name || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Size classes for different input sizes
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-2.5 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
      xl: 'px-5 py-3 text-base',
    };

    // Base classes for the input element
    const inputBaseClasses = 'block w-full rounded-md transition-all focus:outline-none';

    // Variant-specific classes
    const variantClasses = {
      outlined: darkMode 
        ? 'bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      filled: darkMode
        ? 'bg-gray-700 border-0 border-b-2 border-gray-600 text-white placeholder-gray-400 focus:ring-0 focus:border-primary-500'
        : 'bg-gray-100 border-0 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-0 focus:border-primary-500',
      underlined: darkMode
        ? 'bg-transparent border-0 border-b-2 border-gray-600 text-white placeholder-gray-400 focus:ring-0 focus:border-primary-500 rounded-none px-0'
        : 'bg-transparent border-0 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-0 focus:border-primary-500 rounded-none px-0',
    };

    // Error state classes
    const errorClasses = error
      ? darkMode
        ? 'border-red-500 text-red-400 placeholder-red-400 focus:ring-red-500 focus:border-red-500'
        : 'border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
      : '';

    // Disabled state classes
    const disabledClasses = rest.disabled
      ? darkMode
        ? 'opacity-60 cursor-not-allowed bg-gray-700'
        : 'opacity-60 cursor-not-allowed bg-gray-100'
      : '';

    // Loading state classes
    const loadingClasses = isLoading ? 'opacity-70 cursor-wait' : '';

    // Label classes
    const labelClasses = darkMode
      ? 'text-sm font-medium text-gray-300'
      : 'text-sm font-medium text-gray-700';

    // Calculate padding adjustments for icons
    const hasLeadingIcon = leadingIcon ? 'pl-10' : '';
    const hasTrailingIcon = trailingIcon || isLoading ? 'pr-10' : '';

    // Classes for label position
    const labelContainerClasses =
      labelPosition === 'left' 
        ? 'flex items-center mb-0'
        : labelPosition === 'floating' 
          ? 'relative' 
          : 'block mb-1';

    const labelPositionClasses = labelPosition === 'left' 
      ? 'mr-4 w-32 text-right'
      : labelPosition === 'floating' 
        ? 'absolute -top-2 left-2 px-1 text-xs z-10 bg-white dark:bg-gray-800 transition-all' 
        : '';

    const floatingInputClasses = labelPosition === 'floating' 
      ? 'pt-3' 
      : '';

    const inputContainerClasses = labelPosition === 'left' ? 'flex-1' : 'w-full';

    // Helper and error text classes
    const helperTextClasses = darkMode
      ? 'mt-1 text-xs text-gray-400'
      : 'mt-1 text-xs text-gray-500';
    
    const errorTextClasses = darkMode
      ? 'mt-1 text-xs text-red-400'
      : 'mt-1 text-xs text-red-600';

    return (
      <div className={`mb-4 ${containerClassName}`}>
        {label && labelPosition !== 'floating' && (
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
                    className={`
                      ${inputBaseClasses} 
                      ${variantClasses[variant]} 
                      ${sizeClasses[size]} 
                      ${errorClasses} 
                      ${disabledClasses} 
                      ${loadingClasses} 
                      ${hasLeadingIcon} 
                      ${hasTrailingIcon} 
                      ${className}
                    `}
                    required={required}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                      error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                    }
                    {...rest}
                  />

                  {trailingIcon && !isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {trailingIcon}
                    </div>
                  )}

                  {isLoading && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>

                {helperText && !error && (
                  <p id={`${inputId}-helper`} className={helperTextClasses}>
                    {helperText}
                  </p>
                )}

                {error && (
                  <p id={`${inputId}-error`} className={errorTextClasses}>
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
                className={`
                  ${inputBaseClasses} 
                  ${variantClasses[variant]} 
                  ${sizeClasses[size]} 
                  ${errorClasses} 
                  ${disabledClasses} 
                  ${loadingClasses} 
                  ${hasLeadingIcon} 
                  ${hasTrailingIcon} 
                  ${className}
                `}
                required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={
                  error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                }
                {...rest}
              />

              {trailingIcon && !isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {trailingIcon}
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>

            {helperText && !error && (
              <p id={`${inputId}-helper`} className={helperTextClasses}>
                {helperText}
              </p>
            )}

            {error && (
              <p id={`${inputId}-error`} className={errorTextClasses}>
                {error}
              </p>
            )}
          </>
        )}

        {labelPosition === 'floating' && (
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
              className={`
                ${inputBaseClasses} 
                ${variantClasses[variant]} 
                ${sizeClasses[size]} 
                ${errorClasses} 
                ${disabledClasses} 
                ${loadingClasses} 
                ${hasLeadingIcon} 
                ${hasTrailingIcon} 
                ${floatingInputClasses}
                ${className}
              `}
              placeholder=" "
              required={required}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
              }
              {...rest}
            />

            <label 
              htmlFor={inputId} 
              className={`
                ${labelClasses} 
                ${labelPositionClasses}
                peer-focus:text-primary-500
                peer-focus:dark:text-primary-400
                peer-placeholder-shown:text-gray-400
                peer-placeholder-shown:top-2
                peer-placeholder-shown:text-base
              `}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {trailingIcon && !isLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {trailingIcon}
              </div>
            )}

            {isLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}

            {helperText && !error && (
              <p id={`${inputId}-helper`} className={helperTextClasses}>
                {helperText}
              </p>
            )}

            {error && (
              <p id={`${inputId}-error`} className={errorTextClasses}>
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 