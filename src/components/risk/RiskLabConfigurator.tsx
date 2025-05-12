import React, { useState, useEffect } from 'react';
import { LoanType, RiskScoringCategory, ScoringOutcome } from './RiskScoringModel';

interface ConfiguratorProps {
  loanType: LoanType;
  onLoanTypeChange?: (type: LoanType) => void;
}

const RiskLabConfigurator: React.FC<ConfiguratorProps> = ({
  loanType = 'general',
  onLoanTypeChange
}) => {
  // State for configurator values
  const [activeCategory, setActiveCategory] = useState<RiskScoringCategory>('creditworthiness');
  const [currentWeight, setCurrentWeight] = useState<number>(20);
  const [recalculate, setRecalculate] = useState<boolean>(false);
  
  // Define the category weights based on loan type
  const [categoryWeights, setCategoryWeights] = useState<Record<RiskScoringCategory, number>>({
    creditworthiness: 40,
    financial: 20,
    cashflow: 10,
    legal: 20,
    equipment: loanType === 'equipment' ? 20 : 0,
    property: loanType === 'realestate' ? 20 : 0,
    guarantors: 10
  });

  // Update weights when loan type changes
  useEffect(() => {
    setCategoryWeights(prev => ({
      ...prev,
      equipment: loanType === 'equipment' ? 20 : 0,
      property: loanType === 'realestate' ? 20 : 0
    }));
  }, [loanType]);

  // Handle weight change
  const handleWeightChange = (category: RiskScoringCategory, value: number) => {
    setCurrentWeight(value);
    setCategoryWeights(prev => ({
      ...prev,
      [category]: value
    }));
  }

  // Handle category click
  const handleCategoryClick = (category: RiskScoringCategory) => {
    setActiveCategory(category);
    setCurrentWeight(categoryWeights[category]);
  }

  // Handle loan type change
  const handleLoanTypeChange = (type: LoanType) => {
    if (onLoanTypeChange) {
      onLoanTypeChange(type);
    }
  }

  // Get the total weight
  const getTotalWeight = () => {
    return Object.values(categoryWeights).reduce((sum, weight) => sum + weight, 0);
  }

  // Calculate if weights are valid (total 100%)
  const areWeightsValid = () => {
    return getTotalWeight() === 100;
  }

  // Save configuration
  const handleSave = () => {
    if (areWeightsValid()) {
      // In a real app, this would save to backend
      console.log('Configuration saved:', categoryWeights);
      alert('Risk configuration saved successfully!');
    } else {
      alert(`Total weight must equal 100%. Current total: ${getTotalWeight()}%`);
    }
  }

  // Reset configuration
  const handleReset = () => {
    setCategoryWeights({
      creditworthiness: 40,
      financial: 20,
      cashflow: 10,
      legal: 20,
      equipment: loanType === 'equipment' ? 20 : 0,
      property: loanType === 'realestate' ? 20 : 0,
      guarantors: 10
    });
    setCurrentWeight(40);
    setActiveCategory('creditworthiness');
  }

  // Get styling for category based on loan type
  const getCategoryStyle = (category: RiskScoringCategory) => {
    const isActive = category === activeCategory;
    
    let baseStyle = 'px-4 py-3 rounded-lg border flex items-center justify-between mb-2 cursor-pointer transition-all';
    let activeStyle = '';
    
    switch (loanType) {
      case 'equipment':
        activeStyle = isActive ? 'bg-green-50 border-green-300 text-green-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-green-50';
        break;
      case 'realestate':
        activeStyle = isActive ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-amber-50';
        break;
      default: // general
        activeStyle = isActive ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50';
    }
    
    return `${baseStyle} ${activeStyle}`;
  }

  // Get category icon
  const getCategoryIcon = (category: RiskScoringCategory) => {
    switch (category) {
      case 'creditworthiness': return '💳';
      case 'financial': return '📊';
      case 'cashflow': return '💰';
      case 'legal': return '⚖️';
      case 'equipment': return '🔧';
      case 'property': return '🏢';
      case 'guarantors': return '🤝';
      default: return '📋';
    }
  }

  // Get category display name
  const getCategoryName = (category: RiskScoringCategory) => {
    switch (category) {
      case 'creditworthiness': return 'Creditworthiness of The Borrower (CWB)';
      case 'financial': return 'Financial Statements And Ratios (FSR)';
      case 'cashflow': return 'Business Cash Flow (BCF)';
      case 'legal': return 'Legal And Regulatory Compliance (LRC)';
      case 'equipment': return 'Equipment Value and Type (EVT)';
      case 'property': return 'Real Estate (EVT)';
      case 'guarantors': return 'Guarantors & Secondary Collateral';
      default: return category;
    }
  }

  // Get text for the note about fifth category
  const getFifthCategoryNote = () => {
    if (loanType === 'equipment') {
      return 'Depending on whether it\'s an equipment or a real estate loan, a 5th category will be added based on the loan type.';
    } else if (loanType === 'realestate') {
      return 'For real estate loans, Property evaluation is added as a 5th category.';
    } else {
      return 'For equipment loans, Equipment Value assessment is added as a 5th category.';
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Risk Score And Report</h3>
            <p className="text-sm text-gray-500 mt-1">Configure risk scoring parameters and weights</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Loan Type:</span>
            {/* Loan type buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleLoanTypeChange('general')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  loanType === 'general'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                General
              </button>
              <button
                onClick={() => handleLoanTypeChange('equipment')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  loanType === 'equipment'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Equipment & Vehicles
              </button>
              <button
                onClick={() => handleLoanTypeChange('realestate')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                  loanType === 'realestate'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Real Estate
              </button>
            </div>
          </div>
        </div>
        
        {/* Information note about 5th category */}
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-md border border-blue-200">
          <p>{getFifthCategoryNote()}</p>
        </div>
      </div>
      
      {/* Main configurator layout */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category list - left column */}
        <div className="md:col-span-1">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Categories</h4>
          
          <div className="space-y-2">
            {/* Creditworthiness */}
            <div 
              className={getCategoryStyle('creditworthiness')}
              onClick={() => handleCategoryClick('creditworthiness')}
            >
              <div className="flex items-center">
                <span className="mr-2 text-lg">{getCategoryIcon('creditworthiness')}</span>
                <span className="font-medium">Creditworthiness</span>
              </div>
              <div className="text-sm font-medium">
                {categoryWeights.creditworthiness}%
              </div>
            </div>
            
            {/* Financial */}
            <div 
              className={getCategoryStyle('financial')}
              onClick={() => handleCategoryClick('financial')}
            >
              <div className="flex items-center">
                <span className="mr-2 text-lg">{getCategoryIcon('financial')}</span>
                <span className="font-medium">Financial Statements</span>
              </div>
              <div className="text-sm font-medium">
                {categoryWeights.financial}%
              </div>
            </div>
            
            {/* Cash flow */}
            <div 
              className={getCategoryStyle('cashflow')}
              onClick={() => handleCategoryClick('cashflow')}
            >
              <div className="flex items-center">
                <span className="mr-2 text-lg">{getCategoryIcon('cashflow')}</span>
                <span className="font-medium">Cash Flow</span>
              </div>
              <div className="text-sm font-medium">
                {categoryWeights.cashflow}%
              </div>
            </div>
            
            {/* Legal */}
            <div 
              className={getCategoryStyle('legal')}
              onClick={() => handleCategoryClick('legal')}
            >
              <div className="flex items-center">
                <span className="mr-2 text-lg">{getCategoryIcon('legal')}</span>
                <span className="font-medium">Legal & Regulatory</span>
              </div>
              <div className="text-sm font-medium">
                {categoryWeights.legal}%
              </div>
            </div>
            
            {/* Equipment - only for equipment loans */}
            {loanType === 'equipment' && (
              <div 
                className={getCategoryStyle('equipment')}
                onClick={() => handleCategoryClick('equipment')}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{getCategoryIcon('equipment')}</span>
                  <span className="font-medium">Equipment Value</span>
                </div>
                <div className="text-sm font-medium">
                  {categoryWeights.equipment}%
                </div>
              </div>
            )}
            
            {/* Property - only for real estate loans */}
            {loanType === 'realestate' && (
              <div 
                className={getCategoryStyle('property')}
                onClick={() => handleCategoryClick('property')}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{getCategoryIcon('property')}</span>
                  <span className="font-medium">Property</span>
                </div>
                <div className="text-sm font-medium">
                  {categoryWeights.property}%
                </div>
              </div>
            )}
            
            {/* Guarantors */}
            <div 
              className={getCategoryStyle('guarantors')}
              onClick={() => handleCategoryClick('guarantors')}
            >
              <div className="flex items-center">
                <span className="mr-2 text-lg">{getCategoryIcon('guarantors')}</span>
                <span className="font-medium">Guarantors</span>
              </div>
              <div className="text-sm font-medium">
                {categoryWeights.guarantors}%
              </div>
            </div>
          </div>
          
          {/* Weight validation message */}
          <div className={`mt-4 p-3 rounded-md text-sm ${areWeightsValid() ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'}`}>
            {areWeightsValid() 
              ? 'Weights are balanced at 100%' 
              : `Total weight: ${getTotalWeight()}% (should equal 100%)`}
          </div>
        </div>
        
        {/* Weight adjustment - middle column */}
        <div className="md:col-span-1">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Weight Configuration</h4>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h5 className="font-medium text-gray-900">{getCategoryName(activeCategory)}</h5>
            <p className="text-sm text-gray-600 mt-1">
              Adjust the importance of this factor in the overall risk score.
            </p>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight: {currentWeight}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={currentWeight}
                onChange={(e) => handleWeightChange(activeCategory, parseInt(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer
                  ${loanType === 'equipment' ? 'bg-green-200' : 
                    loanType === 'realestate' ? 'bg-amber-200' : 'bg-blue-200'}`}
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Recalculate other weights</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={recalculate} 
                    onChange={() => setRecalculate(!recalculate)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="text-xs text-gray-500">
                When enabled, changing this category's weight will automatically adjust other categories to maintain a total of 100%.
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleReset}
                className="w-full bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-50 transition duration-150"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
        
        {/* Scoring key and actions - right column */}
        <div className="md:col-span-1">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Scoring System</h4>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h5 className="font-medium text-gray-900">Blackjack-Style Scoring</h5>
            <p className="text-sm text-gray-600 mt-1">
              This system uses a "blackjack" approach to calculating risk.
            </p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Good: +2 points</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Average: 0 points</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Negative: -1 point</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h5 className="font-medium text-gray-900">Risk Classification</h5>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-700">Low Risk</span>
                <span className="text-xs text-gray-500">70-100 points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-yellow-700">Medium Risk</span>
                <span className="text-xs text-gray-500">50-69 points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-red-700">High Risk</span>
                <span className="text-xs text-gray-500">0-49 points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleSave}
              className={`w-full text-white rounded-md px-4 py-2 text-sm font-medium transition duration-150 ${
                loanType === 'equipment' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : loanType === 'realestate' 
                    ? 'bg-amber-600 hover:bg-amber-700' 
                    : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskLabConfigurator; 