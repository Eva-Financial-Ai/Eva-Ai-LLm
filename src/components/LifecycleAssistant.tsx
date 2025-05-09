import React, { useState, useEffect } from 'react';
import CreditApplicationBlockchain from './CreditApplicationBlockchain';

// Types
interface Document {
  id: string;
  name: string;
  type: string;
  status: 'received' | 'pending' | 'rejected' | 'approved';
  receivedDate?: string;
}

interface ApplicationStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface LifecycleAssistantProps {
  transactionId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const LifecycleAssistant: React.FC<LifecycleAssistantProps> = ({
  transactionId = 'TX-102',
  isOpen = true,
  onClose = () => {},
}) => {
  // State for application lifecycle
  const [currentStatus, setCurrentStatus] = useState<string>('document-collection');
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc1',
      name: 'Financial Statements',
      type: 'financial',
      status: 'received',
      receivedDate: new Date().toISOString(),
    },
    {
      id: 'doc2',
      name: 'Bank Statements',
      type: 'bank',
      status: 'received',
      receivedDate: new Date().toISOString(),
    },
    {
      id: 'doc3',
      name: 'Tax Returns',
      type: 'tax',
      status: 'received',
      receivedDate: new Date().toISOString(),
    },
  ]);

  const [steps, setSteps] = useState<ApplicationStep[]>([
    {
      id: 1,
      title: 'Proceed to credit assessment',
      description: 'Review financials and perform credit analysis',
      isCompleted: false,
    },
    {
      id: 2,
      title: 'Complete deal structuring and confirm terms with client',
      description: 'Establish loan terms, rates, and conditions',
      isCompleted: false,
    },
    {
      id: 3,
      title: 'Submit for final approval and prepare closing documents',
      description: 'Get final approval and generate necessary paperwork',
      isCompleted: false,
    },
  ]);

  // UI state
  const [showCreditApplication, setShowCreditApplication] = useState<boolean>(false);
  const [showBlockchainDetails, setShowBlockchainDetails] = useState<boolean>(false);
  const [applicationMode, setApplicationMode] = useState<'create' | 'view' | 'edit'>('create');

  // Mark a step as completed
  const completeStep = (stepId: number) => {
    setSteps(prevSteps =>
      prevSteps.map(step => (step.id === stepId ? { ...step, isCompleted: true } : step))
    );

    // If all steps are completed, change status to approved
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, isCompleted: true } : step
    );

    if (updatedSteps.every(step => step.isCompleted)) {
      setCurrentStatus('approved');
    } else if (stepId === 1) {
      setCurrentStatus('credit-assessment');
    } else if (stepId === 2) {
      setCurrentStatus('structuring');
    }
  };

  // Open credit application modal
  const handleOpenCreditApplication = (mode: 'create' | 'view' | 'edit' = 'create') => {
    setApplicationMode(mode);
    setShowCreditApplication(true);
  };

  // Close credit application modal
  const handleCloseCreditApplication = () => {
    setShowCreditApplication(false);
  };

  // Toggle blockchain details section
  const toggleBlockchainDetails = () => {
    setShowBlockchainDetails(prev => !prev);
  };

  // Simulated blockchain transaction data
  const blockchainData = {
    transactionId: '0x7a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    timestamp: new Date().toISOString(),
    status: 'confirmed',
    blockNumber: 12345678,
    networkName: 'EVA Private Chain',
    validations: 24,
  };

  // Format a date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Create a function to handle document upload
  const handleDocumentUpload = (type: string) => {
    // In a real application, this would trigger a file upload process
    // For now, we just simulate adding a new document
    const newDoc: Document = {
      id: `doc${documents.length + 1}`,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Document`,
      type,
      status: 'pending',
    };

    setDocuments([...documents, newDoc]);

    // Simulate processing
    setTimeout(() => {
      setDocuments(prevDocs =>
        prevDocs.map(doc =>
          doc.id === newDoc.id
            ? { ...doc, status: 'received', receivedDate: new Date().toISOString() }
            : doc
        )
      );
    }, 2000);
  };

  // If not open, don't render
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-full sm:w-96 bg-white shadow-lg rounded-t-lg border border-gray-200 z-40">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-primary-600 text-white rounded-t-lg">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <div>
            <h3 className="font-bold">Deal Lifecycle Assistant</h3>
            <p className="text-xs text-gray-100">Transaction #{transactionId}</p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleBlockchainDetails}
            className="p-1 rounded-full hover:bg-primary-500 mr-2"
            title="View Blockchain Details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </button>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-primary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Blockchain details panel (conditionally shown) */}
      {showBlockchainDetails && (
        <div className="p-4 bg-gray-50 border-b">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Blockchain Transaction Details</h4>
          <div className="text-xs space-y-1">
            <p className="flex justify-between">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-mono truncate w-36">{blockchainData.transactionId}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Timestamp:</span>
              <span>{formatDate(blockchainData.timestamp)}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="text-green-600 font-medium">
                {blockchainData.status.toUpperCase()}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Block Number:</span>
              <span>{blockchainData.blockNumber}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Network:</span>
              <span>{blockchainData.networkName}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Validations:</span>
              <span>{blockchainData.validations}</span>
            </p>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => handleOpenCreditApplication('view')}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              View Full Application
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-h-[400px] overflow-y-auto">
        {/* Document Collection Section */}
        <div className="p-4 border-b">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Required Documents</h4>

          {/* Financial Statements */}
          <div className="bg-green-50 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Financial Statements</h5>
                <p className="text-xs text-gray-500">Last 2 years of financial statements</p>
              </div>
              <span className="text-xs text-green-600 font-medium">Received</span>
            </div>
          </div>

          {/* Bank Statements */}
          <div className="bg-green-50 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Bank Statements</h5>
                <p className="text-xs text-gray-500">
                  Last 3 months of business banking statements
                </p>
              </div>
              <span className="text-xs text-green-600 font-medium">Received</span>
            </div>
          </div>

          {/* Tax Returns */}
          <div className="bg-green-50 p-3 rounded-lg mb-3">
            <div className="flex justify-between items-center">
              <div>
                <h5 className="text-sm font-medium">Tax Returns</h5>
                <p className="text-xs text-gray-500">
                  Last 2 years of business tax returns (including all schedules)
                </p>
              </div>
              <span className="text-xs text-green-600 font-medium">Received</span>
            </div>
          </div>

          {/* Dynamically added documents */}
          {documents
            .filter(doc => !['financial', 'bank', 'tax'].includes(doc.type))
            .map(doc => (
              <div
                key={doc.id}
                className={`${
                  doc.status === 'received'
                    ? 'bg-green-50'
                    : doc.status === 'pending'
                      ? 'bg-yellow-50'
                      : 'bg-gray-50'
                } p-3 rounded-lg mb-3`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="text-sm font-medium">{doc.name}</h5>
                    <p className="text-xs text-gray-500">
                      {doc.receivedDate
                        ? `Received on ${formatDate(doc.receivedDate)}`
                        : 'Awaiting document'}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      doc.status === 'received'
                        ? 'text-green-600'
                        : doc.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}

          {/* Add Document Button */}
          <button
            onClick={() => handleOpenCreditApplication()}
            className="w-full mt-2 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Create Credit Application
          </button>
        </div>

        {/* Next Steps Section */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Next Steps to Close Deal</h4>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.isCompleted
                        ? 'bg-green-100 text-green-600'
                        : index === 0 || steps[index - 1]?.isCompleted
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step.isCompleted ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      step.isCompleted
                        ? 'text-green-600'
                        : index === 0 || steps[index - 1]?.isCompleted
                          ? 'text-primary-600'
                          : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>

                  {(index === 0 || steps[index - 1]?.isCompleted) && !step.isCompleted && (
                    <button
                      onClick={() => completeStep(step.id)}
                      className="mt-2 text-xs text-primary-600 font-medium hover:text-primary-700"
                    >
                      Mark as completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acceleration Tips */}
        <div className="p-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Deal Acceleration Tips</h4>

          <div className="space-y-3">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary-600 mt-0.5 mr-2"
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
              <p className="text-xs text-gray-600">
                Send personalized follow-ups highlighting specific benefits of closing quickly
              </p>
            </div>

            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary-600 mt-0.5 mr-2"
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
              <p className="text-xs text-gray-600">
                Offer document collection assistance to streamline information gathering
              </p>
            </div>

            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-primary-600 mt-0.5 mr-2"
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
              <p className="text-xs text-gray-600">
                Consider pre-approval options based on initial documentation provided
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Application Modal */}
      {showCreditApplication && (
        <CreditApplicationBlockchain
          isOpen={showCreditApplication}
          onClose={handleCloseCreditApplication}
          mode={applicationMode}
          initialApplication={
            applicationMode === 'create'
              ? undefined
              : {
                  id: `app-${transactionId}`,
                  applicantName: 'Sample Company LLC',
                  businessName: 'Sample Company LLC',
                  requestedAmount: 750000,
                  purpose: 'Equipment financing for manufacturing expansion',
                  industry: 'Manufacturing',
                  annualRevenue: 2500000,
                  timeInBusiness: 5,
                  creditScore: 720,
                  status: 'submitted',
                }
          }
        />
      )}
    </div>
  );
};

export default LifecycleAssistant;
