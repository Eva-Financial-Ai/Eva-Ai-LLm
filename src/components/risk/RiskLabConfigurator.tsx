import React, { useState, useEffect } from 'react';
import { useRiskConfig, RiskConfigType } from '../../contexts/RiskConfigContext';
import RiskRangesConfigEditor, { RiskRange } from './RiskRangesConfigEditor';
import { DEFAULT_RANGES } from './RiskRangesConfigEditor';
import { mapLoanTypeToConfigType } from './RiskScoringModel';
import { RiskMapType, mapLoanTypeToRiskMapType, mapRiskMapTypeToLoanType } from './RiskMapNavigator';

// Type definitions
export type LoanType = 'general' | 'equipment' | 'realestate';
type RiskScoringCategory = 'creditworthiness' | 'financial' | 'cashflow' | 'legal' | 'equipment' | 'property' | 'guarantors';
type ScoringOutcome = 'positive' | 'average' | 'negative';

// Define a type for mock config when the real one isn't available
interface RiskConfig {
  categoryWeights?: Record<string, number>;
  [key: string]: any;
}

interface ConfiguratorProps {
  loanType: LoanType;
  onLoanTypeChange?: (type: LoanType) => void;
  expanded?: boolean; // Add prop to control expanded state
}

const RiskLabConfigurator: React.FC<ConfiguratorProps> = ({
  loanType = 'general',
  onLoanTypeChange,
  expanded = true // Default to expanded
}) => {
  // Get the context
  const riskContext = useRiskConfig();
  
  // State for configurator values
  const [activeCategory, setActiveCategory] = useState<RiskScoringCategory>('creditworthiness');
  const [recalculate, setRecalculate] = useState<boolean>(true);
  const [activeSlider, setActiveSlider] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded);
  
  // Update expanded state when prop changes
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);
  
  // State for credit score ranges
  const [creditRanges, setCreditRanges] = useState({
    positive: 850,
    average: 719,
    negative: 649
  });

  // State for payment history options
  const [paymentOptions, setPaymentOptions] = useState({
    positive: 'No Missed payment',
    average: '1-2 Missed payment',
    negative: '3+ Missed payment'
  });
  
  // State for weight distribution
  const [categoryWeights, setCategoryWeights] = useState({
    creditworthiness: 40,
    financial: 20,
    cashflow: 20,
    legal: 20,
    equipment: loanType === 'equipment' ? 20 : 0,
    property: loanType === 'realestate' ? 20 : 0,
    guarantors: 0
  });
  
  // State for custom ranges configuration
  const [customRanges, setCustomRanges] = useState<{[key: string]: RiskRange[]}>({
    creditworthiness: [...DEFAULT_RANGES.creditworthiness.metrics],
    financial: [...DEFAULT_RANGES.financial.metrics],
    cashflow: [...DEFAULT_RANGES.cashflow.metrics],
    legal: [...DEFAULT_RANGES.legal.metrics],
    equipment: [...DEFAULT_RANGES.equipment.metrics],
    property: [...DEFAULT_RANGES.property.metrics]
  });

  // Get title based on loan type
  const getTitle = () => {
    switch (loanType) {
      case 'equipment': 
        return 'For Equipment & Vehicles Credit App';
      case 'realestate':
        return 'For Real Estate Credit App';
      default:
        return 'General';
    }
  };

  // Update weights when loan type changes
  useEffect(() => {
    console.log(`RiskLabConfigurator: Loan type changed to ${loanType}`);
    
    // For this demo, we'll implement a mock loader function
    const getMockConfig = (type: LoanType): RiskConfig => {
      // These are default values based on loan type
      return {
        categoryWeights: {
          creditworthiness: type === 'general' ? 40 : 40,
          financial: type === 'general' ? 20 : 15,
          cashflow: type === 'general' ? 20 : 15,
          legal: type === 'general' ? 20 : 10,
          equipment: type === 'equipment' ? 20 : 0,
          property: type === 'realestate' ? 20 : 0,
          guarantors: 0
        }
      };
    };
    
    // Get configuration from our mock (avoids type issues with the real context)
    const config = getMockConfig(loanType);
    
    // Apply the config
    if (config.categoryWeights) {
      setCategoryWeights(prev => ({
        ...prev,
        ...config.categoryWeights
      }));
    }
    
    // Adjust weights based on loan type
    setCategoryWeights(prev => {
      const updatedWeights = { ...prev };
      
      // Reset specialized categories
      updatedWeights.equipment = 0;
      updatedWeights.property = 0;
      
      // Adjust based on loan type
      if (loanType === 'equipment') {
        // For equipment loans: reduce other categories to make room for equipment
        const reductionPerCategory = 20 / 3; // 20% total reduction spread across 3 categories
        updatedWeights.financial = Math.max(0, prev.financial - reductionPerCategory);
        updatedWeights.cashflow = Math.max(0, prev.cashflow - reductionPerCategory);
        updatedWeights.legal = Math.max(0, prev.legal - reductionPerCategory);
        updatedWeights.equipment = 20;
      } else if (loanType === 'realestate') {
        // For real estate loans: reduce other categories to make room for property
        const reductionPerCategory = 20 / 3; // 20% total reduction spread across 3 categories
        updatedWeights.financial = Math.max(0, prev.financial - reductionPerCategory);
        updatedWeights.cashflow = Math.max(0, prev.cashflow - reductionPerCategory);
        updatedWeights.legal = Math.max(0, prev.legal - reductionPerCategory);
        updatedWeights.property = 20;
      } else {
        // For general loans: distribute evenly among the 4 main categories
        updatedWeights.creditworthiness = 40;
        updatedWeights.financial = 20;
        updatedWeights.cashflow = 20;
        updatedWeights.legal = 20;
      }
      
      return updatedWeights;
    });
    
    // Set the active category to the most relevant one for the loan type
    if (loanType === 'equipment') {
      setActiveCategory('equipment');
    } else if (loanType === 'realestate') {
      setActiveCategory('property');
    } else {
      setActiveCategory('creditworthiness');
    }
    
    // Update risk config context with the appropriate config type
    const configType = mapLoanTypeToConfigType(loanType);
    riskContext.loadConfigForType(configType as RiskConfigType);
    
  }, [loanType, riskContext]);

  // Function to check if total weights equal 100%
  const checkTotalWeights = (): boolean => {
    const total = Object.values(categoryWeights).reduce((sum, weight) => sum + weight, 0);
    return total === 100;
  };

  // Handle weight slider changes
  const handleWeightChange = (category: RiskScoringCategory, newValue: number) => {
    setActiveSlider(category);
    
    // Calculate the difference to distribute
    const difference = newValue - categoryWeights[category];
    
    setCategoryWeights(prev => {
      const updated = { ...prev, [category]: newValue };
      
      // Get categories that can be adjusted (non-zero weights excluding the active one)
      const adjustableCategories = Object.entries(prev)
        .filter(([key, value]) => key !== category && value > 0)
        .map(([key]) => key as RiskScoringCategory);
      
      if (adjustableCategories.length === 0) return updated;
      
      // Distribute the difference proportionally
      const totalAdjustableWeight = adjustableCategories.reduce((sum, key) => sum + prev[key], 0);
      
      adjustableCategories.forEach(key => {
        const proportion = prev[key] / totalAdjustableWeight;
        updated[key] = Math.max(0, Math.round(prev[key] - (difference * proportion)));
      });
      
      // Ensure the total is exactly 100%
      const currentTotal = Object.values(updated).reduce((sum, val) => sum + val, 0);
      if (currentTotal !== 100) {
        // Find the largest category (excluding active) to adjust
        const largestCategory = adjustableCategories.reduce(
          (largest, key) => updated[key] > updated[largest] ? key : largest,
          adjustableCategories[0]
        );
        updated[largestCategory] += (100 - currentTotal);
      }
      
      return updated;
    });
  };

  // Handle custom ranges changes
  const handleRangesChange = (category: RiskScoringCategory, ranges: RiskRange[]) => {
    setCustomRanges(prev => ({
      ...prev,
      [category]: ranges
    }));
  };

  // Function to handle credit range changes
  const handleCreditRangeChange = (type: 'positive' | 'average' | 'negative', value: number) => {
    setCreditRanges(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Function to handle payment option changes
  const handlePaymentOptionChange = (type: 'positive' | 'average' | 'negative', value: string) => {
    setPaymentOptions(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Handle loan type change
  const handleLoanTypeChange = (type: LoanType) => {
    console.log(`Changing loan type to: ${type}`);
    
    // Provide visual feedback for the selection
    const button = document.querySelector(`button[data-loan-type="${type}"]`);
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => button.classList.remove('animate-pulse'), 500);
    }
    
    if (onLoanTypeChange) {
      onLoanTypeChange(type);
    }
  };

  // Get the total weight
  const getTotalWeight = () => {
    return Object.values(categoryWeights).reduce((sum, weight) => sum + weight, 0);
  };

  // Calculate if weights are valid (total 100%)
  const areWeightsValid = () => {
    return getTotalWeight() === 100;
  };

  // Handle saving the configuration
  const handleSaveConfig = () => {
    // In a real app, this would save to backend
    alert('Configuration saved successfully!');
    // Show the paywall modal to purchase credits
    setShowPaywall(true);
  };

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
        activeStyle = isActive ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50';
        break;
      default: // general
        activeStyle = isActive ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50';
    }
    
    return `${baseStyle} ${activeStyle}`;
  };

  // Get slider style based on loan type
  const getSliderStyle = () => {
    switch (loanType) {
      case 'equipment':
        return 'accent-red-600';
      case 'realestate':
        return 'accent-blue-600';
      default:
        return 'accent-blue-600';
    }
  };
  
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
  };

  // Get category display name
  const getCategoryName = (category: RiskScoringCategory) => {
    switch (category) {
      case 'creditworthiness': return 'Creditworthiness Of The Borrower (CWB)';
      case 'financial': return 'Financial Statements And Ratios (FSR)';
      case 'cashflow': return 'Business Cash Flow (BCF)';
      case 'legal': return 'Legal And Regulatory Compliance (LRC)';
      case 'equipment': return 'Equipment Value and Type (EVT)';
      case 'property': return 'Real Estate (EVT)';
      case 'guarantors': return 'Guarantors & Secondary Collateral';
      default: return category;
    }
  };

  // Update the credit score input fields
  const renderCreditRangeInputs = () => {
    return (
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">POSITIVE</label>
          <input
            type="number"
            value={creditRanges.positive}
            onChange={(e) => handleCreditRangeChange('positive', parseInt(e.target.value))}
            className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">AVERAGE</label>
          <input
            type="number"
            value={creditRanges.average}
            onChange={(e) => handleCreditRangeChange('average', parseInt(e.target.value))}
            className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">NEGATIVE</label>
          <input
            type="number"
            value={creditRanges.negative}
            onChange={(e) => handleCreditRangeChange('negative', parseInt(e.target.value))}
            className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  };

  // Render payment option inputs
  const renderPaymentOptions = () => {
    return (
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">POSITIVE</label>
          <input
            type="text"
            value={paymentOptions.positive}
            onChange={(e) => handlePaymentOptionChange('positive', e.target.value)}
            className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">AVERAGE</label>
          <input
            type="text"
            value={paymentOptions.average}
            onChange={(e) => handlePaymentOptionChange('average', e.target.value)}
            className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">NEGATIVE</label>
          <input
            type="text"
            value={paymentOptions.negative}
            onChange={(e) => handlePaymentOptionChange('negative', e.target.value)}
            className="w-full p-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  };

  // Replace the creditworthiness section with the updated version
  const renderCategoryWeightSlider = (category: RiskScoringCategory, categoryName: string) => {
    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-900">
            {getCategoryName(category)}
          </h4>
          <button
            className="text-xs text-blue-600"
            onClick={() => {
              // Save current weight
              const currentWeight = parseInt(
                document.getElementById(`weight-${category}`)?.innerText || '0'
              );
              setCategoryWeights(prev => ({
                ...prev,
                [category]: currentWeight
              }));
            }}
          >
            Save
          </button>
        </div>
        
        <div className="flex items-center mb-1">
          <span className="text-xs text-gray-500 mr-2">WEIGHT</span>
          <div 
            className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const position = e.clientX - rect.left;
              const percentage = Math.round((position / rect.width) * 100);
              handleWeightChange(category, Math.min(100, Math.max(0, percentage)));
            }}
          >
            <div 
              className={`h-full ${
                loanType === 'equipment' && category === 'equipment' ? 'bg-red-600' :
                loanType === 'realestate' && category === 'property' ? 'bg-blue-600' :
                loanType === 'equipment' ? 'bg-red-600' : 
                loanType === 'realestate' ? 'bg-blue-600' : 'bg-blue-600'
              }`} 
              style={{ width: `${categoryWeights[category]}%` }}
            ></div>
          </div>
          <input 
            type="number" 
            id={`weight-${category}`}
            min="0"
            max="100"
            value={categoryWeights[category]}
            onChange={(e) => handleWeightChange(category, parseInt(e.target.value))}
            className="w-12 text-xs ml-2 p-1 border border-gray-300 rounded text-center"
          />
          <span className="text-xs ml-1">%</span>
        </div>

        {category === 'creditworthiness' && (
          <>
            {renderCreditRangeInputs()}
            
            <div className="grid grid-cols-4 gap-1 items-center mt-4">
              <div className="text-sm font-medium">Credit Score</div>
              <div className="text-sm text-center text-green-600 font-semibold">
                {creditRanges.positive} <span className="inline-block w-3 h-3 bg-green-100 text-green-800 rounded-full text-xs flex items-center justify-center">✓</span>
              </div>
              <div className="text-sm text-center">{creditRanges.average}</div>
              <div className="text-sm text-center">{creditRanges.negative}</div>
            </div>
            
            <div className="grid grid-cols-4 gap-1 items-center mt-2">
              <div className="text-sm font-medium">Payment History</div>
              <div className="text-sm text-center">{paymentOptions.positive}</div>
              <div className="text-sm text-center text-green-600">{paymentOptions.average} <span className="inline-block w-3 h-3 bg-green-100 text-green-800 rounded-full text-xs flex items-center justify-center">✓</span></div>
              <div className="text-sm text-center">{paymentOptions.negative}</div>
            </div>
            
            {renderPaymentOptions()}
          </>
        )}
      </div>
    );
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
        
        {/* Category tabs */}
        <div className="flex flex-wrap mb-6 border-b border-gray-200">
          {Object.entries(categoryWeights)
            .filter(([_, weight]) => weight > 0)
            .map(([category]) => (
              <button
                key={category}
                className={`py-2 px-4 text-sm font-medium border-b-2 mr-2 ${
                  activeCategory === category
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveCategory(category as RiskScoringCategory)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
        </div>
        
        {/* Weight distribution sliders */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weight Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">
            Adjust the importance of each category in the overall risk assessment. 
            Total must equal 100%.
          </p>
          
          <div className="space-y-4">
            {Object.entries(categoryWeights)
              .filter(([_, weight]) => weight > 0)
              .map(([category, weight]) => (
                <div key={category} className="flex items-center">
                  <div className="w-40 text-sm font-medium text-gray-700">
                    {category.charAt(0).toUpperCase() + category.slice(1)}:
                  </div>
                  <div className="flex-1 mx-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weight}
                      onChange={(e) => handleWeightChange(
                        category as RiskScoringCategory,
                        parseInt(e.target.value)
                      )}
                      className={`w-full ${
                        activeSlider === category ? 'accent-blue-600' : ''
                      }`}
                    />
                  </div>
                  <div className="w-16 text-center">
                    <span className={`font-semibold ${
                      activeSlider === category ? 'text-blue-600' : 'text-gray-700'
                    }`}>
                      {weight}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
          
          {/* Validation message */}
          <div className={`mt-2 text-sm ${
            areWeightsValid() ? 'text-green-600' : 'text-red-600'
          }`}>
            {areWeightsValid() 
              ? '✓ Valid configuration (100%)'
              : `⚠ Total must equal 100% (current: ${getTotalWeight()}%)`
            }
          </div>
        </div>
        
        {/* Range configuration for the selected category */}
        <div className="mt-6">
          <RiskRangesConfigEditor
            category={activeCategory}
            initialRanges={customRanges[activeCategory]}
            onChange={(ranges) => handleRangesChange(activeCategory, ranges)}
          />
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveConfig}
            disabled={!areWeightsValid()}
            className={`px-4 py-2 rounded-md font-medium ${
              areWeightsValid()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
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
                  // In a real app, this would integrate with the PaywallModal component
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

export default RiskLabConfigurator; 