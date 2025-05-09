import React from 'react';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface GridProps {
  /**
   * Grid child elements
   */
  children: React.ReactNode;
  /**
   * Number of columns (12 column grid)
   */
  cols?: {
    xs?: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
  };
  /**
   * Gap size between grid items
   */
  gap?: GridGap;
  /**
   * Whether the grid should be full width
   */
  fullWidth?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to use flex instead of grid
   */
  useFlex?: boolean;
  /**
   * Container padding size
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Grid component for responsive layouts using CSS Grid or Flexbox
 */
export const Grid: React.FC<GridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = 'md',
  fullWidth = false,
  className = '',
  useFlex = false,
  padding = 'md',
}) => {
  // Gap size classes
  const gapSizeClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  // Padding size classes
  const paddingSizeClasses = {
    none: 'p-0',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  // For grid, handle responsive columns
  const getGridColsClasses = () => {
    const classes: string[] = [];
    if (cols.xs) classes.push(`grid-cols-${cols.xs}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    return classes.join(' ');
  };

  // For flex, handle responsive wrapping
  const getFlexColsClasses = () => {
    // With flex, we use different width classes for children
    return 'flex flex-wrap';
  };

  const containerClasses = [
    fullWidth ? 'w-full' : 'w-auto',
    paddingSizeClasses[padding],
    className,
  ].join(' ');

  const layoutClasses = [
    useFlex ? getFlexColsClasses() : `grid ${getGridColsClasses()}`,
    gapSizeClasses[gap],
  ].join(' ');

  return (
    <div className={containerClasses}>
      <div className={layoutClasses}>{children}</div>
    </div>
  );
};

export interface GridItemProps {
  /**
   * Grid item content
   */
  children: React.ReactNode;
  /**
   * How many columns this item should span
   */
  span?: {
    xs?: GridColumns;
    sm?: GridColumns;
    md?: GridColumns;
    lg?: GridColumns;
    xl?: GridColumns;
  };
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * GridItem component for use within a Grid
 */
export const GridItem: React.FC<GridItemProps> = ({ children, span = {}, className = '' }) => {
  // Calculate span classes for grid items
  const getSpanClasses = () => {
    const classes: string[] = [];
    if (span.xs) classes.push(`col-span-${span.xs}`);
    if (span.sm) classes.push(`sm:col-span-${span.sm}`);
    if (span.md) classes.push(`md:col-span-${span.md}`);
    if (span.lg) classes.push(`lg:col-span-${span.lg}`);
    if (span.xl) classes.push(`xl:col-span-${span.xl}`);
    return classes.join(' ');
  };

  const itemClasses = [getSpanClasses(), className].join(' ');

  return <div className={itemClasses}>{children}</div>;
};

export default { Grid, GridItem };
