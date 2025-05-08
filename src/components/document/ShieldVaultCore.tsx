import React, { useState, useEffect, useContext, useCallback, useMemo, memo } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { FileItem } from './FilelockDriveApp';

// Interfaces
interface DocumentLockStatus {
  isLocked: boolean;
  lockedBy: string;
  lockedAt: string;
  transactionId: string;
  canBeUnlocked: boolean;
  unlockedAfterFunding: boolean;
  retentionPolicyApplied: boolean;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  retentionEndDate?: string;
}

interface RetentionPolicy {
  userType: 'lender' | 'broker' | 'borrower' | 'vendor';
  retentionPeriod: number; // in days
  requiredDocuments: string[];
  complianceNotes: string;
  collateralTypes?: string[]; // Additional collateral-specific rules
  requestTypes?: string[];    // Additional request type rules
  instrumentTypes?: string[]; // Additional instrument type rules
}

interface ShieldVaultProps {
  documents: FileItem[];
  transactionId: string;
  transactionStatus: 'draft' | 'in_progress' | 'funded' | 'completed';
  userType: 'lender' | 'broker' | 'borrower' | 'vendor';
  collateralType?: string;
  requestType?: string;
  instrumentType?: string;
  onUpdateDocuments: (updatedDocuments: FileItem[]) => void;
}

// Document Row Component - Memoized for performance
const DocumentRow = memo(({ 
  doc, 
  lockStatus, 
  retentionPeriod,
  formatRetentionPeriod,
  onVerify, 
  onUnlock, 
  onView
}: {
  doc: FileItem;
  lockStatus?: DocumentLockStatus;
  retentionPeriod: number;
  formatRetentionPeriod: (days: number) => string;
  onVerify: (id: string) => void;
  onUnlock: (id: string) => void;
  onView: (id: string) => void;
}) => {
  return (
    <tr className={lockStatus?.retentionPolicyApplied ? 'bg-blue-50' : ''}>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
            {doc.type === 'pdf' ? (
              <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            ) : doc.type === 'image' ? (
              <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
            <div className="text-xs text-gray-500">
              Last modified: {new Date(doc.lastModified).toLocaleDateString()}
            </div>
            {lockStatus?.verificationStatus === 'verified' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                <svg className="-ml-0.5 mr-1 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {lockStatus?.isLocked ? (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Locked
          </span>
        ) : (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Unlocked
          </span>
        )}
        {lockStatus?.isLocked && (
          <div className="text-xs text-gray-500 mt-1">
            Locked by {lockStatus.lockedBy} on {new Date(lockStatus.lockedAt).toLocaleString()}
            {lockStatus.retentionEndDate && (
              <div className="mt-1">
                Until: {new Date(lockStatus.retentionEndDate).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {retentionPeriod > 0 ? (
          <div>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              Required
            </span>
            <div className="text-xs text-gray-500 mt-1">
              Keep for {formatRetentionPeriod(retentionPeriod)}
            </div>
          </div>
        ) : (
          <div>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
              Optional
            </span>
            <div className="text-xs text-gray-500 mt-1">
              No retention required
            </div>
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        {!lockStatus?.isLocked && (
          <button 
            className="text-green-600 hover:text-green-900 mr-3"
            onClick={() => onVerify(doc.id)}
          >
            Verify & Lock
          </button>
        )}
        {lockStatus?.isLocked && lockStatus?.canBeUnlocked && (
          <button 
            className="text-primary-600 hover:text-primary-900 mr-3"
            onClick={() => onUnlock(doc.id)}
          >
            Unlock
          </button>
        )}
        <button 
          className="text-gray-600 hover:text-gray-900"
          onClick={() => onView(doc.id)}
        >
          View
        </button>
      </td>
    </tr>
  );
});

// Empty State Component
const EmptyDocumentState = memo(() => (
  <tr>
    <td colSpan={4} className="px-6 py-12 text-center">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No documents available</h3>
      <p className="mt-1 text-sm text-gray-500">There are no documents to display in the Shield Vault.</p>
    </td>
  </tr>
));

// Main Component - Optimized Shield Vault Core
const ShieldVaultCore: React.FC<ShieldVaultProps> = (props) => {
  const { 
    documents, 
    transactionId, 
    transactionStatus, 
    userType, 
    collateralType = 'equipment', 
    requestType = 'loan', 
    instrumentType = 'lease',
    onUpdateDocuments 
  } = props;
  
  // Log once when component is first rendered
  React.useEffect(() => {
    console.log('ShieldVaultCore loaded successfully');
  }, []);
  
  const { userName } = useContext(UserContext);
  
  // State with reduced initialization overhead
  const [lockStatuses, setLockStatuses] = useState<Record<string, DocumentLockStatus>>({});
  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleDocs, setVisibleDocs] = useState(10);
  
  // Timeouts cleanup
  const timeoutIds = React.useRef<number[]>([]);
  
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(id => window.clearTimeout(id));
    };
  }, []);

  // Load data with optimized timeouts (parallelized loading)
  useEffect(() => {
    setIsLoading(true);
    
    // Load policies - reduced delay
    const policyTimeout = window.setTimeout(() => {
      // Mock retention policies
      const mockPolicies: RetentionPolicy[] = [
        {
          userType: 'lender',
          retentionPeriod: 2555, // ~7 years
          requiredDocuments: ['loan_agreement', 'promissory_note', 'security_agreement'],
          complianceNotes: 'Required for regulatory compliance and audit purposes.',
          collateralTypes: ['equipment', 'vehicle', 'real_estate'],
          requestTypes: ['loan', 'lease'],
          instrumentTypes: ['term_loan', 'lease', 'line_of_credit']
        },
        {
          userType: 'broker',
          retentionPeriod: 1095, // 3 years
          requiredDocuments: ['commission_agreement', 'licensing_documentation'],
          complianceNotes: 'Required for broker compliance and commission verification.',
          requestTypes: ['loan', 'lease'],
        },
        {
          userType: 'borrower',
          retentionPeriod: 730, // 2 years
          requiredDocuments: ['application', 'financial_statements', 'tax_returns'],
          complianceNotes: 'Required for customer record keeping and dispute resolution.',
          collateralTypes: ['equipment', 'vehicle', 'real_estate'],
          instrumentTypes: ['term_loan', 'lease']
        },
        {
          userType: 'vendor',
          retentionPeriod: 730, // 2 years
          requiredDocuments: ['invoice', 'purchase_order', 'delivery_confirmation'],
          complianceNotes: 'Required for vendor payment verification and warranty claims.',
          collateralTypes: ['equipment', 'vehicle'],
        }
      ];
      
      setPolicies(mockPolicies);
    }, 200);
    
    // Load lock statuses - reduced delay
    const statusTimeout = window.setTimeout(() => {
      try {
        // Create mock lock statuses for documents
        const lockData: Record<string, DocumentLockStatus> = {};
        
        documents.forEach(doc => {
          // Simulate some documents being locked and others not
          const isLocked = doc.name.toLowerCase().includes('agreement') || 
                         doc.name.toLowerCase().includes('statement') || 
                         Math.random() > 0.5;
          
          if (isLocked) {
            const lockDate = new Date();
            lockDate.setDate(lockDate.getDate() - Math.floor(Math.random() * 30));
            
            // Calculate retention end date (if retention policy applied)
            const retentionPolicyApplied = Math.random() > 0.3;
            let retentionEndDate: string | undefined = undefined;
            
            if (retentionPolicyApplied) {
              const endDate = new Date(lockDate);
              const retentionYears = [2, 3, 5, 7][Math.floor(Math.random() * 4)];
              endDate.setFullYear(endDate.getFullYear() + retentionYears);
              retentionEndDate = endDate.toISOString();
            }
            
            lockData[doc.id] = {
              isLocked,
              lockedBy: userName || 'System User',
              lockedAt: lockDate.toISOString(),
              transactionId,
              canBeUnlocked: Math.random() > 0.5,
              unlockedAfterFunding: Math.random() > 0.5,
              retentionPolicyApplied,
              verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending',
              retentionEndDate
            };
          }
        });
        
        setLockStatuses(lockData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading lock statuses:', err);
        setError('Failed to load document lock statuses. Please try again.');
        setIsLoading(false);
      }
    }, 400);
    
    timeoutIds.current.push(policyTimeout, statusTimeout);
    
    return () => {
      window.clearTimeout(policyTimeout);
      window.clearTimeout(statusTimeout);
    };
  }, [documents, transactionId, userName]);

  // Efficiently memoize the selected policy
  const selectedPolicy = useMemo(() => {
    if (!policies.length) return null;
    
    // Find the most specific policy that matches
    const matchingPolicies = policies.filter(p => p.userType === userType);
    
    const exactMatch = matchingPolicies.find(p => 
      (p.collateralTypes?.includes(collateralType) || !p.collateralTypes) &&
      (p.requestTypes?.includes(requestType) || !p.requestTypes) &&
      (p.instrumentTypes?.includes(instrumentType) || !p.instrumentTypes)
    );
    
    return exactMatch || matchingPolicies[0] || null;
  }, [policies, userType, collateralType, requestType, instrumentType]);

  // Handler functions - memoized for performance
  const handleVerifyAndLock = useCallback((documentId: string) => {
    // Update lock status
    setLockStatuses(prev => ({
      ...prev,
      [documentId]: {
        isLocked: true,
        lockedBy: userName || 'System',
        lockedAt: new Date().toISOString(),
        transactionId,
        canBeUnlocked: true,
        unlockedAfterFunding: false,
        retentionPolicyApplied: false,
        verificationStatus: 'verified'
      }
    }));
    
    // Update document metadata
    const updatedDocs = documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          blockchainVerified: true,
          activity: [
            ...(doc.activity || []),
            {
              type: 'document_verified',
              timestamp: new Date().toISOString(),
              user: userName || 'System',
              details: 'Document verified and locked in Shield Vault.'
            }
          ]
        };
      }
      return doc;
    });
    
    onUpdateDocuments(updatedDocs);
  }, [documents, userName, transactionId, onUpdateDocuments]);

  const handleUnlock = useCallback((documentId: string) => {
    // Update lock status
    setLockStatuses(prev => {
      if (!prev[documentId]) return prev;
      
      return {
        ...prev,
        [documentId]: {
          ...prev[documentId],
          isLocked: false,
          unlockedAfterFunding: true,
          lockedBy: userName || 'System',
          lockedAt: new Date().toISOString()
        }
      };
    });
    
    // Update document metadata
    const updatedDocs = documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          activity: [
            ...(doc.activity || []),
            {
              type: 'document_unlocked',
              timestamp: new Date().toISOString(),
              user: userName || 'System',
              details: 'Document unlocked from Shield Vault.'
            }
          ]
        };
      }
      return doc;
    });
    
    onUpdateDocuments(updatedDocs);
  }, [documents, userName, onUpdateDocuments]);

  const handleView = useCallback((documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc) {
      const url = (doc as any).url || 
                  doc.downloadUrl || 
                  `/documents/view/${documentId}`;
      window.open(url, '_blank');
    }
  }, [documents]);

  const handleLockAll = useCallback(() => {
    // Get documents that aren't locked yet
    const unlockedDocs = documents.filter(doc => !lockStatuses[doc.id]?.isLocked);
    if (!unlockedDocs.length) return;
    
    // Create new lock statuses
    const newStatuses: Record<string, DocumentLockStatus> = {};
    const now = new Date().toISOString();
    
    unlockedDocs.forEach(doc => {
      newStatuses[doc.id] = {
        isLocked: true,
        lockedBy: userName || 'System',
        lockedAt: now,
        transactionId,
        canBeUnlocked: true,
        unlockedAfterFunding: false,
        retentionPolicyApplied: false,
        verificationStatus: 'pending'
      };
    });
    
    // Update lock statuses
    setLockStatuses(prev => ({...prev, ...newStatuses}));
    
    // Update document metadata
    const updatedDocs = documents.map(doc => {
      if (newStatuses[doc.id]) {
        return {
          ...doc,
          blockchainVerified: true,
          activity: [
            ...(doc.activity || []),
            {
              type: 'document_locked',
              timestamp: now,
              user: userName || 'System',
              details: 'Document locked in Shield Vault.'
            }
          ]
        };
      }
      return doc;
    });
    
    onUpdateDocuments(updatedDocs);
  }, [documents, lockStatuses, userName, transactionId, onUpdateDocuments]);

  const formatRetentionPeriod = useCallback((days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
  }, []);

  const getRetentionPeriod = useCallback((document: FileItem) => {
    if (!selectedPolicy) return 0;
    
    // Check if document is required by retention policy
    const isRequired = selectedPolicy.requiredDocuments.some(
      reqDoc => document.name.toLowerCase().includes(reqDoc.toLowerCase())
    );
    
    return isRequired ? selectedPolicy.retentionPeriod : 0;
  }, [selectedPolicy]);

  // Load more documents
  const handleLoadMore = useCallback(() => {
    setVisibleDocs(prev => Math.min(prev + 10, documents.length));
  }, [documents.length]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary-600 px-6 py-4">
          <h2 className="text-white font-medium text-xl flex items-center">Shield Document Escrow Vault</h2>
          <p className="text-primary-100 mt-1">Secure document storage with automated retention policies</p>
        </div>
        <div className="p-6 flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading Shield Vault...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary-600 px-6 py-4">
          <h2 className="text-white font-medium text-xl flex items-center">Shield Document Escrow Vault</h2>
        </div>
        <div className="p-6 flex justify-center items-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 w-full max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only display visible items for better performance
  const visibleDocuments = documents.slice(0, visibleDocs);
  const hasMoreToLoad = visibleDocs < documents.length;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-primary-600 px-6 py-4">
        <h2 className="text-white font-medium text-xl flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Shield Document Escrow Vault
        </h2>
        <p className="text-primary-100 mt-1">
          Secure document storage with automated retention policies
        </p>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Transaction info */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="mb-2 sm:mb-0">
            <span className="text-sm font-medium text-gray-500">Transaction ID:</span>
            <span className="ml-2 text-sm text-gray-900">{transactionId}</span>
            <span className="ml-4 text-sm font-medium text-gray-500">Status:</span>
            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${transactionStatus === 'funded' ? 'bg-green-100 text-green-800' : 
                transactionStatus === 'completed' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {transactionStatus.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <button
            onClick={handleLockAll}
            disabled={documents.every(doc => lockStatuses[doc.id]?.isLocked)}
            className={`px-4 py-2 text-sm font-medium rounded-md
              ${documents.every(doc => lockStatuses[doc.id]?.isLocked) 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            Lock All Documents
          </button>
        </div>
        
        {/* Policy info */}
        {selectedPolicy && (
          <div className="mb-4 bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">Retention Policy</h3>
                <div className="mt-1 text-xs text-blue-700">
                  <span className="font-medium">{formatRetentionPeriod(selectedPolicy.retentionPeriod)}</span> retention required for {userType} documents
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Document table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lock Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retention
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visibleDocuments.length === 0 ? (
                <EmptyDocumentState />
              ) : (
                visibleDocuments.map(doc => (
                  <DocumentRow 
                    key={doc.id}
                    doc={doc}
                    lockStatus={lockStatuses[doc.id]}
                    retentionPeriod={getRetentionPeriod(doc)}
                    formatRetentionPeriod={formatRetentionPeriod}
                    onVerify={handleVerifyAndLock}
                    onUnlock={handleUnlock}
                    onView={handleView}
                  />
                ))
              )}
            </tbody>
          </table>
          
          {/* Load more button */}
          {hasMoreToLoad && (
            <div className="flex justify-center p-4 border-t border-gray-200">
              <button 
                onClick={handleLoadMore}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md"
              >
                Load More Documents
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShieldVaultCore; 