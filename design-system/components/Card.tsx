import React from 'react';
import tokens from '../tokens';

export interface CardProps {
  /**
   * Card contents
   */
  children: React.ReactNode;
  /**
   * Card variant
   */
  variant?: 'default' | 'highlight' | 'interactive' | 'subdued';
  /**
   * Optional card title
   */
  title?: string | React.ReactNode;
  /**
   * Optional card subtitle
   */
  subtitle?: string | React.ReactNode;
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
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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
  /**
   * Border radius size
   */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Elevation level (shadow depth)
   */
  elevation?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  /**
   * Whether to use dark theme styling
   */
  darkMode?: boolean;
}

/**
 * Card component for containing content in the EVA Design System
 */
export const Card = ({
  children,
  variant = 'default',
  title,
  subtitle,
  onClick,
  className = '',
  padding = 'md',
  headerActions,
  footer,
  fullHeight = false,
  borderRadius = 'md',
  elevation = 'sm',
  darkMode = false,
  ...props
}: CardProps) => {
  // Base styles that apply to all cards
  const baseClasses = `overflow-hidden transition-all`;
  
  // Border radius classes mapped from tokens
  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  };
  
  // Shadow/elevation classes
  const shadowClasses = {
    none: 'shadow-none',
    xs: 'shadow-sm',
    sm: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };
  
  // Variant-specific styling including borders and background colors
  const variantClasses = {
    default: darkMode 
      ? `bg-${tokens.colors.theme.dark.card} border border-gray-700 text-${tokens.colors.theme.dark.text.primary}`
      : 'bg-white border border-gray-200 text-gray-900',
    highlight: darkMode
      ? `bg-${tokens.colors.theme.dark.card} border-2 border-${tokens.colors.brand.primary[700]} text-${tokens.colors.theme.dark.text.primary}`
      : `bg-white border-2 border-${tokens.colors.brand.primary[500]} text-gray-900`,
    interactive: darkMode
      ? `bg-${tokens.colors.theme.dark.card} border border-gray-700 hover:border-${tokens.colors.brand.primary[600]} hover:${shadowClasses.md} cursor-pointer text-${tokens.colors.theme.dark.text.primary}`
      : `bg-white border border-gray-200 hover:border-${tokens.colors.brand.primary[300]} hover:${shadowClasses.md} cursor-pointer text-gray-900`,
    subdued: darkMode
      ? `bg-gray-800 border border-gray-700 text-${tokens.colors.theme.dark.text.primary}`
      : 'bg-gray-50 border border-gray-200 text-gray-900',
  };
  
  // Padding classes
  const paddingClasses = {
    none: 'p-0',
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  // Height class for full height cards
  const heightClass = fullHeight ? 'h-full flex flex-col' : '';
  
  // Event handler only applies to interactive cards
  const handleClick = variant === 'interactive' ? onClick : undefined;
  
  // Compose the final classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${radiusClasses[borderRadius]}
    ${shadowClasses[elevation]}
    ${heightClass}
    ${className}
  `;
  
  // Border color for internal borders (header/footer)
  const internalBorderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const headerPaddingClass = padding !== 'none' ? paddingClasses[padding] : 'px-4 py-3';
  const childrenContainerClass = fullHeight ? 'flex-grow' : '';
  
  return (
    <div
      className={cardClasses.trim()}
      onClick={handleClick}
      {...props}
    >
      {/* Card Header */}
      {(title || headerActions) && (
        <div
          className={`border-b ${internalBorderColor} flex justify-between items-center ${headerPaddingClass}`}
        >
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-lg font-medium">{title}</h3>
            ) : (
              title
            )}
            {typeof subtitle === 'string' ? (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            ) : (
              subtitle && <div className="mt-1">{subtitle}</div>
            )}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </div>
      )}

      {/* Card Content */}
      <div className={`${paddingClasses[padding]} ${childrenContainerClass}`}>{children}</div>

      {/* Card Footer */}
      {footer && (
        <div className={`border-t ${internalBorderColor} ${paddingClasses[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 