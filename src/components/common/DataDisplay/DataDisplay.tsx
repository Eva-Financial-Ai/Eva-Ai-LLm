import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays, subMonths, subWeeks, subYears } from 'date-fns';

export type DataDisplayType = 'table' | 'chart' | 'card' | 'list';
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'donut';
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';
export type SortDirection = 'asc' | 'desc';

export interface DataDisplayProps<T> {
  /**
   * The type of display to render
   */
  displayType: DataDisplayType;
  /**
   * For chart displays, specify chart type
   */
  chartType?: ChartType;
  /**
   * The data to display
   */
  data: T[];
  /**
   * Function to convert data item to a label
   */
  getLabel: (item: T) => string;
  /**
   * Function to convert data item to a value
   */
  getValue: (item: T) => number;
  /**
   * Optional function to get date from data item
   */
  getDate?: (item: T) => Date;
  /**
   * Enable time period filtering
   */
  enableTimeFilter?: boolean;
  /**
   * Default time period to display
   */
  defaultTimePeriod?: TimePeriod;
  /**
   * Enable sorting
   */
  enableSorting?: boolean;
  /**
   * Default sort direction
   */
  defaultSortDirection?: SortDirection;
  /**
   * Optional title
   */
  title?: string;
  /**
   * Optional description
   */
  description?: string;
  /**
   * Additional CSS class
   */
  className?: string;
  /**
   * Set maximum items to display
   */
  maxItems?: number;
  /**
   * Custom table columns (for table display)
   */
  columns?: Array<{
    key: string;
    header: string;
    render: (item: T) => React.ReactNode;
  }>;
  /**
   * Profile ID to filter data by
   */
  profileId?: string;
}

/**
 * DataDisplay component for flexibly displaying data
 */
export function DataDisplay<T>({
  displayType,
  chartType = 'bar',
  data,
  getLabel,
  getValue,
  getDate,
  enableTimeFilter = false,
  defaultTimePeriod = 'month',
  enableSorting = false,
  defaultSortDirection = 'desc',
  title,
  description,
  className = '',
  maxItems = 10,
  columns = [],
  profileId,
}: DataDisplayProps<T>) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(defaultTimePeriod);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  const [activeProfileId, setActiveProfileId] = useState<string | undefined>(profileId);

  // Filter data by time period
  const filteredData = useMemo(() => {
    if (!enableTimeFilter || !getDate || timePeriod === 'all') {
      return data;
    }

    const now = new Date();
    let cutoffDate: Date;

    switch (timePeriod) {
      case 'day':
        cutoffDate = subDays(now, 1);
        break;
      case 'week':
        cutoffDate = subWeeks(now, 1);
        break;
      case 'month':
        cutoffDate = subMonths(now, 1);
        break;
      case 'quarter':
        cutoffDate = subMonths(now, 3);
        break;
      case 'year':
        cutoffDate = subYears(now, 1);
        break;
      default:
        cutoffDate = new Date(0); // Beginning of time
    }

    return data.filter(item => {
      const itemDate = getDate(item);
      return itemDate >= cutoffDate;
    });
  }, [data, timePeriod, enableTimeFilter, getDate]);

  // Filter by profile if needed
  const profileFilteredData = useMemo(() => {
    if (!activeProfileId) {
      return filteredData;
    }

    return filteredData.filter(item => {
      // This is a placeholder. You would implement your own logic
      // to filter by profile ID based on your data structure
      return (item as any).profileId === activeProfileId;
    });
  }, [filteredData, activeProfileId]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!enableSorting) {
      return profileFilteredData;
    }

    return [...profileFilteredData].sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);

      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }, [profileFilteredData, sortDirection, enableSorting, getValue]);

  // Limit data to max items
  const limitedData = useMemo(() => {
    if (maxItems <= 0) {
      return sortedData;
    }

    return sortedData.slice(0, maxItems);
  }, [sortedData, maxItems]);

  // Helper to format the data for charts
  const chartData = useMemo(() => {
    return {
      labels: limitedData.map(getLabel),
      datasets: [
        {
          data: limitedData.map(getValue),
          backgroundColor: [
            '#2563eb', // blue
            '#10b981', // green
            '#f59e0b', // yellow
            '#ef4444', // red
            '#8b5cf6', // purple
            '#ec4899', // pink
            '#06b6d4', // cyan
            '#84cc16', // lime
            '#14b8a6', // teal
            '#f43f5e', // rose
          ],
        },
      ],
    };
  }, [limitedData, getLabel, getValue]);

  // Render time period filter if enabled
  const renderTimeFilter = () => {
    if (!enableTimeFilter) return null;

    return (
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm text-gray-500">Time Period:</span>
        <select
          value={timePeriod}
          onChange={e => setTimePeriod(e.target.value as TimePeriod)}
          className="text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
    );
  };

  // Render sort controls if enabled
  const renderSortControls = () => {
    if (!enableSorting) return null;

    return (
      <div className="flex items-center space-x-2 mb-4 ml-4">
        <span className="text-sm text-gray-500">Sort:</span>
        <select
          value={sortDirection}
          onChange={e => setSortDirection(e.target.value as SortDirection)}
          className="text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="asc">Lowest First</option>
          <option value="desc">Highest First</option>
        </select>
      </div>
    );
  };

  // Render profile selector if profileId is available
  const renderProfileSelector = () => {
    if (!profileId) return null;

    // In a real app, you might fetch a list of profiles from an API
    // This is just a placeholder
    const profiles = [
      { id: profileId, name: 'Current Profile' },
      { id: 'profile2', name: 'Profile 2' },
      { id: 'profile3', name: 'Profile 3' },
    ];

    return (
      <div className="flex items-center space-x-2 mb-4 ml-4">
        <span className="text-sm text-gray-500">Profile:</span>
        <select
          value={activeProfileId}
          onChange={e => setActiveProfileId(e.target.value)}
          className="text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">All Profiles</option>
          {profiles.map(profile => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Render content based on display type
  const renderContent = () => {
    if (limitedData.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No data available for the selected filters.
        </div>
      );
    }

    switch (displayType) {
      case 'table':
        return renderTable();
      case 'chart':
        return renderChart();
      case 'card':
        return renderCards();
      case 'list':
        return renderList();
      default:
        return <div>Unsupported display type</div>;
    }
  };

  // Render a table display
  const renderTable = () => {
    // Use provided columns or generate default ones
    const tableColumns =
      columns.length > 0
        ? columns
        : [
            {
              key: 'label',
              header: 'Name',
              render: (item: T) => getLabel(item),
            },
            {
              key: 'value',
              header: 'Value',
              render: (item: T) => getValue(item).toLocaleString(),
            },
            {
              key: 'date',
              header: 'Date',
              render: (item: T) => (getDate ? format(getDate(item), 'MMM d, yyyy') : 'N/A'),
            },
          ];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {tableColumns.map(column => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {limitedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {tableColumns.map(column => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render a chart (placeholder - in a real app, use a charting library)
  const renderChart = () => {
    return (
      <div className="h-64 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">
          Chart would be rendered here (using React-ChartJS-2 or similar).
          <br />
          Chart Type: {chartType}
          <br />
          Data Points: {limitedData.length}
        </p>
      </div>
    );
  };

  // Render cards
  const renderCards = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {limitedData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 truncate">{getLabel(item)}</h3>
            <p className="mt-1 text-3xl font-semibold text-primary-600">
              {getValue(item).toLocaleString()}
            </p>
            {getDate && (
              <p className="mt-1 text-sm text-gray-500">{format(getDate(item), 'MMM d, yyyy')}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render a simple list
  const renderList = () => {
    return (
      <ul className="divide-y divide-gray-200">
        {limitedData.map((item, index) => (
          <li key={index} className="py-3 flex justify-between items-center hover:bg-gray-50 px-3">
            <span className="text-sm font-medium text-gray-900">{getLabel(item)}</span>
            <span className="text-sm text-gray-600">{getValue(item).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}

      {/* Controls */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center">
        {renderTimeFilter()}
        {renderSortControls()}
        {renderProfileSelector()}
      </div>

      {/* Content */}
      <div className="px-4 py-5 sm:p-6">{renderContent()}</div>
    </div>
  );
}

export default DataDisplay;
