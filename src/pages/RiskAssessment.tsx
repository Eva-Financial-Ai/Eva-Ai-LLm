import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ModularRiskNavigator from '../components/risk/ModularRiskNavigator';
import { RISK_MAP_VIEWS, RiskMapType } from '../components/risk/RiskMapNavigator';
import TopNavigation from '../components/layout/TopNavigation';
import useTransactionStore from '../hooks/useTransactionStore';
import DemoCreditsManager from '../components/dev/DemoCreditsManager';

const RiskAssessment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use Zustand store for transactions
  const {
    currentTransaction,
    transactions,
    loading: storeLoading,
    error: storeError,
    fetchTransactions,
    setCurrentTransaction,
    advanceStage,
  } = useTransactionStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get initial view from URL
  const getInitialViewFromUrl = () => {
    const path = location.pathname;
    console.log(`Current path: ${path}`);

    if (path.includes('/risk-assessment/lab')) return RISK_MAP_VIEWS.LAB;
    if (path.includes('/risk-assessment/score')) return RISK_MAP_VIEWS.SCORE;
    return RISK_MAP_VIEWS.STANDARD;
  };

  // Get initial risk map type from URL if available
  const getInitialRiskMapType = (): RiskMapType => {
    const query = new URLSearchParams(location.search);
    const typeParam = query.get('type');
    console.log(`URL type parameter: ${typeParam}`);

    if (typeParam === 'equipment') return 'equipment';
    if (typeParam === 'realestate') return 'realestate';
    return 'unsecured';
  };

  // Set up state for view and risk map type
  const [currentView, setCurrentView] = useState(getInitialViewFromUrl());
  const [currentRiskMapType, setCurrentRiskMapType] =
    useState<RiskMapType>(getInitialRiskMapType());

  // Update URL when view or risk map type changes
  useEffect(() => {
    const basePath = '/risk-assessment';
    let newPath = '';

    switch (currentView) {
      case RISK_MAP_VIEWS.STANDARD:
        newPath = basePath;
        break;
      case RISK_MAP_VIEWS.LAB:
        newPath = `${basePath}/lab`;
        break;
      case RISK_MAP_VIEWS.SCORE:
        newPath = `${basePath}/score`;
        break;
      default:
        newPath = basePath;
    }

    // Add risk map type as a query parameter if not default
    if (currentRiskMapType !== 'unsecured') {
      newPath += `?type=${currentRiskMapType}`;
    }

    console.log(`Updating URL to: ${newPath} (current view: ${currentView})`);
    navigate(newPath, { replace: true });
  }, [currentView, currentRiskMapType, navigate]);

  // Update the view when URL changes
  useEffect(() => {
    const newView = getInitialViewFromUrl();
    const newType = getInitialRiskMapType();

    console.log(`URL changed, setting view to: ${newView}, type to: ${newType}`);

    setCurrentView(newView);
    setCurrentRiskMapType(newType);
  }, [location.pathname, location.search]);

  // Handle view change
  const handleViewChange = (view: string) => {
    console.log(`View change requested to: ${view}`);
    setCurrentView(view);
  };

  // Handle risk map type change
  const handleRiskMapTypeChange = (type: RiskMapType) => {
    console.log(`Risk map type change requested to: ${type}`);
    setCurrentRiskMapType(type);
  };

  useEffect(() => {
    // Load transaction data
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use cached transaction or fetch new ones
        if (!currentTransaction || transactions.length === 0) {
          await fetchTransactions();
        }

        // Find a transaction in risk_assessment stage if we don't have one
        if (!currentTransaction?.id || currentTransaction.currentStage !== 'risk_assessment') {
          const riskTransaction = transactions.find(
            (t: { currentStage: string }) => t.currentStage === 'risk_assessment'
          );

          if (riskTransaction) {
            setCurrentTransaction(riskTransaction);
          }
        }
      } catch (err) {
        console.error('Error loading risk assessment data:', err);
        setError('Failed to load risk assessment data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentTransaction, fetchTransactions, setCurrentTransaction, transactions]);

  // Handle advancing to next stage
  const goToNextStage = async () => {
    if (!currentTransaction) return;

    try {
      const nextStage = 'deal_structuring';
      await advanceStage(currentTransaction.id, nextStage);
      navigate('/deal-structuring');
    } catch (err) {
      console.error('Error advancing to next stage:', err);
      setError('Failed to advance to next stage. Please try again.');
    }
  };

  // Loading state
  if (isLoading || storeLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-gray-500 mb-4">Loading risk assessment data...</div>
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || storeError) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-red-500 mb-4">{error || (storeError && storeError.message)}</div>
          <button
            onClick={() => {
              setIsLoading(true);
              setError(null);
              fetchTransactions().finally(() => setIsLoading(false));
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-full px-4 py-6">
      {/* Custom TopNavigation for this page */}
      <div className="mb-8">
        <TopNavigation title="Risk Assessment" showTransactionSelector={false} />
      </div>

      {/* Section Header */}
      <div className="mb-6 px-2">
        <h1 className="text-2xl font-bold text-gray-800">Risk Map Navigator</h1>
        <p className="text-gray-600">Comprehensive analysis of risk factors for this transaction</p>
      </div>

      {/* Use ModularRiskNavigator with current view and risk map type */}
      <div className="px-2">
        <ModularRiskNavigator
          initialView={currentView}
          initialRiskMapType={currentRiskMapType}
          onViewChange={handleViewChange}
          onRiskMapTypeChange={handleRiskMapTypeChange}
        />
      </div>

      {/* Transaction buttons - approval/decline */}
      <div className="mt-8 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <button
            onClick={goToNextStage}
            className="px-4 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <span>Approve & Continue to Deal Structuring</span>
          </button>

          <button
            onClick={() => alert('This functionality is currently in development.')}
            className="px-4 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 flex items-center justify-center"
          >
            <span>Human in the Loop - Request Call</span>
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => alert('Hard decline functionality is currently in development.')}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 flex items-center justify-center"
            >
              <span>Hard Decline</span>
            </button>

            <button
              onClick={() => alert('Soft decline functionality is currently in development.')}
              className="flex-1 px-4 py-3 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 flex items-center justify-center"
            >
              <span>Soft Decline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add the demo credits manager component */}
      <DemoCreditsManager />
    </div>
  );
};

export default RiskAssessment;
