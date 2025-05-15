import React, { useState, useEffect } from 'react';

// Types for our risk score thresholds
export interface RangeThreshold {
  min: number;
  max: number;
}

export interface RiskRange {
  id: string;
  name: string;
  category: string;
  good: RangeThreshold;
  average: RangeThreshold;
  negative: RangeThreshold;
  points: {
    good: number;
    average: number;
    negative: number;
  };
  dataSource: string;
}

export interface CategoryConfig {
  name: string;
  weight: {
    general: number;
    equipment: number;
    realestate: number;
  };
  metrics: RiskRange[];
}

// Default thresholds based on the user's specifications
export const DEFAULT_RANGES: Record<string, CategoryConfig> = {
  creditworthiness: {
    name: 'Creditworthiness of the Borrower (CWB)',
    weight: { general: 40, equipment: 40, realestate: 40 },
    metrics: [
      {
        id: 'credit-score',
        name: 'Credit Score',
        category: 'creditworthiness',
        good: { min: 720, max: 850 },
        average: { min: 650, max: 719 },
        negative: { min: 300, max: 649 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'Borrower EIN from Unisyn DB to retrieve Equifax One Score, Paynet API, Dunns & Bradstreet, Experian, and LexisNexis business scores'
      },
      {
        id: 'payment-history',
        name: 'Payment History',
        category: 'creditworthiness',
        good: { min: 0, max: 0 },
        average: { min: 1, max: 2 },
        negative: { min: 3, max: 999 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'Equifax One Score, Paynet API, Dunns & Bradstreet, Experian, LexisNexis'
      },
      {
        id: 'credit-utilization',
        name: 'Credit Utilization',
        category: 'creditworthiness',
        good: { min: 0, max: 30 },
        average: { min: 30, max: 50 },
        negative: { min: 50, max: 100 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'Equifax One Score, Paynet API, Dunns & Bradstreet, Experian, LexisNexis'
      },
      {
        id: 'public-records',
        name: 'Public Records',
        category: 'creditworthiness',
        good: { min: 0, max: 0 },
        average: { min: 1, max: 1 },
        negative: { min: 2, max: 999 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'Equifax One Score, Paynet API, Dunns & Bradstreet, Experian, LexisNexis'
      },
      {
        id: 'credit-history-age',
        name: 'Age of Credit History',
        category: 'creditworthiness',
        good: { min: 10, max: 999 },
        average: { min: 5, max: 10 },
        negative: { min: 0, max: 5 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'Equifax One Score, Paynet API, Dunns & Bradstreet, Experian, LexisNexis'
      }
    ]
  },
  financial: {
    name: 'Financial Statements and Ratios (FSR)',
    weight: { general: 20, equipment: 15, realestate: 15 },
    metrics: [
      {
        id: 'debt-to-equity',
        name: 'Debt-to-Equity Ratio',
        category: 'financial',
        good: { min: 0, max: 1.0 },
        average: { min: 1.0, max: 2.0 },
        negative: { min: 2.0, max: 999 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'OCR & Extraction from Borrower Inc Stmt & Bal Sheet'
      },
      {
        id: 'current-ratio',
        name: 'Current Ratio',
        category: 'financial',
        good: { min: 2.0, max: 999 },
        average: { min: 1.0, max: 2.0 },
        negative: { min: 0, max: 1.0 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'OCR of Borrower Uploaded Inc Stmt & Bal Sheet'
      },
      {
        id: 'quick-ratio',
        name: 'Quick Ratio',
        category: 'financial',
        good: { min: 1.0, max: 999 },
        average: { min: 0.5, max: 1.0 },
        negative: { min: 0, max: 0.5 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'OCR of Borrower Uploaded Inc Stmt & Bal Sheet'
      }
    ]
  },
  cashflow: {
    name: 'Business Cash Flow (BCF)',
    weight: { general: 20, equipment: 15, realestate: 15 },
    metrics: [
      {
        id: 'operating-cash-flow',
        name: 'Operating Cash Flow',
        category: 'cashflow',
        good: { min: 5, max: 999 },
        average: { min: 0, max: 5 },
        negative: { min: -999, max: 0 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'OCR + Borrower Uploaded Statement of Cash Flows'
      },
      {
        id: 'cash-flow-coverage',
        name: 'Cash Flow Coverage Ratio',
        category: 'cashflow',
        good: { min: 1.5, max: 999 },
        average: { min: 1.0, max: 1.5 },
        negative: { min: 0, max: 1.0 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'OCR of Borrower Uploaded Statement of Cash Flows'
      }
    ]
  },
  legal: {
    name: 'Legal and Regulatory Compliance (LRC)',
    weight: { general: 20, equipment: 10, realestate: 10 },
    metrics: [
      {
        id: 'compliance-history',
        name: 'Compliance History',
        category: 'legal',
        good: { min: 0, max: 0 },
        average: { min: 1, max: 1 },
        negative: { min: 2, max: 999 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'Credit Agencies from #1 ideally. If not, Pitchpoint CRS API or PubRec UCC Filings'
      }
    ]
  },
  equipment: {
    name: 'Equipment Value and Type (EVT)',
    weight: { general: 0, equipment: 20, realestate: 0 },
    metrics: [
      {
        id: 'equipment-age',
        name: 'Equipment Age',
        category: 'equipment',
        good: { min: 0, max: 2.66 },
        average: { min: 2.67, max: 5.33 },
        negative: { min: 5.34, max: 999 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'User input or uploaded Purchase Order'
      },
      {
        id: 'equipment-type',
        name: 'Equipment Type Demand',
        category: 'equipment',
        good: { min: 3, max: 3 }, // 3 = High demand
        average: { min: 2, max: 2 }, // 2 = Moderate demand
        negative: { min: 1, max: 1 }, // 1 = Low demand
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'User Input on equipment class & subtype + EquipmentWatch API'
      }
    ]
  },
  property: {
    name: 'Property Financial Health (PFH)',
    weight: { general: 0, equipment: 0, realestate: 20 },
    metrics: [
      {
        id: 'ltv-ratio',
        name: 'Loan-to-Value Ratio',
        category: 'property',
        good: { min: 0, max: 65 },
        average: { min: 65, max: 75 },
        negative: { min: 75, max: 100 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'Loan Amt from loan app + Appraised Value'
      },
      {
        id: 'debt-service-coverage',
        name: 'Debt Service Coverage',
        category: 'property',
        good: { min: 1.25, max: 999 },
        average: { min: 1.1, max: 1.25 },
        negative: { min: 0, max: 1.1 },
        points: { good: 2, average: 1, negative: 0 },
        dataSource: 'OCR of Borrower Inc Stmt upload for NOI + Unisyn DB for average Loan\'s Annual Debt Service'
      }
    ]
  }
};

export interface RiskRangesConfigEditorProps {
  category: string;
  initialRanges?: RiskRange[];
  onChange: (ranges: RiskRange[]) => void;
}

const RiskRangesConfigEditor: React.FC<RiskRangesConfigEditorProps> = ({
  category,
  initialRanges,
  onChange
}) => {
  // Get the ranges for the selected category from defaults or props
  const [ranges, setRanges] = useState<RiskRange[]>(
    initialRanges || DEFAULT_RANGES[category]?.metrics || []
  );

  // Update parent component when ranges change
  useEffect(() => {
    onChange(ranges);
  }, [ranges, onChange]);

  // Update a range threshold
  const handleRangeChange = (metricId: string, rating: 'good' | 'average' | 'negative', field: 'min' | 'max', value: number) => {
    setRanges(prevRanges => {
      return prevRanges.map(range => {
        if (range.id === metricId) {
          return {
            ...range,
            [rating]: {
              ...range[rating],
              [field]: value
            }
          };
        }
        return range;
      });
    });
  };

  // Update points for a threshold
  const handlePointsChange = (metricId: string, rating: 'good' | 'average' | 'negative', value: number) => {
    setRanges(prevRanges => {
      return prevRanges.map(range => {
        if (range.id === metricId) {
          return {
            ...range,
            points: {
              ...range.points,
              [rating]: value
            }
          };
        }
        return range;
      });
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Configure {DEFAULT_RANGES[category]?.name || 'Risk Ranges'}</h3>
      
      {ranges.map(metric => (
        <div key={metric.id} className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-md font-medium text-gray-800 mb-2">{metric.name}</h4>
          <p className="text-xs text-gray-500 mb-4">{metric.dataSource}</p>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1"></div>
            <div className="col-span-1 text-center text-sm font-medium text-green-700">Good</div>
            <div className="col-span-1 text-center text-sm font-medium text-yellow-700">Average</div>
            <div className="col-span-1 text-center text-sm font-medium text-red-700">Negative</div>
            
            {/* Min values */}
            <div className="col-span-1 text-sm text-gray-600">Min Value</div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.good.min}
                onChange={(e) => handleRangeChange(metric.id, 'good', 'min', parseFloat(e.target.value))}
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.average.min}
                onChange={(e) => handleRangeChange(metric.id, 'average', 'min', parseFloat(e.target.value))}
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.negative.min}
                onChange={(e) => handleRangeChange(metric.id, 'negative', 'min', parseFloat(e.target.value))}
              />
            </div>
            
            {/* Max values */}
            <div className="col-span-1 text-sm text-gray-600">Max Value</div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.good.max}
                onChange={(e) => handleRangeChange(metric.id, 'good', 'max', parseFloat(e.target.value))}
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.average.max}
                onChange={(e) => handleRangeChange(metric.id, 'average', 'max', parseFloat(e.target.value))}
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.negative.max}
                onChange={(e) => handleRangeChange(metric.id, 'negative', 'max', parseFloat(e.target.value))}
              />
            </div>
            
            {/* Points */}
            <div className="col-span-1 text-sm text-gray-600">Points</div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.points.good}
                onChange={(e) => handlePointsChange(metric.id, 'good', parseFloat(e.target.value))}
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.points.average}
                onChange={(e) => handlePointsChange(metric.id, 'average', parseFloat(e.target.value))}
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                className="w-full px-2 py-1 border rounded-md"
                value={metric.points.negative}
                onChange={(e) => handlePointsChange(metric.id, 'negative', parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskRangesConfigEditor; 