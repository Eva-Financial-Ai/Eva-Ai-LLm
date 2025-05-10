import React, { useState } from 'react';

interface FinancialStatementsProps {
  userType: string;
}

const FinancialStatements: React.FC<FinancialStatementsProps> = ({ userType }) => {
  // Add state for controlling dropdown visibility
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showIRSModal, setShowIRSModal] = useState(false);
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [showGoogleBusinessModal, setShowGoogleBusinessModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);

  // Mock data for financial statements
  const financialStatements = [
    {
      id: 'fs-1',
      name: 'Profit & Loss Statement',
      description: 'Most recent financial year',
      required: true,
      fileType: 'pdf',
    },
    {
      id: 'fs-2',
      name: 'Balance Sheet',
      description: 'As of last quarter',
      required: true,
      fileType: 'pdf',
    },
    {
      id: 'fs-3',
      name: 'Cash Flow Statement',
      description: 'Last 12 months',
      required: false,
      fileType: 'pdf',
    },
    {
      id: 'fs-4',
      name: 'Business Bank Statements',
      description: 'Last 3 months',
      required: true,
      fileType: 'pdf',
    },
  ];

  // Function to handle accounting software connection
  const connectToAccountingSoftware = (software: string) => {
    console.log(`Connecting to ${software}...`);
    // In a real app, this would initiate OAuth flow or API connection
    alert(`Initiating connection to ${software}. This would redirect to authentication.`);
    setShowAccountDropdown(false);
  };

  return (
    <div className="financial-statements">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Financial Statements</h3>
        <div className="relative">
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm flex items-center"
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          >
            <svg
              className="w-4 h-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
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
            Account Connection
          </button>

          {showAccountDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {/* Plaid Integration */}
                <button
                  onClick={() => {
                    setShowPlaidModal(true);
                    setShowAccountDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="24" height="24" rx="4" fill="#1a1f36" />
                      <path
                        d="M15.51 6.5H19.5V10.38H18.07V9.14C17.84 9.54 17.13 10.33 15.52 10.44V12.41C15.52 13.59 15.96 14.36 16.51 14.92C17.13 15.54 18 15.86 19.11 15.92V18C17.71 17.74 16.42 17.22 15.5 15.92L15.51 6.5Z"
                        fill="white"
                      />
                      <path
                        d="M8.5 6.5H4.5V10.38H5.93V9.14C6.16 9.54 6.87 10.33 8.48 10.44V12.41C8.48 13.59 8.04 14.36 7.49 14.92C6.87 15.54 6 15.86 4.89 15.92V18C6.29 17.74 7.58 17.22 8.5 15.92V6.5Z"
                        fill="white"
                      />
                      <path
                        d="M10 6.5H14V10.38H12.57V9.14C12.33 9.54 11.63 10.33 10.02 10.44V12.41C10.02 13.59 10.46 14.36 11.01 14.92C11.63 15.54 12.5 15.86 13.61 15.92V18C12.21 17.74 10.92 17.22 10 15.92V6.5Z"
                        fill="white"
                      />
                    </svg>
                    Plaid Bank Account Connection
                  </div>
                </button>

                {/* QuickBooks */}
                <button
                  onClick={() => connectToAccountingSoftware('QuickBooks')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intuit_QuickBooks_logo.svg/1200px-Intuit_QuickBooks_logo.svg.png"
                      alt="QuickBooks"
                      className="w-6 h-6 mr-2"
                    />
                    QuickBooks Online
                  </div>
                </button>

                {/* NetSuite */}
                <button
                  onClick={() => connectToAccountingSoftware('NetSuite')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <img
                      src="https://www.netsuite.com/portal/assets/img/social-share-icons/netsuite-social-share.jpg"
                      alt="NetSuite"
                      className="w-6 h-6 mr-2"
                    />
                    Oracle NetSuite
                  </div>
                </button>

                <hr className="my-1" />

                {/* IRS API */}
                <button
                  onClick={() => {
                    setShowIRSModal(true);
                    setShowAccountDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                      />
                    </svg>
                    IRS Transcription & Tax Return API
                  </div>
                </button>

                <hr className="my-1" />

                {/* Google My Business */}
                <button
                  onClick={() => {
                    setShowGoogleBusinessModal(true);
                    setShowAccountDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#fbc02d"
                        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                      <path
                        fill="#e53935"
                        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                      />
                      <path
                        fill="#4caf50"
                        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                      />
                      <path
                        fill="#1565c0"
                        d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                      />
                    </svg>
                    Google My Business Lookup
                  </div>
                </button>

                {/* Stripe */}
                <button
                  onClick={() => {
                    setShowStripeModal(true);
                    setShowAccountDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.9763 7.12635C13.2007 6.7433 12.4251 6.7433 11.4529 6.7433C10.4806 6.7433 9.89583 7.12635 9.89583 7.50939C9.89583 8.27548 11.4529 8.08896 12.4251 8.46201C14.3694 9.01809 15.5347 9.95718 15.5347 11.6428C15.5347 13.7109 13.5903 15.0225 11.2597 15.0225C9.70833 15.0225 8.15694 14.6494 7 13.8833L7.77569 11.8153C8.93264 12.5814 10.0903 12.9544 11.2597 12.9544C12.2333 12.9544 12.8194 12.5814 12.8194 12.1983C12.8194 11.4322 11.4529 11.4322 9.70833 10.6661C8.15694 10.1101 7.19444 9.20999 7.19444 8.08896C7.19444 6.17392 9.12118 4.66275 11.4529 4.66275C12.8194 4.66275 14.1858 4.93177 15.3403 5.49786L14.5639 7.69591C14.3694 7.31287 14.1736 7.12635 13.9763 7.12635ZM8.75 18L14.95 15.5V17.4166L8.75 19.9166V18ZM14 0H10V24H14V0Z"
                        fill="#6772E5"
                      />
                    </svg>
                    Stripe Payment Processing
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IRS Transcription Modal */}
      {showIRSModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">IRS Transcription Access</h3>
              <button
                onClick={() => setShowIRSModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Securely connect to the IRS to retrieve your tax transcripts. This provides a faster
              approval process with verified financial information.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">IRS Username</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IRS Password</label>
                <input
                  type="password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="consent"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="consent" className="ml-2 block text-sm text-gray-900">
                  I consent to retrieve my tax records from the IRS API
                </label>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowIRSModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Connecting to IRS API...');
                    setShowIRSModal(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plaid Modal */}
      {showPlaidModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Connect Bank Account with Plaid</h3>
              <button
                onClick={() => setShowPlaidModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Securely connect your bank accounts through Plaid to verify your financial information
              and streamline the approval process.
            </p>

            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits of connecting:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <svg
                    className="h-4 w-4 text-green-500 mr-2"
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
                  Faster application processing
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-4 w-4 text-green-500 mr-2"
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
                  Automatic verification of bank statements
                </li>
                <li className="flex items-center">
                  <svg
                    className="h-4 w-4 text-green-500 mr-2"
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
                  Secure, read-only access
                </li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPlaidModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Launching Plaid connection...');
                  setShowPlaidModal(false);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Connect Bank Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google My Business Modal */}
      {showGoogleBusinessModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Google My Business Lookup</h3>
              <button
                onClick={() => setShowGoogleBusinessModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Verify your business information through Google My Business to enhance your
              application's credibility.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Address</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your business address"
                />
              </div>

              <button
                type="button"
                className="w-full bg-blue-50 border border-blue-200 text-blue-600 rounded-md py-2 px-4 text-sm font-medium hover:bg-blue-100 focus:outline-none"
              >
                Search Google My Business
              </button>

              {/* This would show after search results come back */}
              <div className="hidden bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900">Business Found:</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Verified
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p className="font-medium">Acme Corporation</p>
                  <p>123 Main St, Anytown, CA 12345</p>
                  <p>Rating: 4.5 ★★★★½ (24 reviews)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowGoogleBusinessModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Business information verification in progress...');
                  setShowGoogleBusinessModal(false);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Verify & Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Modal */}
      {showStripeModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">Connect Stripe Account</h3>
              <button
                onClick={() => setShowStripeModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Connect your Stripe account to share payment processing history and revenue
              information to strengthen your application.
            </p>

            <div className="p-4 bg-indigo-50 rounded-md mb-4">
              <div className="flex items-center text-sm text-indigo-700">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Connecting your Stripe account will provide us with read-only access to your payment
                processing history.
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stripe Account Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@example.com"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="stripe-consent"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="stripe-consent" className="ml-2 block text-sm text-gray-900">
                  I authorize EVA Financial to access my Stripe account data for this application
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowStripeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Redirecting to Stripe OAuth...');
                  setShowStripeModal(false);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                Connect Stripe
              </button>
            </div>
          </div>
        </div>
      )}

      {userType === 'borrower' ? (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-4">
            Please upload the following financial statements to support your application. Documents
            marked as required must be provided to complete your application.
          </p>

          <div className="financial-statements-list">
            {financialStatements.map(statement => (
              <div key={statement.id} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-800">{statement.name}</h4>
                      {statement.required && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{statement.description}</p>
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">
                    Upload
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-sm text-gray-700 mb-4">
            View and manage financial statements submitted by the borrower.
          </p>

          <div className="financial-statements-list">
            {financialStatements.map(statement => (
              <div key={statement.id} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-800">{statement.name}</h4>
                      {statement.required && (
                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{statement.description}</p>
                  </div>
                  <div>
                    <button className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm mr-2">
                      View
                    </button>
                    <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialStatements;
