import React from 'react';

export interface CardProps {
  /**
   * Card contents
   */
  children: React.ReactNode;
  /**
   * Card variant
   */
  variant?: 'default' | 'highlight' | 'interactive';
  /**
   * Optional card title
   */
  title?: string;
  /**
   * Optional card subtitle
   */
  subtitle?: string;
  /**
   * Optional click handler (for interactive cards)
   */
  onClick?: () => void;
  /**
   * Optional additional className
   */
  className?: string;
  /**
   * Padding size
   */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /**
   * Optional header actions (buttons, icons, etc.)
   */
  headerActions?: React.ReactNode;
  /**
   * Optional footer content
   */
  footer?: React.ReactNode;
  /**
   * Whether the card should take full height
   */
  fullHeight?: boolean;
}

/**
 * Card component for containing content
 */
export const Card = ({
  children,
  variant = 'default',
  title,
  subtitle,
  onClick,
  className = '',
  padding = 'medium',
  headerActions,
  footer,
  fullHeight = false,
  ...props
}: CardProps) => {
  const baseClasses = 'bg-white rounded-lg overflow-hidden';

  const variantClasses = {
    default: 'shadow-sm border border-gray-200',
    highlight: 'shadow-sm border border-primary-500',
    interactive:
      'shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer',
  };

  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };

  const heightClass = fullHeight ? 'h-full' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${heightClass} ${className}`}
      onClick={variant === 'interactive' ? onClick : undefined}
      {...props}
    >
      {/* Card Header */}
      {(title || headerActions) && (
        <div
          className={`border-b border-gray-200 flex justify-between items-center ${paddingClasses[padding]}`}
        >
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className={paddingClasses[padding]}>{children}</div>

      {/* Card Footer */}
      {footer && (
        <div className={`border-t border-gray-200 ${paddingClasses[padding]}`}>{footer}</div>
      )}
    </div>
  );
};

export default Card;
