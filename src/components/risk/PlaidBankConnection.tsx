import React, { useState } from 'react';
import { CheckCircleIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface PlaidBankConnectionProps {
  onSuccess: (accountData: any) => void;
  onCancel: () => void;
}

// Mock bank institutions for the demo
const MOCK_BANKS = [
  { id: 'chase', name: 'Chase', logo: '🏦' },
  { id: 'bofa', name: 'Bank of America', logo: '🏦' },
  { id: 'wells', name: 'Wells Fargo', logo: '🏦' },
  { id: 'citi', name: 'Citibank', logo: '🏦' },
  { id: 'usbank', name: 'US Bank', logo: '🏦' },
  { id: 'pnc', name: 'PNC Bank', logo: '🏦' },
  { id: 'capital', name: 'Capital One', logo: '🏦' },
  { id: 'td', name: 'TD Bank', logo: '🏦' },
];

const PlaidBankConnection: React.FC<PlaidBankConnectionProps> = ({ onSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<'select_bank' | 'credentials' | 'select_account' | 'connecting'>('select_bank');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock accounts for the demo
  const MOCK_ACCOUNTS = [
    { id: 'acct1', name: 'Business Checking (...4321)', balance: '$24,532.10', type: 'checking' },
    { id: 'acct2', name: 'Business Savings (...8765)', balance: '$103,250.75', type: 'savings' },
    { id: 'acct3', name: 'Operating Account (...9012)', balance: '$56,789.33', type: 'checking' },
  ];
  
  // Handle bank selection
  const handleSelectBank = (bankId: string) => {
    setSelectedBank(bankId);
    setCurrentStep('credentials');
  };
  
  // Handle credentials submission
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('select_account');
    }, 1500);
  };
  
  // Handle account selection
  const handleSelectAccount = (accountId: string) => {
    setSelectedAccount(accountId);
    setCurrentStep('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      const bankInfo = MOCK_BANKS.find(bank => bank.id === selectedBank);
      const accountInfo = MOCK_ACCOUNTS.find(account => account.id === accountId);
      
      onSuccess({
        bankName: bankInfo?.name || 'Unknown Bank',
        accountName: accountInfo?.name || 'Unknown Account',
        accountId: accountId,
        accountType: accountInfo?.type || 'checking',
        mask: accountInfo?.name?.match(/\(...(\d+)\)/)?.[1] || '0000',
      });
    }, 2000);
  };
  
  // Render based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 'select_bank':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Bank</h3>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_BANKS.map(bank => (
                <button
                  key={bank.id}
                  onClick={() => handleSelectBank(bank.id)}
                  className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 text-xl mr-3">{bank.logo}</div>
                  <span className="font-medium">{bank.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => alert('Search functionality would go here')}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
              >
                Search for bank
              </button>
            </div>
          </div>
        );
        
      case 'credentials':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Enter Your Bank Credentials
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Please enter your online banking username and password. Your credentials are securely transmitted via Plaid and not stored by us.
            </p>
            
            <form onSubmit={handleCredentialsSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('select_bank')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isLoading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>
          </div>
        );
        
      case 'select_account':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Select Account for ACH Payments
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose which account you'd like to use for risk report payments.
            </p>
            
            <div className="space-y-3 mb-6">
              {MOCK_ACCOUNTS.map(account => (
                <button
                  key={account.id}
                  onClick={() => handleSelectAccount(account.id)}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center">
                    <BanknotesIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">{account.name}</div>
                      <div className="text-sm text-gray-500 capitalize">{account.type}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{account.balance}</div>
                    <div className="text-xs text-gray-500">Available</div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep('credentials')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Back
              </button>
            </div>
          </div>
        );
        
      case 'connecting':
        return (
          <div className="py-8 text-center">
            <div className="animate-spin mx-auto h-12 w-12 border-t-2 border-b-2 border-primary-600 rounded-full mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Connecting Your Account</h3>
            <p className="text-sm text-gray-500">
              Please wait while we securely connect your bank account...
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-white rounded-lg p-6">
      {renderStep()}
    </div>
  );
};

export default PlaidBankConnection; 