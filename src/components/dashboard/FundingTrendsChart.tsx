import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Scale, ScaleOptionsByType, Tick } from 'chart.js';

// Mock chart data by month
const mockChartDataByMonth = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Equipment & Vehicles',
      data: [350000, 580000, 420000, 620000, 790000, 680000],
      backgroundColor: 'rgba(16, 185, 129, 0.2)', // green
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Real Estate',
      data: [650000, 980000, 820000, 1100000, 1350000, 1250000],
      backgroundColor: 'rgba(79, 70, 229, 0.2)', // indigo
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'General Funding',
      data: [200000, 340000, 260000, 480000, 560000, 570000],
      backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

// Mock chart data by quarters
const mockChartDataByQuarter = {
  labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023'],
  datasets: [
    {
      label: 'Equipment & Vehicles',
      data: [1350000, 1580000, 1720000, 1950000, 2100000, 2250000],
      backgroundColor: 'rgba(16, 185, 129, 0.2)', // green
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Real Estate',
      data: [2450000, 2580000, 2620000, 2800000, 3100000, 3250000],
      backgroundColor: 'rgba(79, 70, 229, 0.2)', // indigo
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'General Funding',
      data: [800000, 940000, 1060000, 1180000, 1250000, 1350000],
      backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

// Mock chart data by year
const mockChartDataByYear = {
  labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: 'Equipment & Vehicles',
      data: [4500000, 5200000, 4800000, 6100000, 7200000, 8100000],
      backgroundColor: 'rgba(16, 185, 129, 0.2)', // green
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Real Estate',
      data: [8200000, 8900000, 8100000, 9500000, 10500000, 12000000],
      backgroundColor: 'rgba(79, 70, 229, 0.2)', // indigo
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'General Funding',
      data: [3100000, 3400000, 3200000, 3800000, 4200000, 4600000],
      backgroundColor: 'rgba(245, 158, 11, 0.2)', // amber
      borderColor: 'rgba(245, 158, 11, 1)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

export const FundingTrendsChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  // Select the data based on the timeframe
  const chartData = () => {
    switch (timeframe) {
      case 'monthly':
        return mockChartDataByMonth;
      case 'quarterly':
        return mockChartDataByQuarter;
      case 'yearly':
        return mockChartDataByYear;
      default:
        return mockChartDataByMonth;
    }
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (tickValue: string | number, index: number, ticks: Tick[]) {
            if (typeof tickValue === 'number') {
              return `$${tickValue / 1000}k`;
            }
            return tickValue;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Funding Trends</h3>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-l-md ${
              timeframe === 'monthly'
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium ${
              timeframe === 'quarterly'
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTimeframe('quarterly')}
          >
            Quarterly
          </button>
          <button
            type="button"
            className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-r-md ${
              timeframe === 'yearly'
                ? 'bg-primary-100 text-primary-700 border border-primary-300'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTimeframe('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="h-80">
        <Line data={chartData()} options={options} />
      </div>
    </div>
  );
};

export default FundingTrendsChart;
