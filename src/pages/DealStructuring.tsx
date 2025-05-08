import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWorkflow, WorkflowStage } from '../contexts/WorkflowContext';
import DealStructuringComponent from '../components/deal/DealStructuring';
import TransactionTimeMetrics from '../components/TransactionTimeMetrics';
import DealAdvisor from '../components/deal/DealAdvisor';
import TransactionTeamManager from '../components/deal/TransactionTeamManager';

const DealStructuring = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTransaction, transactions, setCurrentTransaction, advanceStage, fetchTransactions, loading } = useWorkflow();
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [smartMatchData, setSmartMatchData] = useState<any>(null);
  const [showMatchBanner, setShowMatchBanner] = useState(false);

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
      const matchedPropertyTransaction = transactions.find(t => 
        t.applicantData && t.applicantData.id === matchedPropertyId
      );
      
      if (!matchedPropertyTransaction && !loading) {
        // Create a new transaction for this property
        console.log('Creating a new transaction for matched property:', location.state.propertyName);
        
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
            industryCode: 'real_estate'
          },
          currentStage: 'deal_structuring' as WorkflowStage,
          details: {
            purpose: 'Property financing',
            sourceOfFunds: 'Commercial loan',
            status: 'pending'
          }
        };
        
        // Set this as the current transaction
        setCurrentTransaction(newTransaction);
      } else if (matchedPropertyTransaction) {
        // Set the matched transaction as current
        console.log('Found existing transaction for matched property:', matchedPropertyTransaction.id);
        setCurrentTransaction(matchedPropertyTransaction);
      }
      
      return () => clearTimeout(timer);
    }
    
    const initializePage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // If no transactions are loaded yet, fetch them
        if (transactions.length === 0 && !loading) {
          console.log('No transactions found, fetching transactions...');
          await fetchTransactions();
        }
        
        // Find a transaction in deal_structuring stage if no transaction is selected
        if (!currentTransaction || currentTransaction.currentStage !== 'deal_structuring') {
          console.log('Looking for a transaction in deal_structuring stage...');
          const dealStructuringTransaction = transactions.find(t => t.currentStage === 'deal_structuring');
          
          if (dealStructuringTransaction) {
            console.log('Found transaction in deal_structuring stage:', dealStructuringTransaction.id);
            setCurrentTransaction(dealStructuringTransaction);
          } else if (transactions.length > 0) {
            // If no deal_structuring transaction found, select the first one and advance it
            console.log('No transaction in deal_structuring stage, advancing the first transaction...');
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
  }, [currentTransaction, transactions, setCurrentTransaction, advanceStage, fetchTransactions, loading, location.state]);

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

  // Loading state
  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
          </div>
          <div>
            <div className="bg-gray-200 h-64 rounded-lg mb-6"></div>
            <div className="bg-gray-200 h-36 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Deal Structuring</h1>
          <p className="mt-1 text-sm text-gray-500">
            AI-optimized finance options tailored to your transaction
          </p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error Loading Deal Structuring</h3>
              <p className="mt-2 text-red-700">{error}</p>
              <button 
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  fetchTransactions();
                }}
                className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deal Structuring</h1>
        <p className="mt-1 text-sm text-gray-500">
          AI-optimized finance options tailored to your transaction
        </p>
      </div>
      
      {/* Smart Match Connection Banner */}
      {showMatchBanner && smartMatchData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Connected with {smartMatchData.propertyName}</h3>
              <p className="mt-1 text-sm text-green-700">
                You've established a connection with this property ({smartMatchData.matchScore}% match).
                {smartMatchData.amount && ` Requested amount: $${smartMatchData.amount.toLocaleString()}`}
              </p>
              <button 
                onClick={() => setShowMatchBanner(false)}
                className="mt-2 text-xs font-medium text-green-600 hover:text-green-500"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DealStructuringComponent />
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Summary</h3>
            
            {currentTransaction ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="text-sm font-medium">{currentTransaction.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Applicant</p>
                  <p className="text-sm font-medium">{currentTransaction.applicantData.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Transaction Type</p>
                  <p className="text-sm font-medium">{currentTransaction.type}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-sm font-medium">${currentTransaction.amount.toLocaleString()}</p>
                </div>
                
                <button
                  onClick={handleContinue}
                  className="w-full mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  Continue to Approval
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No transaction selected</p>
            )}
          </div>
          
          {/* Add transaction time metrics */}
          {currentTransaction?.id && (
            <TransactionTimeMetrics transactionId={currentTransaction.id} />
          )}
          
          <div className="bg-white shadow rounded-lg p-6">
            <DealAdvisor />
          </div>

          <button
            onClick={() => setShowTeamManager(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
          >
            Manage Transaction Team
          </button>
        </div>
      </div>

      {/* Transaction Team Manager */}
      <TransactionTeamManager 
        dealId={currentTransaction?.id || "no-deal-selected"} 
        isOpen={showTeamManager}
        onSave={handleSaveTeamMembers}
        onCancel={() => setShowTeamManager(false)}
      />
    </div>
  );
};

export default DealStructuring; 