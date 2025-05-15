import React, { useState, useEffect } from 'react';
import { RiskMapType } from './RiskMapNavigator';

// Define the types for our risk criteria configuration
export type RiskStatus = 'good' | 'average' | 'negative';

export interface RiskRange {
  min: number | string;
  max: number | string;
  label: string;
  status: RiskStatus;
  points: number;
}

export interface RiskCriteria {
  id: string;
  name: string;
  category: string;
  ranges: RiskRange[];
  sourceOptions: string[];
  unit?: string;
}

interface RiskCriteriaConfigProps {
  riskMapType?: RiskMapType;
  onConfigChange?: (criteria: RiskCriteria[]) => void;
}

// Helper function to get default criteria based on loan type
export const getDefaultCriteria = (mapType: RiskMapType): RiskCriteria[] => {
  // Common criteria for all risk map types
  const commonCriteria: RiskCriteria[] = [
    {
      id: 'credit_score',
      name: 'Credit Score',
      category: 'Creditworthiness',
      ranges: [
        { min: 720, max: 850, label: 'Good', status: 'good', points: 2 },
        { min: 660, max: 719, label: 'Average', status: 'average', points: 1 },
        { min: 300, max: 659, label: 'Negative', status: 'negative', points: 0 },
      ],
      sourceOptions: ['Business', 'Personal', 'Blended'],
    },
    {
      id: 'payment_history',
      name: 'Payment History',
      category: 'Creditworthiness',
      ranges: [
        { min: 'No late payments', max: 'No late payments', label: 'Good', status: 'good', points: 2 },
        { min: '1-2 late payments', max: '1-2 late payments (30-60 days)', label: 'Average', status: 'average', points: 1 },
        { min: '3+ late payments', max: '3+ late payments or 90+ days', label: 'Negative', status: 'negative', points: 0 },
      ],
      sourceOptions: ['Business Credit Report', 'Personal Credit Report', 'Bank Statements'],
    },
    {
      id: 'debt_to_income',
      name: 'Debt to Income Ratio',
      category: 'Financial Health',
      ranges: [
        { min: 0, max: 35, label: 'Good', status: 'good', points: 2 },
        { min: 36, max: 50, label: 'Average', status: 'average', points: 1 },
        { min: 51, max: 100, label: 'Negative', status: 'negative', points: 0 },
      ],
      sourceOptions: ['Tax Returns', 'Financial Statements', 'Loan Application'],
      unit: '%',
    },
    {
      id: 'current_ratio',
      name: 'Current Ratio',
      category: 'Financial Health',
      ranges: [
        { min: 1.5, max: 5, label: 'Good', status: 'good', points: 2 },
        { min: 1, max: 1.49, label: 'Average', status: 'average', points: 1 },
        { min: 0, max: 0.99, label: 'Negative', status: 'negative', points: 0 },
      ],
      sourceOptions: ['Balance Sheet', 'Financial Statements'],
    },
    {
      id: 'operating_cash_flow',
      name: 'Operating Cash Flow',
      category: 'Cash Flow',
      ranges: [
        { min: 'Strong positive', max: 'Strong positive', label: 'Good', status: 'good', points: 2 },
        { min: 'Moderately positive', max: 'Moderately positive', label: 'Average', status: 'average', points: 1 },
        { min: 'Negative or weak', max: 'Negative or weak', label: 'Negative', status: 'negative', points: 0 },
      ],
      sourceOptions: ['Cash Flow Statement', 'Bank Statements'],
    },
    {
      id: 'debt_service_coverage',
      name: 'Debt Service Coverage Ratio',
      category: 'Cash Flow',
      ranges: [
        { min: 1.25, max: 5, label: 'Good', status: 'good', points: 2 },
        { min: 1, max: 1.24, label: 'Average', status: 'average', points: 1 },
        { min: 0, max: 0.99, label: 'Negative', status: 'negative', points: 0 },
      ],
      sourceOptions: ['Financial Statements', 'Tax Returns', 'Projected Financials'],
    },
    {
      id: 'time_in_business',
      name: 'Time in Business',
      category: 'Business Stability',
      ranges: [
        { min: 5, max: 50, label: 'Good', status: 'good', points: 2 },
        { min: 2, max: 4.99, label: 'Average', status: 'average', points: 1 },
        { min: 0, max: 1.99, label: 'Negative', status: 'negative', points: 0 },
      ],
      sourceOptions: ['Business Registration', 'Tax Returns'],
      unit: 'years',
    },
    {
      id: 'industry_risk',
      name: 'Industry Risk',
      category: 'Business Stability',
      ranges: [
        { min: 'Low risk', max: 'Low risk', label: 'Good', status: 'good', points: 2 },
        { min: 'Moderate risk', max: 'Moderate risk', label: 'Average', status: 'average', points: 1 },
        { min: 'High risk', max: 'High risk', label: 'Negative', status: 'negative', points: 0 },
      ],
      sourceOptions: ['Industry Reports', 'EVA Analysis'],
    },
  ];

  // Add equipment-specific criteria
  if (mapType === 'equipment') {
    return [
      ...commonCriteria,
      {
        id: 'equipment_type_demand',
        name: 'Equipment Type Demand',
        category: 'Equipment Value and Type',
        ranges: [
          { min: 'High demand', max: 'High demand / Essential', label: 'Good', status: 'good' as RiskStatus, points: 2 },
          { min: 'Moderate demand', max: 'Moderate demand', label: 'Average', status: 'average' as RiskStatus, points: 1 },
          { min: 'Low demand', max: 'Low demand vs other equipment', label: 'Negative', status: 'negative' as RiskStatus, points: 0 },
        ],
        sourceOptions: ['Equipment Valuation', 'Industry Reports'],
      },
      {
        id: 'equipment_age',
        name: 'Equipment Age',
        category: 'Equipment Value and Type',
        ranges: [
          { min: 'New/Recent (0-2.66y)', max: 'New/Recent (i.e. 0-2.66y)', label: 'Good', status: 'good' as RiskStatus, points: 2 },
          { min: 'Moderate (2.67-5.33y)', max: 'Moderate (2.67-5.33y)', label: 'Average', status: 'average' as RiskStatus, points: 1 },
          { min: 'Old (5.34y+)', max: 'Old (i.e. > 5.34 yrs old)', label: 'Negative', status: 'negative' as RiskStatus, points: 0 },
        ],
        sourceOptions: ['Equipment Documentation', 'Invoice Date'],
      },
    ];
  }

  // Add real estate-specific criteria
  if (mapType === 'realestate') {
    return [
      ...commonCriteria,
      {
        id: 'loan_to_value_ratio',
        name: 'Loan-to-Value Ratio',
        category: 'Property Financial Health',
        ranges: [
          { min: '0%', max: '65%', label: 'Good', status: 'good' as RiskStatus, points: 2 },
          { min: '65%', max: '75%', label: 'Average', status: 'average' as RiskStatus, points: 1 },
          { min: '75%', max: '100%', label: 'Negative', status: 'negative' as RiskStatus, points: 0 },
        ],
        sourceOptions: ['Property Appraisal', 'Loan Application'],
      },
      {
        id: 'property_class',
        name: 'Property Class',
        category: 'Property Financial Health',
        ranges: [
          { min: 'Class A', max: 'Class A', label: 'Good', status: 'good' as RiskStatus, points: 2 },
          { min: 'Class B', max: 'Class B', label: 'Average', status: 'average' as RiskStatus, points: 1 },
          { min: 'Class C', max: 'Class C', label: 'Negative', status: 'negative' as RiskStatus, points: 0 },
        ],
        sourceOptions: ['Property Appraisal', 'Market Analysis'],
      },
    ];
  }
  
  return commonCriteria;
};

const RiskCriteriaConfig: React.FC<RiskCriteriaConfigProps> = ({ 
  riskMapType = 'unsecured',
  onConfigChange
}) => {
  // State for tracking criteria configuration
  const [criteria, setCriteria] = useState<RiskCriteria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Creditworthiness');
  const [selectedCriterion, setSelectedCriterion] = useState<RiskCriteria | null>(null);
  
  // Initialize criteria based on risk map type
  useEffect(() => {
    const defaultCriteria = getDefaultCriteria(riskMapType);
    setCriteria(defaultCriteria);
    
    // Set initial selected criterion
    if (defaultCriteria.length > 0) {
      const firstCategory = defaultCriteria[0].category;
      setSelectedCategory(firstCategory);
      
      const criteriaInCategory = defaultCriteria.filter(c => c.category === firstCategory);
      if (criteriaInCategory.length > 0) {
        setSelectedCriterion(criteriaInCategory[0]);
      }
    }
    
    // Notify parent of criteria change
    if (onConfigChange) {
      onConfigChange(defaultCriteria);
    }
  }, [riskMapType, onConfigChange]);
  
  // Get categories from criteria
  const categories = React.useMemo(() => {
    const categorySet = new Set(criteria.map(c => c.category));
    return Array.from(categorySet);
  }, [criteria]);
  
  // Get criteria for selected category
  const criteriaForCategory = React.useMemo(() => {
    return criteria.filter(c => c.category === selectedCategory);
  }, [criteria, selectedCategory]);
  
  // Update criterion ranges
  const updateCriterionRanges = (criterionId: string, newRanges: RiskRange[]) => {
    const updatedCriteria = criteria.map(c => {
      if (c.id === criterionId) {
        return { ...c, ranges: newRanges };
      }
      return c;
    });
    
    setCriteria(updatedCriteria);
    
    // Update selected criterion if it's the one being edited
    if (selectedCriterion && selectedCriterion.id === criterionId) {
      const updatedCriterion = updatedCriteria.find(c => c.id === criterionId);
      if (updatedCriterion) {
        setSelectedCriterion(updatedCriterion);
      }
    }
    
    // Notify parent of criteria change
    if (onConfigChange) {
      onConfigChange(updatedCriteria);
    }
  };
  
  // Update range value
  const updateRangeValue = (
    criterionId: string, 
    rangeIndex: number, 
    field: keyof RiskRange, 
    value: string | number
  ) => {
    const criterion = criteria.find(c => c.id === criterionId);
    if (!criterion) return;
    
    const newRanges = [...criterion.ranges];
    newRanges[rangeIndex] = { ...newRanges[rangeIndex], [field]: value };
    
    updateCriterionRanges(criterionId, newRanges);
  };
  
  // Add a new range to a criterion
  const addRangeToCriterion = (criterionId: string) => {
    const criterion = criteria.find(c => c.id === criterionId);
    if (!criterion) return;
    
    const newRange: RiskRange = {
      min: 0,
      max: 0,
      label: 'New Range',
      status: 'average',
      points: 1
    };
    
    const newRanges = [...criterion.ranges, newRange];
    updateCriterionRanges(criterionId, newRanges);
  };
  
  // Remove a range from a criterion
  const removeRangeFromCriterion = (criterionId: string, rangeIndex: number) => {
    const criterion = criteria.find(c => c.id === criterionId);
    if (!criterion || criterion.ranges.length <= 1) return;
    
    const newRanges = criterion.ranges.filter((_, index) => index !== rangeIndex);
    updateCriterionRanges(criterionId, newRanges);
  };
  
  // Status options for dropdown
  const statusOptions: RiskStatus[] = ['good', 'average', 'negative'];
  
  return (
    <div className="bg-white rounded-lg p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment Configuration</h2>
      
      {/* Category Tabs */}
      <div className="mb-4">
        <div className="flex space-x-1 border-b border-gray-200">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                const firstCriterion = criteriaForCategory[0];
                if (firstCriterion) {
                  setSelectedCriterion(firstCriterion);
                }
              }}
              className={`px-4 py-2 text-sm font-medium ${
                selectedCategory === category
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Criterion Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Criterion
        </label>
        <select
          className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
          value={selectedCriterion?.id || ''}
          onChange={(e) => {
            const criterion = criteria.find(c => c.id === e.target.value);
            if (criterion) {
              setSelectedCriterion(criterion);
            }
          }}
        >
          {criteriaForCategory.map(criterion => (
            <option key={criterion.id} value={criterion.id}>
              {criterion.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Range Configuration */}
      {selectedCriterion && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-900">
              {selectedCriterion.name} Ranges
            </h3>
            <button
              onClick={() => addRangeToCriterion(selectedCriterion.id)}
              className="px-2 py-1 bg-primary-50 text-primary-600 text-sm font-medium rounded hover:bg-primary-100"
            >
              Add Range
            </button>
          </div>
          
          {/* Data Source Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Source
            </label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              {selectedCriterion.sourceOptions.map(source => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
          
          {/* Ranges Table */}
          <div className="bg-gray-50 p-3 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedCriterion.ranges.map((range, rangeIndex) => (
                  <tr key={rangeIndex}>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={range.min}
                        onChange={(e) => updateRangeValue(selectedCriterion.id, rangeIndex, 'min', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={range.max}
                        onChange={(e) => updateRangeValue(selectedCriterion.id, rangeIndex, 'max', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="text"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={range.label}
                        onChange={(e) => updateRangeValue(selectedCriterion.id, rangeIndex, 'label', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                      <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={range.status}
                        onChange={(e) => updateRangeValue(selectedCriterion.id, rangeIndex, 'status', e.target.value as RiskStatus)}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        value={range.points}
                        onChange={(e) => updateRangeValue(selectedCriterion.id, rangeIndex, 'points', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeRangeFromCriterion(selectedCriterion.id, rangeIndex)}
                        className="text-red-600 hover:text-red-900"
                        disabled={selectedCriterion.ranges.length <= 1}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Display Score Value Equivalents */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Status Score Values</h3>
        <div className="flex space-x-4">
          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md">
            <span className="font-medium">Good:</span> 2 points
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md">
            <span className="font-medium">Average:</span> 1 point
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-2 rounded-md">
            <span className="font-medium">Negative:</span> 0 points
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCriteriaConfig; 