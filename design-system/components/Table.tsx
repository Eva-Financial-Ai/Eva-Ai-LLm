import React from 'react';
import tokens from '../tokens';

export interface TableColumn<T> {
  /**
   * Unique identifier for the column
   */
  key: string;
  /**
   * Header text to display
   */
  header: React.ReactNode;
  /**
   * Function to render cell content
   */
  render?: (item: T, index: number) => React.ReactNode;
  /**
   * Width of the column (can be px, %, etc.)
   */
  width?: string;
  /**
   * Whether the column is sortable
   */
  sortable?: boolean;
  /**
   * Text alignment for the column
   */
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  /**
   * Columns configuration
   */
  columns: TableColumn<T>[];
  /**
   * Data to display in the table
   */
  data: T[];
  /**
   * Key to identify each row (function or string property name)
   */
  rowKey: ((item: T, index: number) => string) | string;
  /**
   * Optional CSS class name for the table container
   */
  className?: string;
  /**
   * Whether to use the dense layout (less padding)
   */
  dense?: boolean;
  /**
   * Whether to add zebra striping to rows
   */
  striped?: boolean;
  /**
   * Whether to add borders between cells
   */
  bordered?: boolean;
  /**
   * Whether to highlight rows on hover
   */
  hoverable?: boolean;
  /**
   * Whether to use dark theme styling
   */
  darkMode?: boolean;
  /**
   * Text to display when table has no data
   */
  emptyText?: React.ReactNode;
  /**
   * Function called when a row is clicked
   */
  onRowClick?: (item: T, index: number) => void;
  /**
   * Currently sorted column key
   */
  sortedColumn?: string;
  /**
   * Current sort direction
   */
  sortDirection?: 'asc' | 'desc';
  /**
   * Function called when a sortable column header is clicked
   */
  onSort?: (column: string) => void;
  /**
   * Whether the table is currently loading data
   */
  loading?: boolean;
  /**
   * Function to apply custom styling to a specific row
   */
  rowClassName?: (item: T, index: number) => string;
}

/**
 * Table component for displaying data in a consistent, flexible way
 */
export function Table<T>({
  columns,
  data,
  rowKey,
  className = '',
  dense = false,
  striped = false,
  bordered = false,
  hoverable = true,
  darkMode = false,
  emptyText = 'No data available',
  onRowClick,
  sortedColumn,
  sortDirection = 'asc',
  onSort,
  loading = false,
  rowClassName,
}: TableProps<T>) {
  // Base table styles
  const tableClasses = 'min-w-full divide-y divide-gray-200 dark:divide-gray-700';
  
  // Header cell styles
  const headerCellClasses = `
    ${dense ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'}
    font-medium text-left
    ${darkMode ? 'text-gray-200 bg-gray-800' : 'text-gray-500 bg-gray-50'}
    ${bordered ? 'border-r border-gray-200 dark:border-gray-700 last:border-r-0' : ''}
  `;
  
  // Body cell styles
  const bodyCellClasses = `
    ${dense ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'}
    ${darkMode ? 'text-gray-200' : 'text-gray-900'}
    ${bordered ? 'border-r border-gray-200 dark:border-gray-700 last:border-r-0' : ''}
  `;
  
  // Row styles
  const rowBaseClasses = `
    ${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : ''}
    ${bordered ? 'border-b border-gray-200 dark:border-gray-700' : ''}
  `;
  
  // Get the row key for a given data item
  const getRowKey = (item: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(item, index);
    }
    return String((item as any)[rowKey]) || `row-${index}`;
  };
  
  // Sort indicator component
  const SortIndicator = ({ direction }: { direction?: 'asc' | 'desc' }) => {
    if (!direction) return null;
    
    return (
      <span className="ml-1 inline-block">
        {direction === 'asc' ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14l5-5 5 5H7z" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        )}
      </span>
    );
  };
  
  // Handle column header click for sorting
  const handleHeaderClick = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };
  
  // Loading overlay
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
  
  return (
    <div className={`relative overflow-hidden rounded-lg shadow ${className}`}>
      {loading && <LoadingOverlay />}
      
      <div className="overflow-x-auto">
        <table className={tableClasses}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`
                    ${headerCellClasses}
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.sortable ? 'cursor-pointer select-none' : ''}
                  `}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleHeaderClick(column)}
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    {column.sortable && sortedColumn === column.key && (
                      <SortIndicator direction={sortDirection} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`${bodyCellClasses} text-center py-6`}
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={getRowKey(item, rowIndex)}
                  className={`
                    ${rowBaseClasses}
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800' : ''}
                    ${rowClassName ? rowClassName(item, rowIndex) : ''}
                  `}
                  onClick={() => onRowClick && onRowClick(item, rowIndex)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowIndex}-${column.key || colIndex}`}
                      className={`
                        ${bodyCellClasses}
                        ${column.align === 'center' ? 'text-center' : ''}
                        ${column.align === 'right' ? 'text-right' : ''}
                      `}
                    >
                      {column.render
                        ? column.render(item, rowIndex)
                        : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 