import React, { useState } from 'react';
import RiskLabConfiguratorEnhanced, { LoanType } from './RiskLabConfiguratorEnhanced';

const RiskCategoryDemo: React.FC = () => {
  const [loanType, setLoanType] = useState<LoanType>('general');

  const handleLoanTypeChange = (type: LoanType) => {
    setLoanType(type);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Risk Assessment Configuration</h1>
        <p className="text-gray-600">
          Toggle between different loan types and categories to see only the relevant data points.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <RiskLabConfiguratorEnhanced 
            loanType={loanType}
            onLoanTypeChange={handleLoanTypeChange}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>
              Select the <span className="font-medium">loan type</span> at the top (General, Real Estate, or Equipment & Vehicles)
            </li>
            <li>
              Use the <span className="font-medium">category tabs</span> to toggle between different risk assessment categories
            </li>
            <li>
              Only the data points relevant to the selected category will be displayed
            </li>
            <li>
              Each category shows specific criteria for what's considered Good, Average, or Negative
            </li>
          </ol>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800 mb-2">Tip</h3>
            <p className="text-blue-700 text-sm">
              When changing loan types, the most relevant category for that loan type will be automatically selected:
              <ul className="list-disc list-inside mt-2">
                <li>Equipment loans → Equipment category</li>
                <li>Real Estate loans → Property category</li>
                <li>General loans → Creditworthiness category</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCategoryDemo; 