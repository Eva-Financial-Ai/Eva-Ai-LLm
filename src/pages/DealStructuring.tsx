import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkflow, WorkflowStage } from '../contexts/WorkflowContext';
import DealStructuringComponent from '../components/deal/DealStructuring';
import TransactionTimeMetrics from '../components/TransactionTimeMetrics';
import DealAdvisor from '../components/deal/DealAdvisor';
import TransactionTeamManager from '../components/deal/TransactionTeamManager';
import { SharedLoadingSpinner } from '../components/deal/DealStructuringComponents';

// Lazy load components for better performance
const LazyDealStructuringComponent = lazy(() =>
  import('../components/deal/DealStructuring').then(module => ({ default: module.default }))
);

const DealStructuring = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentTransaction,
    transactions,
    setCurrentTransaction,
    advanceStage,
    fetchTransactions,
    loading: workflowLoading,
  } = useWorkflow();
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [smartMatchData, setSmartMatchData] = useState<any>(null);
  const [showMatchBanner, setShowMatchBanner] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Implement progressive loading
  useEffect(() => {
    setIsLoading(true);

    // Simulate progressive loading steps
    const loadingTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingTimer);
          setIsLoading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Fetch initial data
    const initData = async () => {
      try {
        // Fetch any required data
        if (!currentTransaction) {
          await fetchTransactions();
        }

        // Set loading to false as soon as data is ready
        clearInterval(loadingTimer);
        setLoadingProgress(100);
        setTimeout(() => setIsLoading(false), 100);
      } catch (err) {
        setError('Failed to load deal structuring data');
        setIsLoading(false);
      }
    };

    initData();

    return () => {
      clearInterval(loadingTimer);
    };
  }, [currentTransaction, fetchTransactions]);

  // Effect to find and set a deal_structuring transaction if none is selected
  useEffect(() => {
    console.log('DealStructuring page initializing...');

    // Check if we have smart match data in the location state
    if (location.state && location.state.propertyId) {
      setSmartMatchData(location.state);
      setShowMatchBanner(true);

      // Auto-hide the banner after 5 seconds
      const timer = setTimeout(() => {
        setShowMatchBanner(false);
      }, 5000);

      // Initialize a transaction for the matched property if needed
      const matchedPropertyId = location.state.propertyId;
      // Check if we have an existing transaction for this property
      const matchedPropertyTransaction = transactions.find(
        t => t.applicantData && t.applicantData.id === matchedPropertyId
      );

      if (!matchedPropertyTransaction && !workflowLoading) {
        // Create a new transaction for this property
        console.log(
          'Creating a new transaction for matched property:',
          location.state.propertyName
        );

        // In a real app, this would call an API to create the transaction
        // For now, we'll create a mock transaction and add it to the context
        const newTransaction = {
          id: `tr-${matchedPropertyId}-${Date.now()}`,
          type: 'financing',
          amount: location.state.amount || 1250000,
          applicantData: {
            name: location.state.propertyName,
            id: matchedPropertyId,
            entityType: 'business',
            industryCode: 'real_estate',
          },
          currentStage: 'deal_structuring' as WorkflowStage,
          details: {
            purpose: 'Property financing',
            sourceOfFunds: 'Commercial loan',
            status: 'pending',
          },
        };

        // Set this as the current transaction
        setCurrentTransaction(newTransaction);
      } else if (matchedPropertyTransaction) {
        // Set the matched transaction as current
        console.log(
          'Found existing transaction for matched property:',
          matchedPropertyTransaction.id
        );
        setCurrentTransaction(matchedPropertyTransaction);
      }

      return () => clearTimeout(timer);
    }

    const initializePage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // If no transactions are loaded yet, fetch them
        if (transactions.length === 0 && !workflowLoading) {
          console.log('No transactions found, fetching transactions...');
          await fetchTransactions();
        }

        // Find a transaction in deal_structuring stage if no transaction is selected
        if (!currentTransaction || currentTransaction.currentStage !== 'deal_structuring') {
          console.log('Looking for a transaction in deal_structuring stage...');
          const dealStructuringTransaction = transactions.find(
            t => t.currentStage === 'deal_structuring'
          );

          if (dealStructuringTransaction) {
            console.log(
              'Found transaction in deal_structuring stage:',
              dealStructuringTransaction.id
            );
            setCurrentTransaction(dealStructuringTransaction);
          } else if (transactions.length > 0) {
            // If no deal_structuring transaction found, select the first one and advance it
            console.log(
              'No transaction in deal_structuring stage, advancing the first transaction...'
            );
            const firstTransaction = transactions[0];
            setCurrentTransaction(firstTransaction);

            // Advance the stage
            await advanceStage(firstTransaction.id, 'deal_structuring');
          } else {
            console.log('No transactions available to use');
            setError('No transactions available. Please create a transaction first.');
          }
        } else {
          console.log('Using current transaction:', currentTransaction.id);
        }
      } catch (err) {
        console.error('Error initializing DealStructuring page:', err);
        setError('Failed to load deal structuring data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [
    currentTransaction,
    transactions,
    setCurrentTransaction,
    advanceStage,
    fetchTransactions,
    workflowLoading,
    location.state,
  ]);

  const handleContinue = () => {
    if (currentTransaction) {
      advanceStage(currentTransaction.id, 'approval_decision');
      navigate('/transactions');
    }
  };

  const handleSaveTeamMembers = (members: any[]) => {
    setTeamMembers(members);
    setShowTeamManager(false);
    console.log('Team members saved:', members);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <SharedLoadingSpinner
            size="lg"
            message="Loading Deal Structuring..."
            submessage="This may take a moment"
          />
          <div className="w-64 h-2 bg-gray-200 rounded-full mt-4">
            <div
              className="h-2 bg-primary-600 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Deal Structuring</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <SharedLoadingSpinner
                message="Loading Deal Structuring..."
                submessage="This may take a moment"
              />
            </div>
          }
        >
          <LazyDealStructuringComponent />
        </Suspense>
      )}
    </div>
  );
};

export default DealStructuring;
