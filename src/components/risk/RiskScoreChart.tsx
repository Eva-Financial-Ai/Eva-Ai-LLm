import React, { useMemo } from 'react';
import { RiskCategory } from './RiskMapOptimized';

interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

interface RiskScoreChartProps {
  data: ChartDataPoint[];
  selectedCategory: RiskCategory;
}

// A simple bar chart component for risk scores
const RiskScoreChart: React.FC<RiskScoreChartProps> = ({ data, selectedCategory }) => {
  // Memoize sorted data to prevent unnecessary re-renders
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);

  const getBarColorClass = (value: number): string => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Risk Score Breakdown</h3>
      <div className="space-y-4">
        {sortedData.map(item => (
          <div key={item.label} className="w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getBarColorClass(item.value)}`}
                style={{
                  width: `${item.value}%`,
                  backgroundColor:
                    selectedCategory === item.label.toLowerCase() ? item.color : undefined,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>High Risk</span>
          <span>Low Risk</span>
        </div>
        <div className="mt-1 h-1.5 w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
      </div>
    </div>
  );
};

export default React.memo(RiskScoreChart);
