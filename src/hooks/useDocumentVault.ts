import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import DocumentSecurityService, { UserType, DocumentVaultRecord, RetentionPolicy } from '../services/DocumentSecurityService';
import { FileItem } from '../components/document/FilelockDriveApp';

// Extended interface for file items with retention data
export interface ExtendedFileItem extends FileItem {
  retentionPeriod?: number;
  retentionExpiryDate?: string;
}

interface DocumentVaultState {
  documents: ExtendedFileItem[];
  vaultRecords: DocumentVaultRecord[];
  loading: boolean;
  lockedDocuments: Record<string, boolean>;
  retentionPolicy: RetentionPolicy | null;
  isLockingAll: boolean;
  selectedDocuments: string[];
}

interface UseDocumentVaultProps {
  transactionId: string;
  initialDocuments: FileItem[];
  userType: UserType;
  transactionStatus: 'draft' | 'in_progress' | 'pending_signatures' | 'funded' | 'completed';
}

interface DocumentVaultActions {
  lockDocument: (documentId: string) => Promise<void>;
  unlockDocument: (documentId: string, userName: string) => Promise<void>;
  lockAllDocuments: () => Promise<void>;
  applyRetentionPolicies: () => Promise<void>;
  getDocumentRetentionInfo: (documentId: string) => {
    retentionPeriod: number;
    retentionExpiryDate: string | null;
    isRequired: boolean;
  };
  selectDocument: (documentId: string, selected: boolean) => void;
  bulkLockDocuments: () => Promise<void>;
  getAIRetentionProtocol: (documentId: string) => Promise<{
    recommendation: string;
    retentionPeriod: number;
    reasoning: string;
  }>;
}

// Hook for managing documents in the Shield Vault
export default function useDocumentVault({
  transactionId,
  initialDocuments,
  userType,
  transactionStatus
}: UseDocumentVaultProps): [DocumentVaultState, DocumentVaultActions] {
  const { userName, userId } = useContext(UserContext);
  const [state, setState] = useState<DocumentVaultState>({
    documents: [],
    vaultRecords: [],
    loading: true,
    lockedDocuments: {},
    retentionPolicy: null,
    isLockingAll: false,
    selectedDocuments: []
  });

  // Initialize document security service
  const documentSecurityService = DocumentSecurityService.getInstance();

  // Load vault records on mount
  useEffect(() => {
    const loadVaultRecords = async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        // Get documents in vault
        const vaultRecords = documentSecurityService.getDocumentsInVault(transactionId);
        
        // Create a map of locked documents
        const lockedDocuments: Record<string, boolean> = {};
        vaultRecords.forEach(record => {
          lockedDocuments[record.documentId] = record.documentMetadata.isLocked;
        });
        
        // Get retention policy for user type
        const retentionPolicy = documentSecurityService.getRetentionPolicy(userType);
        
        // Update state
        setState(prev => ({
          ...prev,
          vaultRecords,
          documents: initialDocuments,
          lockedDocuments,
          retentionPolicy,
          loading: false
        }));
      } catch (error) {
        console.error("Error loading vault records:", error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    
    loadVaultRecords();
  }, [transactionId, userType, initialDocuments, documentSecurityService]);

  // Lock a document
  const lockDocument = async (documentId: string): Promise<void> => {
    if (!userName) return;
    
    try {
      // Call security service to lock document
      const updatedDocument = documentSecurityService.lockDocument(
        documentId, 
        transactionId,
        userName
      );
      
      // If successful, update our state
      if (updatedDocument) {
        const updatedDocuments = state.documents.map(doc => 
          doc.id === documentId ? {...doc, ...updatedDocument} : doc
        );
        
        const updatedLockedDocuments = { 
          ...state.lockedDocuments, 
          [documentId]: true 
        };
        
        setState(prev => ({
          ...prev,
          documents: updatedDocuments,
          lockedDocuments: updatedLockedDocuments
        }));
      }
    } catch (error) {
      console.error(`Error locking document ${documentId}:`, error);
    }
  };

  // Unlock a document
  const unlockDocument = async (documentId: string, userNameParam?: string): Promise<void> => {
    const effectiveUserName = userNameParam || userName;
    if (!effectiveUserName) return;
    
    try {
      const success = documentSecurityService.unlockDocument(
        documentId,
        transactionId,
        effectiveUserName
      );
      
      if (success) {
        const updatedLockedDocuments = { 
          ...state.lockedDocuments, 
          [documentId]: false 
        };
        
        setState(prev => ({
          ...prev,
          lockedDocuments: updatedLockedDocuments
        }));
      }
    } catch (error) {
      console.error(`Error unlocking document ${documentId}:`, error);
    }
  };

  // Lock all documents
  const lockAllDocuments = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLockingAll: true }));
    
    try {
      const documentIds = state.documents.map(doc => doc.id);
      await lockDocuments(documentIds);
    } catch (error) {
      console.error("Error locking all documents:", error);
    } finally {
      setState(prev => ({ ...prev, isLockingAll: false }));
    }
  };

  // Lock multiple documents
  const lockDocuments = async (documentIds: string[]): Promise<void> => {
    if (!userName) return;
    
    try {
      // Process each document sequentially
      const updatedDocuments = [...state.documents];
      const updatedLockedDocuments = { ...state.lockedDocuments };
      
      for (const documentId of documentIds) {
        const updatedDocument = documentSecurityService.lockDocument(
          documentId,
          transactionId,
          userName
        );
        
        if (updatedDocument) {
          // Update document in our local array
          const index = updatedDocuments.findIndex(d => d.id === documentId);
          if (index >= 0) {
            updatedDocuments[index] = {...updatedDocuments[index], ...updatedDocument};
            updatedLockedDocuments[documentId] = true;
          }
        }
      }
      
      // Update state with all changes
      setState(prev => ({
        ...prev,
        documents: updatedDocuments,
        lockedDocuments: updatedLockedDocuments
      }));
      
    } catch (error) {
      console.error("Error locking documents:", error);
    }
  };

  // Bulk lock documents that are selected
  const bulkLockDocuments = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLockingAll: true }));
    
    try {
      await lockDocuments(state.selectedDocuments);
      
      // Clear selection after locking
      setState(prev => ({
        ...prev,
        selectedDocuments: [],
        isLockingAll: false
      }));
    } catch (error) {
      console.error("Error bulk locking documents:", error);
      setState(prev => ({ ...prev, isLockingAll: false }));
    }
  };

  // Select a document
  const selectDocument = (documentId: string, selected: boolean): void => {
    setState(prev => {
      const selectedDocuments = selected
        ? [...prev.selectedDocuments, documentId]
        : prev.selectedDocuments.filter(id => id !== documentId);
      
      return { ...prev, selectedDocuments };
    });
  };

  // Get document retention info
  const getDocumentRetentionInfo = (documentId: string) => {
    const document = state.documents.find(doc => doc.id === documentId);
    const policy = state.retentionPolicy;
    
    if (!document || !policy) {
      return {
        retentionPeriod: 0,
        retentionExpiryDate: null,
        isRequired: false
      };
    }
    
    const isRequired = policy.requiredDocuments.some(rd => 
      document.name.toLowerCase().includes(rd.toLowerCase())
    );
    
    return {
      retentionPeriod: policy.retentionPeriod,
      retentionExpiryDate: document.retentionExpiryDate || null,
      isRequired
    };
  };

  // Get formatted retention period
  const getFormattedRetentionPeriod = (days: number) => {
    if (days >= 365) {
      const years = Math.floor(days / 365);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    } else if (days >= 30) {
      const months = Math.floor(days / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    }
  };

  // Apply AI retention protocol to get recommendations
  const getAIRetentionProtocol = async (documentId: string) => {
    try {
      const userTypeToUse = userType || 'lender';
      
      // Determine appropriate retention period based on user type
      const retentionPolicy = documentSecurityService.getRetentionPolicy(userTypeToUse);
      
      // Apply AI recommendation (in a real app, this would call an AI service)
      const recommendedRetention = {
        recommendation: 'AI-driven retention protocol applied',
        retentionPeriod: retentionPolicy.retentionPeriod,
        reasoning: `Based on document type and user role (${userTypeToUse}), 
                    the recommended retention period is ${getFormattedRetentionPeriod(retentionPolicy.retentionPeriod)}.`
      };
      
      return recommendedRetention;
    } catch (error) {
      console.error("Error applying AI retention protocol:", error);
      return {
        recommendation: 'Error applying AI retention protocol',
        retentionPeriod: 0,
        reasoning: 'Could not determine appropriate retention period'
      };
    }
  };

  // Apply retention policies to all documents
  const applyRetentionPolicies = async (): Promise<void> => {
    try {
      if (!state.retentionPolicy) return;
      
      const policy = state.retentionPolicy;
      
      // Apply retention policy to each document
      const now = new Date();
      const updatedDocuments = state.documents.map(doc => {
        // Check if document should be retained based on name matching required documents
        const shouldRetain = policy.requiredDocuments.some(rd => 
          doc.name.toLowerCase().includes(rd.toLowerCase())
        );
        
        if (shouldRetain) {
          const expiryDate = new Date(now.getTime() + (policy.retentionPeriod * 24 * 60 * 60 * 1000));
          
          // Update with retention information
          return {
            ...doc,
            retentionPeriod: policy.retentionPeriod,
            retentionExpiryDate: expiryDate.toISOString(),
            activity: [
              ...(doc.activity || []),
              {
                type: 'retention_policy_applied',
                timestamp: now.toISOString(),
                user: userName || 'System',
                details: `Retention policy applied: ${getFormattedRetentionPeriod(policy.retentionPeriod)}`
              }
            ]
          };
        }
        
        return doc;
      });
      
      // Update state with modified documents
      setState(prev => ({
        ...prev,
        documents: updatedDocuments
      }));
      
    } catch (error) {
      console.error("Error applying retention policies:", error);
    }
  };

  // Return state and actions
  return [
    state, 
    { 
      lockDocument,
      unlockDocument,
      lockAllDocuments,
      applyRetentionPolicies,
      getDocumentRetentionInfo,
      selectDocument,
      bulkLockDocuments,
      getAIRetentionProtocol
    }
  ];
} 