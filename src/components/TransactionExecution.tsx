import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
import { useWorkflow } from '../contexts/WorkflowContext';
import { useNavigate, useParams } from 'react-router-dom';
// Lazy load heavy components
const TransactionDocumentViewer = lazy(() => import('./document/TransactionDocumentViewer'));
import { UserContext } from '../contexts/UserContext';

interface Document {
  id: string;
  name: string;
  type: 'financial' | 'legal' | 'tax' | 'appraisal' | 'invoice' | 'insurance' | 'bank';
  status: 'required' | 'uploaded' | 'approved' | 'rejected' | 'sent_for_signature' | 'signed';
  uploadedAt?: string;
  fileURL?: string;
  lockedBy?: string;
  lockedUntil?: string;
  versionCount?: number;
  lastModified?: string;
  blockchainVerified?: boolean;
  verificationStatus?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  archivedInVault?: boolean;
  archivedAt?: string;
  blockchainTxId?: string;
  activity?: Array<{
    type: string;
    timestamp: string;
    user: string;
    details?: string;
  }>;
}

// Add props interface for DocumentRow
interface DocumentRowProps {
  document: Document;
  formatDate: (dateString?: string) => string;
  getStatusBadgeColor: (status: Document['status']) => string;
  handleViewDocument: (documentId: string) => void;
  handleVerifyAndArchive: (document: Document) => void;
}

// Memoized loading spinner component for reuse
const LoadingSpinner = React.memo(() => (
  <div className="flex justify-center items-center h-64">
    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-4 text-gray-700">Loading...</p>
  </div>
));

// Memoize document row to prevent unnecessary re-renders
const DocumentRow = React.memo<DocumentRowProps>(({ 
  document, 
  formatDate, 
  getStatusBadgeColor, 
  handleViewDocument, 
  handleVerifyAndArchive 
}) => (
  <tr key={document.id} className={document.lockedBy ? 'bg-amber-50' : ''}>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
          {document.type === 'financial' ? (
            <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2.343M10 14v-4m-4 4v-2m8 2v-6"></path>
            </svg>
          ) : document.type === 'legal' ? (
            <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v2H7V5zm6 4H7v2h6V9zm-6 4h6v2H7v-2z"></path>
            </svg>
          ) : document.type === 'tax' ? (
            <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2.343M10 14a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
          ) : (
            <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path>
            </svg>
          )}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {document.name}
          </div>
          {document.lockedBy && (
            <div className="flex items-center mt-1">
              <svg className="h-3 w-3 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
              </svg>
              <span className="text-xs text-amber-600">
                Locked by {document.lockedBy} until {formatDate(document.lockedUntil)}
              </span>
            </div>
          )}
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(document.status)}`}>
        {document.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {formatDate(document.uploadedAt)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      v{document.versionCount || 1}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <button
        onClick={() => handleViewDocument(document.id)}
        className="text-primary-600 hover:text-primary-900 mr-4"
      >
        View
      </button>
      
      {/* Refactored Verify & Archive button */}
      <button
        onClick={() => handleVerifyAndArchive(document)}
        className="text-green-600 hover:text-green-900"
      >
        Verify & Archive
      </button>
    </td>
  </tr>
));

const TransactionExecution: React.FC = () => {
  const { currentTransaction, advanceStage } = useWorkflow();
  const { userRole } = React.useContext(UserContext);
  const navigate = useNavigate();
  const { transactionId } = useParams<{ transactionId: string }>();
  
  // State for document management
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'documents' | 'blockchain' | 'covenants' | 'vault'>('documents');
  const [viewingDocument, setViewingDocument] = useState<string | null>(null);
  const [generateAllLoading, setGenerateAllLoading] = useState(false);
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Memoize document handling functions to prevent unnecessary re-renders
  const handleLockDocument = useCallback((documentId: string) => {
    setDocuments(prevDocuments => 
      prevDocuments.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              lockedBy: 'Current User', 
              lockedUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString() 
            } 
          : doc
      )
    );
  }, []);
  
  const handleUnlockDocument = useCallback((documentId: string) => {
    setDocuments(prevDocuments => 
      prevDocuments.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              lockedBy: undefined, 
              lockedUntil: undefined
            } 
          : doc
      )
    );
  }, []);
  
  // Handle document view
  const handleViewDocument = useCallback((documentId: string) => {
    setViewingDocument(documentId);
  }, []);
  
  // Handle close document viewer
  const handleCloseViewer = useCallback(() => {
    setViewingDocument(null);
  }, []);
  
  // Chunk document loading to prevent UI freezing
  const loadDocumentsInChunks = useCallback(async (mockData: Document[]) => {
    // Process documents in chunks of 3 to prevent UI freezing
    const chunkSize = 3;
    
    for (let i = 0; i < mockData.length; i += chunkSize) {
      const chunk = mockData.slice(i, i + chunkSize);
      
      // Use setTimeout to give UI time to breathe between chunks
      await new Promise<void>(resolve => {
        setTimeout(() => {
          setDocuments(prevDocs => [...prevDocs, ...chunk]);
          resolve();
        }, 10);
      });
    }
    
    setIsLoading(false);
  }, []);
  
  // Load transaction documents with proper error handling and cleanup
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    
    // Reset documents when loading new data
    setDocuments([]);
    
    const loadDocuments = async () => {
      try {
        // In a real app, this would fetch from your API
        await new Promise(resolve => setTimeout(resolve, 300)); // reduced wait time
        
        // Simulate API response
        const mockDocuments: Document[] = [
          {
            id: 'doc-001',
            name: 'Master Lease Agreement',
            type: 'legal',
            status: 'sent_for_signature',
            uploadedAt: new Date().toISOString(),
            fileURL: '#',
            versionCount: 3,
            lastModified: new Date().toISOString()
          },
          {
            id: 'doc-002',
            name: 'Equipment Schedule',
            type: 'legal',
            status: 'sent_for_signature',
            uploadedAt: new Date().toISOString(),
            fileURL: '#',
            versionCount: 2,
            lastModified: new Date().toISOString()
          },
          {
            id: 'doc-003',
            name: 'Insurance Certificate',
            type: 'insurance',
            status: 'sent_for_signature',
            uploadedAt: new Date().toISOString(),
            fileURL: '#',
            versionCount: 1,
            lastModified: new Date().toISOString()
          },
          {
            id: 'doc-004',
            name: 'Delivery & Acceptance',
            type: 'legal',
            status: 'sent_for_signature',
            uploadedAt: new Date().toISOString(),
            fileURL: '#',
            versionCount: 1,
            lastModified: new Date().toISOString()
          },
          {
            id: 'doc-005',
            name: 'ACH Authorization',
            type: 'financial',
            status: 'sent_for_signature',
            uploadedAt: new Date().toISOString(),
            fileURL: '#',
            versionCount: 1,
            lastModified: new Date().toISOString()
          },
          {
            id: 'doc-006',
            name: 'Financial Covenants Rider',
            type: 'financial',
            status: 'sent_for_signature',
            uploadedAt: new Date().toISOString(),
            fileURL: '#',
            versionCount: 1,
            lastModified: new Date().toISOString()
          },
          {
            id: 'doc-007',
            name: 'Approved Deal Structure',
            type: 'legal',
            status: 'sent_for_signature',
            uploadedAt: new Date().toISOString(),
            fileURL: '#',
            versionCount: 2,
            lastModified: new Date().toISOString()
          },
          {
            id: 'doc-008',
            name: 'Blockchain Smart Contract',
            type: 'legal',
            status: 'sent_for_signature',
            uploadedAt: new Date().toISOString(),
            fileURL: '#',
            versionCount: 1,
            lastModified: new Date().toISOString()
          },
        ];
        
        if (isMounted) {
          // Load documents in chunks to prevent UI freezing
          await loadDocumentsInChunks(mockDocuments);
        }
      } catch (err) {
        console.error('Error loading documents:', err);
        if (isMounted) {
          setError('Failed to load transaction documents. Please try again.');
          setIsLoading(false);
        }
      }
    };
    
    loadDocuments();
    
    // Cleanup function to handle component unmount
    return () => {
      isMounted = false;
    };
  }, [transactionId, loadDocumentsInChunks]);
  
  // Generate all documents with error handling
  const handleGenerateAll = useCallback(async () => {
    setGenerateAllLoading(true);
    
    try {
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update all documents to 'uploaded' status
      setDocuments(prevDocuments => 
        prevDocuments.map(doc => ({
          ...doc,
          status: 'uploaded',
          uploadedAt: new Date().toISOString()
        }))
      );
    } catch (error) {
      console.error('Error generating documents:', error);
      // Show user-friendly error 
      alert('Could not generate documents. Please try again.');
    } finally {
      setGenerateAllLoading(false);
    }
  }, []);
  
  // Send documents for signature with error handling
  const handleSendForSignature = useCallback(async () => {
    setSignatureLoading(true);
    
    try {
      // Simulate sending for signature
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update all documents to 'sent_for_signature' status
      setDocuments(prevDocuments => 
        prevDocuments.map(doc => ({
          ...doc,
          status: 'sent_for_signature'
        }))
      );
    } catch (error) {
      console.error('Error sending for signature:', error);
      alert('Could not send documents for signature. Please try again.');
    } finally {
      setSignatureLoading(false);
    }
  }, []);
  
  // Extract verify and archive functionality
  const handleVerifyAndArchive = useCallback((document: Document) => {
    // First verify the document
    const updatedDocuments = documents.map(doc => {
      if (doc.id === document.id) {
        return {
          ...doc,
          blockchainVerified: true,
          verificationStatus: 'verified',
          verifiedAt: new Date().toISOString(),
          verifiedBy: 'Current User'
        };
      }
      return doc;
    });
    
    // Update documents state
    setDocuments(updatedDocuments);
    
    // Show confirmation dialog
    const confirmArchive = window.confirm(
      `Document "${document.name}" has been verified. Would you like to archive it in the Shield Vault for secure retention?`
    );
    
    if (confirmArchive) {
      // Simulate archive
      setTimeout(() => {
        alert(`Document "${document.name}" has been securely archived in Shield Vault with blockchain verification.`);
        
        // Update document status with correct structure
        const archiveDocuments = updatedDocuments.map(doc => {
          if (doc.id === document.id) {
            // Include necessary fields for archived documents
            return {
              ...doc,
              status: 'approved' as const,
              archivedInVault: true,
              archivedAt: new Date().toISOString(),
              blockchainTxId: `archive_${doc.id.substring(4)}`,
              activity: [{
                type: 'document_archived',
                timestamp: new Date().toISOString(),
                user: 'Current User',
                details: 'Document verified and archived in Shield Vault'
              }]
            } as Document; // Explicitly cast to Document type
          }
          return doc;
        });
        
        setDocuments(archiveDocuments);
      }, 1000);
    }
  }, [documents]);

  // Format date helper function
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);
  
  // Get status badge color
  const getStatusBadgeColor = useCallback((status: Document['status']) => {
    switch (status) {
      case 'required':
        return 'bg-gray-100 text-gray-800';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'sent_for_signature':
        return 'bg-yellow-100 text-yellow-800';
      case 'signed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Memoize expensive calculations 
  const documentsSorted = useMemo(() => {
    return [...documents].sort((a, b) => {
      // Sort by status (approved first, then sent_for_signature, etc.)
      return a.name.localeCompare(b.name);
    });
  }, [documents]);

  // Show loading indicator
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Transaction</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Execution</h1>
        <p className="text-sm text-gray-500 mt-1">Generate, sign, and securely store transaction documents on blockchain</p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'blockchain'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('blockchain')}
          >
            Blockchain Verification
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'covenants'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('covenants')}
          >
            Covenants
          </button>
          <button
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'vault'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('vault')}
          >
            Shield Vault
          </button>
        </nav>
      </div>
      
      {/* Document List */}
      {activeTab === 'documents' && !viewingDocument && (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Transaction Documents</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleGenerateAll}
                disabled={generateAllLoading}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  generateAllLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {generateAllLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate All'
                )}
              </button>
              <button
                onClick={handleSendForSignature}
                disabled={signatureLoading || documents.some(doc => doc.status === 'required')}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  signatureLoading || documents.some(doc => doc.status === 'required')
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {signatureLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send for Signature'
                )}
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentsSorted.map((document) => (
                  <DocumentRow 
                    key={document.id}
                    document={document}
                    formatDate={formatDate}
                    getStatusBadgeColor={getStatusBadgeColor}
                    handleViewDocument={handleViewDocument}
                    handleVerifyAndArchive={handleVerifyAndArchive}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Checklist Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Closing Checklist</h3>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="ml-2 text-gray-700">1. Generate closing documents</p>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="ml-2 text-gray-700">2. Send documents for signature</p>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="ml-2 text-gray-500">3. Complete blockchain verification</p>
              </div>
              <div className="flex items-center text-sm">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="ml-2 text-gray-500">4. Verify KYC and complete closing</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Document Viewer with memoized callbacks and Suspense for lazy loading */}
      {activeTab === 'documents' && viewingDocument && (
        <Suspense fallback={<LoadingSpinner />}>
          <TransactionDocumentViewer 
            documentId={viewingDocument}
            transactionId={transactionId || 'TX-12346'}
            onBack={handleCloseViewer}
            onLock={handleLockDocument}
            onUnlock={handleUnlockDocument}
          />
        </Suspense>
      )}
      
      {/* Other tabs with Suspense */}
      {activeTab === 'blockchain' && (
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Blockchain Verification</h2>
          <p className="text-gray-500">Blockchain verification interface will be displayed here.</p>
        </div>
      )}
      
      {activeTab === 'covenants' && (
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Covenants</h2>
          <p className="text-gray-500">Financial covenants interface will be displayed here.</p>
        </div>
      )}
      
      {activeTab === 'vault' && (
        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shield Vault</h2>
          <p className="text-gray-500">Secure document storage vault will be displayed here.</p>
        </div>
      )}
      
      {/* Transaction Summary Sidebar */}
      <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Transaction Summary</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">TX-12346</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Applicant</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">ABC Corp</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Transaction Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Working Capital</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">$100,000</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Approved Terms</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">No approved deal terms</dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => {
              // This would complete the document setup process
              alert('Document setup complete!');
            }}
          >
            Complete Document Setup First
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TransactionExecution); 