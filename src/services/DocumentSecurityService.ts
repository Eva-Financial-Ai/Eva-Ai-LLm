import { v4 as uuidv4 } from 'uuid';
import { FileItem } from '../components/document/FilelockDriveApp';

export type UserType = 'lender' | 'broker' | 'borrower' | 'vendor';
export type TransactionStatus = 'draft' | 'in_progress' | 'pending_signatures' | 'funded' | 'completed';

export interface DocumentMetadata {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  contentHash: string;
  lastModified: string;
  createdAt: string;
  owner: string;
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
  unlockDate?: string;
  retentionExpiryDate?: string;
  securityClassification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface RetentionPolicy {
  userType: UserType;
  retentionPeriod: number; // in days
  requiredDocuments: string[];
  complianceNotes: string;
}

export interface BlockchainVerification {
  blockchainTxId: string;
  timestamp: string;
  verified: boolean;
  network: string;
  verificationMethod: string;
}

export interface DocumentVaultRecord {
  id: string;
  documentId: string;
  documentMetadata: DocumentMetadata;
  transactionId: string;
  vaultEntryDate: string;
  retentionPeriod: number;
  retentionExpiryDate?: string;
  blockchainVerification?: BlockchainVerification;
  accessLog: Array<{
    userId: string;
    timestamp: string;
    action: 'view' | 'download' | 'lock' | 'unlock';
  }>;
}

// Singleton pattern for the service
class DocumentSecurityService {
  private static instance: DocumentSecurityService;
  private mockVaultRecords: Record<string, DocumentVaultRecord[]> = {};

  private constructor() {
    // Initialize with some mock data
    this.mockVaultRecords = {
      'tx-1234': [
        {
          id: 'vault-1',
          documentId: 'doc-1',
          documentMetadata: {
            id: 'doc-1',
            fileName: 'Loan Agreement.pdf',
            fileType: 'pdf',
            fileSize: 1024000,
            contentHash: 'sha256-12345',
            lastModified: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            owner: 'John Smith',
            isLocked: true,
            lockedBy: 'System',
            lockedAt: new Date().toISOString(),
            securityClassification: 'confidential'
          },
          transactionId: 'tx-1234',
          vaultEntryDate: new Date().toISOString(),
          retentionPeriod: 365 * 7, // 7 years
          retentionExpiryDate: new Date(Date.now() + 365 * 7 * 24 * 60 * 60 * 1000).toISOString(),
          blockchainVerification: {
            blockchainTxId: 'btx-12345',
            timestamp: new Date().toISOString(),
            verified: true,
            network: 'Ethereum',
            verificationMethod: 'Smart Contract'
          },
          accessLog: [
            {
              userId: 'user-1',
              timestamp: new Date().toISOString(),
              action: 'lock'
            }
          ]
        }
      ],
      'tx-5678': [
        {
          id: 'vault-2',
          documentId: 'doc-2',
          documentMetadata: {
            id: 'doc-2',
            fileName: 'Financial Statements.pdf',
            fileType: 'pdf',
            fileSize: 2048000,
            contentHash: 'sha256-67890',
            lastModified: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            owner: 'Jane Doe',
            isLocked: true,
            lockedBy: 'Jane Doe',
            lockedAt: new Date().toISOString(),
            securityClassification: 'confidential'
          },
          transactionId: 'tx-5678',
          vaultEntryDate: new Date().toISOString(),
          retentionPeriod: 365 * 3, // 3 years
          retentionExpiryDate: new Date(Date.now() + 365 * 3 * 24 * 60 * 60 * 1000).toISOString(),
          accessLog: [
            {
              userId: 'user-2',
              timestamp: new Date().toISOString(),
              action: 'lock'
            }
          ]
        }
      ]
    };
  }

  public static getInstance(): DocumentSecurityService {
    if (!DocumentSecurityService.instance) {
      DocumentSecurityService.instance = new DocumentSecurityService();
    }
    return DocumentSecurityService.instance;
  }

  // Get documents in vault for a specific transaction
  public getDocumentsInVault(transactionId: string): DocumentVaultRecord[] {
    return this.mockVaultRecords[transactionId] || [];
  }

  // Add document to vault
  public addDocumentToVault(
    document: FileItem,
    transactionId: string,
    retentionPeriod: number,
    securityClassification: 'public' | 'internal' | 'confidential' | 'restricted',
    userName: string
  ): DocumentVaultRecord {
    const now = new Date();
    
    const documentMetadata: DocumentMetadata = {
      id: document.id,
      fileName: document.name,
      fileType: document.type,
      fileSize: document.size || 0,
      contentHash: `sha256-${uuidv4()}`,
      lastModified: document.lastModified,
      createdAt: document.createdAt,
      owner: document.owner,
      isLocked: true,
      lockedBy: userName,
      lockedAt: now.toISOString(),
      securityClassification
    };
    
    const retentionExpiryDate = retentionPeriod > 0 
      ? new Date(now.getTime() + retentionPeriod * 24 * 60 * 60 * 1000).toISOString()
      : undefined;
    
    const vaultRecord: DocumentVaultRecord = {
      id: `vault-${uuidv4()}`,
      documentId: document.id,
      documentMetadata,
      transactionId,
      vaultEntryDate: now.toISOString(),
      retentionPeriod,
      retentionExpiryDate,
      accessLog: [
        {
          userId: userName,
          timestamp: now.toISOString(),
          action: 'lock'
        }
      ]
    };
    
    // Add to mock data
    if (!this.mockVaultRecords[transactionId]) {
      this.mockVaultRecords[transactionId] = [];
    }
    this.mockVaultRecords[transactionId].push(vaultRecord);
    
    return vaultRecord;
  }

  // Lock a document
  public lockDocument(documentId: string, transactionId: string, userName: string): FileItem | null {
    // In a real implementation, this would interact with an API
    // For now, return a mock response
    return {
      id: documentId,
      name: 'Locked Document.pdf',
      type: 'pdf',
      size: 1024000,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      path: `/transactions/${transactionId}/documents/locked-document.pdf`,
      parentId: null,
      owner: userName,
      blockchainVerified: true,
      activity: [
        {
          type: 'document_locked',
          timestamp: new Date().toISOString(),
          user: userName,
          details: 'Document locked in Shield Document Escrow Vault'
        }
      ]
    };
  }

  // Unlock a document
  public unlockDocument(documentId: string, transactionId: string, userName: string): boolean {
    // In a real implementation, this would check permissions and interact with an API
    return true;
  }

  // Get retention policy for a user type
  public getRetentionPolicy(userType: UserType): RetentionPolicy {
    // Mock retention policies
    const policies: Record<UserType, RetentionPolicy> = {
      lender: {
        userType: 'lender',
        retentionPeriod: 365 * 7, // 7 years
        requiredDocuments: ['loan_agreement', 'financial_statements', 'credit_report'],
        complianceNotes: 'Required by federal regulations to maintain loan documentation.'
      },
      broker: {
        userType: 'broker',
        retentionPeriod: 365 * 3, // 3 years
        requiredDocuments: ['loan_application', 'broker_agreement'],
        complianceNotes: 'Industry standard for broker documentation.'
      },
      borrower: {
        userType: 'borrower',
        retentionPeriod: 365 * 1, // 1 year
        requiredDocuments: ['loan_agreement_copy', 'payment_schedule'],
        complianceNotes: 'Recommended minimum retention period for personal records.'
      },
      vendor: {
        userType: 'vendor',
        retentionPeriod: 365 * 2, // 2 years
        requiredDocuments: ['service_agreement', 'invoice'],
        complianceNotes: 'Standard business practice for vendor relationships.'
      }
    };
    
    return policies[userType];
  }
}

export default DocumentSecurityService; 