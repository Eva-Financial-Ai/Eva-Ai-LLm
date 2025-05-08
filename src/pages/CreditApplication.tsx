import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import CreditApplicationForm from '../components/CreditApplicationForm';
import PortfolioNavigator from '../components/blockchain/PortfolioNavigator';
import { useWorkflow } from '../contexts/WorkflowContext';
import { UserContext } from '../contexts/UserContext';
import TopNavigation from '../components/layout/TopNavigation';
import BorrowerSelector, { Borrower } from '../components/BorrowerSelector';
import ShareApplicationModal from '../components/ShareApplicationModal';
import SharedApplicationTracker from '../components/SharedApplicationTracker';
import CreditApplicationNav from '../components/layout/CreditApplicationNav';

const CreditApplication: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const { advanceStage } = useWorkflow();
  const { userRole } = useContext(UserContext) as { userRole: string };
  const [showBlockchainTools, setShowBlockchainTools] = useState(false);
  
  // Add new state for pre-filling and sharing application
  const [showBorrowerSelector, setShowBorrowerSelector] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState<'new' | 'existing'>('new');

  // Check for prefill mode in URL params and show borrower selector if needed
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    
    if (mode === 'prefill') {
      setShowBorrowerSelector(true);
    }
  }, [location.search]);

  // Add event listener for prefill button in the form
  useEffect(() => {
    const handlePrefillRequest = () => {
      setShowBorrowerSelector(true);
    };
    
    document.addEventListener('prefill-borrower-requested', handlePrefillRequest);
    
    // Clean up
    return () => {
      document.removeEventListener('prefill-borrower-requested', handlePrefillRequest);
    };
  }, []);

  // Add listener for business type changes
  useEffect(() => {
    const handleBusinessTypeChange = (e: CustomEvent) => {
      setBusinessType(e.detail.type);
      
      // If type is "existing", automatically show the borrower selector
      if (e.detail.type === 'existing') {
        setShowBorrowerSelector(true);
      }
    };
    
    // Add event listener for business type changes from CreditApplicationForm
    document.addEventListener('business-type-changed', handleBusinessTypeChange as EventListener);
    
    return () => {
      document.removeEventListener('business-type-changed', handleBusinessTypeChange as EventListener);
    };
  }, []);

  const handleApplicationSubmit = (data: any) => {
    setTransactionId(data.transactionId);
    setSignatureData(data.signature || null);
    setSubmitted(true);
    setApplicationData(data);
    
    // Show blockchain tools after submission for brokers and lenders
    if (userRole === 'broker' || userRole === 'lender') {
      setShowBlockchainTools(true);
    } else {
      // For borrowers, automatically advance to risk assessment
      setTimeout(() => {
        if (data.transactionId) {
          advanceStage(data.transactionId, 'risk_assessment');
          navigate('/risk-assessment');
        }
      }, 1000);
    }
  };

  const handleVerificationComplete = (result: any) => {
    // After blockchain verification, proceed to risk assessment
    if (transactionId) {
      advanceStage(transactionId, 'risk_assessment');
      setTimeout(() => navigate('/risk-assessment'), 1500);
    }
  };
  
  // Add handler for selecting a borrower to pre-fill the form
  const handleBorrowerSelect = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
    setShowBorrowerSelector(false);
    setBusinessType('existing');
    
    // Convert borrower data to application format with more comprehensive pre-fill data
    const preFillData = {
      businessName: borrower.businessName,
      taxId: borrower.taxId,
      businessType: 'existing_business', // Set business type to existing
      businessAddress: borrower.address || '',
      businessCity: borrower.city || '',
      businessState: borrower.state || '',
      businessZip: borrower.zipCode || '',
      businessPhoneNumber: borrower.phone || '',
      businessEmail: borrower.email || '',
      owners: [{
        id: 'owner-primary',
        type: borrower.type === 'business' ? 'individual' : borrower.type,
        name: borrower.contactName,
        email: borrower.email,
        phone: borrower.phone,
        ownershipPercentage: '100',
        isComplete: false,
        notificationSent: false
      }]
    };
    
    setApplicationData(preFillData);
    
    // Add a small delay to ensure the component is fully rendered before dispatching event
    setTimeout(() => {
      // Dispatch a custom event to CreditApplicationForm to set businessType to 'existing'
      const event = new CustomEvent('set-business-existing', {
        detail: { 
          businessName: borrower.businessName,
          taxId: borrower.taxId
        }
      });
      document.dispatchEvent(event);
    }, 200);
  };
  
  // Handle sharing application with selected recipients
  const handleShareApplication = (recipients: any[], message: string, expirationDays: number) => {
    // In a real implementation, this would call an API to send the shared application
    console.log('Sharing application with:', recipients);
    console.log('Message:', message);
    console.log('Expiration days:', expirationDays);
    
    // Show success message
    const recipientNames = recipients.map(r => r.name).join(', ');
    setShareSuccess(`Application shared successfully with ${recipientNames}. They will receive an email with a link to complete the application.`);
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShareSuccess(null);
    }, 5000);
  };

  // Enhance the Pre-fill button display
  const renderPreFillButton = () => {
    return (
      <button
        onClick={() => setShowBorrowerSelector(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Pre-fill from Existing Borrower
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <TopNavigation title="Credit Application" />
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Credit Application</h1>
      <p className="text-gray-600 mb-6">Complete the form below to begin the credit application process</p>
      
      {/* Action buttons for pre-filling and sharing - Enhanced UI */}
      <div className="flex flex-wrap gap-3 mb-6">
        {!submitted && renderPreFillButton()}
        
        {submitted && applicationData && (
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Application
          </button>
        )}
        
        {selectedBorrower && (
          <div className="flex items-center bg-blue-50 px-4 py-2 rounded-md border border-blue-200 text-blue-700 text-sm">
            <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Pre-filled with <span className="font-medium ml-1">Existing Business:</span> <span className="font-medium ml-1">{selectedBorrower.businessName}</span>
            <button 
              onClick={() => setSelectedBorrower(null)} 
              className="ml-2 text-blue-500 hover:text-blue-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Share success message */}
      {shareSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{shareSuccess}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Navigation - New Component */}
        <div className="lg:col-span-1">
          <CreditApplicationNav activeSection="credit-application" />
          
          {/* Additional info panel */}
          {!submitted && !showBlockchainTools && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-medium text-blue-800 mb-2">Application Information</h3>
              <p className="text-sm text-blue-600 mb-4">
                This credit application form will be processed through our secure system and verified 
                against multiple data sources.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-sm">Your data is encrypted and securely stored</p>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">Save and resume your application at any time</p>
                </div>
                
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">Get faster decisions with our AI-powered process</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Blockchain tools section when relevant */}
          {showBlockchainTools && transactionId && signatureData && (
            <div className="mt-6">
              <PortfolioNavigator 
                documentId={transactionId}
                signatureData={signatureData}
                onVerify={handleVerificationComplete}
              />
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className={`${submitted ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
          {!submitted ? (
            <CreditApplicationForm 
              onSubmit={handleApplicationSubmit} 
              initialData={applicationData || {}}
              businessType={businessType}
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <svg className="h-8 w-8 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-xl font-bold text-gray-900">Application Submitted Successfully</h2>
                </div>
                <p className="mb-4 text-gray-600">Your application has been submitted and is being processed. You can share this application with brokers, originators, or other parties using the "Share Application" button above.</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => navigate('/risk-assessment')}
                    className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                  >
                    Continue to Risk Assessment
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Edit Application
                  </button>
                </div>
              </div>
              
              {/* Shared Application Tracker */}
              {transactionId && (
                <SharedApplicationTracker applicationId={transactionId} />
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Borrower Selector Modal with manual close button */}
      {showBorrowerSelector && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-medium text-gray-900">Select Existing Business</h2>
              <button
                onClick={() => setShowBorrowerSelector(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <BorrowerSelector onSelect={handleBorrowerSelect} />
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      {showShareModal && (
        <ShareApplicationModal
          isOpen={showShareModal}
          onShare={handleShareApplication}
          onClose={() => setShowShareModal(false)}
          applicationId={transactionId || ""}
        />
      )}
    </div>
  );
};

export default CreditApplication; 