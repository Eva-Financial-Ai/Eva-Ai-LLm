import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SafeForms from './credit/SafeForms';
import FinancialStatements from './credit/FinancialStatements';
import BusinessTaxReturns from './credit/BusinessTaxReturns';
import { UserContext } from '../contexts/UserContext';

const CreditApplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState('application');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userContext = useContext(UserContext);

  // Simulate loading and check for potential issues
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call or data loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user context is properly loaded
        if (!userContext || !userContext.userRole) {
          throw new Error('User context not properly loaded');
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Credit Application:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    loadData();
  }, [userContext]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSave = () => {
    alert('Application saved successfully!');
  };

  const handleSubmit = () => {
    alert('Application submitted successfully!');
    navigate('/dashboard');
  };

  const handleRetry = () => {
    // Reload the component data
    setIsLoading(true);
    setError(null);

    // Simulate reloading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-primary-600 text-xl">Loading Credit Application...</p>
        <p className="text-gray-500 text-lg mt-2">Please wait while we prepare your application</p>
      </div>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <svg
          className="mx-auto h-16 w-16 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-red-600 mt-4">Failed to load Credit Application</h2>
        <p className="text-gray-600 text-lg mt-2 mb-6">
          {error || 'There was a problem loading the application. Please try again.'}
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-primary-600 text-white text-lg font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Credit Application</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('application')}
            className={`${
              activeTab === 'application'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
          >
            Application
          </button>
          <button
            onClick={() => handleTabChange('financial')}
            className={`${
              activeTab === 'financial'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
          >
            Financial Statements
          </button>
          <button
            onClick={() => handleTabChange('taxes')}
            className={`${
              activeTab === 'taxes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg`}
          >
            Tax Returns
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {activeTab === 'application' && (
          <SafeForms userType={userContext?.userRole || 'borrower'} requestMode={false} />
        )}

        {activeTab === 'financial' && (
          <FinancialStatements userType={userContext?.userRole || 'borrower'} />
        )}

        {activeTab === 'taxes' && <BusinessTaxReturns />}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 border border-gray-300 shadow-sm text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        >
          Save Draft
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
        >
          Submit Application
        </button>
      </div>
    </div>
  );
};

export default CreditApplication;
