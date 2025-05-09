import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface PlaidLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const PlaidLinkModal: React.FC<PlaidLinkModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<
    'institution' | 'credentials' | 'accounts' | 'connecting' | 'success'
  >('institution');
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animation for modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(50px)',
  }) as any;

  // Mock bank institution list
  const institutions = [
    { id: 'chase', name: 'Chase', logo: '🏦' },
    { id: 'bofa', name: 'Bank of America', logo: '🏦' },
    { id: 'wells', name: 'Wells Fargo', logo: '🏦' },
    { id: 'citi', name: 'Citibank', logo: '🏦' },
    { id: 'usbank', name: 'US Bank', logo: '🏦' },
    { id: 'pnc', name: 'PNC Bank', logo: '🏦' },
    { id: 'capital', name: 'Capital One', logo: '🏦' },
    { id: 'td', name: 'TD Bank', logo: '🏦' },
  ];

  // Mock accounts
  const accounts = [
    { id: 'acc1', name: 'Business Checking (...4321)', type: 'checking', balance: '$25,430.45' },
    { id: 'acc2', name: 'Business Savings (...8765)', type: 'savings', balance: '$104,250.00' },
    { id: 'acc3', name: 'Business Credit Card (...9012)', type: 'credit', balance: '$-2,340.75' },
  ];

  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleInstitutionSelect = (institutionId: string) => {
    setSelectedInstitution(institutionId);
    setCurrentStep('credentials');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('accounts');
    }, 2000);
  };

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev =>
      prev.includes(accountId) ? prev.filter(id => id !== accountId) : [...prev, accountId]
    );
  };

  const handleAccountsSubmit = () => {
    setCurrentStep('connecting');

    // Simulate connection process
    setTimeout(() => {
      setCurrentStep('success');

      // Simulate successful connection
      setTimeout(() => {
        const selectedBank = institutions.find(inst => inst.id === selectedInstitution);
        const connectedAccounts = accounts.filter(acc => selectedAccounts.includes(acc.id));

        onSuccess({
          provider: 'Banking Data',
          institution: selectedBank?.name,
          accounts: connectedAccounts,
          connected: true,
          timestamp: new Date().toISOString(),
        });

        onClose();
      }, 2000);
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'institution':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select your bank</h3>
            <div className="grid grid-cols-2 gap-3">
              {institutions.map(institution => (
                <button
                  key={institution.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  onClick={() => handleInstitutionSelect(institution.id)}
                >
                  <span className="text-2xl mr-2">{institution.logo}</span>
                  <span className="text-sm font-medium">{institution.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'credentials':
        return (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setCurrentStep('institution')}
                className="mr-2 text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-medium text-gray-900">
                {institutions.find(inst => inst.id === selectedInstitution)?.name}
              </h3>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Enter your online banking credentials to securely connect your account. Your
              credentials are encrypted and never stored.
            </p>

            <form onSubmit={handleCredentialsSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username / Email
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={e => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                  {isLoading ? (
                    <span className="flex justify-center items-center">
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
                      Connecting...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Secure connection provided by Plaid. Your credentials are never stored.
            </p>
          </div>
        );

      case 'accounts':
        return (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setCurrentStep('credentials')}
                className="mr-2 text-gray-400 hover:text-gray-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="text-lg font-medium text-gray-900">Select accounts to connect</h3>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Choose which accounts you want to connect to the application.
            </p>

            <div className="space-y-3">
              {accounts.map(account => (
                <div
                  key={account.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    selectedAccounts.includes(account.id) ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                  onClick={() => handleAccountToggle(account.id)}
                >
                  <div>
                    <p className="font-medium text-gray-800">{account.name}</p>
                    <p className="text-sm text-gray-500">
                      {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <span className="mr-3 font-medium">{account.balance}</span>
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => {}} // Handled by div click
                      className="h-4 w-4 text-primary-600 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAccountsSubmit}
              disabled={selectedAccounts.length === 0}
              className={`mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                selectedAccounts.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              Connect {selectedAccounts.length}{' '}
              {selectedAccounts.length === 1 ? 'Account' : 'Accounts'}
            </button>
          </div>
        );

      case 'connecting':
        return (
          <div className="py-8 text-center">
            <div className="animate-spin mx-auto h-12 w-12 border-t-2 border-b-2 border-primary-600 rounded-full"></div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Establishing secure connection
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Connecting to your bank and retrieving account information...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="py-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Connection Successful!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your {selectedAccounts.length}{' '}
              {selectedAccounts.length === 1 ? 'account has' : 'accounts have'} been connected
              successfully.
            </p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <animated.div
        style={modalAnimation}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Connect Bank Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
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

        {/* Content */}
        <div className="px-4">{renderStep()}</div>

        {/* Footer - Only show for institution selection */}
        {currentStep === 'institution' && (
          <div className="p-4 border-t flex justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <span className="mr-1">Powered by</span>
              <span className="font-bold">Plaid</span>
            </div>
            <div>
              <span className="mr-2">🔒</span>
              <span>Bank-level security</span>
            </div>
          </div>
        )}
      </animated.div>
    </div>
  );
};

export default PlaidLinkModal;
