import React from 'react';
import tokens from '../tokens';

export interface ButtonProps {
  /**
   * Button contents
   */
  children: React.ReactNode;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Button variant
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  /**
   * Button size
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional additional className
   */
  className?: string;
  /**
   * Is button disabled
   */
  disabled?: boolean;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Icon to display before children
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display after children
   */
  endIcon?: React.ReactNode;
  /**
   * Set to true for a round button with only an icon
   */
  iconOnly?: boolean;
}

/**
 * Primary UI component for user interaction in the EVA Design System
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  fullWidth = false,
  type = 'button',
  startIcon,
  endIcon,
  iconOnly = false,
  ...props
}: ButtonProps) => {
  // Base classes shared by all buttons
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-md focus:outline-none';

  // Variant-specific styling
  const variantClasses = {
    primary: `bg-${tokens.colors.brand.primary[600]} text-white hover:bg-${tokens.colors.brand.primary[700]} focus:ring-2 focus:ring-${tokens.colors.brand.primary[500]} focus:ring-offset-2`,
    secondary: `bg-${tokens.colors.neutral.silver[200]} text-gray-800 hover:bg-${tokens.colors.neutral.silver[300]} focus:ring-2 focus:ring-gray-400 focus:ring-offset-2`,
    danger: `bg-${tokens.colors.semantic.risk.default} text-white hover:bg-${tokens.colors.semantic.risk.dark} focus:ring-2 focus:ring-${tokens.colors.semantic.risk.default} focus:ring-offset-2`,
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    outline: `bg-transparent border border-${tokens.colors.neutral.silver[300]} text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-${tokens.colors.brand.primary[500]} focus:ring-offset-2`,
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:ring-offset-1',
  };

  // Size-specific styling
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-base',
  };

  // Icon-only button sizing
  const iconOnlySizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3',
  };

  // Apply appropriate styles based on props
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthClasses = fullWidth ? 'w-full' : '';
  const sizeClass = iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size];
  const iconSpacing = !iconOnly && startIcon ? 'gap-2' : !iconOnly && endIcon ? 'gap-2' : '';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClass} ${disabledClasses} ${widthClasses} ${iconSpacing} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {startIcon && startIcon}
      {!iconOnly && children}
      {endIcon && endIcon}
    </button>
  );
};

export default Button; 