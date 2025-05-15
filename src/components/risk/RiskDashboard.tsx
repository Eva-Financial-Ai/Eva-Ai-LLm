import React, { useState, useCallback, useEffect } from 'react';
import { RiskMapOptimized, RiskCategory, ViewMode } from './RiskMapOptimized';
import { RiskMapType, RISK_MAP_VIEWS } from './RiskMapNavigator';
import RiskMapNavigator from './RiskMapNavigator';
import ErrorBoundary from '../common/ErrorBoundary';
import { RiskCriteria } from './RiskCriteriaConfig';
import RiskReportPaywall from './RiskReportPaywall';
import riskMapService from './RiskMapService';

interface RiskDashboardProps {
  transactionId?: string;
}

const RiskDashboard: React.FC<RiskDashboardProps> = ({ transactionId }) => {
  console.log('[RiskDashboard] Rendering with transactionId:', transactionId);
  
  // State for user selections
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>('all');
  const [riskMapType, setRiskMapType] = useState<RiskMapType>('unsecured');
  const [activeView, setActiveView] = useState<string>(RISK_MAP_VIEWS.STANDARD);
  const [customCriteria, setCustomCriteria] = useState<RiskCriteria[]>([]);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [reportPurchased, setReportPurchased] = useState<boolean>(false);

  // Map string view to ViewMode type
  const getViewMode = (view: string): ViewMode => {
    switch (view) {
      case RISK_MAP_VIEWS.LAB:
        return 'detailed';
      case RISK_MAP_VIEWS.SCORE:
        return 'summary';
      default:
        return 'standard';
    }
  };

  // Handlers for category and type changes
  const handleCategorySelect = useCallback((category: RiskCategory) => {
    console.log(`[RiskDashboard] Category selected: ${category}`);
    setSelectedCategory(category);
  }, []);

  const handleRiskMapTypeChange = useCallback((type: RiskMapType) => {
    console.log(`[RiskDashboard] Risk map type changed: ${type}`);
    setRiskMapType(type);
  }, []);

  const handleViewChange = useCallback((view: string) => {
    console.log(`[RiskDashboard] View changed: ${view}`);
    setActiveView(view);
  }, []);

  // Handler for criteria configuration changes
  const handleCriteriaChange = useCallback((criteria: RiskCriteria[]) => {
    console.log('[RiskDashboard] Criteria configuration updated');
    setCustomCriteria(criteria);
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    console.log('[RiskDashboard] State updated:', {
      selectedCategory,
      riskMapType,
      activeView,
      transactionId,
      criteriaCount: customCriteria.length
    });
  }, [selectedCategory, riskMapType, activeView, transactionId, customCriteria]);

  // Check if report is purchased
  useEffect(() => {
    const checkReportAccess = () => {
      const isPurchased = riskMapService.isReportPurchased(
        transactionId || '',
        riskMapType
      );
      setReportPurchased(isPurchased);
    };
    
    checkReportAccess();
  }, [transactionId, riskMapType]);

  // Handle purchase completion
  const handlePurchaseComplete = () => {
    setShowPaywall(false);
    setReportPurchased(true);
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="bg-white shadow rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            Error Loading Risk Dashboard
          </h2>
          <p className="text-red-500 mb-4">
            There was a problem loading the risk assessment dashboard.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Reload Page
          </button>
        </div>
      }
    >
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              Risk Assessment Dashboard
            </h2>
            
            {!reportPurchased && (
              <button
                onClick={() => setShowPaywall(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700"
              >
                Purchase Full Report
              </button>
            )}
            
            {reportPurchased && (
              <div className="flex items-center text-sm text-green-600">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Report Purchased
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Risk Map Navigator Section */}
            <div className="md:col-span-4 lg:col-span-3 bg-gray-50 rounded-lg">
              <RiskMapNavigator
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                riskMapType={riskMapType}
                onRiskMapTypeChange={handleRiskMapTypeChange}
                activeView={activeView}
                onViewChange={handleViewChange}
                onCriteriaChange={handleCriteriaChange}
              />
            </div>
            
            {/* Risk Map Content Section */}
            <div className="md:col-span-8 lg:col-span-9">
              <RiskMapOptimized
                transactionId={transactionId}
                initialCategory={selectedCategory}
                viewMode={getViewMode(activeView)}
                riskMapType={riskMapType}
                customCriteria={customCriteria}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Paywall */}
      {showPaywall && (
        <RiskReportPaywall
          riskMapType={riskMapType}
          onPurchaseComplete={handlePurchaseComplete}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </ErrorBoundary>
  );
};

export default RiskDashboard; 