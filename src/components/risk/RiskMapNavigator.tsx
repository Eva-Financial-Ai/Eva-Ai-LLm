import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RiskMapOptimized, { RiskCategory } from './RiskMapOptimized';
import { useWorkflow } from '../../contexts/WorkflowContext';
import { useLoadingStatus } from '../../services/LoadingService';
import ModularLoading from '../common/ModularLoading';
import riskMapService, { RiskData } from './RiskMapService';

// Define and export RiskMapType
export type RiskMapType = 'unsecured' | 'equipment' | 'realestate';

// Define and export RISK_MAP_VIEWS
export const RISK_MAP_VIEWS = {
  STANDARD: 'standard',
  REPORT: 'report',
  LAB: 'lab',
  SCORE: 'score',
};

// Re-export service mapping functions
export const mapLoanTypeToRiskMapType = riskMapService.mapLoanTypeToRiskMapType;
export const mapRiskMapTypeToLoanType = riskMapService.mapRiskMapTypeToLoanType;

// Define Risk Map types for the tabs
const riskMapTypes = [
  { id: 'unsecured', label: 'Unsecured' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'realestate', label: 'Real Estate' }
];

// Update component props to accept the props used in other components
interface RiskMapNavigatorProps {
  selectedCategory?: string;
  onCategorySelect?: (category: RiskCategory) => void;
  riskMapType?: RiskMapType;
  onRiskMapTypeChange?: (type: RiskMapType) => void;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

const RiskMapNavigator: React.FC<RiskMapNavigatorProps> = ({
  selectedCategory,
  onCategorySelect,
  riskMapType,
  onRiskMapTypeChange,
  activeView,
  onViewChange
}) => {
  const navigate = useNavigate();
  const { currentTransaction } = useWorkflow();
  
  // Define state for active risk map and active type
  const [activeRiskMap, setActiveRiskMap] = useState<'standard' | 'eva' | 'interactive'>('eva');
  
  // Use the parent component's riskMapType if provided, otherwise use local state
  const [activeType, setActiveType] = useState<string>(riskMapType || 'unsecured');
  
  // Use the loading service for risk map components
  const [riskMapStatus, riskMapLoading] = useLoadingStatus('risk-map', 'main');
  const [riskScoreStatus, riskScoreLoading] = useLoadingStatus('risk-score', 'main');
  const [evaAnalysisStatus, evaAnalysisLoading] = useLoadingStatus('eva-analysis', 'main');
  const [paymentProcessingStatus, paymentProcessingLoading] = useLoadingStatus('payment-processing', 'main');

  // Add state for payment handling
  const [isPaymentProcessorOpen, setIsPaymentProcessorOpen] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(riskMapService.getAvailableCredits());
  
  // State for risk data
  const [riskData, setRiskData] = useState<RiskData | null>(null);

  // Update local state when props change
  useEffect(() => {
    if (riskMapType) {
      setActiveType(riskMapType);
    }
  }, [riskMapType]);
  
  // Load risk data when component mounts or active type changes
  useEffect(() => {
    loadRiskData(activeType as RiskMapType);
    
    // Clean up function
    return () => {
      riskMapLoading.resetLoading();
      riskScoreLoading.resetLoading();
      evaAnalysisLoading.resetLoading();
      paymentProcessingLoading.resetLoading();
    };
  }, [activeType]);

  // Centralized function to load risk data
  const loadRiskData = async (type: RiskMapType) => {
    try {
      // Start loading indicators
      riskMapLoading.startLoading('Loading risk assessment data...');
      
      setTimeout(() => {
        riskScoreLoading.startLoading('Calculating risk score...');
      }, 100);
      
      setTimeout(() => {
        evaAnalysisLoading.startLoading('EVA AI is analyzing application data...');
      }, 200);
      
      // Fetch data from the service
      const data = await riskMapService.fetchRiskData(type);
      
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
      console.error('Error loading risk data:', error);
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

  // Handle risk type change
  const handleRiskTypeChange = (type: RiskMapType) => {
    console.log(`Changing risk map type to: ${type}`);
    setActiveType(type);
    
    // Notify parent component
    if (onRiskMapTypeChange) {
      onRiskMapTypeChange(type);
    }
    
    // Load new risk data
    loadRiskData(type);
  };

  // Handle payment processing with credits
  const handlePaymentProcessing = () => {
    // Check if user has credits
    if (availableCredits > 0) {
      // Use the service to use a credit
      if (riskMapService.useCredit()) {
        // Update local state
        setAvailableCredits(riskMapService.getAvailableCredits());
        
        console.log('Using credit for report generation');
        paymentProcessingLoading.startLoading('Processing credit redemption...');
        
        // Simulate processing
        setTimeout(() => {
          paymentProcessingLoading.completeLoading('Credit redeemed successfully');
          
          // Redirect to report view
          if (onViewChange) {
            onViewChange(RISK_MAP_VIEWS.REPORT);
          }
        }, 1000);
      }
    } else {
      console.log('Insufficient credits');
      paymentProcessingLoading.setError('Insufficient credits. Please purchase more credits.');
      
      // Open payment modal in parent component via custom event
      const openPaywallEvent = new CustomEvent('openPaywall', { detail: { type: activeType } });
      document.dispatchEvent(openPaywallEvent);
    }
  };

  // Listen for credits updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'availableCredits') {
        setAvailableCredits(riskMapService.getAvailableCredits());
      }
    };
    
    // Check credits on mount and on storage changes
    setAvailableCredits(riskMapService.getAvailableCredits());
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Create a periodic checker for credit updates (for cases where storage event doesn't fire)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCredits = riskMapService.getAvailableCredits();
      if (currentCredits !== availableCredits) {
        setAvailableCredits(currentCredits);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [availableCredits]);

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment for ABC Corp</h1>
      <p className="text-gray-600 mb-6">
        Comprehensive analysis of risk factors for this transaction
      </p>

      {/* Tabs for risk map types */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Risk map types">
          {riskMapTypes.map(mapType => (
            <button
              key={mapType.id}
              onClick={() => handleRiskTypeChange(mapType.id as RiskMapType)}
              className={`pb-4 px-1 text-sm font-medium ${
                (riskMapType || activeType) === mapType.id
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {mapType.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Payment Credits Display */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600">Available Credits:</span>
          <span className="ml-2 font-semibold">{availableCredits}</span>
        </div>
        <button
          onClick={handlePaymentProcessing}
          className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium"
        >
          {availableCredits > 0 ? 'Use Credit' : 'Buy Credits'}
        </button>
      </div>

      {/* Risk map content */}
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
        
        {/* Risk Score Loading Indicator */}
        {riskScoreStatus.state === 'loading' && (
          <div className="mb-6">
            <ModularLoading 
              status={riskScoreStatus} 
              theme="red" 
              spinnerType="bar"
              size="full"
              className="border border-gray-200"
            />
          </div>
        )}
        
        {/* Combined Risk Report and Score Component */}
        {riskScoreStatus.state !== 'loading' && riskData && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <span className="mr-2">
                  <svg
                    className="h-5 w-5 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                EVA AI Risk Analysis & Score
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Based on our industry analysis, this application shows strong metrics with minor exceptions to review.
              </p>
              
              {/* Score display */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500">Overall Risk Score</h4>
                  <div className="flex items-center mt-1">
                    <div className="text-3xl font-bold text-gray-900">{riskData.score}</div>
                    <div className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Good
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500">Industry Average</h4>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{riskData.industry_avg}</div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-500">AI Confidence</h4>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{riskData.confidence}%</div>
                </div>
              </div>
              
              {/* Risk categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Risk Category Scores</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(riskData.categories).map(([category, data]) => (
                    <div key={category} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        <span className="text-sm font-semibold text-gray-900">{data.score}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className={`bg-${data.status === 'green' ? 'green' : data.status === 'yellow' ? 'yellow' : 'red'}-500 h-1.5 rounded-full`} 
                          style={{ width: `${data.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Key findings */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Key Findings</h4>
                <ul className="space-y-2 text-sm">
                  {riskData.findings.map((finding, index) => (
                    <li key={index} className="flex items-start">
                      <svg 
                        className={`h-5 w-5 ${
                          finding.type === 'positive' ? 'text-green-500' : 
                          finding.type === 'warning' ? 'text-yellow-500' : 
                          'text-red-500'
                        } mr-2 mt-0.5`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        {finding.type === 'positive' ? (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        ) : finding.type === 'warning' ? (
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        )}
                      </svg>
                      <span>{finding.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
        
        {/* Risk Map */}
        {riskMapStatus.state !== 'loading' && (
          <RiskMapOptimized initialCategory={selectedCategory as RiskCategory || 'capacity'} />
        )}
      </div>

      {/* Payment processor modal */}
      {isPaymentProcessorOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Credit Card Payment</h3>
              <button 
                onClick={() => setIsPaymentProcessorOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {paymentProcessingStatus.state === 'loading' ? (
              <ModularLoading 
                status={paymentProcessingStatus} 
                theme="red" 
                spinnerType="dots"
                size="full"
              />
            ) : paymentProcessingStatus.state === 'error' ? (
              <div className="text-center p-4">
                <div className="text-red-600 mb-4">{paymentProcessingStatus.error}</div>
                <button 
                  onClick={handlePaymentProcessing}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">
                Please purchase credits through the checkout process to access reports.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskMapNavigator;
