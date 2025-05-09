import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface DocumentVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  documentId?: string;
  userData?: UserData;
  onUserDataChange?: (data: UserData) => void;
  initialError?: string | null;
  onVerificationComplete?: (result: { success: boolean; documentId?: string }) => void;
}

interface ThirdPartyVerificationResult {
  source: string;
  verified: boolean;
  confidenceScore: number;
  matchedFields: { field: string; value: string; matched: boolean }[];
  verificationId: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  docType: string;
  status: 'uploading' | 'uploaded' | 'failed';
  dateUploaded: string;
  fileSize?: string;
}

interface UserData {
  // Personal/Business Info
  applicantType: 'individual' | 'business';
  businessName?: string;
  businessType?: string;
  taxId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  // Address
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Financial Info
  annualRevenue?: string;
  annualIncome?: string;
  yearsInBusiness?: string;
  creditScore?: string;

  // Bank Info
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;

  // Application Info
  loanAmount?: string;
  loanPurpose?: string;
  loanTerm?: string;
  collateral?: string;

  // Authorization
  hasESignature?: boolean;
  signatureDate?: string;
  agreeToTerms?: boolean;
}

// Add risk assessment types
interface ComplianceCheckResult {
  status: 'compliant' | 'non-compliant' | 'needs-review';
  regulations: {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    details: string;
  }[];
  lastChecked: string;
  overallRiskScore: number;
}

interface FraudDetectionResult {
  riskLevel: 'low' | 'medium' | 'high';
  alertFlags: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  verificationStatus: 'verified' | 'suspicious' | 'unverified';
  lastChecked: string;
}

interface CreditReport {
  id: string;
  name: string;
  source: string;
  reportDate: string;
  fileSize?: string;
  score?: number;
  status: 'uploaded' | 'processing' | 'analyzed';
}

const DocumentVerificationSystem: React.FC<DocumentVerificationProps> = ({
  isOpen,
  onClose,
  documentId,
  userData,
  onUserDataChange,
  initialError,
  onVerificationComplete,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'identity'
    | 'financial'
    | 'ownership'
    | 'authenticity'
    | 'all_documents'
    | 'credit_application'
    | 'compliance_check'
    | 'fraud_detection'
    | 'credit_scoring'
  >('identity');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<
    'select' | 'processing' | 'results' | 'third-party-check'
  >('select');
  const [thirdPartyChecks, setThirdPartyChecks] = useState<ThirdPartyVerificationResult[]>([]);
  const [enableCrossCheck, setEnableCrossCheck] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [showDocumentManager, setShowDocumentManager] = useState(false);
  // Initialize formData with userData prop or defaults
  const [formData, setFormData] = useState<UserData>({
    applicantType: 'business',
    agreeToTerms: false,
    hasESignature: false,
    ...userData,
  });
  const [signatureData, setSignatureData] = useState<string>('');
  const [isSavingApplication, setIsSavingApplication] = useState(false);
  const signatureRef = useRef<HTMLCanvasElement>(null);
  const [verificationResults, setVerificationResults] = useState<{
    verified: boolean;
    confidenceScore: number;
    riskFlags: string[];
    notes: string;
  } | null>(null);

  // Risk assessment states
  const [creditReports, setCreditReports] = useState<CreditReport[]>([]);
  const [complianceResult, setComplianceResult] = useState<ComplianceCheckResult | null>(null);
  const [fraudDetectionResult, setFraudDetectionResult] = useState<FraudDetectionResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedCreditReport, setSelectedCreditReport] = useState<string | null>(null);
  const creditReportRef = useRef<HTMLInputElement>(null);

  // Load saved documents from localStorage on component mount
  useEffect(() => {
    const savedDocuments = localStorage.getItem('eva_uploaded_documents');
    if (savedDocuments) {
      try {
        setUploadedDocuments(JSON.parse(savedDocuments));
      } catch (e) {
        console.error('Error loading saved documents:', e);
        localStorage.removeItem('eva_uploaded_documents');
      }
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (uploadedDocuments.length > 0) {
      localStorage.setItem('eva_uploaded_documents', JSON.stringify(uploadedDocuments));
    }
  }, [uploadedDocuments]);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('eva_user_data');
    if (savedUserData) {
      try {
        setFormData(prev => ({
          ...prev,
          ...JSON.parse(savedUserData),
        }));
      } catch (e) {
        console.error('Error loading saved user data:', e);
        localStorage.removeItem('eva_user_data');
      }
    }
  }, []);

  // Update formData when userData prop changes
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        ...userData,
      }));
    }
  }, [userData]);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (formData && Object.keys(formData).length > 3) {
      // More than just the defaults
      localStorage.setItem('eva_user_data', JSON.stringify(formData));
    }
  }, [formData]);

  // Animation for modal
  const modalAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(50px)' },
    config: { tension: 280, friction: 60 },
  }) as any; // Type assertion to any to bypass type checking limitations with react-spring

  // Mock document types
  const documentTypes = [
    { id: 'drivers_license', name: "Driver's License", type: 'identity' },
    { id: 'passport', name: 'Passport', type: 'identity' },
    { id: 'business_license', name: 'Business License', type: 'ownership' },
    { id: 'articles_incorporation', name: 'Articles of Incorporation', type: 'ownership' },
    { id: 'operating_agreement', name: 'Operating Agreement', type: 'ownership' },
    { id: 'partnership_agreement', name: 'Partnership Agreement', type: 'ownership' },
    { id: 'corporate_bylaws', name: 'Corporate Bylaws', type: 'ownership' },
    { id: 'certificate_good_standing', name: 'Certificate of Good Standing', type: 'ownership' },
    { id: 'bank_statements', name: 'Bank Statements', type: 'financial' },
    { id: 'tax_returns', name: 'Tax Returns', type: 'financial' },
    { id: 'financial_statements', name: 'Financial Statements', type: 'financial' },
    {
      id: 'accounts_receivable_aging',
      name: 'Accounts Receivable Aging Report',
      type: 'financial',
    },
  ];

  // Mock verification engines
  const verificationEngines = [
    {
      id: 'deep_doctection',
      name: 'DeepDoctection',
      description: 'Advanced document layout analysis',
    },
    {
      id: 'doc_layout_yolo',
      name: 'DocLayoutYOLO',
      description: 'Fast visual document element detection',
    },
    { id: 'opencv_img2table', name: 'OpenCV/img2table', description: 'Table structure extraction' },
    {
      id: 'scikit_classifier',
      name: 'Scikit-learn Classifier',
      description: 'Document classification',
    },
    {
      id: 'pycaret_classifier',
      name: 'PyCaret Classifier',
      description: 'Automated document classification',
    },
  ];

  // Third-party databases for cross checking
  const thirdPartyDatabases = [
    { id: 'government', name: 'Government Records', description: 'Official government databases' },
    {
      id: 'financial',
      name: 'Financial Institutions',
      description: 'Banking and financial records',
    },
    { id: 'credit', name: 'Credit Bureaus', description: 'Credit history and reports' },
    { id: 'business', name: 'Business Registries', description: 'Company registration data' },
  ];

  const filteredDocuments = documentTypes.filter(doc => doc.type === activeTab);

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocument(docId);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, docType?: string) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Create a new uploaded document entry
      const newDocument: UploadedDocument = {
        id: `upload-${Date.now()}`,
        name: file.name,
        docType: docType || activeTab,
        status: 'uploading',
        dateUploaded: new Date().toISOString(),
        fileSize: formatFileSize(file.size),
      };

      setUploadedDocuments(prev => [...prev, newDocument]);

      // Simulate upload process
      setTimeout(() => {
        setUploadedDocuments(prev =>
          prev.map(doc => (doc.id === newDocument.id ? { ...doc, status: 'uploaded' } : doc))
        );

        // Auto-select the document after upload
        setSelectedDocument(newDocument.id);
      }, 1500);

      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));

    // If the currently selected document is being removed, clear the selection
    if (selectedDocument === docId) {
      setSelectedDocument(null);
    }
  };

  const handleVerify = () => {
    if (!selectedDocument && !verificationResults) {
      alert('Please select a document to verify');
      return;
    }

    if (verificationStep === 'results' && enableCrossCheck) {
      // Move to third-party verification
      setVerificationStep('third-party-check');
      performThirdPartyChecks();
      return;
    }

    if (verificationStep === 'third-party-check' || verificationResults) {
      // Verification complete, close modal
      onClose();
      return;
    }

    // Initial verification
    setIsVerifying(true);
    setVerificationStep('processing');
    setVerificationResults(null);

    // Simulate verification process
    setTimeout(() => {
      // Mock verification results
      const results = {
        verified: Math.random() > 0.2, // 80% chance of success
        confidenceScore: Math.random() * 0.3 + 0.7, // Score between 0.7 and 1.0
        riskFlags: [] as string[],
        notes: '',
      };

      // Add some random risk flags if the score is lower
      if (results.confidenceScore < 0.85) {
        const possibleFlags = [
          'Document resolution too low',
          'Incomplete document pages',
          'Missing signatures',
          'Inconsistent formatting',
          'Potential manipulation detected',
          'Date inconsistencies found',
        ];

        // Add 1-3 random flags
        const flagCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < flagCount; i++) {
          const randomFlag = possibleFlags[Math.floor(Math.random() * possibleFlags.length)];
          if (!results.riskFlags.includes(randomFlag)) {
            results.riskFlags.push(randomFlag);
          }
        }
        results.notes = 'Document requires additional review due to identified risk factors.';
      } else {
        results.notes = 'Document passed automated verification checks.';
      }

      setVerificationResults(results);
      setIsVerifying(false);
      setVerificationStep('results');
    }, 2500);
  };

  // Function to perform third-party database checks
  const performThirdPartyChecks = () => {
    setIsVerifying(true);

    // Simulate third-party database checks
    setTimeout(() => {
      // Generate mock results for third-party checks
      const checks: ThirdPartyVerificationResult[] = thirdPartyDatabases.map(db => {
        const isVerified = Math.random() > 0.2; // 80% chance of verification success
        return {
          source: db.name,
          verified: isVerified,
          confidenceScore: Math.random() * 0.2 + (isVerified ? 0.75 : 0.4), // Higher confidence if verified
          matchedFields: [
            { field: 'Name', value: 'John Smith', matched: Math.random() > 0.1 },
            { field: 'ID Number', value: 'X12345678', matched: Math.random() > 0.2 },
            { field: 'Issue Date', value: '2022-05-15', matched: Math.random() > 0.2 },
            { field: 'Address', value: '123 Main St, Anytown', matched: Math.random() > 0.3 },
          ],
          verificationId: `VID-${Math.floor(Math.random() * 9000) + 1000}-${db.id.substring(0, 3).toUpperCase()}`,
        };
      });

      setThirdPartyChecks(checks);
      setIsVerifying(false);
    }, 3000);
  };

  // Render third-party verification results
  const renderThirdPartyChecks = () => {
    if (thirdPartyChecks.length === 0) {
      return (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Checking external databases...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Third-Party Verification Results</h3>

        {thirdPartyChecks.map((check, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${check.verified ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{check.source}</h4>
                <p className="text-sm text-gray-600">Verification ID: {check.verificationId}</p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${check.verified ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
              >
                {check.verified ? 'Verified' : 'Not Verified'}
              </div>
            </div>

            <p className="text-sm mb-2">
              Confidence Score: {Math.round(check.confidenceScore * 100)}%
            </p>

            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Matched Fields:</p>
              <div className="overflow-hidden border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Field
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Value
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {check.matchedFields.map((field, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 text-sm text-gray-900">{field.field}</td>
                        <td className="px-3 py-2 text-sm text-gray-500">{field.value}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${field.matched ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {field.matched ? 'Matched' : 'Mismatch'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Get document type name
  const getDocumentTypeName = (type: string): string => {
    switch (type) {
      case 'identity':
        return 'Identity';
      case 'financial':
        return 'Financial';
      case 'ownership':
        return 'Ownership';
      case 'authenticity':
        return 'Authenticity';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Render Document Card with Upload Button
  const renderDocumentCard = (doc: any) => {
    const isSelected = selectedDocument === doc.id;
    const isUploaded = uploadedDocuments.some(
      uploaded =>
        uploaded.docType === doc.type &&
        uploaded.status === 'uploaded' &&
        uploaded.id === selectedDocument
    );

    return (
      <div
        key={doc.id}
        className={`border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition ${isSelected ? 'bg-primary-50 border-primary-500' : ''}`}
        onClick={() => handleDocumentSelect(doc.id)}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-md mr-3">
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
              <p className="font-medium text-sm">{doc.name}</p>
              <p className="text-xs text-gray-500">
                {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)} Document
              </p>
              {isUploaded && <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>}
            </div>
          </div>
          <input
            type="file"
            id={`file-input-${doc.id}`}
            className="hidden"
            onChange={e => handleFileUpload(e, doc.type)}
            accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff"
          />
          <label
            htmlFor={`file-input-${doc.id}`}
            className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded border border-primary-200 hover:bg-primary-100 cursor-pointer"
            onClick={e => e.stopPropagation()}
          >
            Upload
          </label>
        </div>
      </div>
    );
  };

  // Render uploaded documents for current tab
  const renderUploadedDocuments = () => {
    const filtered = uploadedDocuments.filter(doc =>
      activeTab === 'all_documents' ? true : doc.docType === activeTab
    );

    if (filtered.length === 0) return null;

    return (
      <div className="mt-4 border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Your Uploaded Documents</h4>
        <div className="space-y-2">
          {filtered.map(doc => (
            <div
              key={doc.id}
              className={`border rounded-lg p-3 ${selectedDocument === doc.id ? 'bg-primary-50 border-primary-500' : 'bg-white'}`}
            >
              <div className="flex items-center">
                <div
                  className="p-2 bg-green-100 text-green-700 rounded-md mr-3"
                  onClick={() => setSelectedDocument(doc.id)}
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1" onClick={() => setSelectedDocument(doc.id)}>
                  <p className="font-medium text-sm">{doc.name}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {getDocumentTypeName(doc.docType)}
                    </span>
                    {doc.fileSize && <span>{doc.fileSize}</span>}
                    <span>{new Date(doc.dateUploaded).toLocaleDateString()}</span>
                  </div>
                </div>
                {doc.status === 'uploading' ? (
                  <div className="w-5 h-5 mr-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRemoveDocument(doc.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded"
                    title="Remove document"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Document Manager
  const renderDocumentManager = () => {
    // Group documents by type
    const groupedDocuments: { [key: string]: UploadedDocument[] } = {};
    uploadedDocuments.forEach(doc => {
      if (!groupedDocuments[doc.docType]) {
        groupedDocuments[doc.docType] = [];
      }
      groupedDocuments[doc.docType].push(doc);
    });

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Document Manager</h3>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Document
            </button>
          </div>
        </div>

        {Object.keys(groupedDocuments).length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-600 mb-1">No documents uploaded yet</p>
            <p className="text-gray-500 text-sm">Upload documents to begin verification</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedDocuments).map(docType => (
              <div key={docType}>
                <h4 className="font-medium text-gray-700 mb-2 border-b pb-1">
                  {getDocumentTypeName(docType)} Documents
                </h4>
                <div className="space-y-2">
                  {groupedDocuments[docType].map(doc => (
                    <div
                      key={doc.id}
                      className={`border rounded-lg p-3 flex items-center ${selectedDocument === doc.id ? 'bg-primary-50 border-primary-500' : 'bg-white'}`}
                    >
                      <div className="p-2 mr-3 rounded-md bg-gray-100 text-gray-700">
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
                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.name}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="mr-3">
                            {new Date(doc.dateUploaded).toLocaleDateString()}
                          </span>
                          {doc.fileSize && <span className="mr-3">{doc.fileSize}</span>}
                          <span
                            className={`px-2 py-0.5 rounded ${
                              doc.status === 'uploaded'
                                ? 'bg-green-100 text-green-800'
                                : doc.status === 'uploading'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {doc.status === 'uploaded'
                              ? 'Ready'
                              : doc.status === 'uploading'
                                ? 'Uploading...'
                                : 'Failed'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedDocument(doc.id)}
                          className="p-1.5 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
                          title="Select for verification"
                        >
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
                        </button>
                        <button
                          onClick={() => handleRemoveDocument(doc.id)}
                          className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          title="Remove document"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // E-Signature handling
  const clearSignature = () => {
    const canvas = signatureRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignatureData('');
        setFormData(prev => ({ ...prev, hasESignature: false }));
      }
    }
  };

  const initializeSignaturePad = () => {
    const canvas = signatureRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const coords = getEventCoordinates(e, canvas);
      lastX = coords.x;
      lastY = coords.y;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !ctx) return;
      e.preventDefault();

      const coords = getEventCoordinates(e, canvas);
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(coords.x, coords.y);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastX = coords.x;
      lastY = coords.y;
    };

    const stopDrawing = () => {
      if (isDrawing) {
        isDrawing = false;
        if (canvas) {
          setSignatureData(canvas.toDataURL());
          setFormData(prev => ({
            ...prev,
            hasESignature: true,
            signatureDate: new Date().toISOString(),
          }));
        }
      }
    };

    const getEventCoordinates = (e: MouseEvent | TouchEvent, element: HTMLCanvasElement) => {
      const rect = element.getBoundingClientRect();
      let clientX, clientY;

      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    // Return a cleanup function
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  };

  // Initialize signature pad when tab is active
  useEffect(() => {
    if (activeTab === 'credit_application') {
      const cleanup = initializeSignaturePad();
      return cleanup;
    }
  }, [activeTab]);

  // Handle input change on the credit application form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle saving the application
  const handleSaveApplication = () => {
    if (!formData.hasESignature || !formData.agreeToTerms) {
      alert('Please provide your signature and agree to the terms before proceeding');
      return;
    }

    setIsSavingApplication(true);

    // Simulate API call
    setTimeout(() => {
      // Save data to localStorage for persistence
      localStorage.setItem('eva_user_data', JSON.stringify(formData));

      setIsSavingApplication(false);

      // Notify parent component if callback exists
      if (onUserDataChange) {
        onUserDataChange(formData);
      }

      alert('Application saved successfully!');
    }, 1500);
  };

  // Handle credit report upload
  const handleCreditReportUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Create new credit report entry
      const newReport: CreditReport = {
        id: `report-${Date.now()}`,
        name: file.name,
        source: file.name.includes('equifax')
          ? 'Equifax'
          : file.name.includes('experian')
            ? 'Experian'
            : file.name.includes('transunion')
              ? 'TransUnion'
              : 'Unknown',
        reportDate: new Date().toISOString(),
        fileSize: formatFileSize(file.size),
        status: 'uploaded',
      };

      setCreditReports(prev => [...prev, newReport]);

      // Simulate processing
      setTimeout(() => {
        setCreditReports(prev =>
          prev.map(report =>
            report.id === newReport.id ? { ...report, status: 'processing' } : report
          )
        );

        // Simulate analysis completion
        setTimeout(() => {
          setCreditReports(prev =>
            prev.map(report =>
              report.id === newReport.id
                ? {
                    ...report,
                    status: 'analyzed',
                    score: Math.floor(Math.random() * 300) + 500, // Random score between 500-800
                  }
                : report
            )
          );
        }, 3000);
      }, 1500);

      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  // Run compliance check
  const runComplianceCheck = () => {
    setIsAnalyzing(true);

    // Simulate compliance analysis
    setTimeout(() => {
      const result: ComplianceCheckResult = {
        status:
          Math.random() > 0.7
            ? 'compliant'
            : Math.random() > 0.5
              ? 'non-compliant'
              : 'needs-review',
        regulations: [
          {
            name: 'KYC Verification',
            status: Math.random() > 0.8 ? 'pass' : Math.random() > 0.5 ? 'fail' : 'warning',
            details: 'Identity verification through approved documentation',
          },
          {
            name: 'AML Screening',
            status: Math.random() > 0.8 ? 'pass' : Math.random() > 0.5 ? 'fail' : 'warning',
            details: 'Anti-money laundering checks against watchlists',
          },
          {
            name: 'OFAC Compliance',
            status: Math.random() > 0.8 ? 'pass' : Math.random() > 0.5 ? 'fail' : 'warning',
            details: 'Office of Foreign Assets Control sanctions list screening',
          },
          {
            name: 'BSA Compliance',
            status: Math.random() > 0.8 ? 'pass' : Math.random() > 0.5 ? 'fail' : 'warning',
            details: 'Bank Secrecy Act requirements for financial institutions',
          },
          {
            name: 'Regulation Z',
            status: Math.random() > 0.8 ? 'pass' : Math.random() > 0.5 ? 'fail' : 'warning',
            details: 'Truth in Lending Act disclosure compliance',
          },
        ],
        lastChecked: new Date().toISOString(),
        overallRiskScore: Math.floor(Math.random() * 100),
      };

      setComplianceResult(result);
      setIsAnalyzing(false);
    }, 2500);
  };

  // Run fraud detection
  const runFraudDetection = () => {
    setIsAnalyzing(true);

    // Simulate fraud detection analysis
    setTimeout(() => {
      const result: FraudDetectionResult = {
        riskLevel: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high',
        alertFlags: [
          {
            type: 'Identity Verification',
            severity: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high',
            description: 'Verification of applicant identity through document analysis',
          },
          {
            type: 'Document Authenticity',
            severity: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high',
            description: 'Analysis of document security features and authenticity markers',
          },
          {
            type: 'Address Verification',
            severity: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high',
            description: 'Verification of provided address against trusted databases',
          },
          {
            type: 'Behavioral Analysis',
            severity: Math.random() > 0.7 ? 'low' : Math.random() > 0.4 ? 'medium' : 'high',
            description: 'Analysis of application behavior patterns for suspicious activity',
          },
        ],
        verificationStatus:
          Math.random() > 0.7 ? 'verified' : Math.random() > 0.3 ? 'suspicious' : 'unverified',
        lastChecked: new Date().toISOString(),
      };

      setFraudDetectionResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Credit Scoring UI
  const renderCreditScoring = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Credit Scoring</h3>

        <div className="space-y-6">
          {/* Upload credit reports section */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Historical Credit Reports</h4>
            <p className="text-sm text-gray-600 mb-4">
              Upload historical credit reports (PDF format) for automated analysis and scoring.
            </p>

            <div className="flex items-center mb-4">
              <input
                type="file"
                ref={creditReportRef}
                className="hidden"
                onChange={handleCreditReportUpload}
                accept=".pdf"
              />
              <button
                onClick={() => creditReportRef.current?.click()}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                  />
                </svg>
                Upload Credit Report
              </button>
            </div>

            {/* Credit reports list */}
            {creditReports.length > 0 ? (
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-700">Uploaded Reports</h5>
                {creditReports.map(report => (
                  <div
                    key={report.id}
                    className={`border rounded-lg p-3 ${selectedCreditReport === report.id ? 'bg-primary-50 border-primary-300' : 'bg-white'}`}
                    onClick={() => setSelectedCreditReport(report.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="p-2 bg-red-100 text-red-600 rounded-md mr-3">
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
                          <p className="font-medium text-sm">{report.name}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{report.source}</span>
                            <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                            {report.fileSize && <span>{report.fileSize}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {report.status === 'uploaded' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Uploaded
                          </span>
                        )}
                        {report.status === 'processing' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-600"
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
                            Processing
                          </span>
                        )}
                        {report.status === 'analyzed' && report.score && (
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                report.score > 700
                                  ? 'bg-green-100 text-green-800'
                                  : report.score > 600
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              Score: {report.score}
                            </span>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setCreditReports(prev => prev.filter(r => r.id !== report.id));
                                if (selectedCreditReport === report.id) {
                                  setSelectedCreditReport(null);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 rounded"
                              title="Remove report"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mx-auto text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600">No credit reports uploaded yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Upload PDF credit reports to see analysis
                </p>
              </div>
            )}
          </div>

          {/* Credit score summary */}
          {creditReports.some(report => report.status === 'analyzed') && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-3">Credit Score Summary</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {['Equifax', 'Experian', 'TransUnion'].map(bureau => {
                  const report = creditReports.find(
                    r => r.source === bureau && r.status === 'analyzed'
                  );
                  return (
                    <div key={bureau} className="border rounded-lg p-3 bg-white">
                      <p className="text-sm font-medium text-gray-800">{bureau}</p>
                      {report ? (
                        <div className="mt-2">
                          <p
                            className={`text-xl font-bold ${
                              (report.score || 0) > 700
                                ? 'text-green-600'
                                : (report.score || 0) > 600
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {report.score}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Report Date: {new Date(report.reportDate).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">No data available</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="bg-white p-3 rounded border">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Average Score</h5>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    {(() => {
                      const avgScore =
                        creditReports
                          .filter(r => r.status === 'analyzed' && r.score)
                          .reduce((sum, report) => sum + (report.score || 0), 0) /
                        creditReports.filter(r => r.status === 'analyzed' && r.score).length;

                      const percentage = Math.min(Math.max(((avgScore - 300) / 550) * 100, 0), 100);

                      return (
                        <div
                          className={`h-2.5 rounded-full ${
                            avgScore > 700
                              ? 'bg-green-600'
                              : avgScore > 600
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      );
                    })()}
                  </div>
                  <p className="ml-3 text-lg font-semibold">
                    {Math.round(
                      creditReports
                        .filter(r => r.status === 'analyzed' && r.score)
                        .reduce((sum, report) => sum + (report.score || 0), 0) /
                        creditReports.filter(r => r.status === 'analyzed' && r.score).length
                    ) || 'N/A'}
                  </p>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>300</span>
                  <span>850</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Compliance Check UI
  const renderComplianceCheck = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Compliance Check</h3>

        {complianceResult ? (
          <div className="space-y-6">
            {/* Compliance status */}
            <div
              className={`p-4 rounded-lg ${
                complianceResult.status === 'compliant'
                  ? 'bg-green-50'
                  : complianceResult.status === 'non-compliant'
                    ? 'bg-red-50'
                    : 'bg-yellow-50'
              }`}
            >
              <div className="flex items-center mb-3">
                <div
                  className={`rounded-full p-2 mr-3 ${
                    complianceResult.status === 'compliant'
                      ? 'bg-green-100 text-green-600'
                      : complianceResult.status === 'non-compliant'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {complianceResult.status === 'compliant' ? (
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
                  ) : complianceResult.status === 'non-compliant' ? (
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
                  ) : (
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-base capitalize">
                    <span>
                      {complianceResult.status === 'compliant'
                        ? 'Compliant'
                        : complianceResult.status === 'non-compliant'
                          ? 'Non-Compliant'
                          : 'Needs Review'}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    Last checked: {new Date(complianceResult.lastChecked).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Regulations compliance */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Regulations Compliance</h4>
              <div className="space-y-3">
                {complianceResult.regulations.map((reg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      reg.status === 'pass'
                        ? 'border-green-200 bg-green-50'
                        : reg.status === 'fail'
                          ? 'border-red-200 bg-red-50'
                          : 'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-medium">{reg.name}</h5>
                        <p className="text-xs text-gray-600 mt-1">{reg.details}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          reg.status === 'pass'
                            ? 'bg-green-100 text-green-800'
                            : reg.status === 'fail'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={runComplianceCheck}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Run Compliance Check Again
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent mb-4"></div>
                <p className="text-gray-600">Running compliance check...</p>
                <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400"
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
                <p className="text-gray-600">No compliance check has been run</p>
                <button
                  onClick={runComplianceCheck}
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Run Compliance Check
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Fraud Detection UI
  const renderFraudDetection = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Fraud Detection</h3>

        {fraudDetectionResult ? (
          <div className="space-y-6">
            {/* Fraud detection status */}
            <div
              className={`p-4 rounded-lg ${
                fraudDetectionResult.riskLevel === 'low'
                  ? 'bg-green-50'
                  : fraudDetectionResult.riskLevel === 'medium'
                    ? 'bg-yellow-50'
                    : 'bg-red-50'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`rounded-full p-2 mr-3 ${
                    fraudDetectionResult.riskLevel === 'low'
                      ? 'bg-green-100 text-green-600'
                      : fraudDetectionResult.riskLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                  }`}
                >
                  {fraudDetectionResult.riskLevel === 'low' ? (
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
                  ) : fraudDetectionResult.riskLevel === 'medium' ? (
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  ) : (
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-base capitalize">
                    <span>
                      {fraudDetectionResult.riskLevel === 'low'
                        ? 'Low Risk'
                        : fraudDetectionResult.riskLevel === 'medium'
                          ? 'Medium Risk'
                          : 'High Risk'}
                    </span>{' '}
                    -
                    <span className="ml-1 capitalize">
                      {fraudDetectionResult.verificationStatus}
                    </span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    Last checked: {new Date(fraudDetectionResult.lastChecked).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Alert flags */}
            <div>
              <h4 className="text-base font-medium text-gray-800 mb-3">Alert Flags</h4>
              <div className="space-y-3">
                {fraudDetectionResult.alertFlags.map((flag, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      flag.severity === 'low'
                        ? 'border-green-200 bg-green-50'
                        : flag.severity === 'medium'
                          ? 'border-yellow-200 bg-yellow-50'
                          : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-medium">{flag.type}</h5>
                        <p className="text-xs text-gray-600 mt-1">{flag.description}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          flag.severity === 'low'
                            ? 'bg-green-100 text-green-800'
                            : flag.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {flag.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={runFraudDetection}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Run Fraud Detection Again
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin h-10 w-10 border-4 border-primary-500 rounded-full border-t-transparent mb-4"></div>
                <p className="text-gray-600">Running fraud detection...</p>
                <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="text-gray-600">No fraud detection has been run</p>
                <button
                  onClick={runFraudDetection}
                  className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Run Fraud Detection
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render credit application form
  const renderCreditApplication = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Credit Application</h3>

        <div className="space-y-6">
          {/* Applicant Type */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Applicant Information</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="individual"
                    name="applicantType"
                    value="individual"
                    checked={formData.applicantType === 'individual'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="individual" className="ml-2 text-sm text-gray-700">
                    Individual
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="business"
                    name="applicantType"
                    value="business"
                    checked={formData.applicantType === 'business'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="business" className="ml-2 text-sm text-gray-700">
                    Business
                  </label>
                </div>
              </div>

              {formData.applicantType === 'business' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="businessName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Name*
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="businessType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Type*
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="">Select Business Type</option>
                      <option value="LLC">LLC</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                      Tax ID (EIN)*
                    </label>
                    <input
                      type="text"
                      id="taxId"
                      name="taxId"
                      value={formData.taxId || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="yearsInBusiness"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Years in Business*
                    </label>
                    <input
                      type="text"
                      id="yearsInBusiness"
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                  Street Address*
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City*
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State*
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP Code*
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Financial Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700">
                  {formData.applicantType === 'business'
                    ? 'Annual Business Revenue*'
                    : 'Annual Income*'}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="annualRevenue"
                    name={formData.applicantType === 'business' ? 'annualRevenue' : 'annualIncome'}
                    value={
                      formData.applicantType === 'business'
                        ? formData.annualRevenue || ''
                        : formData.annualIncome || ''
                    }
                    onChange={handleInputChange}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700">
                  Credit Score (if known)
                </label>
                <input
                  type="text"
                  id="creditScore"
                  name="creditScore"
                  value={formData.creditScore || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                  Primary Bank
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={formData.bankName || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Loan Information */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Requested Financing</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">
                  Requested Amount*
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="loanAmount"
                    name="loanAmount"
                    value={formData.loanAmount || ''}
                    onChange={handleInputChange}
                    required
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="loanPurpose" className="block text-sm font-medium text-gray-700">
                  Purpose of Financing*
                </label>
                <select
                  id="loanPurpose"
                  name="loanPurpose"
                  value={formData.loanPurpose || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select Purpose</option>
                  <option value="Equipment Purchase">Equipment Purchase</option>
                  <option value="Working Capital">Working Capital</option>
                  <option value="Inventory Financing">Inventory Financing</option>
                  <option value="Business Expansion">Business Expansion</option>
                  <option value="Debt Refinancing">Debt Refinancing</option>
                  <option value="Real Estate">Real Estate</option>
                </select>
              </div>
              <div>
                <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700">
                  Preferred Term*
                </label>
                <select
                  id="loanTerm"
                  name="loanTerm"
                  value={formData.loanTerm || ''}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select Term</option>
                  <option value="12 Months">12 Months</option>
                  <option value="24 Months">24 Months</option>
                  <option value="36 Months">36 Months</option>
                  <option value="48 Months">48 Months</option>
                  <option value="60 Months">60 Months</option>
                  <option value="72 Months">72 Months</option>
                </select>
              </div>
              <div>
                <label htmlFor="collateral" className="block text-sm font-medium text-gray-700">
                  Collateral (if applicable)
                </label>
                <input
                  type="text"
                  id="collateral"
                  name="collateral"
                  value={formData.collateral || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Equipment, Real Estate, etc."
                />
              </div>
            </div>
          </div>

          {/* Electronic Signature */}
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-medium text-indigo-800 mb-2">Authorization & E-Signature</h4>
            <p className="text-sm text-gray-600 mb-4">
              By signing below, I certify that all information provided is accurate and authorize
              EVA AI to obtain credit reports and verify information provided for the purpose of
              evaluating this credit application.
            </p>

            <div className="border-2 border-gray-300 rounded-lg p-2 bg-white mb-3">
              <canvas
                ref={signatureRef}
                width={600}
                height={150}
                className="w-full cursor-crosshair"
              ></canvas>
            </div>

            <div className="flex justify-between items-center mb-4">
              <button
                type="button"
                onClick={clearSignature}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Clear Signature
              </button>

              {formData.hasESignature && (
                <div className="text-sm text-green-600 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
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
                  Signature Captured
                </div>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms || false}
                onChange={e => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 mt-1"
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-800">
                  Terms and Conditions
                </a>
                ,
                <a href="#" className="text-indigo-600 hover:text-indigo-800">
                  {' '}
                  Privacy Policy
                </a>
                , and consent to the electronic processing of my application.
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <animated.div
        style={modalAnimation}
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {documentId ? 'Verify Document' : 'New Credit Application'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            {/* Document Verification */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Document Verification</h3>

              {/* Document Selection */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Select Document to Verify
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredDocuments.map(doc => renderDocumentCard(doc))}
                </div>

                {renderUploadedDocuments()}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.tif,.tiff"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 text-sm bg-primary-50 text-primary-700 rounded-md border border-primary-200 hover:bg-primary-100 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
                        />
                      </svg>
                      Upload New Document
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('all_documents');
                      setShowDocumentManager(true);
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-primary-700 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    View All Documents
                  </button>
                </div>
              </div>

              {/* Verification Settings */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Verification Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Engine
                    </label>
                    <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option value="">Auto-select best engine</option>
                      {verificationEngines.map(engine => (
                        <option key={engine.id} value={engine.id}>
                          {engine.name} - {engine.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Confidence Threshold
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="85"
                          className="w-full mr-2"
                        />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fraud Detection Sensitivity
                      </label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        defaultValue="Medium"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      id="enhanced-verification"
                      checked={enableCrossCheck}
                      onChange={() => setEnableCrossCheck(!enableCrossCheck)}
                      className="mt-1 h-4 w-4 text-primary-600 rounded"
                    />
                    <div className="ml-2">
                      <label htmlFor="enhanced-verification" className="text-sm font-medium">
                        Enable Enhanced Verification
                      </label>
                      <p className="text-xs text-gray-500">
                        Uses multiple verification engines and cross-checks results with third-party
                        databases
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Processing */}
            {verificationStep === 'processing' && (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <div className="animate-spin mx-auto h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent mb-4"></div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Verifying Document</h3>
                <p className="text-gray-500">
                  This may take a moment while we analyze the document...
                </p>
              </div>
            )}

            {/* Verification Results */}
            {verificationStep === 'results' && verificationResults && (
              <div
                className={`bg-white p-4 rounded-lg border ${
                  verificationResults.verified ? 'border-green-200' : 'border-orange-200'
                }`}
              >
                <h3 className="text-lg font-medium text-gray-800 mb-2">Verification Results</h3>

                <div className="flex items-center mb-4">
                  <div
                    className={`p-2 rounded-full ${
                      verificationResults.verified
                        ? 'bg-green-100 text-green-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {verificationResults.verified ? (
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-medium">
                      {verificationResults.verified
                        ? 'Document Verified'
                        : 'Verification Issues Found'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Confidence Score: {Math.round(verificationResults.confidenceScore * 100)}%
                    </p>
                  </div>
                </div>

                {verificationResults.riskFlags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Risk Flags Identified:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {verificationResults.riskFlags.map((flag, index) => (
                        <li key={index} className="text-sm text-red-600">
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm text-gray-700">{verificationResults.notes}</p>
              </div>
            )}

            {/* Third Party Verification */}
            {verificationStep === 'third-party-check' && renderThirdPartyChecks()}
          </div>

          <div className="md:w-1/2">
            {/* Credit Application */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Credit Application</h3>
              {renderCreditApplication()}
            </div>

            {/* Compliance Check */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Compliance Check</h3>
              {renderComplianceCheck()}
            </div>

            {/* Fraud Detection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Fraud Detection</h3>
              {renderFraudDetection()}
            </div>

            {/* Credit Scoring */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Credit Scoring</h3>
              {renderCreditScoring()}
            </div>

            {/* Document Manager */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Document Manager</h3>
              {renderDocumentManager()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Powered by <span className="font-medium">EVA AI</span> Document Verification
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            {!showDocumentManager && activeTab !== 'credit_application' && (
              <button
                onClick={handleVerify}
                disabled={isVerifying || (verificationStep === 'select' && !selectedDocument)}
                className={`px-4 py-2 text-sm text-white rounded-md ${
                  isVerifying || (verificationStep === 'select' && !selectedDocument)
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isVerifying ? (
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
                    Verifying...
                  </span>
                ) : verificationStep === 'select' ? (
                  'Verify Document'
                ) : verificationStep === 'results' && enableCrossCheck ? (
                  'Cross-Check with External Databases'
                ) : (
                  'Complete Verification'
                )}
              </button>
            )}
            {activeTab === 'credit_application' && (
              <button
                onClick={handleSaveApplication}
                disabled={isSavingApplication || !formData.hasESignature || !formData.agreeToTerms}
                className={`px-4 py-2 text-sm text-white rounded-md ${
                  isSavingApplication || !formData.hasESignature || !formData.agreeToTerms
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isSavingApplication ? (
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
                    Saving Application...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            )}
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default DocumentVerificationSystem;
