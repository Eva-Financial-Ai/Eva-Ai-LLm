import React, { useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import ThirdPartyAuthModal from './ThirdPartyAuthModal';
import DocumentUploadModal from './DocumentUploadModal';
import PlaidLinkModal from './PlaidLinkModal';
import StripeConnectModal from './StripeConnectModal';
import { useNavigate } from 'react-router-dom';

interface DataOrchestratorProps {
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

const IntelligentDataOrchestrator: React.FC<DataOrchestratorProps> = ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Main modal */}
      <animated.div
        style={{
          opacity: modalAnimation.opacity,
          transform: modalAnimation.transform,
        }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-primary-700">
            Intelligent Data Orchestrator
            <span className="ml-2 text-sm font-normal text-gray-500">
              AI-powered data collection and processing
            </span>
          </h2>
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

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'requirements' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Requirements
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'collection' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Collection Strategy
          </button>
          <button
            onClick={() => setActiveTab('processing')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'processing' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Processing Plan
          </button>
          <button
            onClick={() => setActiveTab('integration')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'integration' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Integrations
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'requirements' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium text-blue-800">Transaction Requirements</h3>
                <p className="text-sm text-blue-600">
                  AI-recommended data requirements for this transaction
                </p>

                {transactionId ? (
                  <p className="text-sm mt-2">
                    Analyzing requirements for transaction #{transactionId}...
                  </p>
                ) : (
                  <p className="text-sm mt-2">
                    No transaction selected. Using default requirements profile.
                  </p>
                )}
              </div>

              {/* Filelock Drive Integration - Added for direct access */}
              <FilelockConnector />

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Document Requirements</h3>
                <p className="text-sm text-gray-600 mb-4">Customize data requirements based on:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Product-Based Requirements</p>
                      <p className="text-xs text-gray-500">Adapt to loan type and structure</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Risk-Based Requirements</p>
                      <p className="text-xs text-gray-500">Adjust based on risk profile</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Entity-Based Requirements</p>
                      <p className="text-xs text-gray-500">Customized for business structure</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Regulatory Requirements</p>
                      <p className="text-xs text-gray-500">Ensure compliance with regulations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'collection' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Collection Methods</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select and configure data collection methods
                  {connectedMethodsCount > 0 && (
                    <span className="ml-2 text-green-600">({connectedMethodsCount} connected)</span>
                  )}
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {Object.values(collectionMethodsDetails).map(method => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition
                        ${selectedMethods[method.id] ? 'bg-primary-50 border-primary-300' : ''}
                        ${method.isConnected ? 'ring-1 ring-green-500' : ''}
                      `}
                      onClick={() => handleMethodSelect(method.id)}
                    >
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">{method.icon}</div>
                        <div>
                          <p className="font-medium text-sm">{method.name}</p>
                          <p className="text-xs text-gray-500">{method.description}</p>
                        </div>
                        {method.isConnected && (
                          <div className="ml-auto text-green-600">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {selectedMethods[method.id] && (
                        <div className="mt-3 border-t pt-3">
                          <p className="text-xs text-gray-700 mb-4">{method.details}</p>

                          {method.isConnected ? (
                            <div className="bg-green-50 p-2 rounded text-xs text-green-700 mb-3">
                              {method.id === 'document_upload' ? (
                                <>
                                  <p className="font-medium">
                                    Documents Uploaded: {method.documentUploads?.length || 0}
                                  </p>
                                  {method.documentUploads && method.documentUploads.length > 0 && (
                                    <ul className="mt-1 space-y-1">
                                      {method.documentUploads
                                        .slice(0, 3)
                                        .map((doc: any, idx: number) => (
                                          <li key={idx}>{doc.name}</li>
                                        ))}
                                      {method.documentUploads.length > 3 && (
                                        <li>+{method.documentUploads.length - 3} more</li>
                                      )}
                                    </ul>
                                  )}
                                </>
                              ) : (
                                <>
                                  <p className="font-medium">
                                    Connected to {method.connectionDetails?.provider}
                                  </p>
                                  <p className="mt-1">
                                    Last updated: {new Date().toLocaleDateString()}
                                  </p>
                                </>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleConnectMethod(method.id);
                              }}
                              className="w-full text-center py-2 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                            >
                              {method.id === 'document_upload'
                                ? 'Upload Documents'
                                : `Connect to ${method.name}`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Collection Strategy</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Optimize the data collection experience:
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Collection Priority</p>
                    <select
                      className="text-sm border-gray-300 rounded-md"
                      value={collectionPriority}
                      onChange={handleCollectionPriorityChange}
                    >
                      <option>Standard</option>
                      <option>Expedited</option>
                      <option>Critical</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Processing Mode</p>
                    <select
                      className="text-sm border-gray-300 rounded-md"
                      value={processingMode}
                      onChange={handleProcessingModeChange}
                    >
                      <option>Automated</option>
                      <option>Assisted</option>
                      <option>Manual</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Data Quality Threshold</p>
                    <div className="w-32">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={dataQualityThreshold}
                        onChange={handleQualityThresholdChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'processing' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Document Processing</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure document processing workflows:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Financial Document Extraction</p>
                      <p className="text-xs text-gray-500">
                        Extract data from tax returns, financial statements, bank statements
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Entity Document Extraction</p>
                      <p className="text-xs text-gray-500">
                        Process formation documents, licenses, certifications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Enhanced Processing</p>
                      <p className="text-xs text-gray-500">
                        Handwriting recognition, document repair, multi-language support
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">
                  Data Normalization & Enrichment
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure how data is standardized and enhanced:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Financial Data Normalization</p>
                      <p className="text-xs text-gray-500">Standardize financial data formats</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Entity Information Normalization</p>
                      <p className="text-xs text-gray-500">
                        Standardize business identity information
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Internal Data Enrichment</p>
                      <p className="text-xs text-gray-500">
                        Enhance with existing relationship data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Third-Party Data Enrichment</p>
                      <p className="text-xs text-gray-500">Add market and industry data</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integration' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">
                  Enterprise System Integrations
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure integrations with your systems:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mr-3">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Loan Origination System</p>
                        <p className="text-xs text-gray-500">Sync data & workflow with LOS</p>
                      </div>
                    </div>
                    <button className="text-sm text-primary-600 font-medium">Configure</button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center mr-3">
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
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Credit Decisioning System</p>
                        <p className="text-xs text-gray-500">
                          Deliver data to credit decision engine
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-primary-600 font-medium">Configure</button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mr-3">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Document Management System</p>
                        <p className="text-xs text-gray-500">Store and index processed documents</p>
                      </div>
                    </div>
                    <button className="text-sm text-primary-600 font-medium">Configure</button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">Third-Party Integrations</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure external service integrations:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Financial Institution Integrations</p>
                      <p className="text-xs text-gray-500">
                        Banks, credit bureaus, payment processors
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Service Provider Integrations</p>
                      <p className="text-xs text-gray-500">
                        Verification, valuation, insurance services
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                      defaultChecked
                    />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Ecosystem Partner Integrations</p>
                      <p className="text-xs text-gray-500">
                        Accounting, ERP, industry-specific systems
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input type="checkbox" className="mt-1 h-4 w-4 text-primary-600 rounded" />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Data Exchange Formats</p>
                      <p className="text-xs text-gray-500">Standard and custom data formats</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Powered by <span className="font-medium">EVA AI</span> Intelligent Data Orchestration
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRunOrchestrator}
              disabled={isConfiguring}
              className={`px-4 py-2 text-sm text-white rounded-md ${
                isConfiguring ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isConfiguring ? (
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
              ) : (
                'Run Orchestrator'
              )}
            </button>
          </div>
        </div>
      </animated.div>

      {/* Third-party authentication modal */}
      {showAuthModal && currentProvider && (
        <ThirdPartyAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          provider={currentProvider}
        />
      )}

      {/* Document upload modal */}
      {showUploadModal && (
        <DocumentUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
          documentType={currentDocumentType}
          acceptedFileTypes=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
          maxFileSize={15}
          multipleFiles={true}
        />
      )}

      {/* Plaid bank connection modal */}
      {showPlaidModal && (
        <PlaidLinkModal
          isOpen={showPlaidModal}
          onClose={() => setShowPlaidModal(false)}
          onSuccess={handlePlaidSuccess}
        />
      )}

      {/* Stripe payment processor modal */}
      {showStripeModal && (
        <StripeConnectModal
          isOpen={showStripeModal}
          onClose={() => setShowStripeModal(false)}
          onSuccess={handleStripeSuccess}
        />
      )}
    </div>
  );
};

export default IntelligentDataOrchestrator;
