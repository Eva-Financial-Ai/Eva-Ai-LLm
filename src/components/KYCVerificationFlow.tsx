import React, { useState, useEffect } from 'react';

// Define types for verification process
type VerificationStep =
  | 'welcome'
  | 'basic-info'
  | 'verify-phone'
  | 'review-info'
  | 'remember-me'
  | 'verification-complete'
  | 'verification-failed';

interface KYCVerificationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (success: boolean) => void;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  dateOfBirth: {
    month: string;
    day: string;
    year: string;
  };
  address: string;
  ssn: string;
  phoneNumber: string;
  verificationCode: string;
  rememberMe: boolean;
}

const KYCVerificationFlow: React.FC<KYCVerificationFlowProps> = ({
  isOpen,
  onClose,
  onComplete,
  userEmail,
  userPhone,
  userName,
}) => {
  // State for current step in verification flow
  const [currentStep, setCurrentStep] = useState<VerificationStep>('welcome');
  const [userData, setUserData] = useState<UserData>({
    firstName: userName?.split(' ')[0] || '',
    lastName: userName?.split(' ')[1] || '',
    dateOfBirth: {
      month: '',
      day: '',
      year: '',
    },
    address: '',
    ssn: '',
    phoneNumber: userPhone || '',
    verificationCode: '',
    rememberMe: false,
  });

  // Code verification state
  const [verificationSent, setVerificationSent] = useState(false);
  const [codeDigits, setCodeDigits] = useState<string[]>(['', '', '', '', '']);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // When verification code is sent, start countdown for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verificationSent && resendDisabled) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [verificationSent, resendDisabled]);

  // Hide component if not open
  if (!isOpen) return null;

  // Handle continues to next step
  const handleContinue = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('basic-info');
        break;
      case 'basic-info':
        setCurrentStep('verify-phone');
        // Simulate sending verification code
        setVerificationSent(true);
        setResendDisabled(true);
        break;
      case 'verify-phone':
        setCurrentStep('review-info');
        break;
      case 'review-info':
        setCurrentStep('remember-me');
        break;
      case 'remember-me':
        // If remember me is checked, complete with success
        if (userData.rememberMe) {
          setCurrentStep('verification-complete');
          if (onComplete) onComplete(true);
        } else {
          setCurrentStep('verification-complete');
          if (onComplete) onComplete(true);
        }
        break;
      case 'verification-complete':
        onClose();
        break;
      case 'verification-failed':
        onClose();
        break;
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserData(prevData => ({
        ...prevData,
        [parent]: {
          ...(prevData[parent as keyof UserData] as any),
          [child]: value,
        },
      }));
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setUserData(prevData => ({
        ...prevData,
        [name]: target.checked,
      }));
    } else {
      setUserData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle verification code input
  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }

    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = value;
    setCodeDigits(newCodeDigits);

    // Auto-focus next input
    if (value !== '' && index < 4) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Check if all digits are filled
    if (newCodeDigits.every(digit => digit !== '') && newCodeDigits.join('').length === 5) {
      // Simulate verification
      setTimeout(() => {
        handleContinue();
      }, 500);
    }
  };

  // Handle resend code
  const handleResendCode = () => {
    if (!resendDisabled) {
      // Simulate resending code
      setVerificationSent(true);
      setResendDisabled(true);
      setCodeDigits(['', '', '', '', '']);
      // Focus first input
      setTimeout(() => {
        const firstInput = document.getElementById('code-0');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  };

  // Render welcome step
  const renderWelcomeStep = () => (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <div className="bg-black rounded-full p-4 w-20 h-20 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white"
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
      </div>

      <h2 className="text-xl font-semibold text-center mb-3">
        To continue, we need to verify your identity
      </h2>

      <div className="space-y-4 mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
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
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">Fast and secure</h3>
            <p className="text-xs text-gray-500">
              Verification usually takes less than a few minutes and is encrypted
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">How we verify you</h3>
            <p className="text-xs text-gray-500">
              To learn how our service provider uses data you provide and device data, see their
              Privacy Statement
            </p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-6">
        By selecting Continue, you agree to the Ontop Technologies LLC Privacy Policy
      </div>

      <button
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );

  // Render basic info step
  const renderBasicInfoStep = () => (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button
          className="mr-2 text-gray-500 hover:text-gray-700"
          onClick={() => setCurrentStep('welcome')}
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
        <h2 className="text-lg font-medium">Basic Information</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Date of birth</h3>
        <p className="text-sm text-gray-500 mb-4">
          This should match what is on your government issued ID.
        </p>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <select
              name="dateOfBirth.month"
              value={userData.dateOfBirth.month}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="dateOfBirth.day"
              value={userData.dateOfBirth.day}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="dateOfBirth.year"
              value={userData.dateOfBirth.year}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 18 - i).map(
                year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>

      <button
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleContinue}
        disabled={
          !userData.dateOfBirth.month || !userData.dateOfBirth.day || !userData.dateOfBirth.year
        }
      >
        Continue
      </button>
    </div>
  );

  // Render verify phone step
  const renderVerifyPhoneStep = () => (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button
          className="mr-2 text-gray-500 hover:text-gray-700"
          onClick={() => setCurrentStep('basic-info')}
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
        <h2 className="text-lg font-medium">Verify phone number</h2>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 rounded-md">
          <svg
            className="w-8 h-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 mb-2">Enter the 5-digit code sent to your phone</p>
        <div className="flex justify-center space-x-2 mb-4">
          {codeDigits.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={e => handleCodeInput(index, e.target.value)}
              className="w-10 h-10 text-center border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
            />
          ))}
        </div>
        <div className="text-sm text-gray-500">
          {resendDisabled ? (
            `Didn't receive your code? Resend in ${countdown}s`
          ) : (
            <button className="text-indigo-600 hover:text-indigo-500" onClick={handleResendCode}>
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render review info step
  const renderReviewInfoStep = () => (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button
          className="mr-2 text-gray-500 hover:text-gray-700"
          onClick={() => setCurrentStep('verify-phone')}
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
        <h2 className="text-lg font-medium">Review information</h2>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 rounded-md">
          <svg
            className="w-8 h-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Good news, we found an identity linked to your phone number!
        </p>
        <button className="text-indigo-600 hover:text-indigo-500 font-medium" onClick={() => {}}>
          Leslie Knope
        </button>
      </div>

      <div className="mt-4 mb-6">
        <p className="text-sm text-gray-600 mb-2">We also have the following on file:</p>
        <div className="space-y-2">
          <div className="flex">
            <div className="w-28 text-sm text-gray-500">Address</div>
            <div className="flex-1 text-sm">123 Main St, Pawnee, Indiana</div>
          </div>
          <div className="flex">
            <div className="w-28 text-sm text-gray-500">SSN</div>
            <div className="flex-1 text-sm">123-**-****</div>
          </div>
        </div>
      </div>

      <div className="space-x-2">
        <button
          className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {}}
        >
          Update Information
        </button>
        <button
          className="py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={handleContinue}
        >
          Confirm and Continue
        </button>
      </div>
    </div>
  );

  // Render remember me step
  const renderRememberMeStep = () => (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <button
          className="mr-2 text-gray-500 hover:text-gray-700"
          onClick={() => setCurrentStep('review-info')}
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
        <h2 className="text-lg font-medium">Remember Me</h2>
      </div>

      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center bg-indigo-100 rounded-md">
          <svg
            className="w-8 h-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Remember me next time?</h3>
        <div className="mb-2">
          <p className="text-sm text-gray-500">Faster verification on other apps</p>
        </div>

        <div className="p-4 border border-gray-200 rounded-md mb-4">
          <div className="flex items-start mb-2">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={userData.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
              <span className="block text-xs text-gray-500">
                and create a Pilot Remember Me Profile
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-500">
            By checking "Remember me" below, you agree to Persona's collection of information that
            could be used to identify you. For more info, see Remember Me's Terms of Service.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setUserData(prev => ({ ...prev, rememberMe: false }))}
          >
            Not now
          </button>
          <button
            className="flex-1 py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleContinue}
          >
            Remember me
          </button>
        </div>
      </div>
    </div>
  );

  // Render verification complete step
  const renderVerificationCompleteStep = () => (
    <div className="p-6 text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Successfully verified</h2>
      <p className="text-sm text-gray-500 mb-6">Press "Finish" to continue</p>

      <button
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleContinue}
      >
        Finish
      </button>
    </div>
  );

  // Render verification failed step
  const renderVerificationFailedStep = () => (
    <div className="p-6 text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-16 h-16 flex items-center justify-center bg-red-100 rounded-full">
          <svg
            className="w-10 h-10 text-red-600"
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
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Unable to verify your identity</h2>
      <p className="text-sm text-gray-500 mb-6">
        We have received our request and are reviewing your information.
      </p>

      <button
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleContinue}
      >
        Finish
      </button>
    </div>
  );

  // Render different steps based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'basic-info':
        return renderBasicInfoStep();
      case 'verify-phone':
        return renderVerifyPhoneStep();
      case 'review-info':
        return renderReviewInfoStep();
      case 'remember-me':
        return renderRememberMeStep();
      case 'verification-complete':
        return renderVerificationCompleteStep();
      case 'verification-failed':
        return renderVerificationFailedStep();
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
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

          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default KYCVerificationFlow;
