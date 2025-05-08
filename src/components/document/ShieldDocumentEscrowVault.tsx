import React, { useState, useEffect, useContext, useCallback, useMemo, useRef, lazy } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { v4 as uuidv4 } from 'uuid';
import { FileItem } from './FilelockDriveApp';

// Interfaces for components
interface VirtualizedRowProps {
  doc: FileItem;
  lockStatus: DocumentLockStatus | undefined;
  retentionPeriod: number;
  isVerified: boolean;
  formatRetentionPeriod: (days: number) => string;
  handleDocumentVerify: (documentId: string, verified?: boolean) => void;
  handleUnlockDocument: (documentId: string) => void;
  handleViewDocument: (documentId: string) => void;
}

interface ErrorStateProps {
  error: string;
  retry: () => void;
}

// Define the existing interfaces
interface RetentionPolicy {
  userType: 'lender' | 'broker' | 'borrower' | 'vendor';
  retentionPeriod: number; // in days
  requiredDocuments: string[];
  complianceNotes: string;
  collateralTypes?: string[]; // Additional collateral-specific rules
  requestTypes?: string[];    // Additional request type rules
  instrumentTypes?: string[]; // Additional instrument type rules
}

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

interface ShieldDocumentVaultProps {
  documents: FileItem[];
  transactionId: string;
  transactionStatus: 'draft' | 'in_progress' | 'funded' | 'completed';
  userType: 'lender' | 'broker' | 'borrower' | 'vendor';
  collateralType?: string;
  requestType?: string;
  instrumentType?: string;
  onUpdateDocuments: (updatedDocuments: FileItem[]) => void;
}

// Additional import for virtualization
const VirtualizedRow = React.memo<VirtualizedRowProps>(({
  doc,
  lockStatus,
  retentionPeriod,
  isVerified,
  formatRetentionPeriod,
  handleDocumentVerify,
  handleUnlockDocument,
  handleViewDocument
}) => {
  return (
    <tr className={lockStatus?.retentionPolicyApplied ? 'bg-blue-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
            {doc.type === 'pdf' ? (
              <svg className="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            ) : doc.type === 'image' ? (
              <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
            <div className="text-sm text-gray-500">Last modified: {new Date(doc.lastModified).toLocaleDateString()}</div>
            {lockStatus?.verificationStatus === 'verified' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
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
      <td className="px-6 py-4 whitespace-nowrap">
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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {!isVerified && !lockStatus?.isLocked && (
          <button 
            className="text-green-600 hover:text-green-900 mr-3"
            onClick={() => handleDocumentVerify(doc.id)}
          >
            Verify & Lock
          </button>
        )}
        {lockStatus?.isLocked && lockStatus?.canBeUnlocked && (
          <button 
            className="text-primary-600 hover:text-primary-900 mr-3"
            onClick={() => handleUnlockDocument(doc.id)}
          >
            Unlock
          </button>
        )}
        <button 
          className="text-gray-600 hover:text-gray-900"
          onClick={() => handleViewDocument(doc.id)}
        >
          View
        </button>
      </td>
    </tr>
  );
});

// Memoized Loading component
const LoadingState = React.memo(() => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="bg-primary-600 px-6 py-4">
      <h2 className="text-white font-medium text-xl flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Shield Document Escrow Vault
      </h2>
    </div>
    <div className="p-6 flex justify-center items-center h-64">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading Shield Vault...</p>
      </div>
    </div>
  </div>
));

// Memoized Error component
const ErrorState = React.memo<ErrorStateProps>(({ error, retry }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <div className="bg-primary-600 px-6 py-4">
      <h2 className="text-white font-medium text-xl flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Shield Document Escrow Vault
      </h2>
    </div>
    <div className="p-6 flex flex-col items-center">
      <div className="bg-red-50 border border-red-200 rounded-md p-4 w-full max-w-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={retry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));

const ShieldDocumentEscrowVault: React.FC<ShieldDocumentVaultProps> = ({
  documents,
  transactionId,
  transactionStatus,
  userType,
  collateralType = 'equipment',
  requestType = 'loan',
  instrumentType = 'lease',
  onUpdateDocuments
}) => {
  const { userName } = useContext(UserContext);
  const [lockedDocuments, setLockedDocuments] = useState<Record<string, DocumentLockStatus>>({});
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([]);
  const [isLockingAll, setIsLockingAll] = useState(false);
  const [showRetentionPolicyModal, setShowRetentionPolicyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedDocuments, setVerifiedDocuments] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<number>(20); // Number of items to show initially
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // References for cleanup of async operations and observer
  const timeoutRefs = useRef<number[]>([]);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  
  // Clear all timeouts on component unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  // Modified loadRetentionPolicies with better error handling and performance
  const loadRetentionPolicies = useCallback(async () => {
    // This would normally be an API call
    // For demo, we'll simulate loading with a slight delay
    try {
      // Simulate API delay with reduced timeout (500ms instead of 1500ms)
      const timeoutId = window.setTimeout(() => {
        // Mock retention policies based on transaction type
        const policies: RetentionPolicy[] = [
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
        
        setRetentionPolicies(policies);
      }, 500);
      
      timeoutRefs.current.push(timeoutId);
    } catch (err) {
      console.error('Error loading retention policies:', err);
      setError('Failed to load retention policies. Please try again.');
    }
  }, []);

  // Modified fetchDocumentLockStatus with better performance
  const fetchDocumentLockStatus = useCallback(async () => {
    if (!documents || documents.length === 0) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Reduce simulation delay from 2000ms to 800ms
      const timeoutId = window.setTimeout(() => {
        // Create lock statuses for documents
        const newLockedDocuments: Record<string, DocumentLockStatus> = {};
        
        documents.forEach(doc => {
          // Simulate some documents being locked and others not
          const isLocked = doc.name.toLowerCase().includes('agreement') || 
                          doc.name.toLowerCase().includes('statement') || 
                          Math.random() > 0.7;
          
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
            
            newLockedDocuments[doc.id] = {
              isLocked,
              lockedBy: userName || 'System User',
              lockedAt: lockDate.toISOString(),
              transactionId,
              canBeUnlocked: Math.random() > 0.7,
              unlockedAfterFunding: Math.random() > 0.5,
              retentionPolicyApplied,
              verificationStatus: Math.random() > 0.3 ? 'verified' : 'pending',
              retentionEndDate
            };
          }
        });
        
        setLockedDocuments(newLockedDocuments);
        setIsLoading(false);
      }, 800);
      
      timeoutRefs.current.push(timeoutId);
    } catch (err) {
      console.error('Error fetching document lock status:', err);
      setError('Failed to fetch document lock status. Please try again.');
      setIsLoading(false);
    }
  }, [documents, transactionId, userName]);

  // Initialize data with optimized loading sequence
  useEffect(() => {
    // Skip initial data loading on first render to avoid conflicts with other components
    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Add a very short timeout to allow the UI to render first
      const initialTimeoutId = window.setTimeout(() => {
        setIsLoading(true);
        Promise.all([
          loadRetentionPolicies(),
          fetchDocumentLockStatus()
        ]).catch(err => {
          console.error('Error initializing Shield Vault:', err);
          setError('Failed to initialize Shield Vault. Please try again.');
          setIsLoading(false);
        });
      }, 50);
      
      timeoutRefs.current.push(initialTimeoutId);
    } else {
      // For subsequent renders (e.g., when documents update)
      setIsLoading(true);
      fetchDocumentLockStatus().catch(err => {
        console.error('Error updating document lock status:', err);
        setError('Failed to update document status. Please try again.');
        setIsLoading(false);
      });
    }
  }, [fetchDocumentLockStatus, loadRetentionPolicies]);

  // Use intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreTriggerRef.current || documents.length <= visibleItems) return;
    
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsLoadingMore(true);
        // Simulate loading delay
        const timeoutId = window.setTimeout(() => {
          setVisibleItems(prev => Math.min(prev + 10, documents.length));
          setIsLoadingMore(false);
        }, 200);
        timeoutRefs.current.push(timeoutId);
      }
    }, { rootMargin: '100px' });
    
    observer.observe(loadMoreTriggerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [documents.length, visibleItems]);
  
  // Cleanup function for all timeouts
  const clearAllTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(id => window.clearTimeout(id));
    timeoutRefs.current = [];
  }, []);

  // Use memoized selected policy to avoid recalculations
  const selectedPolicy = useMemo(() => {
    if (!retentionPolicies.length) return null;
    
    // Find the most specific policy that matches the user's context
    // Start with user type and narrow down by other criteria
    const matchingPolicies = retentionPolicies.filter(p => p.userType === userType);
    
    // First look for exact match with all criteria
    const exactMatch = matchingPolicies.find(p => 
      (p.collateralTypes?.includes(collateralType) || !p.collateralTypes) &&
      (p.requestTypes?.includes(requestType) || !p.requestTypes) &&
      (p.instrumentTypes?.includes(instrumentType) || !p.instrumentTypes)
    );
    
    if (exactMatch) return exactMatch;
    
    // Fall back to just userType if no specific match
    return matchingPolicies[0] || null;
  }, [retentionPolicies, userType, collateralType, requestType, instrumentType]);

  // Handle transaction funding - apply retention policies
  useEffect(() => {
    if ((transactionStatus === 'funded' || transactionStatus === 'completed') && selectedPolicy && !isLoading) {
      // Apply retention policies when transaction is funded
      const updatedLockStatus: Record<string, DocumentLockStatus> = {...lockedDocuments};
      let docsUpdated = false;
      const now = new Date();
      
      // Go through all documents
      documents.forEach(doc => {
        if (updatedLockStatus[doc.id] && !updatedLockStatus[doc.id].retentionPolicyApplied) {
          // Apply retention policy
          const shouldRetain = selectedPolicy.requiredDocuments.some(
            requiredDoc => doc.name.includes(requiredDoc)
          );
          
          // Calculate retention end date
          const retentionEndDate = shouldRetain ? 
            new Date(now.getTime() + selectedPolicy.retentionPeriod * 24 * 60 * 60 * 1000) : 
            undefined;
          
          // Update lock status based on retention policy
          updatedLockStatus[doc.id] = {
            ...updatedLockStatus[doc.id],
            retentionPolicyApplied: true,
            unlockedAfterFunding: !shouldRetain, // Unlock if not needed for retention
            canBeUnlocked: shouldRetain, // Can be manually unlocked if needed for retention
            isLocked: shouldRetain, // Lock document if it needs to be retained
            lockedBy: shouldRetain ? 'System (Compliance)' : updatedLockStatus[doc.id].lockedBy,
            lockedAt: shouldRetain ? now.toISOString() : updatedLockStatus[doc.id].lockedAt,
            retentionEndDate: retentionEndDate?.toISOString()
          };
          
          docsUpdated = true;
        }
      });
      
      if (docsUpdated) {
        setLockedDocuments(updatedLockStatus);
        
        // Update document metadata
        const updatedDocuments = documents.map(doc => {
          const lockStatus = updatedLockStatus[doc.id];
          if (lockStatus && lockStatus.retentionPolicyApplied && !lockStatus.unlockedAfterFunding) {
            return {
              ...doc,
              blockchainVerified: true,
              retentionEndDate: lockStatus.retentionEndDate,
              activity: [
                ...(doc.activity || []),
                {
                  type: 'retention_applied',
                  timestamp: now.toISOString(),
                  user: 'System',
                  details: `Document locked for retention until ${new Date(lockStatus.retentionEndDate || '').toLocaleDateString()}.`
                }
              ]
            } as FileItem;
          }
          return doc;
        });
        
        onUpdateDocuments(updatedDocuments);
      }
    }
  }, [transactionStatus, selectedPolicy, documents, lockedDocuments, onUpdateDocuments, isLoading]);

  // Handle document verification without using Array.from unnecessarily
  const handleDocumentVerify = useCallback((documentId: string, verified: boolean = true) => {
    if (verified) {
      // More efficient Set update without converting to array and back
      setVerifiedDocuments(prev => {
        const newSet = new Set(prev);
        newSet.add(documentId);
        return newSet;
      });
      
      // Update lock status
      const updatedLockStatus = {...lockedDocuments};
      if (updatedLockStatus[documentId]) {
        updatedLockStatus[documentId] = {
          ...updatedLockStatus[documentId],
          verificationStatus: 'verified',
          isLocked: true,
          lockedBy: 'System (Verification)',
          lockedAt: new Date().toISOString()
        };
        
        setLockedDocuments(updatedLockStatus);
        
        // Update document metadata
        const updatedDocuments = documents.map(doc => {
          if (doc.id === documentId) {
            return {
              ...doc,
              blockchainVerified: true,
              activity: [
                ...(doc.activity || []),
                {
                  type: 'document_verified',
                  timestamp: new Date().toISOString(),
                  user: 'System',
                  details: 'Document verified and locked in Shield Vault.'
                }
              ]
            } as FileItem;
          }
          return doc;
        });
        
        onUpdateDocuments(updatedDocuments);
      }
    }
  }, [documents, lockedDocuments, onUpdateDocuments]);

  // Lock all documents with better error handling
  const lockAllDocuments = useCallback(() => {
    if (isLockingAll) return; // Prevent multiple simultaneous calls
    
    setIsLockingAll(true);
    
    try {
      // Use batched updates to improve performance
      const timeoutId = window.setTimeout(() => {
        try {
          const updatedLockStatus: Record<string, DocumentLockStatus> = {};
          const now = new Date().toISOString();
          const updatedDocBatch: FileItem[] = [];
          
          documents.forEach(doc => {
            // Only update documents that aren't already locked
            if (!lockedDocuments[doc.id]?.isLocked) {
              updatedLockStatus[doc.id] = {
                isLocked: true,
                lockedBy: userName || 'System',
                lockedAt: now,
                transactionId: transactionId,
                canBeUnlocked: false,
                unlockedAfterFunding: false,
                retentionPolicyApplied: false,
                verificationStatus: 'pending'
              };
              
              // Update document metadata
              updatedDocBatch.push({
                ...doc,
                blockchainVerified: true,
                blockchainTxId: `shield_${uuidv4().substring(0, 8)}`,
                versions: [
                  ...(doc.versions || []),
                  {
                    id: `v${(doc.versions?.length || 0) + 1}`,
                    timestamp: now,
                    author: 'system'
                  }
                ],
                activity: [
                  ...(doc.activity || []),
                  {
                    type: 'document_locked',
                    timestamp: now,
                    user: userName || 'System',
                    details: `Document locked in Shield Document Escrow Vault.`
                  }
                ]
              });
            }
          });
          
          // Only update state if changes were made
          if (Object.keys(updatedLockStatus).length > 0) {
            setLockedDocuments(prev => ({...prev, ...updatedLockStatus}));
            
            // Update documents if there are changes
            if (updatedDocBatch.length > 0) {
              const finalDocuments = documents.map(
                doc => updatedDocBatch.find(updated => updated.id === doc.id) || doc
              ) as FileItem[];
              onUpdateDocuments(finalDocuments);
            }
          }
        } catch (err) {
          console.error('Error locking documents:', err);
          alert('Failed to lock all documents. Please try again.');
        } finally {
          setIsLockingAll(false);
        }
      }, 1000);
      
      timeoutRefs.current.push(timeoutId);
    } catch (err) {
      console.error('Error initiating lock operation:', err);
      setIsLockingAll(false);
    }
  }, [documents, lockedDocuments, userName, transactionId, onUpdateDocuments]);

  // Memoize helper functions
  const isDocumentRequiredForRetention = useCallback((document: FileItem) => {
    if (!selectedPolicy) return false;
    return selectedPolicy.requiredDocuments.some(
      requiredDoc => document.name.includes(requiredDoc)
    );
  }, [selectedPolicy]);

  const getRetentionPeriod = useCallback((document: FileItem) => {
    if (!selectedPolicy) return 0;
    return isDocumentRequiredForRetention(document) ? selectedPolicy.retentionPeriod : 0;
  }, [selectedPolicy, isDocumentRequiredForRetention]);

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
  
  // Memoized check for verified documents to avoid unnecessary renders
  const isDocumentVerified = useCallback((documentId: string) => {
    return verifiedDocuments.has(documentId);
  }, [verifiedDocuments]);

  // We'll use this for virtualization - only display visible items
  const displayedDocuments = useMemo(() => {
    return documents.slice(0, visibleItems);
  }, [documents, visibleItems]);

  // Handler for unlocking documents
  const handleUnlockDocument = useCallback(async (documentId: string) => {
    try {
      // This would be an actual API call in production
      // Simulate API delay
      const timeoutId = window.setTimeout(() => {
        // Update lock status
        const updatedLockStatus = {...lockedDocuments};
        if (updatedLockStatus[documentId]) {
          updatedLockStatus[documentId] = {
            ...updatedLockStatus[documentId],
            isLocked: false,
            unlockedAfterFunding: true,
            lockedBy: userName || 'System User',
            lockedAt: new Date().toISOString()
          };
          
          setLockedDocuments(updatedLockStatus);
          
          // Update document metadata
          const updatedDocuments = documents.map(doc => {
            if (doc.id === documentId) {
              return {
                ...doc,
                activity: [
                  ...(doc.activity || []),
                  {
                    type: 'document_unlocked',
                    timestamp: new Date().toISOString(),
                    user: userName || 'System User',
                    details: 'Document unlocked from Shield Vault.'
                  }
                ]
              } as FileItem;
            }
            return doc;
          });
          
          onUpdateDocuments(updatedDocuments);
          
          // Show success toast or message
          console.log('Document unlocked successfully:', documentId);
        }
      }, 800);
      
      timeoutRefs.current.push(timeoutId);
    } catch (err) {
      console.error('Error unlocking document:', err);
      setError('Failed to unlock document. Please try again.');
    }
  }, [documents, lockedDocuments, userName, onUpdateDocuments]);

  // Handler for viewing documents
  const handleViewDocument = useCallback((documentId: string) => {
    // Get the document from the list
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      console.log('Viewing document:', document.name);
      // This would typically open a document viewer or redirect to a view page
      // Safely access URL property which might be in document's properties or attachments
      const docUrl = (document as any).url || 
                    (document.downloadUrl) || 
                    `/documents/view/${documentId}`;
      window.open(docUrl, '_blank');
    }
  }, [documents]);

  // Return optimized render logic
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} retry={() => {
      setError(null);
      setIsLoading(true);
      Promise.all([
        loadRetentionPolicies(),
        fetchDocumentLockStatus()
      ]).catch(err => {
        console.error('Error retrying Shield Vault initialization:', err);
        setError('Failed to initialize Shield Vault. Please try again.');
        setIsLoading(false);
      });
    }} />;
  }

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
      
      <div className="p-6">
        {/* Status and action section */}
        <div className="mb-6 flex justify-between items-center">
          <div>
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
          
          <div className="flex space-x-2">
            <button
              onClick={lockAllDocuments}
              disabled={isLockingAll || Object.values(lockedDocuments).every(doc => doc.isLocked)}
              className={`px-4 py-2 text-sm font-medium rounded-md
                ${isLockingAll || Object.values(lockedDocuments).every(doc => doc.isLocked) 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {isLockingAll ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Locking Documents...
                </span>
              ) : Object.values(lockedDocuments).every(doc => doc.isLocked) ? (
                'All Documents Locked'
              ) : (
                'Lock All Documents'
              )}
            </button>
            
            <button 
              onClick={() => setShowRetentionPolicyModal(true)}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
            >
              View Retention Policy
            </button>
          </div>
        </div>
        
        {/* Compliance Information */}
        {selectedPolicy && (
          <div className="mb-6 bg-blue-50 p-4 rounded-md border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">Active Compliance Policy</h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>
                    <span className="font-medium">Retention: </span> 
                    {formatRetentionPeriod(selectedPolicy.retentionPeriod)} 
                    <span className="mx-2">|</span>
                    <span className="font-medium">Request Type: </span> 
                    {requestType}
                    <span className="mx-2">|</span>
                    <span className="font-medium">Collateral: </span> 
                    {collateralType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Document list - now virtualized */}
        <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lock Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retention
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedDocuments.map(doc => {
                const lockStatus = lockedDocuments[doc.id];
                const retentionPeriod = getRetentionPeriod(doc);
                const isVerified = isDocumentVerified(doc.id);
                
                return (
                  <VirtualizedRow
                    key={doc.id}
                    doc={doc}
                    lockStatus={lockStatus}
                    retentionPeriod={retentionPeriod}
                    isVerified={isVerified}
                    formatRetentionPeriod={formatRetentionPeriod}
                    handleDocumentVerify={handleDocumentVerify}
                    handleUnlockDocument={handleUnlockDocument}
                    handleViewDocument={handleViewDocument}
                  />
                );
              })}
            </tbody>
          </table>
          
          {/* Load more trigger - used by intersection observer */}
          {documents.length > visibleItems && (
            <div 
              ref={loadMoreTriggerRef} 
              className="flex justify-center items-center py-4 border-t border-gray-200"
            >
              {isLoadingMore ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin mr-2"></div>
                  <p className="text-sm text-gray-500">Loading more documents...</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Scroll for more documents</p>
              )}
            </div>
          )}
        </div>
        
        {/* Retention policy modal */}
        {showRetentionPolicyModal && selectedPolicy && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Document Retention Policy
                      </h3>
                      <div className="mt-2">
                        <div className="mb-4 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                          <p className="text-sm text-yellow-800">
                            <span className="font-medium">Transaction Specific Details:</span>
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <div className="text-sm">
                              <span className="text-gray-500">User Role:</span> 
                              <span className="ml-1 font-medium">{userType}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Request Type:</span> 
                              <span className="ml-1 font-medium">{requestType}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Collateral:</span> 
                              <span className="ml-1 font-medium">{collateralType}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500">Instrument:</span> 
                              <span className="ml-1 font-medium">{instrumentType}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          Your role as a <span className="font-medium">{selectedPolicy.userType}</span> has the following retention requirements:
                        </p>
                        <div className="mt-3 bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">Required retention period:</p>
                          <p className="text-sm text-gray-900 mt-1">{formatRetentionPeriod(selectedPolicy.retentionPeriod)}</p>
                          
                          <p className="text-sm font-medium text-gray-700 mt-3">Required documents:</p>
                          <ul className="mt-1 ml-4 list-disc text-sm text-gray-900">
                            {selectedPolicy.requiredDocuments.map((doc, i) => (
                              <li key={i}>{doc}</li>
                            ))}
                          </ul>
                          
                          <p className="text-sm font-medium text-gray-700 mt-3">Compliance notes:</p>
                          <p className="text-sm text-gray-900 mt-1">{selectedPolicy.complianceNotes}</p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-3">
                          When a transaction is funded, EVA AI will automatically apply this retention policy to determine which documents should be retained and for how long.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="button" 
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowRetentionPolicyModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Create a lazy-loaded wrapper component for the Shield Vault
// This will allow the main component to be code-split
export const LazyShieldDocumentEscrowVault = lazy(() => 
  Promise.resolve({ default: ShieldDocumentEscrowVault })
);

// Export the default component for direct imports
export default ShieldDocumentEscrowVault; 