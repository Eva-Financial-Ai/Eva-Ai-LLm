// Document Generation Service for generating PDFs and managing signatures
import { v4 as uuidv4 } from 'uuid';

// Types
export interface ParticipantInfo {
  id: string;
  name: string;
  email: string;
  role: 'borrower' | 'broker' | 'vendor' | 'guarantor' | 'asset_seller' | 'lender';
  kycStatus?: 'pending' | 'in_progress' | 'verified' | 'failed';
  kybStatus?: 'pending' | 'in_progress' | 'verified' | 'failed';
  signatureStatus?: 'pending' | 'sent' | 'signed' | 'expired';
}

export interface DealParticipants {
  borrower: ParticipantInfo;
  broker?: ParticipantInfo;
  vendor?: ParticipantInfo;
  guarantors?: ParticipantInfo[];
  assetSellers?: ParticipantInfo[];
}

export interface TermSheetDocument {
  id: string;
  name: string;
  transactionId: string;
  borrowerName: string;
  createdAt: string;
  expiresAt: string;
  status: 'draft' | 'pending_signatures' | 'partially_signed' | 'fully_signed' | 'expired';
  fileUrl: string;
  participants: ParticipantInfo[];
}

export interface TermSheetData {
  transactionId: string;
  transactionType: string;
  borrowerName: string;
  borrowerAddress?: string;
  borrowerEmail?: string;
  borrowerPhone?: string;
  loanAmount: number;
  downPayment: number;
  residualValue: number;
  residualPercent: number;
  term: number;
  rate: number;
  paymentAmount: number;
  financingType: string;
  assetDescription?: string;
  closingConditions?: string[];
  specialProvisions?: string[];
  brokerName?: string;
  brokerCompany?: string;
  vendorName?: string;
}

// Notification System
export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
}

// Observer pattern for notifications
class NotificationSystem {
  private static observers: ((notification: Notification) => void)[] = [];
  private static notifications: Notification[] = [];

  static subscribe(callback: (notification: Notification) => void) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(observer => observer !== callback);
    };
  }

  static notify(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) {
    const newNotification: Notification = {
      id: uuidv4(),
      timestamp: Date.now(),
      isRead: false,
      ...notification,
    };

    this.notifications.push(newNotification);

    // Limit to 50 notifications
    if (this.notifications.length > 50) {
      this.notifications.shift();
    }

    // Notify all observers
    this.observers.forEach(observer => observer(newNotification));

    return newNotification.id;
  }

  static getAll() {
    return [...this.notifications];
  }

  static markAsRead(id: string) {
    this.notifications = this.notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    );
  }
}

// Service for generating and managing documents
class DocumentGenerationService {
  // Generate PDF term sheet
  async generateTermSheet(
    termSheetData: TermSheetData
  ): Promise<{ fileId: string; fileUrl: string }> {
    console.log('Generating term sheet for transaction:', termSheetData.transactionId);

    // In a real implementation, this would call a backend API to generate the PDF
    // For this example, we'll simulate the API call with a delay
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock response with file details
        resolve({
          fileId: `term-sheet-${termSheetData.transactionId}-${Date.now()}`,
          fileUrl: `/api/files/term-sheets/${termSheetData.transactionId}/${Date.now()}.pdf`,
        });
      }, 1500);
    });
  }

  // Upload document to Filelock
  async uploadToFilelock(
    fileId: string,
    fileName: string,
    fileData: any,
    transactionId: string
  ): Promise<{ id: string; securePath: string }> {
    console.log('Uploading document to Filelock:', fileName);

    // In a real implementation, this would call the Filelock API
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock a successful upload
        resolve({
          id: `filelock-${fileId}`,
          securePath: `/filelock/secure/${transactionId}/${fileId}`,
        });
      }, 1000);
    });
  }

  // Send document for e-signature
  async sendForSignature(
    termSheetDocument: TermSheetDocument,
    participants: ParticipantInfo[]
  ): Promise<{ signatureRequestId: string; status: string }> {
    console.log('Sending document for signatures:', termSheetDocument.id);

    // In a real implementation, this would call an e-signature API
    return new Promise(resolve => {
      setTimeout(() => {
        // Send notification when signature request is sent
        NotificationSystem.notify({
          type: 'info',
          title: 'Signature Request Sent',
          message: `E-signature request sent for ${termSheetDocument.name}`,
          actionUrl: `/documents/${termSheetDocument.id}`,
        });

        // Mock response for signature request
        resolve({
          signatureRequestId: `sig-req-${uuidv4()}`,
          status: 'signature_request_sent',
        });
      }, 1200);
    });
  }

  // Check KYC/KYB status for a participant
  async checkVerificationStatus(
    participantId: string,
    verificationType: 'kyc' | 'kyb'
  ): Promise<{ status: 'pending' | 'in_progress' | 'verified' | 'failed' }> {
    console.log(
      `Checking ${verificationType.toUpperCase()} status for participant:`,
      participantId
    );

    // In a real implementation, this would call the KYC/KYB verification service API
    return new Promise(resolve => {
      setTimeout(() => {
        // Mock verification status (simulate most participants pass verification)
        const randomFactor = Math.random();
        let status: 'pending' | 'in_progress' | 'verified' | 'failed' = 'pending';

        if (randomFactor < 0.05) {
          status = 'failed'; // 5% chance of failure
        } else if (randomFactor < 0.15) {
          status = 'in_progress'; // 10% chance of still in progress
        } else {
          status = 'verified'; // 85% chance of success
        }

        resolve({ status });
      }, 800);
    });
  }

  // Trigger KYC/KYB verification process for a participant
  async initiateVerification(
    participantId: string,
    participantEmail: string,
    verificationType: 'kyc' | 'kyb'
  ): Promise<{ verificationId: string; status: string }> {
    console.log(`Initiating ${verificationType.toUpperCase()} verification for:`, participantEmail);

    // In a real implementation, this would send an email/notification to the participant
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          verificationId: `${verificationType}-${uuidv4()}`,
          status: 'verification_initiated',
        });
      }, 600);
    });
  }

  // Check funding eligibility based on signatures and KYC/KYB
  async checkFundingEligibility(
    termSheetDocument: TermSheetDocument
  ): Promise<{ eligible: boolean; pendingItems: string[] }> {
    console.log('Checking funding eligibility for document:', termSheetDocument.id);

    // Check all participants for signature status and KYC/KYB verification
    const pendingItems: string[] = [];

    // In a real implementation, this would query the status of all signatures and verifications
    termSheetDocument.participants.forEach(participant => {
      if (participant.signatureStatus !== 'signed') {
        pendingItems.push(`Signature required from ${participant.name} (${participant.role})`);
      }

      if (participant.kycStatus !== 'verified') {
        pendingItems.push(
          `KYC verification required for ${participant.name} (${participant.role})`
        );
      }

      if (participant.role !== 'borrower' && participant.kybStatus !== 'verified') {
        pendingItems.push(
          `KYB verification required for ${participant.name} (${participant.role})`
        );
      }
    });

    return {
      eligible: pendingItems.length === 0,
      pendingItems,
    };
  }

  // Create complete term sheet workflow
  async createTermSheetWorkflow(
    termSheetData: TermSheetData,
    participants: DealParticipants
  ): Promise<TermSheetDocument> {
    try {
      // 1. Generate the PDF
      const { fileId, fileUrl } = await this.generateTermSheet(termSheetData);

      // Send notification for term sheet generation
      NotificationSystem.notify({
        type: 'success',
        title: 'Term Sheet Generated',
        message: `Term sheet for ${termSheetData.borrowerName} has been successfully generated`,
        actionUrl: `/deal-structuring`,
      });

      // 2. Convert participants to array format for the document
      const participantsArray: ParticipantInfo[] = [
        participants.borrower,
        ...(participants.broker ? [participants.broker] : []),
        ...(participants.vendor ? [participants.vendor] : []),
        ...(participants.guarantors || []),
        ...(participants.assetSellers || []),
      ];

      // 3. Create the term sheet document object
      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setDate(expiryDate.getDate() + 30); // Term sheets expire in 30 days

      const termSheetDocument: TermSheetDocument = {
        id: uuidv4(),
        name: `Term Sheet - ${termSheetData.borrowerName} - ${termSheetData.transactionId}`,
        transactionId: termSheetData.transactionId,
        borrowerName: termSheetData.borrowerName,
        createdAt: now.toISOString(),
        expiresAt: expiryDate.toISOString(),
        status: 'draft',
        fileUrl: fileUrl,
        participants: participantsArray,
      };

      // 4. Upload to Filelock (simulated)
      await this.uploadToFilelock(
        fileId,
        termSheetDocument.name,
        { termSheetData, fileUrl },
        termSheetData.transactionId
      );

      // Send notification for Filelock upload
      NotificationSystem.notify({
        type: 'info',
        title: 'Document Secured',
        message: `Term sheet securely uploaded to Filelock vault`,
        actionUrl: `/documents/${termSheetDocument.id}`,
      });

      // 5. Send for e-signature (simulated)
      await this.sendForSignature(termSheetDocument, participantsArray);

      // Update term sheet status
      termSheetDocument.status = 'pending_signatures';

      // 6. Initiate KYC/KYB for all participants
      for (const participant of participantsArray) {
        await this.initiateVerification(participant.id, participant.email, 'kyc');

        if (participant.role !== 'borrower') {
          await this.initiateVerification(participant.id, participant.email, 'kyb');
        }
      }

      return termSheetDocument;
    } catch (error) {
      console.error('Term sheet workflow failed:', error);

      // Send error notification
      NotificationSystem.notify({
        type: 'error',
        title: 'Term Sheet Generation Failed',
        message: `There was an error generating the term sheet. Please try again.`,
      });

      throw error;
    }
  }

  // Simulate status updates for demo
  simulateStatusUpdates(documentId: string) {
    // Simulate a participant signing the document after 20 seconds
    setTimeout(() => {
      NotificationSystem.notify({
        type: 'success',
        title: 'Document Signed',
        message: 'A participant has signed the term sheet',
        actionUrl: `/documents/${documentId}`,
      });
    }, 20000);

    // Simulate KYC verification complete after 35 seconds
    setTimeout(() => {
      NotificationSystem.notify({
        type: 'success',
        title: 'KYC Verification Complete',
        message: 'KYC verification has been completed for a participant',
        actionUrl: `/documents/${documentId}`,
      });
    }, 35000);
  }
}

export default new DocumentGenerationService();
export { NotificationSystem };
