import React, { useState } from 'react';

// Define interfaces for Plaid data
interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balance: {
    available: number;
    current: number;
  };
  institution: string;
}

interface PlaidIntegrationProps {
  applicationId: string;
  onAccountsLinked?: (accounts: PlaidAccount[]) => void;
}

const PlaidIntegration: React.FC<PlaidIntegrationProps> = ({ applicationId, onAccountsLinked }) => {
  const [isLinkReady, setIsLinkReady] = useState(true);
  const [isPlaidLoading, setIsPlaidLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<PlaidAccount[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('auth');
  const [timeframe, setTimeframe] = useState<string>('30');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const plaidProducts = [
    { id: 'auth', name: 'Account Verification' },
    { id: 'transactions', name: 'Transactions' },
    { id: 'assets', name: 'Assets' },
    { id: 'liabilities', name: 'Liabilities' },
    { id: 'investments', name: 'Investments' },
  ];

  const openPlaidLink = () => {
    setIsPlaidLoading(true);
    setError(null);

    // Simulate successful Plaid connection
    setTimeout(() => {
      const mockAccounts: PlaidAccount[] = [
        {
          id: 'acc-1',
          name: 'Checking Account',
          mask: '1234',
          type: 'depository',
          subtype: 'checking',
          balance: {
            available: 12500.23,
            current: 12500.23,
          },
          institution: 'Chase',
        },
        {
          id: 'acc-2',
          name: 'Savings Account',
          mask: '5678',
          type: 'depository',
          subtype: 'savings',
          balance: {
            available: 25000.0,
            current: 25000.0,
          },
          institution: 'Chase',
        },
      ];

      setLinkedAccounts(mockAccounts);
      setSuccess('Successfully connected bank accounts');

      if (onAccountsLinked) {
        onAccountsLinked(mockAccounts);
      }

      setIsPlaidLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Bank Statement Verification</h3>
      <p className="text-sm text-gray-600 mb-4">
        Connect your bank accounts securely through Plaid to verify your financial information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="plaidProduct">
            Select Verification Type
          </label>
          <select
            id="plaidProduct"
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            {plaidProducts.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="timeframe">
            Time Period
          </label>
          <select
            id="timeframe"
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="30">30 days</option>
            <option value="60">60 days</option>
            <option value="90">90 days</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      <button
        type="button"
        onClick={openPlaidLink}
        disabled={!isLinkReady || isPlaidLoading}
        className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
          !isLinkReady || isPlaidLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
      >
        {isPlaidLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            Connecting...
          </>
        ) : linkedAccounts.length > 0 ? (
          'Connect Additional Accounts'
        ) : (
          'Connect Bank Accounts'
        )}
      </button>

      {linkedAccounts.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-700 mb-2">Connected Accounts</h4>
          <div className="divide-y divide-gray-200">
            {linkedAccounts.map(account => (
              <div key={account.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{account.name}</p>
                    <p className="text-sm text-gray-500">
                      {account.institution} •••• {account.mask}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${account.balance.available.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {account.type} {account.subtype ? `• ${account.subtype}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs text-gray-500">
          Your data is securely transmitted through Plaid. We never store your banking credentials.
        </p>
      </div>
    </div>
  );
};

export default PlaidIntegration;
