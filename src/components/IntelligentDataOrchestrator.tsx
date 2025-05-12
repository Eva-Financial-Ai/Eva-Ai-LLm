/**
 * @component IntelligentDataOrchestrator
 * @description Orchestrates data collection and processing from multiple sources
 *
 * @userStories
 * 1. As a financial analyst, I want to automatically collect and process data from multiple sources so that I can create comprehensive financial assessments without manual data entry.
 * 2. As a loan officer, I want to connect to a borrower's financial systems so that I can verify data directly from the source.
 * 3. As a borrower, I want to securely share my business data so that I don't have to manually gather and submit various documents.
 * 4. As a credit manager, I want to orchestrate data collection across systems so that I have a complete financial picture for decisioning.
 *
 * @userJourney Loan Officer Using Data Orchestrator
 * 1. Trigger: New loan application requires financial verification
 * 2. Entry Point: Opens Intelligent Data Orchestrator from loan application
 * 3. Transaction Association: System connects orchestrator to loan application ID
 * 4. Data Requirements: Reviews required financial information for loan type
 * 5. Collection Method Selection: Selects mixture of methods (direct API, document upload)
 * 6. Connection Configuration: Configures connections to borrower's accounting system
 * 7. Authentication: Completes secure authentication for third-party systems
 * 8. Data Collection Process: Monitors real-time data collection progress
 * 9. Validation Review: Reviews automatically validated data points
 * 10. Manual Verification: Addresses any flagged inconsistencies
 * 11. Structured Output: Receives structured financial data integrated into loan application
 * 12. Confirmation: Confirms completed data collection for underwriting
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import ThirdPartyAuthModal from './ThirdPartyAuthModal';
import DocumentUploadModal from './DocumentUploadModal';
import PlaidLinkModal from './PlaidLinkModal';
import StripeConnectModal from './StripeConnectModal';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface IntelligentDataOrchestratorProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId?: string;
}

// Integration types
interface IntegrationConfig {
  enabled: boolean;
  apiKey?: string;
  credentials?: {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
  };
  settings?: Record<string, any>;
  connected?: boolean;
  connectionDetails?: any;
}

// Document upload types
interface DocumentUpload {
  file: File;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  results?: any;
}

// Collection method details
interface MethodDetails {
  id: string;
  name: string;
  icon: string;
  description: string;
  details: string;
  isConnected: boolean;
  connectionDetails?: any;
  documentUploads?: any[];
}

const IntelligentDataOrchestrator: React.FC<IntelligentDataOrchestratorProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'requirements' | 'collection' | 'processing' | 'integration'
  >('requirements');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showMethodDetails, setShowMethodDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use transactionId if provided
  useEffect(() => {
    if (transactionId) {
      console.log(`Loading data for transaction: ${transactionId}`);
      // In a real app, you would fetch transaction data here
    }
  }, [transactionId]);

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<any>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState('');

  // Collection strategy states
  const [collectionPriority, setCollectionPriority] = useState('Standard');
  const [processingMode, setProcessingMode] = useState('Automated');
  const [dataQualityThreshold, setDataQualityThreshold] = useState(80);

  // Selected collection methods with connection status
  const [collectionMethodsDetails, setCollectionMethodsDetails] = useState<
    Record<string, MethodDetails>
  >({
    document_upload: {
      id: 'document_upload',
      name: 'Document Upload',
      icon: '📄',
      description: 'Upload financial documents with AI OCR processing',
      details:
        'Upload documents for intelligent extraction using our advanced OCR engine. We support various formats including PDF, JPG, PNG and TIFF.',
      isConnected: false,
      documentUploads: [],
    },
    filelock_drive: {
      id: 'filelock_drive',
      name: 'Filelock Drive',
      icon: '🔒',
      description: 'Access documents from your secure Filelock Drive',
      details:
        'Filelock Drive provides secure, cloud-based document storage with version history, electronic signatures, and collaborative editing features.',
      isConnected: true,
    },
    erp_connect: {
      id: 'erp_connect',
      name: 'ERP System',
      icon: '🏢',
      description: 'Connect to your ERP system via secure API',
      details:
        'Direct integration with major ERP systems including SAP, Oracle, Microsoft Dynamics, and NetSuite.',
      isConnected: false,
    },
    accounting_connect: {
      id: 'accounting_connect',
      name: 'Accounting Software',
      icon: '💼',
      description: 'Connect to QuickBooks, Xero, or other accounting systems',
      details:
        'Seamlessly sync with your accounting software to import financial data, invoices, and payment history.',
      isConnected: false,
    },
    banking_connect: {
      id: 'banking_connect',
      name: 'Banking Data',
      icon: '🏦',
      description: 'Connect bank accounts via Plaid integration',
      details:
        'Securely connect to 11,000+ financial institutions to retrieve account data, transactions, and balances.',
      isConnected: false,
    },
    payment_connect: {
      id: 'payment_connect',
      name: 'Payment Processors',
      icon: '💳',
      description: 'Connect to Stripe, Square, or PayPal',
      details:
        'Import transaction history, revenue data, and customer information from your payment processors.',
      isConnected: false,
    },
    credit_bureau: {
      id: 'credit_bureau',
      name: 'Credit Bureau',
      icon: '📊',
      description: 'Retrieve credit reports and scores',
      details:
        'Access comprehensive credit data from major credit bureaus with customer authorization.',
      isConnected: false,
    },
  });

  // Selected collection methods
  const [selectedMethods, setSelectedMethods] = useState<{ [key: string]: boolean }>({
    document_upload: false,
    filelock_drive: false,
    erp_connect: false,
    accounting_connect: false,
    banking_connect: false,
    payment_connect: false,
    credit_bureau: false,
  });

  // Integration states
  const [integrations, setIntegrations] = useState<Record<string, IntegrationConfig>>({
    erp: { enabled: false },
    plaid: { enabled: false },
    quickbooks: { enabled: false },
    stripe: { enabled: false },
    xero: { enabled: false },
    sap: { enabled: false },
    netsuite: { enabled: false },
  });

  // Document upload states
  const [documentUploads, setDocumentUploads] = useState<DocumentUpload[]>([]);
  const [ocrEnabled, setOcrEnabled] = useState(true);
  const [ocrConfidence, setOcrConfidence] = useState(80);

  // Provider configuration for third-party auth
  const authProviders = {
    filelock_drive: {
      name: 'Filelock Drive',
      description: 'Access your secure document storage system',
      fields: [],
    },
    erp_connect: {
      name: 'ERP System',
      description: 'Provide your ERP system credentials to establish secure API connection',
      fields: [
        {
          name: 'system',
          label: 'ERP System',
          type: 'text',
          required: true,
          placeholder: 'e.g., SAP, Oracle, Dynamics',
        },
        { name: 'apiKey', label: 'API Key', type: 'password', required: true },
        {
          name: 'instanceUrl',
          label: 'Instance URL',
          type: 'text',
          required: true,
          placeholder: 'https://your-erp-instance.com',
        },
      ],
    },
    accounting_connect: {
      name: 'Accounting Software',
      description: 'Connect to your accounting software to import financial data',
      fields: [
        {
          name: 'provider',
          label: 'Provider',
          type: 'text',
          required: true,
          placeholder: 'QuickBooks, Xero, etc.',
        },
        { name: 'username', label: 'Username/Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
      ],
    },
    banking_connect: {
      name: 'Banking Data',
      description: 'Connect to your financial institution via secure Plaid integration',
      fields: [
        { name: 'institution', label: 'Financial Institution', type: 'text', required: true },
        { name: 'username', label: 'Online Banking Username', type: 'text', required: true },
        { name: 'password', label: 'Online Banking Password', type: 'password', required: true },
      ],
    },
    payment_connect: {
      name: 'Payment Processor',
      description: 'Connect to your payment processor account',
      fields: [
        {
          name: 'processor',
          label: 'Processor',
          type: 'text',
          required: true,
          placeholder: 'Stripe, Square, PayPal',
        },
        { name: 'apiKey', label: 'API Key/Secret', type: 'password', required: true },
        { name: 'accountId', label: 'Account ID', type: 'text', required: false },
      ],
    },
    credit_bureau: {
      name: 'Credit Bureau',
      description: 'Authorize access to credit report data',
      fields: [
        {
          name: 'bureau',
          label: 'Credit Bureau',
          type: 'text',
          required: true,
          placeholder: 'Experian, Equifax, TransUnion',
        },
        { name: 'apiKey', label: 'API Key', type: 'password', required: true },
        { name: 'consentReference', label: 'Consent Reference ID', type: 'text', required: false },
      ],
    },
  };

  // Document types for upload
  const documentTypes = [
    { id: 'tax_returns', name: 'Tax Returns', required: true },
    { id: 'financial_statements', name: 'Financial Statements', required: true },
    { id: 'bank_statements', name: 'Bank Statements', required: true },
    { id: 'business_licenses', name: 'Business Licenses', required: false },
    { id: 'legal_documents', name: 'Legal Documents', required: false },
    { id: 'collateral_docs', name: 'Collateral Documentation', required: true },
  ];

  // Animation for modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(50px)',
  }) as any;

  // Handle method selection
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setShowMethodDetails(true);

    // Toggle the selected method
    setSelectedMethods(prev => ({
      ...prev,
      [methodId]: !prev[methodId],
    }));
  };

  // Handle back to methods list
  const handleBackToMethods = () => {
    setShowMethodDetails(false);
  };

  // Handle button click for connection methods
  const handleConnectMethod = (methodId: string) => {
    if (methodId === 'document_upload') {
      // Open document upload modal
      setCurrentDocumentType('Financial Documents');
      setShowUploadModal(true);
    } else if (methodId === 'filelock_drive') {
      // Navigate to Filelock Drive
      navigate('/documents');
      onClose();
    } else if (methodId === 'banking_connect') {
      // Open Plaid modal for bank connection
      setShowPlaidModal(true);
    } else if (methodId === 'payment_connect') {
      // Open Stripe modal for payment processor connection
      setShowStripeModal(true);
    } else {
      // Open third-party auth modal for other providers
      setCurrentProvider(authProviders[methodId as keyof typeof authProviders]);
      setShowAuthModal(true);
    }
  };

  // Handle auth success
  const handleAuthSuccess = (credentials: any) => {
    if (!selectedMethod) return;

    setShowAuthModal(false);

    // Update connection status
    setCollectionMethodsDetails(prev => ({
      ...prev,
      [selectedMethod]: {
        ...prev[selectedMethod],
        isConnected: true,
        connectionDetails: credentials,
      },
    }));

    // Update selected methods
    setSelectedMethods(prev => ({
      ...prev,
      [selectedMethod]: true,
    }));

    // Show success message (could be implemented as a toast)
    console.log(`Successfully connected to ${selectedMethod}`);
  };

  // Handle Plaid success
  const handlePlaidSuccess = (data: any) => {
    setShowPlaidModal(false);

    // Update connection status
    setCollectionMethodsDetails(prev => ({
      ...prev,
      banking_connect: {
        ...prev.banking_connect,
        isConnected: true,
        connectionDetails: data,
      },
    }));

    // Update selected methods
    setSelectedMethods(prev => ({
      ...prev,
      banking_connect: true,
    }));
  };

  // Handle Stripe success
  const handleStripeSuccess = (data: any) => {
    setShowStripeModal(false);

    // Update connection status
    setCollectionMethodsDetails(prev => ({
      ...prev,
      payment_connect: {
        ...prev.payment_connect,
        isConnected: true,
        connectionDetails: data,
      },
    }));

    // Update selected methods
    setSelectedMethods(prev => ({
      ...prev,
      payment_connect: true,
    }));
  };

  // Handle upload completion
  const handleUploadComplete = (files: any[]) => {
    setShowUploadModal(false);

    // Update document uploads
    const newUploads: DocumentUpload[] = files.map(file => ({
      file: file,
      type: currentDocumentType,
      status: 'completed',
      progress: 100,
      results: { confidence: 85, extracted: true },
    }));

    setDocumentUploads(prev => [...prev, ...newUploads]);

    // Update connection status
    setCollectionMethodsDetails(prev => ({
      ...prev,
      document_upload: {
        ...prev.document_upload,
        isConnected: true,
        documentUploads: [...(prev.document_upload.documentUploads || []), ...newUploads],
      },
    }));

    // Update selected methods
    setSelectedMethods(prev => ({
      ...prev,
      document_upload: true,
    }));
  };

  // Handle collection priority change
  const handleCollectionPriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCollectionPriority(e.target.value);
  };

  // Handle processing mode change
  const handleProcessingModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProcessingMode(e.target.value);
  };

  // Handle data quality threshold change
  const handleQualityThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataQualityThreshold(parseInt(e.target.value));
  };

  const handleRunOrchestrator = () => {
    setIsConfiguring(true);

    // Simulate processing
    setTimeout(() => {
      setIsConfiguring(false);
      // Show success message and close modal
      alert('Data orchestration completed successfully!');
      onClose();
    }, 2000);
  };

  // Get the count of connected methods
  const connectedMethodsCount = Object.values(collectionMethodsDetails).filter(
    method => method.isConnected
  ).length;

  // Process OCR data from document upload
  const processOCRData = (documents: DocumentUpload[]) => {
    // In a real application, this would process and structure the extracted OCR data
    console.log('Processing OCR data from uploads:', documents);
  };

  // FilelockConnector component for direct access to the Filelock Drive
  const FilelockConnector = () => {
    return (
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm p-6 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">Filelock Drive Integration</h3>
            <p className="mt-1 text-sm text-gray-500">
              Access your secure document storage directly from the Data Orchestrator. Filelock
              Drive provides enterprise-grade security, versioning, and collaboration capabilities.
            </p>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => {
                  navigate('/documents');
                  onClose();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Open Filelock Drive
              </button>
              <button
                onClick={() => handleMethodSelect('filelock_drive')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Configure Integration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // When mode is changed to automated mode
  const handleAutomatedModeChange = () => {
    setProcessingMode('Automated');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-lg flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-white">
                  Intelligent Data Orchestrator
                </span>
                {transactionId && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    Transaction: {transactionId}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
              <svg
                className="h-12 w-12 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Intelligent Data Orchestrator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              Streamline your data management with our AI-powered orchestration system. Automate
              data flows, validation, and integrations across your entire business.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-left">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Automated Data Validation
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Cross-System Integration
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Real-time Data Processing
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Intelligent Data Routing
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-left">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Benefits</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Reduced Manual Data Entry
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Improved Data Accuracy
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Faster Processing Times
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Enhanced Compliance
                  </li>
                </ul>
              </div>
            </div>

            <button className="mt-8 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Launch Data Orchestrator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentDataOrchestrator;
