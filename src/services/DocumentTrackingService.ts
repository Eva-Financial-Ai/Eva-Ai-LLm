// Document Tracking Service for monitoring term sheets and verification status
import { TermSheetDocument, ParticipantInfo } from './DocumentGenerationService';

// Types
export interface DocumentStatusUpdate {
  documentId: string;
  updatedAt: string;
  updateType: 'signature' | 'kyc' | 'kyb' | 'status_change';
  participantId?: string;
  newStatus: string;
  message: string;
}

export interface DocumentTrackingResult {
  document: TermSheetDocument;
  statusUpdates: DocumentStatusUpdate[];
  isFundingEligible: boolean;
  pendingItems: string[];
  completedItems: string[];
}

// Service for tracking document signatures and verification status
class DocumentTrackingService {
  // Store for tracking documents
  private activeDocuments: Map<string, TermSheetDocument> = new Map();
  private statusUpdates: Map<string, DocumentStatusUpdate[]> = new Map();
  
  // Register a document for tracking
  registerDocument(document: TermSheetDocument): void {
    this.activeDocuments.set(document.id, document);
    this.statusUpdates.set(document.id, [
      {
        documentId: document.id,
        updatedAt: new Date().toISOString(),
        updateType: 'status_change',
        newStatus: 'pending_signatures',
        message: 'Term sheet generated and sent for signatures'
      }
    ]);
    
    console.log(`Document ${document.id} registered for tracking`);
  }
  
  // Get document tracking status
  getDocumentStatus(documentId: string): DocumentTrackingResult | null {
    const document = this.activeDocuments.get(documentId);
    const updates = this.statusUpdates.get(documentId) || [];
    
    if (!document) {
      console.log(`Document ${documentId} not found for tracking`);
      return null;
    }
    
    // Calculate pending and completed items
    const pendingItems: string[] = [];
    const completedItems: string[] = [];
    
    document.participants.forEach(participant => {
      // Check signature status
      if (participant.signatureStatus !== 'signed') {
        pendingItems.push(`Signature required from ${participant.name} (${participant.role})`);
      } else {
        completedItems.push(`Signature completed by ${participant.name} (${participant.role})`);
      }
      
      // Check KYC status
      if (participant.kycStatus !== 'verified') {
        pendingItems.push(`KYC verification required for ${participant.name} (${participant.role})`);
      } else {
        completedItems.push(`KYC verified for ${participant.name} (${participant.role})`);
      }
      
      // Check KYB status for businesses
      if (participant.role !== 'borrower' && participant.kybStatus !== 'verified') {
        pendingItems.push(`KYB verification required for ${participant.name} (${participant.role})`);
      } else if (participant.role !== 'borrower' && participant.kybStatus === 'verified') {
        completedItems.push(`KYB verified for ${participant.name} (${participant.role})`);
      }
    });
    
    // Calculate funding eligibility
    const isFundingEligible = pendingItems.length === 0;
    
    return {
      document,
      statusUpdates: updates,
      isFundingEligible,
      pendingItems,
      completedItems
    };
  }
  
  // Update signature status for a participant
  updateSignatureStatus(
    documentId: string,
    participantId: string,
    newStatus: ParticipantInfo['signatureStatus']
  ): DocumentTrackingResult | null {
    const document = this.activeDocuments.get(documentId);
    if (!document) {
      console.error(`Document ${documentId} not found for signature status update`);
      return null;
    }
    
    // Find the participant and update signature status
    const updatedParticipants = document.participants.map(p => 
      p.id === participantId ? { ...p, signatureStatus: newStatus } : p
    );
    
    // Update document status based on signature progress
    let documentStatus = document.status;
    const allSigned = updatedParticipants.every(p => p.signatureStatus === 'signed');
    const someSigned = updatedParticipants.some(p => p.signatureStatus === 'signed');
    
    if (allSigned) {
      documentStatus = 'fully_signed';
    } else if (someSigned) {
      documentStatus = 'partially_signed';
    }
    
    // Create updated document
    const updatedDocument: TermSheetDocument = {
      ...document,
      participants: updatedParticipants,
      status: documentStatus
    };
    
    // Update storage
    this.activeDocuments.set(documentId, updatedDocument);
    
    // Record the status update
    const participant = updatedParticipants.find(p => p.id === participantId);
    const updateMessage = `Signature status for ${participant?.name} (${participant?.role}) changed to ${newStatus}`;
    
    const update: DocumentStatusUpdate = {
      documentId,
      updatedAt: new Date().toISOString(),
      updateType: 'signature',
      participantId,
      newStatus: newStatus || 'unknown',
      message: updateMessage
    };
    
    const currentUpdates = this.statusUpdates.get(documentId) || [];
    this.statusUpdates.set(documentId, [...currentUpdates, update]);
    
    console.log(updateMessage);
    
    // Return updated tracking result
    return this.getDocumentStatus(documentId);
  }
  
  // Update KYC/KYB status for a participant
  updateVerificationStatus(
    documentId: string,
    participantId: string,
    verificationType: 'kyc' | 'kyb',
    newStatus: 'pending' | 'in_progress' | 'verified' | 'failed'
  ): DocumentTrackingResult | null {
    const document = this.activeDocuments.get(documentId);
    if (!document) {
      console.error(`Document ${documentId} not found for verification status update`);
      return null;
    }
    
    // Find the participant and update verification status
    const updatedParticipants = document.participants.map(p => {
      if (p.id === participantId) {
        if (verificationType === 'kyc') {
          return { ...p, kycStatus: newStatus };
        } else {
          return { ...p, kybStatus: newStatus };
        }
      }
      return p;
    });
    
    // Create updated document
    const updatedDocument: TermSheetDocument = {
      ...document,
      participants: updatedParticipants
    };
    
    // Update storage
    this.activeDocuments.set(documentId, updatedDocument);
    
    // Record the status update
    const participant = updatedParticipants.find(p => p.id === participantId);
    const updateMessage = `${verificationType.toUpperCase()} verification status for ${participant?.name} (${participant?.role}) changed to ${newStatus}`;
    
    const update: DocumentStatusUpdate = {
      documentId,
      updatedAt: new Date().toISOString(),
      updateType: verificationType,
      participantId,
      newStatus,
      message: updateMessage
    };
    
    const currentUpdates = this.statusUpdates.get(documentId) || [];
    this.statusUpdates.set(documentId, [...currentUpdates, update]);
    
    console.log(updateMessage);
    
    // Return updated tracking result
    return this.getDocumentStatus(documentId);
  }
  
  // Get all documents being tracked
  getAllDocuments(): TermSheetDocument[] {
    return Array.from(this.activeDocuments.values());
  }
  
  // Get all documents for a specific transaction
  getDocumentsByTransaction(transactionId: string): TermSheetDocument[] {
    return Array.from(this.activeDocuments.values())
      .filter(doc => doc.transactionId === transactionId);
  }
  
  // Simulate random status updates for demo purposes
  simulateStatusUpdates(documentId: string): void {
    const document = this.activeDocuments.get(documentId);
    if (!document) return;
    
    console.log(`Simulating status updates for document ${documentId}`);
    
    // Randomly update some participants
    document.participants.forEach(participant => {
      // 60% chance of signature update
      if (Math.random() < 0.6 && participant.signatureStatus !== 'signed') {
        setTimeout(() => {
          this.updateSignatureStatus(documentId, participant.id, 'signed');
        }, 1000 + Math.random() * 5000);
      }
      
      // 70% chance of KYC update
      if (Math.random() < 0.7 && participant.kycStatus !== 'verified') {
        setTimeout(() => {
          this.updateVerificationStatus(documentId, participant.id, 'kyc', 'verified');
        }, 2000 + Math.random() * 8000);
      }
      
      // 70% chance of KYB update for businesses
      if (participant.role !== 'borrower' && Math.random() < 0.7 && participant.kybStatus !== 'verified') {
        setTimeout(() => {
          this.updateVerificationStatus(documentId, participant.id, 'kyb', 'verified');
        }, 3000 + Math.random() * 10000);
      }
    });
  }
}

export default new DocumentTrackingService(); 