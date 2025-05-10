import React, { useState, useEffect } from 'react';

export type UserRole = 'borrower' | 'vendor' | 'broker' | 'lender' | 'investor' | 'admin';

interface AnalyticsDataPoint {
  label: string;
  value: number;
  prevValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'currency' | 'percent' | 'number';
}

interface AnalyticsChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
  type: 'bar' | 'line' | 'pie' | 'doughnut';
}

interface RoleAnalyticsDisplayProps {
  role: UserRole;
  timeframe?: 'day' | 'week' | 'month' | 'quarter' | 'year';
  onExport?: (format: 'csv' | 'pdf' | 'excel') => void;
  isLoading?: boolean;
  error?: string;
}

const RoleAnalyticsDisplay: React.FC<RoleAnalyticsDisplayProps> = ({
  role,
  timeframe = 'month',
  onExport,
  isLoading = false,
  error = '',
}) => {
  const [metrics, setMetrics] = useState<AnalyticsDataPoint[]>([]);
  const [charts, setCharts] = useState<AnalyticsChartData[]>([]);
  const [selectedChartIndex, setSelectedChartIndex] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Mock data generation based on role
  useEffect(() => {
    if (isLoading) return;

    // Simulate data loading
    setDataLoaded(false);
    const loadTimeout = setTimeout(() => {
      generateRoleSpecificData(role, timeframe);
      setDataLoaded(true);
    }, 500);

    return () => clearTimeout(loadTimeout);
  }, [role, timeframe, isLoading]);

  // Generate role-specific data
  const generateRoleSpecificData = (role: UserRole, timeframe: string) => {
    switch (role) {
      case 'borrower':
        generateBorrowerData(timeframe);
        break;
      case 'vendor':
        generateVendorData(timeframe);
        break;
      case 'broker':
        generateBrokerData(timeframe);
        break;
      case 'lender':
        generateLenderData(timeframe);
        break;
      case 'investor':
        generateInvestorData(timeframe);
        break;
      case 'admin':
        generateAdminData(timeframe);
        break;
      default:
        setMetrics([]);
        setCharts([]);
    }
  };

  // Role-specific data generators
  const generateBorrowerData = (timeframe: string) => {
    setMetrics([
      {
        label: 'Credit Score',
        value: 725,
        prevValue: 710,
        change: 2.1,
        changeType: 'increase',
        format: 'number',
      },
      {
        label: 'Available Credit',
        value: 250000,
        prevValue: 220000,
        change: 13.6,
        changeType: 'increase',
        format: 'currency',
      },
      {
        label: 'Active Applications',
        value: 2,
        prevValue: 1,
        change: 100,
        changeType: 'increase',
        format: 'number',
      },
      {
        label: 'Average Interest Rate',
        value: 6.25,
        prevValue: 6.75,
        change: -7.4,
        changeType: 'decrease',
        format: 'percent',
      },
    ]);

    setCharts([
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Credit Utilization',
            data: [65, 59, 80, 81, 56, 45],
            backgroundColor: Array(6).fill('rgba(75, 192, 192, 0.2)'),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
        type: 'bar',
      },
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Payment History',
            data: [30, 29, 30, 28, 30, 30],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: Array(6).fill('rgba(54, 162, 235, 0.2)'),
            borderWidth: 2,
            fill: true,
          },
        ],
        type: 'line',
      },
    ]);
  };

  const generateVendorData = (timeframe: string) => {
    setMetrics([
      {
        label: 'Total Inventory',
        value: 32,
        prevValue: 28,
        change: 14.3,
        changeType: 'increase',
        format: 'number',
      },
      {
        label: 'Financed Assets',
        value: 12,
        prevValue: 8,
        change: 50,
        changeType: 'increase',
        format: 'number',
      },
      {
        label: 'Average Financing Rate',
        value: 5.75,
        prevValue: 5.9,
        change: -2.5,
        changeType: 'decrease',
        format: 'percent',
      },
      {
        label: 'Total Sales',
        value: 780000,
        prevValue: 650000,
        change: 20,
        changeType: 'increase',
        format: 'currency',
      },
    ]);

    setCharts([
      {
        labels: ['Equipment', 'Vehicles', 'Technology', 'Manufacturing', 'Other'],
        datasets: [
          {
            label: 'Inventory by Category',
            data: [12, 8, 6, 4, 2],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
          },
        ],
        type: 'pie',
      },
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Monthly Sales',
            data: [120000, 135000, 110000, 140000, 125000, 150000],
            backgroundColor: Array(6).fill('rgba(75, 192, 192, 0.2)'),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
        type: 'bar',
      },
    ]);
  };

  const generateBrokerData = (timeframe: string) => {
    setMetrics([
      {
        label: 'Active Deals',
        value: 15,
        prevValue: 12,
        change: 25,
        changeType: 'increase',
        format: 'number',
      },
      {
        label: 'Conversion Rate',
        value: 42.5,
        prevValue: 38.7,
        change: 9.8,
        changeType: 'increase',
        format: 'percent',
      },
      {
        label: 'Pipeline Value',
        value: 3750000,
        prevValue: 3200000,
        change: 17.2,
        changeType: 'increase',
        format: 'currency',
      },
      {
        label: 'Est. Commission',
        value: 84375,
        prevValue: 70400,
        change: 19.9,
        changeType: 'increase',
        format: 'currency',
      },
    ]);

    setCharts([
      {
        labels: ['Leads', 'Applications', 'Underwriting', 'Approved', 'Funded'],
        datasets: [
          {
            label: 'Deals by Stage',
            data: [25, 20, 15, 10, 8],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
          },
        ],
        type: 'doughnut',
      },
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Monthly Commission',
            data: [12500, 14300, 11800, 15600, 14100, 16100],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: Array(6).fill('rgba(54, 162, 235, 0.2)'),
            borderWidth: 2,
            fill: true,
          },
        ],
        type: 'line',
      },
    ]);
  };

  const generateLenderData = (timeframe: string) => {
    setMetrics([
      {
        label: 'Active Loans',
        value: 78,
        prevValue: 72,
        change: 8.3,
        changeType: 'increase',
        format: 'number',
      },
      {
        label: 'Portfolio Value',
        value: 28500000,
        prevValue: 26200000,
        change: 8.8,
        changeType: 'increase',
        format: 'currency',
      },
      {
        label: 'Default Rate',
        value: 2.1,
        prevValue: 2.3,
        change: -8.7,
        changeType: 'decrease',
        format: 'percent',
      },
      {
        label: 'Average Yield',
        value: 8.4,
        prevValue: 8.2,
        change: 2.4,
        changeType: 'increase',
        format: 'percent',
      },
    ]);

    setCharts([
      {
        labels: ['Equipment', 'Real Estate', 'Working Capital', 'Vehicle', 'Technology'],
        datasets: [
          {
            label: 'Portfolio by Asset Type',
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
          },
        ],
        type: 'doughnut',
      },
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Monthly Origination',
            data: [4200000, 3800000, 4100000, 4500000, 4300000, 4600000],
            backgroundColor: Array(6).fill('rgba(75, 192, 192, 0.2)'),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
        type: 'bar',
      },
    ]);
  };

  const generateInvestorData = (timeframe: string) => {
    setMetrics([
      {
        label: 'Total Investments',
        value: 15200000,
        prevValue: 14000000,
        change: 8.6,
        changeType: 'increase',
        format: 'currency',
      },
      {
        label: 'Current Yield',
        value: 7.8,
        prevValue: 7.2,
        change: 8.3,
        changeType: 'increase',
        format: 'percent',
      },
      {
        label: 'Portfolio Risk Score',
        value: 68,
        prevValue: 72,
        change: -5.6,
        changeType: 'decrease',
        format: 'number',
      },
      {
        label: 'Diversification Index',
        value: 84,
        prevValue: 78,
        change: 7.7,
        changeType: 'increase',
        format: 'number',
      },
    ]);

    setCharts([
      {
        labels: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B'],
        datasets: [
          {
            label: 'Portfolio by Credit Rating',
            data: [15, 25, 30, 20, 8, 2],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
          },
        ],
        type: 'pie',
      },
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Monthly Returns',
            data: [0.65, 0.61, 0.68, 0.63, 0.67, 0.71],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: Array(6).fill('rgba(54, 162, 235, 0.2)'),
            borderWidth: 2,
            fill: true,
          },
        ],
        type: 'line',
      },
    ]);
  };

  const generateAdminData = (timeframe: string) => {
    setMetrics([
      {
        label: 'Active Users',
        value: 345,
        prevValue: 312,
        change: 10.6,
        changeType: 'increase',
        format: 'number',
      },
      {
        label: 'Total Transactions',
        value: 1243,
        prevValue: 1102,
        change: 12.8,
        changeType: 'increase',
        format: 'number',
      },
      {
        label: 'Platform Revenue',
        value: 875000,
        prevValue: 780000,
        change: 12.2,
        changeType: 'increase',
        format: 'currency',
      },
      {
        label: 'Average Decision Time',
        value: 42,
        prevValue: 48,
        change: -12.5,
        changeType: 'decrease',
        format: 'number',
      },
    ]);

    setCharts([
      {
        labels: ['Borrowers', 'Vendors', 'Brokers', 'Lenders', 'Investors'],
        datasets: [
          {
            label: 'Users by Role',
            data: [150, 85, 60, 35, 15],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: 1,
          },
        ],
        type: 'doughnut',
      },
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Transaction Volume',
            data: [180, 192, 185, 204, 215, 235],
            backgroundColor: Array(6).fill('rgba(75, 192, 192, 0.2)'),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
        type: 'bar',
      },
    ]);
  };

  // Format value based on format type
  const formatValue = (value: number, format?: string): string => {
    if (!value && value !== 0) return 'N/A';

    switch (format) {
      case 'currency':
        return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      case 'percent':
        return `${value}%`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  // Handle export click
  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    if (onExport) {
      onExport(format);
    } else {
      console.log(`Exporting data in ${format} format`);
      // Default export implementation could go here
    }
  };

  // Render chart based on type (placeholder for actual chart components)
  const renderChart = (chartData: AnalyticsChartData) => {
    const { type, labels, datasets } = chartData;

    // This is a placeholder for actual chart rendering
    // In a real implementation, you would use a charting library like Chart.js or Recharts
    return (
      <div className="chart-placeholder text-center p-10 border border-gray-200 rounded-lg bg-gray-50">
        <div className="text-lg font-medium mb-2">
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart: {datasets[0].label}
        </div>
        <div className="text-sm text-gray-500">
          {datasets[0].data.length} data points from {labels[0]} to {labels[labels.length - 1]}
        </div>
        <div className="mt-4 h-40 flex items-center justify-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex justify-end">
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-red-700">{error}</div>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => generateRoleSpecificData(role, timeframe)}
        >
          Retry
        </button>
      </div>
    );
  }

  // No data state
  if (!dataLoaded || metrics.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center p-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <div className="text-lg font-medium text-gray-700 mb-2">No analytics data available</div>
          <div className="text-sm text-gray-500 mb-4">
            There is no data available for this role and timeframe.
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => generateRoleSpecificData(role, timeframe)}
          >
            Generate Data
          </button>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Key metrics section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
            <div className="text-2xl font-semibold">{formatValue(metric.value, metric.format)}</div>
            {metric.change !== undefined && (
              <div
                className={`flex items-center mt-1 text-sm ${
                  metric.changeType === 'increase'
                    ? 'text-green-600'
                    : metric.changeType === 'decrease'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {metric.changeType === 'increase' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : metric.changeType === 'decrease' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {Math.abs(metric.change)}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Analytics Charts</h3>

          {/* Chart selector */}
          <div className="flex space-x-2">
            {charts.map((chart, index) => (
              <button
                key={index}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedChartIndex === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedChartIndex(index)}
              >
                {chart.datasets[0].label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart display */}
        {charts.length > 0 && renderChart(charts[selectedChartIndex])}
      </div>

      {/* Export actions */}
      <div className="flex justify-end space-x-2">
        <button
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={() => handleExport('csv')}
        >
          Export CSV
        </button>
        <button
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={() => handleExport('excel')}
        >
          Export Excel
        </button>
        <button
          className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          onClick={() => handleExport('pdf')}
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default RoleAnalyticsDisplay;
