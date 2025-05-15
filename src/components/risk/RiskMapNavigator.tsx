import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { useLoadingStatus } from '../../services/LoadingService';
import ModularLoading from '../common/ModularLoading';
import riskMapService, { RiskData } from './RiskMapService';
import RiskCriteriaConfig, { RiskCriteria } from './RiskCriteriaConfig';

// Define and export RiskMapType
export type RiskMapType = 'unsecured' | 'equipment' | 'realestate';

// Define and export RISK_MAP_VIEWS
export const RISK_MAP_VIEWS = {
  STANDARD: 'standard',
  LAB: 'lab',
  SCORE: 'score',
};

// Re-export service mapping functions
export const mapLoanTypeToRiskMapType = riskMapService.mapLoanTypeToRiskMapType;
export const mapRiskMapTypeToLoanType = riskMapService.mapRiskMapTypeToLoanType;

// Import RiskCategory directly to avoid circular dependencies
export type RiskCategory =
  | 'all'
  | 'credit'
  | 'capacity'
  | 'collateral'
  | 'capital'
  | 'conditions'
  | 'character'
  | 'customer_retention';

// Update component props to accept the props used in other components
interface RiskMapNavigatorProps {
  selectedCategory?: string;
  onCategorySelect?: (category: RiskCategory) => void;
  riskMapType?: RiskMapType;
  onRiskMapTypeChange?: (type: RiskMapType) => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
  onCriteriaChange?: (criteria: RiskCriteria[]) => void;
}

const RiskMapNavigator: React.FC<RiskMapNavigatorProps> = ({
  selectedCategory,
  onCategorySelect,
  riskMapType,
  onRiskMapTypeChange,
  activeView,
  onViewChange,
  onCriteriaChange
}) => {
  const navigate = useNavigate();
  const { currentTransaction } = useWorkflow();
  
  // Use the parent component's riskMapType if provided, otherwise use local state
  const [activeType, setActiveType] = useState<RiskMapType>(riskMapType as RiskMapType || 'unsecured');
  
  // Use the loading service for risk map components - only load one at a time
  const [riskMapStatus, riskMapLoading] = useLoadingStatus('risk-map', 'main');
  const [riskScoreStatus, riskScoreLoading] = useLoadingStatus('risk-score', 'main');
  const [evaAnalysisStatus, evaAnalysisLoading] = useLoadingStatus('eva-analysis', 'main');

  // State for risk data
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  
  // Add state for showing the criteria configuration
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(false);

  // Update local state when props change
  useEffect(() => {
    if (riskMapType) {
      setActiveType(riskMapType);
    }
  }, [riskMapType]);
  
  // Load risk data when component mounts or active type changes - only load the selected type
  useEffect(() => {
    // Only load data for this specific map type
    loadRiskData(activeType);
    
    // Clean up function
    return () => {
      riskMapLoading.resetLoading();
      riskScoreLoading.resetLoading();
      evaAnalysisLoading.resetLoading();
    };
  }, [activeType]);

  // Centralized function to load risk data for a single type
  const loadRiskData = async (type: RiskMapType) => {
    console.log(`[RiskMapNavigator] Loading risk data for type: ${type}`);
    
    try {
      // Start loading indicators for this risk map only
      riskMapLoading.startLoading(`Loading ${type} risk assessment data...`);
      
      setTimeout(() => {
        riskScoreLoading.startLoading(`Calculating ${type} risk score...`);
      }, 100);
      
      setTimeout(() => {
        evaAnalysisLoading.startLoading(`EVA AI is analyzing ${type} application data...`);
      }, 200);
      
      // Make sure we clear any previous data for different types
      setRiskData(null);
      
      // Fetch data from the service - only for the current map type
      const data = await riskMapService.fetchRiskData(type);
      console.log(`[RiskMapNavigator] Risk data loaded successfully for ${type}:`, data);
      
      // Update state safely
      setRiskData(data);
      
      // Complete loading indicators with staggered timing for better UX
      setTimeout(() => {
        riskScoreLoading.completeLoading('Risk score calculated successfully');
      }, 500);
      
      setTimeout(() => {
        riskMapLoading.completeLoading('Risk assessment loaded');
      }, 700);
      
      setTimeout(() => {
        evaAnalysisLoading.completeLoading('Analysis complete');
      }, 900);
    } catch (error) {
      console.error('[RiskMapNavigator] Error loading risk data:', error);
      riskMapLoading.setError('Failed to load risk assessment data. Please try again.');
      riskScoreLoading.setError('Failed to calculate risk score. Please try again.');
      evaAnalysisLoading.setError('EVA AI analysis failed. Please try again.');
    }
  };
  
  // Handle category selection
  const handleCategorySelection = (category: RiskCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  // Create an array of categories for the selector
  const categories: RiskCategory[] = [
    'credit', 
    'capacity', 
    'collateral', 
    'capital', 
    'conditions', 
    'character',
    'all',
    'customer_retention'
  ];

  // Add handler for risk map type changes
  const handleRiskMapTypeChange = (type: RiskMapType) => {
    setActiveType(type);
    
    // Call parent component's handler if provided
    if (onRiskMapTypeChange) {
      onRiskMapTypeChange(type);
    }
    
    // Load new data for this type
    loadRiskData(type);
  };

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Risk Assessment</h1>
        <button
          onClick={() => setShowConfigPanel(!showConfigPanel)}
          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded hover:bg-blue-200"
        >
          {showConfigPanel ? 'Show Map' : 'Configure Criteria'}
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">
        Analyzing risk factors for {activeType} transaction type
      </p>
      
      {showConfigPanel ? (
        <RiskCriteriaConfig 
          riskMapType={activeType}
          onConfigChange={(criteria) => {
            console.log('[RiskMapNavigator] Risk criteria updated:', criteria);
            // Pass criteria changes to parent component
            if (onCriteriaChange) {
              onCriteriaChange(criteria);
            }
          }}
        />
      ) : (
        <div className="mb-6 relative">
          {/* EVA AI Analysis Loading */}
          {evaAnalysisStatus.state === 'loading' && (
            <div className="mb-6">
              <ModularLoading 
                status={evaAnalysisStatus} 
                theme="red" 
                spinnerType="dots"
                size="full"
                className="border border-gray-200 bg-gray-50"
                showThoughtProcess={true}
              />
            </div>
          )}
          
          {/* Risk Map Loading Indicator */}
          {riskMapStatus.state === 'loading' && (
            <div className="mb-6">
              <ModularLoading 
                status={riskMapStatus} 
                theme="red" 
                spinnerType="circle"
                size="full"
                className="border border-gray-200 py-8"
              />
            </div>
          )}
          
          {/* View Mode Selector */}
          {riskMapStatus.state === 'success' && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">View Options</h2>
              <div className="flex space-x-2">
                {Object.values(RISK_MAP_VIEWS).map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      if (onViewChange) {
                        onViewChange(view);
                      }
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeView === view
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Risk Categories Selection */}
          {riskMapStatus.state === 'success' && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Risk Categories</h2>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelection(category)}
                    className={`text-left px-4 py-2 border rounded-md transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Risk Map Type Selector */}
          {riskMapStatus.state === 'success' && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Transaction Type</h2>
              <div className="flex flex-col space-y-2">
                {['unsecured', 'equipment', 'realestate'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleRiskMapTypeChange(type as RiskMapType)}
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      activeType === type
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskMapNavigator;
