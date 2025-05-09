import React, { useState } from 'react';
// @ts-ignore
import { useSpring, animated } from '@react-spring/web';

interface StripeConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const StripeConnectModal: React.FC<StripeConnectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState<
    'intro' | 'account' | 'verification' | 'connecting' | 'success'
  >('intro');
  const [accountType, setAccountType] = useState<'standard' | 'express' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accountData, setAccountData] = useState({
    email: '',
    businessName: '',
    country: 'US',
    currency: 'USD',
    type: 'company',
  });

  // Animation for modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 280, friction: 60 },
  });

  const handleAccountTypeSelect = (type: 'standard' | 'express') => {
    setAccountType(type);
    setCurrentStep('account');
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate account creation process
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep('verification');
    }, 2000);
  };

  const handleVerificationSubmit = () => {
    setCurrentStep('connecting');

    // Simulate connection process
    setTimeout(() => {
      setCurrentStep('success');

      // Simulate successful connection and return to parent
      setTimeout(() => {
        onSuccess({
          provider: 'Payment Processor',
          service: 'Stripe',
          accountType: accountType,
          accountData: {
            ...accountData,
            accountId: 'acct_' + Math.random().toString(36).substring(2, 15),
            status: 'active',
          },
          connected: true,
          timestamp: new Date().toISOString(),
        });

        onClose();
      }, 2000);
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <div className="py-4">
            <div className="mb-6 text-center">
              <div className="inline-flex mx-auto items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-2">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Connect your Stripe account
              </h3>
              <p className="text-sm text-gray-500">
                Choose how you want to integrate with Stripe to process payments
              </p>
            </div>

            <div className="space-y-4">
              <div
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAccountTypeSelect('standard')}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="h-5 w-5 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Standard Connect</h4>
                    <p className="mt-1 text-xs text-gray-500">
                      Connect your existing Stripe account or create a new one with full
                      customization and control
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAccountTypeSelect('express')}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="h-5 w-5 text-primary-600"
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
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">Express Connect</h4>
                    <p className="mt-1 text-xs text-gray-500">
                      Fast and simple onboarding with a Stripe-hosted account setup and dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setCurrentStep('intro')}
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
                {accountType === 'standard' ? 'Standard' : 'Express'} Connect
              </h3>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              {accountType === 'standard'
                ? 'Enter your business details to configure your Stripe account'
                : 'Enter basic information to get started with Express onboarding'}
            </p>

            <form onSubmit={handleAccountSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={accountData.email}
                    onChange={e => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={accountData.businessName}
                    onChange={e =>
                      setAccountData(prev => ({ ...prev, businessName: e.target.value }))
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    id="country"
                    value={accountData.country}
                    onChange={e => setAccountData(prev => ({ ...prev, country: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                    Default Currency
                  </label>
                  <select
                    id="currency"
                    value={accountData.currency}
                    onChange={e => setAccountData(prev => ({ ...prev, currency: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
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
                      Processing...
                    </span>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </form>
          </div>
        );

      case 'verification':
        return (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <button
                onClick={() => setCurrentStep('account')}
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
              <h3 className="text-lg font-medium text-gray-900">Verify your account</h3>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {accountType === 'standard'
                      ? "To complete your Stripe account setup, you'll need to provide additional verification information through Stripe."
                      : "Complete your Express account setup through Stripe's hosted onboarding flow."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg divide-y">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Business Information</h4>
                    <p className="mt-1 text-xs text-gray-500">Legal details about your business</p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Business Representative</h4>
                    <p className="mt-1 text-xs text-gray-500">Person representing the business</p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Required
                    </span>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Bank Account</h4>
                    <p className="mt-1 text-xs text-gray-500">Where payments will be deposited</p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Required
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleVerificationSubmit}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Complete verification with Stripe
              </button>
            </div>
          </div>
        );

      case 'connecting':
        return (
          <div className="py-8 text-center">
            <div className="animate-spin mx-auto h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Setting up your account</h3>
            <p className="mt-2 text-sm text-gray-500">
              Connecting to Stripe and configuring your payment account...
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">Account Connected!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your {accountType === 'standard' ? 'Standard' : 'Express'} Stripe account has been
              connected successfully.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              You can now receive payments through {accountData.businessName}.
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
      <div
        style={{
          opacity: modalAnimation.opacity as unknown as number,
          transform: modalAnimation.transform as unknown as string,
        }}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="text-purple-500 h-6 w-6 mr-2" viewBox="0 0 23 23" fill="currentColor">
              <path d="M1.36 8.242a.67.67 0 000 1.341h20.28a.67.67 0 100-1.341H1.36zm0 5.366a.67.67 0 000 1.341h20.28a.67.67 0 100-1.341H1.36z" />
            </svg>
            Connect with Stripe
          </h2>
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

        {/* Footer - Only show for intro step */}
        {currentStep === 'intro' && (
          <div className="p-4 border-t flex justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <span className="mr-1">Powered by</span>
              <span className="font-bold">Stripe</span>
            </div>
            <div>
              <span className="mr-2">🔒</span>
              <span>PCI Compliant</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeConnectModal;
