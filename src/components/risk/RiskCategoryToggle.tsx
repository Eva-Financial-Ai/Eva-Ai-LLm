import React, { useState, useEffect } from 'react';

// Define types for risk categories and data points
export type RiskCategory = 'creditworthiness' | 'financial' | 'cashflow' | 'legal' | 'equipment' | 'property';

// Interface for data point structure
interface DataPoint {
  id: string;
  label: string;
  category: RiskCategory;
  good: string;
  average: string;
  negative: string;
  source: string;
}

interface RiskCategoryToggleProps {
  initialCategory?: RiskCategory;
  onCategoryChange?: (category: RiskCategory) => void;
}

const RiskCategoryToggle: React.FC<RiskCategoryToggleProps> = ({
  initialCategory = 'creditworthiness',
  onCategoryChange
}) => {
  const [activeCategory, setActiveCategory] = useState<RiskCategory>(initialCategory);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [filteredDataPoints, setFilteredDataPoints] = useState<DataPoint[]>([]);

  // Sample data points for demonstration
  const allDataPoints: DataPoint[] = [
    // Creditworthiness data points
    {
      id: 'credit-score',
      label: 'Credit Score',
      category: 'creditworthiness',
      good: '720-850',
      average: '650-719',
      negative: '300-649',
      source: 'Borrower EIN from MicroVu or Equifax One Score'
    },
    {
      id: 'payment-history',
      label: 'Payment History',
      category: 'creditworthiness',
      good: '0-2 missed payments',
      average: '3-5 missed payments',
      negative: '5+ missed payments',
      source: 'Equifax One Score, Paynet API'
    },
    {
      id: 'public-records',
      label: 'Public Records',
      category: 'creditworthiness',
      good: '0 issues',
      average: '1 minor issue',
      negative: '1+ issue',
      source: 'Equifax One Score, Paynet API, D&B'
    },
    
    // Financial data points
    {
      id: 'debt-to-equity',
      label: 'Debt-to-Equity Ratio',
      category: 'financial',
      good: '< 1.0',
      average: '1.0-2.0',
      negative: '> 2.0',
      source: 'OCR of Borrower Inc Stat & Bal Sheet'
    },
    {
      id: 'current-ratio',
      label: 'Current Ratio',
      category: 'financial',
      good: '> 2.0',
      average: '1.0-2.0',
      negative: '< 1.0',
      source: 'OCR of Borrower Uploaded Inc Stat & Bal Sheet'
    },
    
    // Cashflow data points
    {
      id: 'annual-cash-flow',
      label: 'Annual Cash Flow',
      category: 'cashflow',
      good: '> 5% annual increase',
      average: '0 - 5% annual growth',
      negative: '< 0% annual decrease',
      source: 'OCR + Borrower Uploaded Statement of Cash Flows'
    },
    {
      id: 'cash-conversion-cycle',
      label: 'Cash Conversion Cycle',
      category: 'cashflow',
      good: '< 30 days',
      average: '30-60 days',
      negative: '> 60 days',
      source: 'OCR of Borrower Uploaded Statement of Cash Flows'
    },
    
    // Legal data points
    {
      id: 'compliance-history',
      label: 'Compliance History',
      category: 'legal',
      good: '0 issues',
      average: '1 issue',
      negative: '2+ issues',
      source: 'Credit Agencies from #1 ideally'
    },
    {
      id: 'legal-disputes',
      label: 'Legal Disputes',
      category: 'legal',
      good: 'No Disputes',
      average: '1 - 2 Disputes',
      negative: '> 2 Disputes',
      source: 'Credit Agencies from #1 OR PitchPoint CRS API'
    },
    
    // Equipment data points
    {
      id: 'equipment-age',
      label: 'Equipment Age',
      category: 'equipment',
      good: 'New/Recent (i.e. 0-2.6y)',
      average: 'Moderate (2.67-5.33yrs)',
      negative: 'Old (i.e. > 5.34 yrs old)',
      source: 'User input or uploaded Purchase Order'
    },
    {
      id: 'utilization-rate',
      label: 'Utilization Rate',
      category: 'equipment',
      good: '> 80%',
      average: '50%-80%',
      negative: '< 50%',
      source: 'User Input or above APIs for industry benchmark'
    },
    
    // Property data points
    {
      id: 'loan-to-value',
      label: 'Loan-to-Value Ratio',
      category: 'property',
      good: '< 65%',
      average: '65% - 75%',
      negative: '> 75%',
      source: 'Loan API from loan app + Appraised Value'
    },
    {
      id: 'property-class',
      label: 'Property Class',
      category: 'property',
      good: 'Class A',
      average: 'Class B',
      negative: 'Class C',
      source: 'Property address from loan app to pull from PubRec'
    }
  ];

  useEffect(() => {
    // Load all data points initially
    setDataPoints(allDataPoints);
    
    // Filter data points based on active category
    filterDataPoints(activeCategory);
  }, [activeCategory]);

  // Function to filter data points based on selected category
  const filterDataPoints = (category: RiskCategory) => {
    const filtered = allDataPoints.filter(point => point.category === category);
    setFilteredDataPoints(filtered);
    
    // Call the callback if provided
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  // Handle category change
  const handleCategoryChange = (category: RiskCategory) => {
    setActiveCategory(category);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Risk Lab Configurator</h3>
        <p className="text-sm text-gray-500 mt-1">Toggle categories to see relevant data points</p>
      </div>
      
      {/* Category tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleCategoryChange('creditworthiness')}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
            activeCategory === 'creditworthiness'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Creditworthiness
        </button>
        <button
          onClick={() => handleCategoryChange('financial')}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
            activeCategory === 'financial'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Financial
        </button>
        <button
          onClick={() => handleCategoryChange('cashflow')}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
            activeCategory === 'cashflow'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Cash Flow
        </button>
        <button
          onClick={() => handleCategoryChange('legal')}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
            activeCategory === 'legal'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Legal
        </button>
      </div>
      
      {/* Toggle additional categories based on loan type */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => handleCategoryChange('equipment')}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
            activeCategory === 'equipment'
              ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Equipment
        </button>
        <button
          onClick={() => handleCategoryChange('property')}
          className={`flex-1 py-2 px-4 text-center text-sm font-medium ${
            activeCategory === 'property'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Property
        </button>
      </div>
      
      {/* Data points table for selected category */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">
          {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Data Points
        </h4>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Point
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Good
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average
              </th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Negative
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDataPoints.map((point) => (
              <tr key={point.id}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {point.label}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                  {point.good}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                  {point.average}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                  {point.negative}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredDataPoints.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No data points found for this category
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskCategoryToggle; 