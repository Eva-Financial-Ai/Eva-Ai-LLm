import React, { useState, useEffect } from 'react';
import { useRiskConfig, RiskConfigType } from '../../contexts/RiskConfigContext';
import RiskCategoryToggle, { RiskCategory } from './RiskCategoryToggle';

// Type definitions
export type LoanType = 'general' | 'equipment' | 'realestate';

interface RiskLabConfiguratorEnhancedProps {
  loanType?: LoanType;
  onLoanTypeChange?: (type: LoanType) => void;
}

const RiskLabConfiguratorEnhanced: React.FC<RiskLabConfiguratorEnhancedProps> = ({
  loanType = 'general',
  onLoanTypeChange
}) => {
  const riskContext = useRiskConfig();
  const [activeCategory, setActiveCategory] = useState<RiskCategory>('creditworthiness');
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  
  // Update active category based on loan type
  useEffect(() => {
    if (loanType === 'equipment') {
      setActiveCategory('equipment');
    } else if (loanType === 'realestate') {
      setActiveCategory('property');
    } else {
      setActiveCategory('creditworthiness');
    }
    
    // Update risk config context
    const configType = mapLoanTypeToConfigType(loanType);
    riskContext.loadConfigForType(configType as RiskConfigType);
  }, [loanType, riskContext]);
  
  // Helper function to map loan type to config type
  const mapLoanTypeToConfigType = (type: LoanType): string => {
    switch (type) {
      case 'equipment': return 'equipment';
      case 'realestate': return 'realestate';
      default: return 'general';
    }
  };
  
  // Handle loan type change
  const handleLoanTypeChange = (type: LoanType) => {
    if (onLoanTypeChange) {
      onLoanTypeChange(type);
    }
  };
  
  // Handle category change
  const handleCategoryChange = (category: RiskCategory) => {
    setActiveCategory(category);
  };

  // Get the tab text for loan type selection
  const getLoanTypeTabText = (type: LoanType) => {
    switch (type) {
      case 'equipment':
        return 'Equipment & Vehicles';
      case 'realestate':
        return 'Real Estate';
      default:
        return 'General';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with tabs for loan type selection */}
      <div className="flex border-b border-gray-200">
        {['general', 'realestate', 'equipment'].map((type) => (
          <button
            key={type}
            data-loan-type={type}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              loanType === type
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleLoanTypeChange(type as LoanType)}
          >
            {getLoanTypeTabText(type as LoanType)}
          </button>
        ))}
      </div>
      
      {/* Main content area */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Risk Lab Configurator for {getLoanTypeTabText(loanType)}
        </h2>
        
        {/* Category toggle component */}
        <RiskCategoryToggle 
          initialCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* Action buttons */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setShowPaywall(true)}
            className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Save Configuration & Run Assessment
          </button>
        </div>
      </div>
      
      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">Purchase Report Credits</h3>
            <p className="text-gray-600 mb-6">
              To run this risk assessment with your custom configuration, you need to purchase credits.
            </p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowPaywall(false)}
                className="px-4 py-2 border rounded-md text-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPaywall(false);
                  alert('Redirecting to payment screen...');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Purchase Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskLabConfiguratorEnhanced; 