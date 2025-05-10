import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';

interface WrittenPasswordVerificationProps {
  transactionId: string;
  onVerificationSuccess: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

interface PortfolioManager {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Demo portfolio managers for testing
const demoPortfolioManagers: PortfolioManager[] = [
  {
    id: 'pm1',
    name: 'Michael Chen',
    email: 'michael.chen@evafi.com',
    phone: '+1-555-123-4567',
  },
  {
    id: 'pm2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@evafi.com',
    phone: '+1-555-987-6543',
  },
  {
    id: 'pm3',
    name: 'David Rodriguez',
    email: 'david.rodriguez@evafi.com',
    phone: '+1-555-456-7890',
  },
];

// DEMO ONLY: Fixed demo password that will always work for testing purposes
const DEMO_PASSWORD = 'EVA-DEMO-PASSWORD-123';

const WrittenPasswordVerification: React.FC<WrittenPasswordVerificationProps> = ({
  transactionId,
  onVerificationSuccess,
  onCancel,
  isVisible,
}) => {
  const { currentTransaction } = useWorkflow();
  const [writtenPassword, setWrittenPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [selectedManager, setSelectedManager] = useState<PortfolioManager | null>(null);
  const [passwordSent, setPasswordSent] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState<'email' | 'sms' | 'app'>('email');

  // Demo verification password - would be generated and stored securely in a real app
  // Format: EVA-PM-[Manager ID]-[Random 5 chars]
  const [demoPassword, setDemoPassword] = useState('');

  useEffect(() => {
    if (selectedManager) {
      generateNewPassword();
    }
  }, [selectedManager]);

  // Generate a random password for demo purposes
  const generateNewPassword = () => {
    if (!selectedManager) return;

    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    const generatedPassword = `EVA-PM-${selectedManager.id.toUpperCase()}-${randomChars}`;
    setDemoPassword(generatedPassword);
    console.log('Demo password generated (for testing only):', generatedPassword);
  };

  // For demo - in production this would go to a secure backend service
  const sendNotification = () => {
    if (!selectedManager) {
      setErrorMessage('Please select a portfolio manager first');
      return;
    }

    setVerifying(true);

    // Simulate API call
    setTimeout(() => {
      // Log the notification that would be sent
      console.log(`Notification sent to ${selectedManager.name} via ${notificationMethod}:`);
      console.log(`One-time password for transaction ${transactionId}: ${demoPassword}`);

      if (notificationMethod === 'email') {
        console.log(`Email sent to: ${selectedManager.email}`);
      } else if (notificationMethod === 'sms') {
        console.log(`SMS sent to: ${selectedManager.phone}`);
      } else {
        console.log(`In-app notification sent to ${selectedManager.id}`);
      }

      setPasswordSent(true);
      setVerifying(false);
    }, 1500);
  };

  const verifyPassword = () => {
    setVerifying(true);
    setErrorMessage('');

    // For demo purposes, compare with demoPassword or with the DEMO_PASSWORD
    // In production, this would be a secure API call to verify the password
    setTimeout(() => {
      if (writtenPassword === demoPassword || writtenPassword === DEMO_PASSWORD) {
        onVerificationSuccess();
      } else {
        setErrorMessage('Invalid password. Please try again.');
      }
      setVerifying(false);
    }, 1000);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Written Password Verification</h2>
          <p className="text-sm text-gray-600">
            Additional security verification required by portfolio manager to close this transaction
          </p>
        </div>

        {/* DEMO ONLY: Fixed password display */}
        <div className="mb-4 bg-yellow-100 border-2 border-yellow-400 p-3 rounded-md text-center">
          <p className="text-sm font-bold text-yellow-800">DEMO MODE: Always working password</p>
          <div className="mt-2 bg-white p-2 rounded border border-yellow-400 font-mono text-lg">
            {DEMO_PASSWORD}
          </div>
          <p className="mt-1 text-xs text-yellow-700">
            This password will always work during demo. In production, real passwords would be
            required.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Transaction Details</h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Transaction ID</span>
              <span className="text-sm">{transactionId}</span>
            </div>
            {currentTransaction && (
              <>
                <div className="flex justify-between mt-1">
                  <span className="text-sm font-medium">Applicant</span>
                  <span className="text-sm">
                    {currentTransaction.applicantData?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm font-medium">Amount</span>
                  <span className="text-sm">
                    ${currentTransaction.amount?.toLocaleString() || '0'}
                  </span>
                </div>
              </>
            )}
            <div className="mt-2">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                Pending Verification
              </span>
            </div>
          </div>
        </div>

        {!passwordSent ? (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Request Written Password</h3>
            <p className="text-sm text-gray-600 mb-4">
              To complete this transaction, you need a written password from a portfolio manager.
              This is an extra security measure to prevent fraud.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Portfolio Manager
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedManager?.id || ''}
                onChange={e => {
                  const manager = demoPortfolioManagers.find(m => m.id === e.target.value);
                  setSelectedManager(manager || null);
                }}
              >
                <option value="">-- Select a manager --</option>
                {demoPortfolioManagers.map(manager => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name} ({manager.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Method
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="email"
                    checked={notificationMethod === 'email'}
                    onChange={() => setNotificationMethod('email')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="sms"
                    checked={notificationMethod === 'sms'}
                    onChange={() => setNotificationMethod('sms')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">SMS</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="notificationMethod"
                    value="app"
                    checked={notificationMethod === 'app'}
                    onChange={() => setNotificationMethod('app')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">App Notification</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={sendNotification}
              disabled={!selectedManager || verifying}
              className="w-full py-2 px-4 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {verifying ? 'Sending...' : 'Request Written Password'}
            </button>
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="font-medium mb-2">Enter Written Password</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please enter the written password provided by {selectedManager?.name}.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Written Password
              </label>
              <input
                type="text"
                placeholder="EVA-PM-XXXX-XXXXX"
                value={writtenPassword}
                onChange={e => setWrittenPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Written passwords are case-sensitive. You can also use the demo password above.
              </p>
              {errorMessage && <p className="text-xs text-red-600 mt-1">{errorMessage}</p>}
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={verifyPassword}
                disabled={!writtenPassword || verifying}
                className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Verify Password'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasswordSent(false);
                  setWrittenPassword('');
                  setErrorMessage('');
                }}
                className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Request New
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 bg-blue-50 p-3 rounded-md text-xs text-blue-800">
          <p>
            Written passwords are issued to portfolio managers and are used to verify high-value or
            sensitive transactions. This provides an additional human verification layer for
            security.
          </p>
        </div>

        {/* For DEMO purposes only - display generated password if one exists */}
        {demoPassword && (
          <div className="mt-4 border border-dashed border-red-300 bg-red-50 p-3 rounded-md">
            <p className="text-xs font-medium text-red-800 mb-1">
              Manager-specific password (for testing):
            </p>
            <p className="text-sm font-mono bg-white p-2 rounded border border-red-200">
              {demoPassword}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WrittenPasswordVerification;
