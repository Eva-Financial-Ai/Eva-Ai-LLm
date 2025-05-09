import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';

// Types for verification status and steps
type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'failed';
type VerificationStep =
  | 'welcome'
  | 'basic-info'
  | 'phone-verification'
  | 'review'
  | 'remember-me'
  | 'complete'
  | 'failed';

interface KYCVerificationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (success: boolean) => void;
}

const KYCVerificationFlow: React.FC<KYCVerificationFlowProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
}) => {
  const { userRole } = useContext(UserContext);

  // States for the verification flow
  const [currentStep, setCurrentStep] = useState<VerificationStep>('welcome');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  const [processing, setProcessing] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  // Form data states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [documentType, setDocumentType] = useState('driver-license');
  const [documentNumber, setDocumentNumber] = useState('');

  // Verification code timer
  const [codeTimer, setCodeTimer] = useState(0);

  // Handle code timer countdown
  useEffect(() => {
    if (currentStep === 'phone-verification' && codeTimer > 0) {
      const timer = setTimeout(() => {
        setCodeTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, codeTimer]);

  // Simulated send verification code
  const handleSendVerificationCode = () => {
    if (phoneNumber.length >= 10) {
      setProcessing(true);
      setTimeout(() => {
        // Simulate code being sent
        setCodeTimer(60); // 60 second countdown
        setProcessing(false);
      }, 1500);
    }
  };

  // Simulated verify code
  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      setProcessing(true);
      setTimeout(() => {
        // 90% success rate for demo
        const success = Math.random() < 0.9;
        if (success) {
          setCurrentStep('review');
        } else {
          setVerificationStatus('failed');
        }
        setProcessing(false);
      }, 1500);
    }
  };

  // Submit verification after review
  const handleSubmitVerification = () => {
    setProcessing(true);
    setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() < 0.9;
      if (success) {
        setVerificationStatus('verified');
        setCurrentStep('remember-me');
      } else {
        setVerificationStatus('failed');
        setCurrentStep('failed');
      }
      setProcessing(false);
    }, 2000);
  };

  // Complete verification process
  const handleCompleteVerification = () => {
    setCurrentStep('complete');
    onVerificationComplete(true);
  };

  // Retry verification if failed
  const handleRetry = () => {
    setVerificationStatus('pending');
    setCurrentStep('basic-info');
  };

  // Handle next step navigation
  const handleNext = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('basic-info');
        break;
      case 'basic-info':
        if (firstName && lastName && dateOfBirth && address) {
          setCurrentStep('phone-verification');
        }
        break;
      case 'phone-verification':
        handleVerifyCode();
        break;
      case 'review':
        handleSubmitVerification();
        break;
      case 'remember-me':
        handleCompleteVerification();
        break;
      default:
        break;
    }
  };

  // Handle back navigation
  const handleBack = () => {
    switch (currentStep) {
      case 'basic-info':
        setCurrentStep('welcome');
        break;
      case 'phone-verification':
        setCurrentStep('basic-info');
        break;
      case 'review':
        setCurrentStep('phone-verification');
        break;
      case 'remember-me':
        setCurrentStep('review');
        break;
      default:
        break;
    }
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    const steps = [
      { key: 'welcome', label: 'Welcome' },
      { key: 'basic-info', label: 'Basic Info' },
      { key: 'phone-verification', label: 'Verify' },
      { key: 'review', label: 'Review' },
      { key: 'complete', label: 'Complete' },
    ];

    const currentIndex = steps.findIndex(step => step.key === currentStep);

    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center ${
                  currentStep === step.key
                    ? 'bg-primary-600 text-white'
                    : index < currentIndex
                      ? 'bg-green-100 text-green-800'
                      : 'bg-primary-100 text-primary-800'
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-10 h-1 bg-gray-200">
                  <div
                    className={`h-1 bg-primary-600 ${index < currentIndex ? 'w-full' : 'w-0'}`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="text-center">
            <div className="h-20 w-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary-600"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to KYC Verification</h3>
            <p className="text-sm text-gray-600 mb-6">
              To comply with financial regulations and ensure security, we need to verify your
              identity. This process will take approximately 2-3 minutes to complete.
            </p>

            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-6">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-yellow-400 mr-2"
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
                <p className="text-sm text-yellow-800">
                  Please have your identification documents ready and ensure you're in a well-lit
                  area.
                </p>
              </div>
            </div>

            <h4 className="text-sm font-medium text-gray-700 mb-2">
              The verification process includes:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
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
                Basic personal information
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
                Phone number verification
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
                ID document verification
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
                Information review and confirmation
              </li>
            </ul>
          </div>
        );

      case 'basic-info':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <p className="text-sm text-gray-600 mb-6">
              Please provide your basic personal information.
            </p>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Home Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street address, city, state, zip code"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="documentType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ID Document Type
                </label>
                <select
                  id="documentType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={documentType}
                  onChange={e => setDocumentType(e.target.value)}
                  required
                >
                  <option value="driver-license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="state-id">State ID</option>
                  <option value="military-id">Military ID</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="documentNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Document Number
                </label>
                <input
                  type="text"
                  id="documentNumber"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={documentNumber}
                  onChange={e => setDocumentNumber(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'phone-verification':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Phone Verification</h3>
            <p className="text-sm text-gray-600 mb-6">
              We need to verify your phone number to enhance security.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <div className="flex">
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter your phone number"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={phoneNumber.length < 10 || codeTimer > 0 || processing}
                    className={`px-4 py-2 text-sm font-medium rounded-r-md focus:outline-none ${
                      codeTimer > 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {codeTimer > 0 ? `Resend in ${codeTimer}s` : 'Send Code'}
                  </button>
                </div>
              </div>

              {codeTimer > 0 && (
                <div>
                  <label
                    htmlFor="verificationCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={verificationCode}
                    onChange={e => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 6) {
                        setVerificationCode(value);
                      }
                    }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                </div>
              )}

              {verificationStatus === 'failed' && (
                <div className="bg-red-50 p-3 rounded-md border border-red-100 mt-4">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-red-400 mr-2"
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
                    <p className="text-sm text-red-800">
                      The verification code is incorrect. Please check the code and try again.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-blue-400 mr-2"
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
                <p className="text-sm text-blue-800">
                  A 6-digit verification code has been sent to your phone. Please enter it above to
                  continue.
                </p>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Information</h3>
            <p className="text-sm text-gray-600 mb-6">
              Please review your information to ensure everything is correct.
            </p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Personal Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Full Name:</span>
                  <span className="text-sm font-medium">
                    {firstName} {lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date of Birth:</span>
                  <span className="text-sm font-medium">
                    {new Date(dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Address:</span>
                  <span className="text-sm font-medium">{address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone Number:</span>
                  <span className="text-sm font-medium">{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">ID Document:</span>
                  <span className="text-sm font-medium">
                    {documentType === 'driver-license'
                      ? "Driver's License"
                      : documentType === 'passport'
                        ? 'Passport'
                        : documentType === 'state-id'
                          ? 'State ID'
                          : 'Military ID'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Document Number:</span>
                  <span className="text-sm font-medium">{documentNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-yellow-400 mr-2 mt-0.5"
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
                <p className="text-sm text-yellow-800">
                  By proceeding, you confirm that the information provided is accurate and belongs
                  to you. Providing false information may result in account termination and possible
                  legal action.
                </p>
              </div>
            </div>
          </div>
        );

      case 'remember-me':
        return (
          <div className="text-center">
            <div className="h-20 w-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600"
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
            <h3 className="text-lg font-medium text-green-800 mb-2">Verification Successful!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your identity has been verified successfully.
            </p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <div className="flex items-center justify-center mb-4">
                <input
                  type="checkbox"
                  id="rememberDevice"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={rememberDevice}
                  onChange={e => setRememberDevice(e.target.checked)}
                />
                <label htmlFor="rememberDevice" className="ml-2 block text-sm text-gray-700">
                  Remember this device for 30 days
                </label>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Remembering this device will allow you to skip verification steps on future logins
                from this device. We recommend only enabling this option on your personal devices.
              </p>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center">
            <div className="rounded-full bg-green-100 p-3 mx-auto w-20 h-20 flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-green-600"
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
            <h3 className="text-lg font-medium text-green-800 mb-2">Verification Complete!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your identity has been successfully verified. You can now proceed with your
              transaction.
            </p>

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Details:</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Verification ID:</span>
                  <span className="font-medium">
                    KYC-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Verification Method:</span>
                  <span className="font-medium">Multi-factor KYC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Device Remembered:</span>
                  <span className="font-medium">{rememberDevice ? 'Yes (30 days)' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <div className="rounded-full bg-red-100 p-3 mx-auto w-20 h-20 flex items-center justify-center mb-4">
              <svg
                className="h-10 w-10 text-red-600"
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
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Verification Failed</h3>
            <p className="text-sm text-gray-600 mb-6">
              We encountered an issue while verifying your identity. Please try again.
            </p>

            <div className="bg-red-50 p-4 rounded-md border border-red-100 mb-6">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-red-400 mr-2"
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
                <p className="text-sm text-red-800">This could be due to:</p>
              </div>
              <ul className="ml-7 mt-2 space-y-1 list-disc text-sm text-red-800">
                <li>Information mismatch with our records</li>
                <li>Poor quality of submitted documents</li>
                <li>Network or system errors</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              If you continue to experience issues, please contact our support team at
              support@eva-platform.com
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  // Render footer with action buttons
  const renderFooter = () => (
    <div className="border-t border-gray-200 p-4 flex justify-between">
      {currentStep === 'welcome' ? (
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      ) : currentStep === 'complete' ? (
        <div></div>
      ) : currentStep === 'failed' ? (
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      ) : (
        <button
          onClick={handleBack}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          disabled={processing}
        >
          Back
        </button>
      )}

      {currentStep === 'complete' ? (
        <button
          onClick={onClose}
          className="px-6 py-2 bg-green-600 text-sm text-white rounded-md hover:bg-green-700"
        >
          Close
        </button>
      ) : currentStep === 'failed' ? (
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-primary-600 text-sm text-white rounded-md hover:bg-primary-700"
        >
          Try Again
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary-600 text-sm text-white rounded-md hover:bg-primary-700"
          disabled={
            (currentStep === 'basic-info' &&
              (!firstName || !lastName || !dateOfBirth || !address)) ||
            (currentStep === 'phone-verification' &&
              (verificationCode.length !== 6 || !codeTimer)) ||
            processing
          }
        >
          {processing ? 'Processing...' : currentStep === 'remember-me' ? 'Complete' : 'Continue'}
        </button>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 relative overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-primary-700">Identity Verification</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
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

        <div className="p-6">
          {['welcome', 'basic-info', 'phone-verification', 'review', 'remember-me'].includes(
            currentStep
          ) && renderProgressIndicator()}
          {renderStepContent()}
        </div>

        {renderFooter()}
      </div>
    </div>
  );
};

export default KYCVerificationFlow;
