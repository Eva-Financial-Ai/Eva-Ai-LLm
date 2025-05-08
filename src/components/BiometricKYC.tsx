import React, { useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

// Types for verification status
type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'failed';
type UserRole = 'borrower' | 'broker' | 'vendor' | 'lender';

interface BiometricKYCProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (success: boolean) => void;
  userRole: UserRole;
}

const BiometricKYC: React.FC<BiometricKYCProps> = ({ 
  isOpen, 
  onClose, 
  onVerificationComplete,
  userRole 
}) => {
  const [step, setStep] = useState<'intro' | 'face' | 'document' | 'final'>('intro');
  const [faceStatus, setFaceStatus] = useState<VerificationStatus>('pending');
  const [documentStatus, setDocumentStatus] = useState<VerificationStatus>('pending');
  const [overall, setOverall] = useState<VerificationStatus>('pending');
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [processing, setProcessing] = useState(false);

  // Simulate camera activation
  useEffect(() => {
    if (step === 'face' && faceStatus === 'pending') {
      setCameraActive(true);
      // Simulated countdown
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            simulateFaceVerification();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(timer);
        setCameraActive(false);
      };
    }
  }, [step, faceStatus]);

  // Simulate document scan when on document step
  useEffect(() => {
    if (step === 'document' && documentStatus === 'pending') {
      const timer = setTimeout(() => {
        simulateDocumentVerification();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [step, documentStatus]);

  // Simulate face verification
  const simulateFaceVerification = () => {
    setFaceStatus('in_progress');
    setProcessing(true);
    
    setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() < 0.9;
      setFaceStatus(success ? 'verified' : 'failed');
      setProcessing(false);
    }, 2000);
  };

  // Simulate document verification
  const simulateDocumentVerification = () => {
    setDocumentStatus('in_progress');
    setProcessing(true);
    
    setTimeout(() => {
      // 90% success rate for demo
      const success = Math.random() < 0.9;
      setDocumentStatus(success ? 'verified' : 'failed');
      setProcessing(false);
    }, 2000);
  };

  // Handle next step navigation
  const handleNext = () => {
    if (step === 'intro') {
      setStep('face');
    } else if (step === 'face' && faceStatus === 'verified') {
      setStep('document');
    } else if (step === 'document' && documentStatus === 'verified') {
      setStep('final');
      setOverall('verified');
      onVerificationComplete(true);
    }
  };

  // Handle retry for failed verification
  const handleRetry = () => {
    if (step === 'face') {
      setFaceStatus('pending');
    } else if (step === 'document') {
      setDocumentStatus('pending');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center">
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 'intro' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-800'}`}>
          1
        </div>
        <div className="w-10 h-1 bg-gray-200">
          <div className={`h-1 bg-primary-600 ${step !== 'intro' ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 'face' ? 'bg-primary-600 text-white' : faceStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-primary-100 text-primary-800'}`}>
          2
        </div>
        <div className="w-10 h-1 bg-gray-200">
          <div className={`h-1 bg-primary-600 ${step === 'document' || step === 'final' ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 'document' ? 'bg-primary-600 text-white' : documentStatus === 'verified' ? 'bg-green-100 text-green-800' : 'bg-primary-100 text-primary-800'}`}>
          3
        </div>
        <div className="w-10 h-1 bg-gray-200">
          <div className={`h-1 bg-primary-600 ${step === 'final' ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step === 'final' ? 'bg-primary-600 text-white' : 'bg-primary-100 text-primary-800'}`}>
          4
        </div>
      </div>
    </div>
  );

  // Render the content based on current step
  const renderContent = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="text-center">
            <div className="h-20 w-20 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Biometric KYC Verification</h3>
            <p className="text-sm text-gray-600 mb-6">
              Before completing your transaction, we need to verify your identity using biometric authentication.
              This process helps ensure security and compliance with financial regulations.
            </p>
            
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-6">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-yellow-800">
                  You will need to complete a facial scan and provide identification documents 
                  relevant to your role as a {userRole}.
                </p>
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-gray-700 mb-2">The process includes:</h4>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Facial recognition scan
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                ID document verification
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {userRole === 'borrower' ? 'Proof of address verification' : 
                  userRole === 'lender' ? 'Financial authority credentials' : 
                  userRole === 'broker' ? 'Broker license verification' : 
                  'Business license verification'}
              </li>
            </ul>
          </div>
        );
        
      case 'face':
        return (
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Facial Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please look directly at the camera and follow the instructions.
            </p>
            
            <div className="relative bg-gray-800 h-64 w-full max-w-sm mx-auto rounded-lg overflow-hidden mb-4">
              {cameraActive && faceStatus === 'pending' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 border-4 border-primary-400 rounded-full"></div>
                  {countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl text-white font-bold">{countdown}</span>
                    </div>
                  )}
                </div>
              )}
              
              {faceStatus === 'in_progress' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              
              {faceStatus === 'verified' && (
                <div className="absolute inset-0 flex items-center justify-center bg-green-900 bg-opacity-50">
                  <div className="bg-white rounded-full p-3">
                    <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              
              {faceStatus === 'failed' && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-50">
                  <div className="bg-white rounded-full p-3">
                    <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            {faceStatus === 'verified' && (
              <div className="bg-green-50 p-3 rounded-md border border-green-100 mb-4">
                <p className="text-sm text-green-800 font-medium">Facial verification successful!</p>
              </div>
            )}
            
            {faceStatus === 'failed' && (
              <div className="bg-red-50 p-3 rounded-md border border-red-100 mb-4">
                <p className="text-sm text-red-800">Verification failed. Please ensure proper lighting and that your face is clearly visible.</p>
              </div>
            )}
          </div>
        );
        
      case 'document':
        return (
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Verification</h3>
            <p className="text-sm text-gray-600 mb-4">
              {userRole === 'borrower' ? 'Please upload or scan your government-issued ID and proof of address.' : 
               userRole === 'lender' ? 'Please upload your financial institution credentials and license.' : 
               userRole === 'broker' ? 'Please upload your broker license and certification.' : 
               'Please upload your business license and vendor credentials.'}
            </p>
            
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
              {documentStatus === 'pending' && (
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-500">
                    Drag and drop files here or <span className="text-primary-600">click to upload</span>
                  </p>
                </div>
              )}
              
              {documentStatus === 'in_progress' && (
                <div className="text-center">
                  <div className="mx-auto mb-2 animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
                  <p className="text-sm text-gray-600">Processing documents...</p>
                </div>
              )}
              
              {documentStatus === 'verified' && (
                <div className="text-center">
                  <div className="rounded-full bg-green-100 p-2 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-green-800">Documents verified successfully</p>
                </div>
              )}
              
              {documentStatus === 'failed' && (
                <div className="text-center">
                  <div className="rounded-full bg-red-100 p-2 mx-auto w-16 h-16 flex items-center justify-center mb-2">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-red-800">Document verification failed</p>
                </div>
              )}
            </div>
            
            {documentStatus === 'verified' && (
              <div className="bg-green-50 p-3 rounded-md border border-green-100 mb-4">
                <p className="text-sm text-green-800">All required documents have been verified successfully!</p>
              </div>
            )}
            
            {documentStatus === 'failed' && (
              <div className="bg-red-50 p-3 rounded-md border border-red-100 mb-4">
                <p className="text-sm text-red-800">
                  Document verification failed. Please ensure all documents are clear and valid.
                </p>
              </div>
            )}
          </div>
        );
        
      case 'final':
        return (
          <div className="text-center">
            <div className="rounded-full bg-green-100 p-3 mx-auto w-20 h-20 flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">Verification Complete!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your identity has been successfully verified. You can now proceed with closing the transaction.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Verification Details:</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Verification ID:</span>
                  <span className="font-medium">KYC-{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="font-medium">{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Role Verified:</span>
                  <span className="font-medium capitalize">{userRole}</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render footer with action buttons
  const renderFooter = () => (
    <div className="border-t border-gray-200 p-4 flex justify-between">
      {step === 'intro' ? (
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      ) : step === 'final' ? (
        <div></div>
      ) : (
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={processing}
        >
          Cancel
        </button>
      )}
      
      {step === 'final' ? (
        <button
          onClick={onClose}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Close
        </button>
      ) : faceStatus === 'failed' || documentStatus === 'failed' ? (
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          disabled={processing}
        >
          Retry
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          disabled={
            (step === 'face' && faceStatus !== 'verified') || 
            (step === 'document' && documentStatus !== 'verified') ||
            processing
          }
        >
          {processing ? 'Processing...' : 'Continue'}
        </button>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-10 relative overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary-700">Biometric KYC Verification</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {renderStepIndicator()}
          {renderContent()}
        </div>
        
        {renderFooter()}
      </div>
    </div>
  );
};

export default BiometricKYC; 