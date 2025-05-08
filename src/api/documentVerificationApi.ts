import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Types for document verification
export interface VerificationResult {
  verified: boolean;
  documentType: string;
  extractedData: Record<string, any>;
  confidence: number;
  verificationTimestamp: string;
  documentId?: string;
  error?: string;
}

/**
 * Uploads a document for verification and analysis by EVA AI
 */
export const verifyDocument = async (
  file: File, 
  transactionId: string
): Promise<VerificationResult> => {
  try {
    // In a real implementation, this would upload to a server endpoint
    // Here we'll simulate a response for demo purposes
    
    // For demo: Simulate network request with timeout
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a FormData object to send the file
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('transactionId', transactionId);
    
    // const response = await axios.post(`${API_BASE_URL}/api/documents/verify`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // });
    
    // return response.data;
    
    // For demo: Return mock data based on file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Create different mock data based on file type
    if (fileExtension === 'pdf') {
      return {
        verified: true,
        documentType: 'Financial Statement',
        extractedData: {
          companyName: 'Quantum Innovations LLC',
          date: '2023-09-15',
          totalAssets: '$2,450,000',
          totalLiabilities: '$1,200,000',
          netIncome: '$350,000',
        },
        confidence: 0.92,
        verificationTimestamp: new Date().toISOString(),
        documentId: `doc-${Date.now()}`
      };
    } else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
      return {
        verified: true,
        documentType: 'ID Document',
        extractedData: {
          name: 'Sarah J. Thompson',
          documentNumber: 'ID-8742-39521',
          issuanceDate: '2020-05-12',
          expiryDate: '2025-05-11',
          issuingAuthority: 'Department of Licensing',
        },
        confidence: 0.87,
        verificationTimestamp: new Date().toISOString(),
        documentId: `doc-${Date.now()}`
      };
    } else if (['doc', 'docx'].includes(fileExtension || '')) {
      return {
        verified: true,
        documentType: 'Contract',
        extractedData: {
          contractType: 'Service Agreement',
          parties: 'Quantum Innovations LLC, Advanced Tech Solutions Inc.',
          effectiveDate: '2023-10-01',
          terminationDate: '2024-09-30',
          value: '$120,000',
        },
        confidence: 0.89,
        verificationTimestamp: new Date().toISOString(),
        documentId: `doc-${Date.now()}`
      };
    } else if (['xls', 'xlsx', 'csv'].includes(fileExtension || '')) {
      return {
        verified: true,
        documentType: 'Financial Data',
        extractedData: {
          recordCount: '156',
          dateRange: 'Jan 2023 - Sep 2023',
          totalRevenue: '$1,245,000',
          averageMonthlyRevenue: '$138,333',
          topCategory: 'Professional Services',
        },
        confidence: 0.95,
        verificationTimestamp: new Date().toISOString(),
        documentId: `doc-${Date.now()}`
      };
    } else {
      return {
        verified: true,
        documentType: 'Generic Document',
        extractedData: {
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(2)} KB`,
          uploadDate: new Date().toLocaleDateString(),
          contentSummary: 'Document contains business information and details related to the transaction.',
        },
        confidence: 0.75,
        verificationTimestamp: new Date().toISOString(),
        documentId: `doc-${Date.now()}`
      };
    }
  } catch (error) {
    console.error('Error in document verification:', error);
    return {
      verified: false,
      documentType: 'Unknown',
      extractedData: {},
      confidence: 0,
      verificationTimestamp: new Date().toISOString(),
      error: 'Failed to process document. Please try again.'
    };
  }
};

/**
 * Retrieves the status and results of a document verification
 */
export const getVerificationStatus = async (documentId: string): Promise<VerificationResult> => {
  try {
    // In a real implementation, this would check the status from the server
    // const response = await axios.get(`${API_BASE_URL}/api/documents/status/${documentId}`);
    // return response.data;
    
    // For demo: Return mock data
    return {
      verified: true,
      documentType: 'Financial Statement',
      extractedData: {
        companyName: 'Quantum Innovations LLC',
        date: '2023-09-15',
        totalAssets: '$2,450,000',
        totalLiabilities: '$1,200,000',
        netIncome: '$350,000',
      },
      confidence: 0.92,
      verificationTimestamp: new Date().toISOString(),
      documentId
    };
  } catch (error) {
    console.error('Error checking verification status:', error);
    return {
      verified: false,
      documentType: 'Unknown',
      extractedData: {},
      confidence: 0,
      verificationTimestamp: new Date().toISOString(),
      error: 'Failed to retrieve verification status.'
    };
  }
};

export default {
  verifyDocument,
  getVerificationStatus
}; 