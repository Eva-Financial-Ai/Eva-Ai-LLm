import React, { useEffect, useState } from 'react';
import useTransactionStore from '../../hooks/useTransactionStore';

interface TestDiagnosticsProps {
  showFullDetails?: boolean;
}

const TestDiagnostics: React.FC<TestDiagnosticsProps> = ({ showFullDetails = false }) => {
  const { transactions, currentTransaction, fetchTransactions, loading, error } =
    useTransactionStore();
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    // Initial fetch
    fetchTransactions();
  }, [fetchTransactions, refreshCounter]);

  const handleRefresh = () => {
    setRefreshCounter(prevCounter => prevCounter + 1);
  };

  // Filter transactions by stage
  const getTransactionsByStage = (stage: string) => {
    return transactions.filter(t => t.currentStage === stage);
  };

  const riskAssessmentTransactions = getTransactionsByStage('risk_assessment');

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Transaction Store Diagnostics</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800 mb-2">Store Error</h3>
          <div className="text-red-600">{error.message}</div>
          {error.details && (
            <div className="mt-2 text-sm text-red-500">{JSON.stringify(error.details)}</div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-sm text-blue-800">Total Transactions</div>
          <div className="text-3xl font-bold text-blue-600">{transactions.length}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="text-sm text-green-800">Risk Assessment Transactions</div>
          <div className="text-3xl font-bold text-green-600">
            {riskAssessmentTransactions.length}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-800 mb-4">Current Transaction</h3>
      {currentTransaction ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm font-medium text-gray-500">ID</div>
            <div className="text-sm text-gray-900">{currentTransaction.id}</div>

            <div className="text-sm font-medium text-gray-500">Name</div>
            <div className="text-sm text-gray-900">{currentTransaction.applicantData.name}</div>

            <div className="text-sm font-medium text-gray-500">Stage</div>
            <div className="text-sm text-gray-900">{currentTransaction.currentStage}</div>

            <div className="text-sm font-medium text-gray-500">Amount</div>
            <div className="text-sm text-gray-900">
              ${currentTransaction.amount.toLocaleString()}
            </div>
          </div>

          {showFullDetails && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Full Transaction Details</h4>
              <pre className="bg-gray-900 text-white p-2 rounded text-xs overflow-auto">
                {JSON.stringify(currentTransaction, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
          <span className="text-yellow-700">No current transaction selected</span>
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-800 mb-4">Risk Assessment Transactions</h3>
      {riskAssessmentTransactions.length > 0 ? (
        <div className="space-y-4">
          {riskAssessmentTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="p-4 bg-green-50 rounded-lg border border-green-100"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium text-gray-500">ID</div>
                <div className="text-sm text-gray-900">{transaction.id}</div>

                <div className="text-sm font-medium text-gray-500">Name</div>
                <div className="text-sm text-gray-900">{transaction.applicantData.name}</div>

                <div className="text-sm font-medium text-gray-500">Type</div>
                <div className="text-sm text-gray-900">{transaction.type}</div>

                <div className="text-sm font-medium text-gray-500">Amount</div>
                <div className="text-sm text-gray-900">${transaction.amount.toLocaleString()}</div>
              </div>

              {showFullDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <pre className="bg-gray-900 text-white p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(transaction, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-center">
          <span className="text-yellow-700">No transactions in risk_assessment stage</span>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              The Risk Map feature requires at least one transaction in the risk_assessment stage.
            </p>
            <button
              onClick={() => {
                // This is just a diagnostic tool - in a real app, you would have a proper way to
                // create or advance transactions to the risk_assessment stage
                // For now, reload the page which should load mock transactions from localStorage
                window.location.reload();
              }}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Reload Mock Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDiagnostics;
