import React, { useState, useEffect } from 'react';

interface WrittenPasswordVerificationProps {
  transactionId: string;
  onVerificationComplete: (success: boolean, verificationDetails: any) => void;
  onCancel: () => void;
}

interface PortfolioManager {
  id: string;
  name: string;
  email: string;
}

const MOCK_PORTFOLIO_MANAGERS: PortfolioManager[] = [
  { id: 'pm-1', name: 'Sarah Johnson', email: 'sarah.johnson@evafi.com' },
  { id: 'pm-2', name: 'Michael Chen', email: 'michael.chen@evafi.com' },
  { id: 'pm-3', name: 'Jessica Rodriguez', email: 'jessica.rodriguez@evafi.com' },
  { id: 'pm-4', name: 'David Kim', email: 'david.kim@evafi.com' },
];

// This would come from a secure database in a real implementation
const MOCK_WRITTEN_PASSWORDS: Record<string, string> = {
  'pm-1': 'EVA-PM-ALPHA-47293',
  'pm-2': 'EVA-PM-BETA-85621',
  'pm-3': 'EVA-PM-GAMMA-36914',
  'pm-4': 'EVA-PM-DELTA-24780',
};

const WrittenPasswordVerification: React.FC<WrittenPasswordVerificationProps> = ({
  transactionId,
  onVerificationComplete,
  onCancel
}) => {
  const [selectedManager, setSelectedManager] = useState<string>('');
  const [writtenPassword, setWrittenPassword] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [passwordReceived, setPasswordReceived] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'pending' | 'success' | 'failure'>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationTimestamp, setVerificationTimestamp] = useState<string | null>(null);

  // Reset state when transaction ID changes
  useEffect(() => {
    setSelectedManager('');
    setWrittenPassword('');
    setRequestSent(false);
    setPasswordReceived(false);
    setVerificationStatus('idle');
    setError(null);
  }, [transactionId]);

  const handleRequestWrittenPassword = async () => {
    if (!selectedManager) {
      setError('Please select a portfolio manager');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would send an email or message to the selected portfolio manager
      // For demo purposes, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRequestSent(true);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to send request. Please try again.');
      setLoading(false);
    }
  };

  const handlePasswordReceived = () => {
    setPasswordReceived(true);
  };

  const handleVerifyPassword = async () => {
    if (!writtenPassword) {
      setError('Please enter the written password');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationStatus('pending');

    try {
      // In a real implementation, this would check against a secure record
      // For demo purposes, we'll check against our mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const expectedPassword = MOCK_WRITTEN_PASSWORDS[selectedManager];
      
      if (writtenPassword === expectedPassword) {
        const timestamp = new Date().toISOString();
        setVerificationTimestamp(timestamp);
        setVerificationStatus('success');
        
        // Complete the verification with success
        onVerificationComplete(true, {
          portfolioManagerId: selectedManager,
          portfolioManagerName: MOCK_PORTFOLIO_MANAGERS.find(pm => pm.id === selectedManager)?.name,
          verificationMethod: 'written-password',
          timestamp,
          transactionId
        });
      } else {
        setVerificationStatus('failure');
        setError('Invalid written password. Please check and try again.');
      }
      
      setLoading(false);
    } catch (err: any) {
      setError('Verification failed. Please try again.');
      setVerificationStatus('failure');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Written Password Verification</h2>
        <p className="text-sm text-gray-500 mt-1">
          Additional security verification required by portfolio manager to close this transaction
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Transaction Details</h3>
        <div className="bg-gray-50 rounded p-4 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="text-sm font-medium">{transactionId}</p>
            </div>
            <div className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 text-xs font-medium">
              Pending Verification
            </div>
          </div>
        </div>
      </div>

      {verificationStatus !== 'success' && (
        <>
          {!requestSent ? (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Request Written Password</h3>
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <p className="text-sm text-blue-800">
                  To complete this transaction, you need a written password from a portfolio manager. 
                  This is an extra security measure to prevent fraud.
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="portfolioManager" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Portfolio Manager
                </label>
                <select
                  id="portfolioManager"
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">-- Select Portfolio Manager --</option>
                  {MOCK_PORTFOLIO_MANAGERS.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleRequestWrittenPassword}
                disabled={loading || !selectedManager}
                className={`w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Sending Request...
                  </span>
                ) : (
                  'Request Written Password'
                )}
              </button>
            </div>
          ) : !passwordReceived ? (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Waiting for Written Password</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-yellow-800">
                    Request sent to {MOCK_PORTFOLIO_MANAGERS.find(pm => pm.id === selectedManager)?.name}.
                    Please wait for them to provide you with the written password.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handlePasswordReceived}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  I've Received the Password
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-2">Enter Written Password</h3>
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                <p className="text-sm text-blue-800">
                  Please enter the written password provided by the portfolio manager.
                </p>
              </div>
              
              <div className="mb-4">
                <label htmlFor="writtenPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Written Password
                </label>
                <input
                  id="writtenPassword"
                  type="text"
                  value={writtenPassword}
                  onChange={(e) => setWrittenPassword(e.target.value)}
                  placeholder="EVA-PM-XXXX-XXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 font-mono"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Written passwords are case-sensitive and follow the format: EVA-PM-XXXX-XXXXX
                </p>
              </div>
              
              <button
                onClick={handleVerifyPassword}
                disabled={loading || !writtenPassword}
                className={`w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Verifying...
                  </span>
                ) : (
                  'Verify Password'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {verificationStatus === 'success' && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Verification successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>The written password has been verified by the system.</p>
                  <p className="mt-1">
                    Verified at: {new Date(verificationTimestamp || '').toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        
        {verificationStatus === 'success' && (
          <button
            onClick={() => onVerificationComplete(true, {
              portfolioManagerId: selectedManager,
              portfolioManagerName: MOCK_PORTFOLIO_MANAGERS.find(pm => pm.id === selectedManager)?.name,
              verificationMethod: 'written-password',
              timestamp: verificationTimestamp,
              transactionId
            })}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue to Funding
          </button>
        )}
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          Written passwords are issued to portfolio managers and are used to verify high-value or sensitive transactions.
          <br />
          This provides an additional human verification layer for security.
        </p>
      </div>
    </div>
  );
};

export default WrittenPasswordVerification; 