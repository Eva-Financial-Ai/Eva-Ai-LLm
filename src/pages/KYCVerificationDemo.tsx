import React, { useState } from 'react';
import KYCVerificationFlow from '../components/security/KYCVerificationFlow';
import { UserContext } from '../contexts/UserContext';

const KYCVerificationDemo: React.FC = () => {
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleOpenKYC = () => {
    setIsKYCModalOpen(true);
  };

  const handleCloseKYC = () => {
    setIsKYCModalOpen(false);
  };

  const handleVerificationComplete = (success: boolean) => {
    setIsVerified(success);
    // In a real application, you would typically store this verification status in your backend
    console.log('Verification completed with status:', success);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">KYC Verification Demo</h1>
        <p className="text-gray-600 mb-6">
          This page demonstrates the KYC (Know Your Customer) verification flow that can be
          integrated into transaction processes to verify user identity in compliance with financial
          regulations.
        </p>

        <div className="flex items-center mb-8">
          <div className="mr-4 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-800">KYC Verification Status</h2>
            <div className="flex items-center mt-1">
              {isVerified ? (
                <>
                  <span className="flex h-3 w-3 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-green-600 font-medium">Verified</span>
                </>
              ) : (
                <>
                  <span className="flex h-3 w-3 bg-yellow-400 rounded-full mr-2"></span>
                  <span className="text-yellow-600 font-medium">Not Verified</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenKYC}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {isVerified ? 'Re-verify Identity' : 'Verify Identity'}
        </button>
      </div>

      {/* Example Transaction Card */}
      <div className="bg-white shadow-md rounded-lg p-6 border-t-4 border-primary-500">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Example Transaction</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-500">Transaction Type:</span>
            <span className="font-medium">Commercial Loan Application</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">$250,000.00</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-500">Term:</span>
            <span className="font-medium">60 months</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-500">Interest Rate:</span>
            <span className="font-medium">5.75%</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-100">
            <span className="text-gray-500">Status:</span>
            <span className="font-medium text-yellow-600">Identity Verification Required</span>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-6">
          <div className="flex">
            <svg
              className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-yellow-800">
              To proceed with this transaction, identity verification is required in compliance with
              financial regulations. Please complete the KYC verification process.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenKYC}
          disabled={isVerified}
          className={`w-full py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isVerified
              ? 'bg-green-500 text-white cursor-not-allowed'
              : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
          }`}
        >
          {isVerified
            ? 'Identity Verified - Continue with Transaction'
            : 'Verify Identity to Proceed'}
        </button>
      </div>

      {/* KYC Verification Flow Modal */}
      <KYCVerificationFlow
        isOpen={isKYCModalOpen}
        onClose={handleCloseKYC}
        onVerificationComplete={handleVerificationComplete}
      />
    </div>
  );
};

export default KYCVerificationDemo;
