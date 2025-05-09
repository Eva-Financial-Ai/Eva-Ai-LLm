import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Types for credit application data
interface CreditApplication {
  id: string;
  applicantName: string;
  businessName: string;
  requestedAmount: number;
  purpose: string;
  term: number;
  industry: string;
  annualRevenue: number;
  creditScore: number;
  timeInBusiness: number;
  submittedDate: string;
  status: 'draft' | 'submitted' | 'validated' | 'approved' | 'rejected' | 'on-chain';
  blockchainTxId?: string;
  blockchainStatus?: 'pending' | 'confirmed' | 'failed';
  documentsComplete?: boolean;
}

// Smart Match profile type
interface SmartMatchProfile {
  id: string;
  name: string;
  type: 'lender' | 'borrower' | 'broker';
  creditScore?: number;
  industry?: string;
  loanSize: {
    min: number;
    max: number;
  };
  interestRate?: number;
  location: string;
  matchScore: number;
}

interface CreditApplicationBlockchainProps {
  isOpen: boolean;
  onClose: () => void;
  initialApplication?: Partial<CreditApplication>;
  mode: 'create' | 'view' | 'edit';
}

// User role and mode types
type UserRole = 'lender' | 'broker' | 'borrower';
type OperationMode = 'send' | 'receive';

const CreditApplicationBlockchain: React.FC<CreditApplicationBlockchainProps> = ({
  isOpen,
  onClose,
  initialApplication,
  mode,
}) => {
  const navigate = useNavigate();

  // Add user role and mode state
  const [userRole, setUserRole] = useState<UserRole>('borrower');
  const [operationMode, setOperationMode] = useState<OperationMode>('send');

  // Smart matching state
  const [isSmartMatchingAvailable, setIsSmartMatchingAvailable] = useState(false);
  const [showSmartMatching, setShowSmartMatching] = useState(false);
  const [smartMatches, setSmartMatches] = useState<SmartMatchProfile[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Form state
  const [application, setApplication] = useState<CreditApplication>({
    id: initialApplication?.id || `app-${Date.now()}`,
    applicantName: initialApplication?.applicantName || '',
    businessName: initialApplication?.businessName || '',
    requestedAmount: initialApplication?.requestedAmount || 0,
    purpose: initialApplication?.purpose || '',
    term: initialApplication?.term || 36,
    industry: initialApplication?.industry || '',
    annualRevenue: initialApplication?.annualRevenue || 0,
    creditScore: initialApplication?.creditScore || 680,
    timeInBusiness: initialApplication?.timeInBusiness || 0,
    submittedDate: initialApplication?.submittedDate || new Date().toISOString(),
    status: initialApplication?.status || 'draft',
    blockchainTxId: initialApplication?.blockchainTxId,
    blockchainStatus: initialApplication?.blockchainStatus,
    documentsComplete: initialApplication?.documentsComplete || false,
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [blockchainStatus, setBlockchainStatus] = useState<{
    isProcessing: boolean;
    message: string;
    success?: boolean;
  }>({
    isProcessing: false,
    message: '',
  });

  // Check if application is eligible for smart matching
  useEffect(() => {
    // Application must be confirmed on blockchain and documents must be complete
    const isEligible =
      application.status === 'on-chain' &&
      application.blockchainStatus === 'confirmed' &&
      application.documentsComplete === true;

    setIsSmartMatchingAvailable(isEligible);
  }, [application]);

  // Form change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setApplication(prev => ({
      ...prev,
      [name]:
        name === 'requestedAmount' ||
        name === 'annualRevenue' ||
        name === 'creditScore' ||
        name === 'term' ||
        name === 'timeInBusiness'
          ? Number(value)
          : value,
    }));
  };

  // Change role handler
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
  };

  // Change mode handler
  const handleModeChange = (mode: OperationMode) => {
    setOperationMode(mode);
  };

  // Smart matching handler
  const handleSmartMatching = () => {
    setIsLoadingMatches(true);
    setShowSmartMatching(true);

    // Mock API call to get smart matches
    setTimeout(() => {
      // Generate matches based on the user role
      const mockMatches: SmartMatchProfile[] =
        userRole === 'lender' ? generateMockBorrowerMatches() : generateMockLenderMatches();

      setSmartMatches(mockMatches);
      setIsLoadingMatches(false);
    }, 1500);
  };

  // Mock data generators
  const generateMockLenderMatches = (): SmartMatchProfile[] => {
    return [
      {
        id: 'lender-1',
        name: 'First Capital Bank',
        type: 'lender',
        loanSize: { min: 50000, max: 500000 },
        interestRate: 5.25,
        location: 'New York, NY',
        industry: 'Banking',
        matchScore: 92,
      },
      {
        id: 'lender-2',
        name: 'Commercial Growth Partners',
        type: 'lender',
        loanSize: { min: 100000, max: 2000000 },
        interestRate: 6.75,
        location: 'Chicago, IL',
        industry: 'Investment',
        matchScore: 87,
      },
      {
        id: 'lender-3',
        name: 'West Coast Credit Union',
        type: 'lender',
        loanSize: { min: 25000, max: 750000 },
        interestRate: 4.85,
        location: 'San Francisco, CA',
        industry: 'Credit Union',
        matchScore: 85,
      },
      {
        id: 'lender-4',
        name: 'Regional Enterprise Fund',
        type: 'lender',
        loanSize: { min: 75000, max: 1000000 },
        interestRate: 5.5,
        location: 'Atlanta, GA',
        industry: 'Finance',
        matchScore: 79,
      },
      {
        id: 'lender-5',
        name: 'Innovation Capital LLC',
        type: 'lender',
        loanSize: { min: 200000, max: 5000000 },
        interestRate: 7.25,
        location: 'Boston, MA',
        industry: 'Venture Capital',
        matchScore: 72,
      },
    ];
  };

  const generateMockBorrowerMatches = (): SmartMatchProfile[] => {
    return [
      {
        id: 'borrower-1',
        name: 'Tech Innovations Inc.',
        type: 'borrower',
        creditScore: 750,
        industry: 'Technology',
        loanSize: { min: 150000, max: 500000 },
        location: 'Austin, TX',
        matchScore: 95,
      },
      {
        id: 'borrower-2',
        name: 'Greenfield Manufacturing',
        type: 'borrower',
        creditScore: 710,
        industry: 'Manufacturing',
        loanSize: { min: 300000, max: 750000 },
        location: 'Detroit, MI',
        matchScore: 89,
      },
      {
        id: 'borrower-3',
        name: 'HealthServe Medical Group',
        type: 'borrower',
        creditScore: 780,
        industry: 'Healthcare',
        loanSize: { min: 400000, max: 1200000 },
        location: 'Minneapolis, MN',
        matchScore: 84,
      },
      {
        id: 'borrower-4',
        name: 'Urban Property Developers',
        type: 'borrower',
        creditScore: 690,
        industry: 'Real Estate',
        loanSize: { min: 500000, max: 2000000 },
        location: 'Miami, FL',
        matchScore: 79,
      },
      {
        id: 'borrower-5',
        name: 'Fresh Farm Distributors',
        type: 'borrower',
        creditScore: 720,
        industry: 'Food & Beverage',
        loanSize: { min: 100000, max: 400000 },
        location: 'Portland, OR',
        matchScore: 75,
      },
    ];
  };

  // Mark documents as complete (would be triggered by actual document system)
  const markDocumentsComplete = () => {
    setApplication(prev => ({
      ...prev,
      documentsComplete: true,
    }));
  };

  // Validate form based on current step
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!application.applicantName) errors.applicantName = 'Applicant name is required';
      if (!application.businessName) errors.businessName = 'Business name is required';
      if (application.requestedAmount <= 0)
        errors.requestedAmount = 'Amount must be greater than 0';
      if (!application.purpose) errors.purpose = 'Purpose is required';
    } else if (currentStep === 2) {
      if (!application.industry) errors.industry = 'Industry is required';
      if (application.annualRevenue <= 0)
        errors.annualRevenue = 'Annual revenue must be greater than 0';
      if (application.timeInBusiness < 0)
        errors.timeInBusiness = 'Time in business cannot be negative';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCurrentStep()) return;

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Final submission
    setIsSubmitting(true);

    try {
      // First, save to regular database
      const updatedApplication = {
        ...application,
        status: 'submitted' as const,
        submittedDate: new Date().toISOString(),
      };

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state
      setApplication(updatedApplication);

      // Submit to blockchain
      await submitToBlockchain(updatedApplication);

      // Success - close modal or redirect
      setTimeout(() => {
        onClose();
        // Optionally redirect to a success page or view application page
        navigate(`/lifecycle-assistant/applications/${updatedApplication.id}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit application:', error);
      setBlockchainStatus({
        isProcessing: false,
        message: 'Failed to submit application. Please try again.',
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit application to blockchain
  const submitToBlockchain = async (applicationData: CreditApplication) => {
    setBlockchainStatus({
      isProcessing: true,
      message: 'Submitting to blockchain...',
    });

    try {
      // Mock blockchain submission - replace with actual blockchain API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock transaction ID
      const txId = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      // Update application with blockchain info
      setApplication(prev => ({
        ...prev,
        blockchainTxId: txId,
        blockchainStatus: 'pending',
        status: 'on-chain' as const,
      }));

      setBlockchainStatus({
        isProcessing: false,
        message: 'Successfully submitted to blockchain',
        success: true,
      });

      // In real implementation, listen for blockchain confirmation event
      setTimeout(() => {
        setApplication(prev => ({
          ...prev,
          blockchainStatus: 'confirmed',
        }));
      }, 5000);

      return txId;
    } catch (error) {
      console.error('Blockchain submission failed:', error);
      setBlockchainStatus({
        isProcessing: false,
        message: 'Blockchain submission failed. Application saved to database only.',
        success: false,
      });
      throw error;
    }
  };

  // Query application from blockchain by ID
  const queryApplicationFromBlockchain = async (applicationId: string) => {
    setBlockchainStatus({
      isProcessing: true,
      message: 'Querying application from blockchain...',
    });

    try {
      // Mock blockchain query - replace with actual blockchain API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In real implementation, this would return actual blockchain data
      setBlockchainStatus({
        isProcessing: false,
        message: 'Application data retrieved from blockchain',
        success: true,
      });

      // Return mock data (in real implementation, this would be the blockchain response)
      return {
        id: applicationId,
        blockchainConfirmed: true,
        blockTimestamp: new Date().toISOString(),
        // Other blockchain-specific data
      };
    } catch (error) {
      console.error('Blockchain query failed:', error);
      setBlockchainStatus({
        isProcessing: false,
        message: 'Failed to retrieve application from blockchain',
        success: false,
      });
      throw error;
    }
  };

  // Validate application against business rules
  const validateApplication = () => {
    // Example validation rules
    const validationResults = {
      creditScoreCheck: application.creditScore >= 650,
      revenueSufficient: application.annualRevenue >= application.requestedAmount * 0.5,
      termAppropriate: application.term <= 84 && application.term >= 12,
      timeInBusinessSufficient: application.timeInBusiness >= 2,
    };

    const isPassing = Object.values(validationResults).every(result => result === true);

    setApplication(prev => ({
      ...prev,
      status: isPassing ? ('approved' as const) : ('rejected' as const),
    }));

    return {
      isPassing,
      results: validationResults,
    };
  };

  // Reset form
  const resetForm = () => {
    setApplication({
      id: `app-${Date.now()}`,
      applicantName: '',
      businessName: '',
      requestedAmount: 0,
      purpose: '',
      term: 36,
      industry: '',
      annualRevenue: 0,
      creditScore: 680,
      timeInBusiness: 0,
      submittedDate: new Date().toISOString(),
      status: 'draft' as const,
    });
    setCurrentStep(1);
    setValidationErrors({});
    setBlockchainStatus({
      isProcessing: false,
      message: '',
    });
  };

  // Close handler with confirmation if needed
  const handleClose = () => {
    if (
      application.status === 'draft' &&
      (application.applicantName ||
        application.businessName ||
        application.requestedAmount > 0 ||
        application.purpose)
    ) {
      // Show confirmation dialog
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Define role-specific UI elements and functionality
  const getRoleSpecificContent = () => {
    switch (userRole) {
      case 'lender':
        return {
          title:
            operationMode === 'send' ? 'Lender - Send Application' : 'Lender - Review Applications',
          actionButton: operationMode === 'send' ? 'Send to Borrower' : 'Approve Application',
          fields:
            operationMode === 'send'
              ? ['term', 'requestedAmount', 'purpose']
              : ['creditScore', 'industry', 'annualRevenue'],
          description:
            operationMode === 'send'
              ? 'Create and send a loan offer to a potential borrower'
              : 'Review and approve incoming loan applications',
        };
      case 'broker':
        return {
          title:
            operationMode === 'send' ? 'Broker - Send to Lender' : 'Broker - Forward to Borrower',
          actionButton: operationMode === 'send' ? 'Submit to Lender' : 'Forward to Borrower',
          fields:
            operationMode === 'send'
              ? ['applicantName', 'creditScore', 'requestedAmount']
              : ['term', 'purpose', 'industry'],
          description:
            operationMode === 'send'
              ? 'Submit loan application to available lenders'
              : 'Forward loan offers to borrowers',
        };
      case 'borrower':
      default:
        return {
          title:
            operationMode === 'send' ? 'Borrower - Loan Application' : 'Borrower - Review Offers',
          actionButton: operationMode === 'send' ? 'Submit Application' : 'Accept Offer',
          fields:
            operationMode === 'send'
              ? ['applicantName', 'businessName', 'requestedAmount', 'purpose']
              : ['term', 'annualRevenue', 'timeInBusiness'],
          description:
            operationMode === 'send'
              ? 'Apply for a loan by submitting your information'
              : 'Review and accept loan offers from lenders',
        };
    }
  };

  const roleSpecificContent = getRoleSpecificContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />

      {/* Main modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-primary-700">
            {showSmartMatching ? 'Smart Matching Results' : roleSpecificContent.title}

            {!showSmartMatching && application.status !== 'draft' && (
              <span
                className={`ml-3 px-2 py-1 text-xs rounded-full ${
                  application.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : application.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : application.status === 'on-chain'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                }`}
              >
                {application.status.toUpperCase()}
              </span>
            )}

            {application.documentsComplete && (
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                DOCS COMPLETE
              </span>
            )}
          </h2>
          <button onClick={handleClose} className="rounded-full p-1 hover:bg-gray-100">
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

        {/* Smart Matching Results */}
        {showSmartMatching ? (
          <div className="p-5 overflow-y-auto">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Commercial Paper Matching Results</h3>
                <button
                  onClick={() => setShowSmartMatching(false)}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Back to Application
                </button>
              </div>

              {isLoadingMatches ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Finding optimal matches...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-700"
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
                      <div>
                        <h4 className="font-medium text-blue-800">Smart Matching Insights</h4>
                        <p className="text-sm text-blue-600 mt-1">
                          {userRole === 'lender'
                            ? 'We found 5 high-quality borrower matches based on your lending criteria and risk profile.'
                            : 'We found 5 lenders that closely match your financing needs and business profile.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {smartMatches.map(match => (
                      <div
                        key={match.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium text-lg">{match.name}</h4>
                              <div
                                className={`ml-3 px-2 py-1 text-xs rounded-full ${
                                  match.matchScore >= 90
                                    ? 'bg-green-100 text-green-800'
                                    : match.matchScore >= 80
                                      ? 'bg-blue-100 text-blue-800'
                                      : match.matchScore >= 70
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {match.matchScore}% Match
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {match.location} • {match.industry}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {match.type === 'lender'
                                ? `${match.interestRate}% Interest Rate`
                                : `Credit Score: ${match.creditScore}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              Loan Size: ${match.loanSize.min.toLocaleString()} - $
                              {match.loanSize.max.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                            View Profile
                          </button>
                          <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700">
                            {match.type === 'lender' ? 'Apply Now' : 'Contact Borrower'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Role & Mode Selectors */}
            <div className="bg-gray-50 px-5 py-3 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{roleSpecificContent.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Role selector */}
                  <div className="flex items-center rounded-md border border-gray-300 bg-white">
                    <button
                      onClick={() => handleRoleChange('borrower')}
                      className={`px-3 py-1 text-sm rounded-l-md ${userRole === 'borrower' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                      Borrower
                    </button>
                    <button
                      onClick={() => handleRoleChange('broker')}
                      className={`px-3 py-1 text-sm ${userRole === 'broker' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                      Broker
                    </button>
                    <button
                      onClick={() => handleRoleChange('lender')}
                      className={`px-3 py-1 text-sm rounded-r-md ${userRole === 'lender' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                      Lender
                    </button>
                  </div>

                  {/* Mode selector */}
                  <div className="flex items-center rounded-md border border-gray-300 bg-white">
                    <button
                      onClick={() => handleModeChange('send')}
                      className={`px-3 py-1 text-sm rounded-l-md ${operationMode === 'send' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                      Send
                    </button>
                    <button
                      onClick={() => handleModeChange('receive')}
                      className={`px-3 py-1 text-sm rounded-r-md ${operationMode === 'receive' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
                    >
                      Receive
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Matching Banner - show when eligible */}
            {isSmartMatchingAvailable && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center mb-3 sm:mb-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mr-3"
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
                    <div>
                      <h3 className="font-bold text-lg">Smart Matching Available</h3>
                      <p className="text-sm text-blue-100">
                        Your application is ready for commercial paper matching!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSmartMatching}
                    className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50"
                  >
                    Find Matches
                  </button>
                </div>
              </div>
            )}

            {/* Document Status Simulation (normally would be triggered by document system) */}
            {application.status === 'on-chain' && !application.documentsComplete && (
              <div className="bg-yellow-50 px-5 py-3 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-yellow-800">
                      Waiting for documents to be verified
                    </span>
                  </div>
                  <button
                    onClick={markDocumentsComplete}
                    className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Simulate Document Completion
                  </button>
                </div>
              </div>
            )}

            {/* Progress indicator - only for Send mode */}
            {operationMode === 'send' && (
              <div className="px-5 pt-5">
                <div className="flex items-center justify-between mb-4">
                  {['Applicant Info', 'Business Details', 'Review & Submit'].map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          currentStep > index + 1
                            ? 'bg-green-500 text-white'
                            : currentStep === index + 1
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {currentStep > index + 1 ? (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-xs mt-1">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Receive mode content */}
            {operationMode === 'receive' && (
              <div className="p-5 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Received Applications</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    {userRole === 'lender' ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(item => (
                          <div key={item} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">
                                  Small Business Loan - $
                                  {(Math.random() * 100000 + 50000).toFixed(0)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Business Name: Acme Corp {item}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Credit Score: {Math.floor(Math.random() * 200) + 650}
                                </p>
                              </div>
                              <div>
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                  Pending Review
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded mr-2">
                                Approve
                              </button>
                              <button className="px-3 py-1 text-sm bg-red-600 text-white rounded">
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : userRole === 'broker' ? (
                      <div className="space-y-4">
                        {[1, 2].map(item => (
                          <div key={item} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">Loan Offer from FirstCapital Bank</h4>
                                <p className="text-sm text-gray-600">
                                  Amount: ${(Math.random() * 100000 + 50000).toFixed(0)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Term: {Math.floor(Math.random() * 36) + 24} months
                                </p>
                              </div>
                              <div>
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                  Ready to Forward
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button className="px-3 py-1 text-sm bg-primary-600 text-white rounded">
                                Forward to Client
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[1, 2, 3].map(item => (
                          <div key={item} className="border rounded-lg p-4 bg-white">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">Loan Offer #{item}</h4>
                                <p className="text-sm text-gray-600">
                                  Lender:{' '}
                                  {['FirstBank', 'Capital Funding', 'Credit Union'][item - 1]}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Amount: ${(Math.random() * 100000 + 50000).toFixed(0)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Rate: {(Math.random() * 5 + 3).toFixed(2)}%
                                </p>
                              </div>
                              <div>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  Offer Available
                                </span>
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded mr-2">
                                Accept
                              </button>
                              <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded">
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Form content - only for Send mode */}
            {operationMode === 'send' && (
              <div className="p-5 overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Applicant Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Applicant Name
                          </label>
                          <input
                            type="text"
                            name="applicantName"
                            value={application.applicantName}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              validationErrors.applicantName ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                            disabled={mode === 'view' || isSubmitting}
                          />
                          {validationErrors.applicantName && (
                            <p className="mt-1 text-sm text-red-600">
                              {validationErrors.applicantName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Business Name
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={application.businessName}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              validationErrors.businessName ? 'border-red-500' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                            disabled={mode === 'view' || isSubmitting}
                          />
                          {validationErrors.businessName && (
                            <p className="mt-1 text-sm text-red-600">
                              {validationErrors.businessName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Requested Amount ($)
                          </label>
                          <input
                            type="number"
                            name="requestedAmount"
                            value={application.requestedAmount}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border ${
                              validationErrors.requestedAmount
                                ? 'border-red-500'
                                : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                            disabled={mode === 'view' || isSubmitting}
                          />
                          {validationErrors.requestedAmount && (
                            <p className="mt-1 text-sm text-red-600">
                              {validationErrors.requestedAmount}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Term (Months)
                          </label>
                          <input
                            type="number"
                            name="term"
                            value={application.term}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            disabled={mode === 'view' || isSubmitting}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loan Purpose
                        </label>
                        <textarea
                          name="purpose"
                          value={application.purpose}
                          onChange={handleChange}
                          rows={3}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            validationErrors.purpose ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          disabled={mode === 'view' || isSubmitting}
                        />
                        {validationErrors.purpose && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.purpose}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Business Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Industry</label>
                        <select
                          name="industry"
                          value={application.industry}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            validationErrors.industry ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          disabled={mode === 'view' || isSubmitting}
                        >
                          <option value="">Select Industry</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Technology">Technology</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Construction">Construction</option>
                          <option value="Retail">Retail</option>
                          <option value="Energy">Energy</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Finance">Finance</option>
                          <option value="Other">Other</option>
                        </select>
                        {validationErrors.industry && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.industry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Annual Revenue ($)
                        </label>
                        <input
                          type="number"
                          name="annualRevenue"
                          value={application.annualRevenue}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            validationErrors.annualRevenue ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          disabled={mode === 'view' || isSubmitting}
                        />
                        {validationErrors.annualRevenue && (
                          <p className="mt-1 text-sm text-red-600">
                            {validationErrors.annualRevenue}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Business Credit Score
                        </label>
                        <input
                          type="number"
                          name="creditScore"
                          value={application.creditScore}
                          onChange={handleChange}
                          min="300"
                          max="850"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          disabled={mode === 'view' || isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Time in Business (Years)
                        </label>
                        <input
                          type="number"
                          name="timeInBusiness"
                          value={application.timeInBusiness}
                          onChange={handleChange}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            validationErrors.timeInBusiness ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                          disabled={mode === 'view' || isSubmitting}
                        />
                        {validationErrors.timeInBusiness && (
                          <p className="mt-1 text-sm text-red-600">
                            {validationErrors.timeInBusiness}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Application Summary
                        </h3>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-gray-700">Applicant Information</h4>
                            <p className="mt-1">
                              <span className="text-gray-500">Applicant Name:</span>{' '}
                              {application.applicantName}
                            </p>
                            <p>
                              <span className="text-gray-500">Business Name:</span>{' '}
                              {application.businessName}
                            </p>
                            <p>
                              <span className="text-gray-500">Loan Amount:</span> $
                              {application.requestedAmount.toLocaleString()}
                            </p>
                            <p>
                              <span className="text-gray-500">Term:</span> {application.term} months
                            </p>
                            <p>
                              <span className="text-gray-500">Purpose:</span> {application.purpose}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-700">Business Details</h4>
                            <p className="mt-1">
                              <span className="text-gray-500">Industry:</span>{' '}
                              {application.industry}
                            </p>
                            <p>
                              <span className="text-gray-500">Annual Revenue:</span> $
                              {application.annualRevenue.toLocaleString()}
                            </p>
                            <p>
                              <span className="text-gray-500">Credit Score:</span>{' '}
                              {application.creditScore}
                            </p>
                            <p>
                              <span className="text-gray-500">Time in Business:</span>{' '}
                              {application.timeInBusiness} years
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">
                          Blockchain Storage
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          This application will be securely stored on our private blockchain
                          network. This provides:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>Immutable record of your application</li>
                          <li>Secure, tamper-proof storage</li>
                          <li>Transparent audit trail</li>
                          <li>Enhanced security for your sensitive financial data</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </form>

                {/* Blockchain status message */}
                {blockchainStatus.message && (
                  <div
                    className={`mt-4 p-3 rounded-md ${
                      blockchainStatus.success === true
                        ? 'bg-green-50 text-green-800'
                        : blockchainStatus.success === false
                          ? 'bg-red-50 text-red-800'
                          : 'bg-blue-50 text-blue-800'
                    }`}
                  >
                    <div className="flex items-center">
                      {blockchainStatus.isProcessing ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
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
                      ) : blockchainStatus.success === true ? (
                        <svg
                          className="h-5 w-5 mr-2 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 mr-2 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span>{blockchainStatus.message}</span>
                    </div>

                    {application.blockchainTxId && (
                      <div className="mt-2 text-xs">
                        <p>
                          Transaction ID:{' '}
                          <span className="font-mono">{application.blockchainTxId}</span>
                        </p>
                        <p className="mt-1">Status: {application.blockchainStatus}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Footer with buttons */}
        <div className="p-5 border-t flex justify-between items-center">
          {showSmartMatching ? (
            <button
              type="button"
              onClick={() => setShowSmartMatching(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Application
            </button>
          ) : operationMode === 'send' && currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Back
            </button>
          ) : (
            <div></div> // Spacer
          )}

          <div className="flex space-x-3">
            {!showSmartMatching && isSmartMatchingAvailable && (
              <button
                type="button"
                onClick={handleSmartMatching}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Find Matches
              </button>
            )}

            {!showSmartMatching && operationMode === 'send' && mode !== 'view' && (
              <button
                type="button"
                onClick={
                  currentStep < 3
                    ? () => validateCurrentStep() && setCurrentStep(prev => prev + 1)
                    : handleSubmit
                }
                className={`px-4 py-2 rounded-lg ${
                  currentStep < 3
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
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
                ) : currentStep < 3 ? (
                  'Continue'
                ) : (
                  roleSpecificContent.actionButton
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditApplicationBlockchain;
