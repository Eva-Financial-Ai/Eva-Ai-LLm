import React, { useState, useEffect } from 'react';

interface BlockchainTransaction {
  txId: string;
  timestamp: string;
  blockNumber: number;
  from: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  data: {
    applicationType: string;
    applicationId: string;
    businessName: string;
    amount: number;
    hash: string;
  };
}

interface BlockchainTransactionViewerProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId?: string;
}

const BlockchainTransactionViewer: React.FC<BlockchainTransactionViewerProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  // State for transaction details and UI
  const [transaction, setTransaction] = useState<BlockchainTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txIdInput, setTxIdInput] = useState(transactionId || '');
  const [validationStatus, setValidationStatus] = useState<{
    isValid: boolean;
    message: string;
    details?: Record<string, boolean>;
  } | null>(null);

  // Fetch transaction data when component mounts or transactionId changes
  useEffect(() => {
    if (transactionId) {
      fetchTransaction(transactionId);
    }
  }, [transactionId]);

  // Fetch transaction data from blockchain
  const fetchTransaction = async (txId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call to your blockchain node
      // Mocking the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock response data
      const mockTransaction: BlockchainTransaction = {
        txId,
        timestamp: new Date().toISOString(),
        blockNumber: 12345678,
        from: '0x9876543210abcdef9876543210abcdef98765432',
        to: '0x1234567890abcdef1234567890abcdef12345678',
        status: 'confirmed',
        confirmations: 24,
        data: {
          applicationType: 'commercial_loan',
          applicationId: 'APP-12345',
          businessName: 'Acme Corporation',
          amount: 750000,
          hash: '0x7a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
        },
      };

      setTransaction(mockTransaction);
    } catch (err) {
      setError('Failed to fetch transaction data. Please try again.');
      console.error('Error fetching transaction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission for transaction lookup
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (txIdInput.trim()) {
      fetchTransaction(txIdInput.trim());
    }
  };

  // Validate transaction authenticity
  const validateTransaction = async () => {
    if (!transaction) return;

    setIsLoading(true);

    try {
      // In a real app, this would call your validation service
      // Mocking validation with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation result
      const validationResult = {
        isValid: true,
        message: 'Transaction has been validated successfully',
        details: {
          signatureValid: true,
          dataIntegrity: true,
          blockConfirmations: true,
          chainValid: true,
        },
      };

      setValidationStatus(validationResult);
    } catch (err) {
      setError('Validation failed. Please try again.');
      console.error('Error validating transaction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format a date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  // If not open, don't render
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Main modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Blockchain Transaction Viewer</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-primary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search Form */}
        <div className="p-4 border-b">
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="flex-1">
              <label htmlFor="txId" className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID
              </label>
              <input
                type="text"
                id="txId"
                value={txIdInput}
                onChange={e => setTxIdInput(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter blockchain transaction ID"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !txIdInput.trim()}
              className="ml-3 mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border-b">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Transaction content */}
        <div className="max-h-[500px] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading transaction data...</p>
            </div>
          ) : transaction ? (
            <div className="space-y-6">
              {/* Transaction Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transaction Overview</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="font-mono text-sm break-all">{transaction.txId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Timestamp</p>
                      <p className="text-sm">{formatDate(transaction.timestamp)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Block Number</p>
                      <p className="text-sm">{transaction.blockNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`text-sm font-medium ${
                          transaction.status === 'confirmed'
                            ? 'text-green-600'
                            : transaction.status === 'pending'
                              ? 'text-yellow-600'
                              : 'text-red-600'
                        }`}
                      >
                        {transaction.status.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Confirmations</p>
                      <p className="text-sm">{transaction.confirmations}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* From/To Addresses */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Addresses</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-mono text-sm break-all">{transaction.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-mono text-sm break-all">{transaction.to}</p>
                  </div>
                </div>
              </div>

              {/* Application Data */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Data</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Application Type</p>
                      <p className="text-sm capitalize">
                        {transaction.data.applicationType.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Application ID</p>
                      <p className="text-sm">{transaction.data.applicationId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="text-sm">{transaction.data.businessName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-sm">${transaction.data.amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Data Hash</p>
                    <p className="font-mono text-xs break-all">{transaction.data.hash}</p>
                  </div>
                </div>
              </div>

              {/* Validation Status */}
              {validationStatus && (
                <div
                  className={`rounded-lg p-4 ${
                    validationStatus.isValid ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      validationStatus.isValid ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    Validation Results
                  </h3>
                  <p
                    className={`text-sm mb-3 ${
                      validationStatus.isValid ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {validationStatus.message}
                  </p>

                  {validationStatus.details && (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(validationStatus.details).map(([key, value]) => (
                        <div key={key} className="flex items-center">
                          {value ? (
                            <svg
                              className="h-4 w-4 text-green-500 mr-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="h-4 w-4 text-red-500 mr-1"
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
                          )}
                          <span className="text-sm capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {!validationStatus && (
                <div className="flex justify-center">
                  <button
                    onClick={validateTransaction}
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Validating...' : 'Validate Transaction'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Transaction Data</h3>
              <p className="text-gray-500 max-w-sm">
                Enter a transaction ID to view details or validate a blockchain transaction
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <p className="text-xs text-gray-500">Powered by EVA Blockchain Network</p>
          <a
            href="#"
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            onClick={e => {
              e.preventDefault();
              window.open('/blockchain-explorer', '_blank');
            }}
          >
            Open Blockchain Explorer
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlockchainTransactionViewer;
