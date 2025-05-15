import axios from 'axios';
import { FileItem } from '../components/document/FilelockDriveApp';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

// Types for document verification
export interface VerificationResult {
  verified: boolean;
  documentType: string;
  extractedData: Record<string, any>;
  confidence: number;
  verificationTimestamp: string;
  documentId: string;
  extractedText?: string;
  error?: string;
}

/**
 * Verify a document and extract its contents
 * @param file The file to verify
 * @param options Optional verification options
 * @returns Verification result
 */
export const verifyDocument = async (
  file: FileItem,
  options?: { forceRecheck?: boolean }
): Promise<VerificationResult> => {
  try {
    console.log(`Verifying document: ${file.name}`);
    
    // In a real implementation, this would call an API to perform OCR and verification
    // For this demo, we'll simulate different results based on file type

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Generate extracted text based on document type
    let extractedText = '';
    
    // For PDFs
    if (fileExtension === 'pdf') {
      if (file.name.includes('Loan') || file.name.includes('loan')) {
        extractedText = "LOAN AGREEMENT\n\nTHIS LOAN AGREEMENT (the \"Agreement\") is made and entered into as of [Date], by and between [Lender Name] (\"Lender\") and [Borrower Name] (\"Borrower\").\n\nWHEREAS, Borrower has requested that Lender extend credit to Borrower as described below, and Lender has agreed to provide such credit to Borrower on the terms and conditions contained herein.\n\nNOW, THEREFORE, for valuable consideration, the receipt and sufficiency of which are hereby acknowledged, Lender and Borrower hereby agree as follows:";
        
        return {
          verified: true,
          documentType: 'Loan Agreement',
          extractedData: {
            documentType: 'Loan Agreement',
            parties: 'Lender Company, Borrower LLC',
            date: new Date().toISOString().split('T')[0],
            loanAmount: '$250,000',
            interestRate: '4.5%',
            term: '60 months',
          },
          extractedText,
          confidence: 0.92,
          verificationTimestamp: new Date().toISOString(),
          documentId: `doc-${Date.now()}`,
        };
      } else if (file.name.includes('Tax') || file.name.includes('tax')) {
        extractedText = "FORM 1120\nU.S. CORPORATION INCOME TAX RETURN\nFor calendar year 2022 or tax year beginning [Start Date], ending [End Date]\n\nPART I - Income\n1a Gross receipts or sales\n1b Returns and allowances\n1c Balance\n2 Cost of goods sold\n3 Gross profit\n4 Dividends and inclusions\n5 Interest";
        
        return {
          verified: true,
          documentType: 'Tax Document',
          extractedData: {
            taxPeriod: '2022',
            totalTax: '$45,320',
            businessIncome: '$420,500',
            deductions: '$135,200',
            taxableIncome: '$285,300',
          },
          extractedText,
          confidence: 0.88,
          verificationTimestamp: new Date().toISOString(),
          documentId: `doc-${Date.now()}`,
        };
      } else if (file.name.includes('Business') || file.name.includes('business')) {
        extractedText = "BUSINESS PLAN\n\nEXECUTIVE SUMMARY\n\nCompany: [Company Name]\nIndustry: [Industry]\nMission: [Mission Statement]\n\nOur company provides innovative solutions to address [problem] by offering [product/service]. The market opportunity is estimated at $X billion, with an annual growth rate of X%. Our competitive advantage is based on [unique value proposition].";
        
        return {
          verified: true,
          documentType: 'Business Plan',
          extractedData: {
            companyName: 'Example Corp',
            industry: 'Technology',
            funding: '$1.2 million',
            projectedRevenue: '$3.5 million',
            targetMarket: 'Small to medium businesses',
          },
          extractedText,
          confidence: 0.85,
          verificationTimestamp: new Date().toISOString(),
          documentId: `doc-${Date.now()}`,
        };
      } else if (['doc', 'docx'].includes(fileExtension || '')) {
        extractedText = "SERVICE AGREEMENT\n\nTHIS SERVICE AGREEMENT (the \"Agreement\") is entered into as of [Effective Date] by and between Quantum Innovations LLC (\"Provider\") and Advanced Tech Solutions Inc. (\"Client\").\n\nSERVICES: Provider agrees to provide to Client the following services (\"Services\"): [Description of Services].\n\nTERM: This Agreement shall commence on [Start Date] and shall continue until [End Date], unless earlier terminated.";
        
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
          extractedText,
          confidence: 0.89,
          verificationTimestamp: new Date().toISOString(),
          documentId: `doc-${Date.now()}`,
        };
      } else if (['xls', 'xlsx', 'csv'].includes(fileExtension || '')) {
        extractedText = "Financial Data\nJan 2023,Feb 2023,Mar 2023,Apr 2023,May 2023,Jun 2023,Jul 2023,Aug 2023,Sep 2023\nRevenue,$120000,$135000,$142000,$138000,$145000,$155000,$160000,$150000,$165000\nExpenses,$85000,$82000,$88000,$90000,$93000,$95000,$97000,$92000,$96000\nProfit,$35000,$53000,$54000,$48000,$52000,$60000,$63000,$58000,$69000";
        
        return {
          verified: true,
          documentType: 'Financial Statement',
          extractedData: {
            recordCount: '156',
            dateRange: 'Jan 2023 - Sep 2023',
            totalRevenue: '$1,245,000',
            averageMonthlyRevenue: '$138,333',
            topCategory: 'Professional Services',
          },
          extractedText,
          confidence: 0.95,
          verificationTimestamp: new Date().toISOString(),
          documentId: `doc-${Date.now()}`,
        };
      } else {
        extractedText = "This document contains business information and details related to the transaction. The content has been securely processed and verified by the EVA AI document analysis system.";
        
        return {
          verified: true,
          documentType: 'Generic Document',
          extractedData: {
            fileName: file.name,
            fileSize: file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown',
            uploadDate: new Date().toLocaleDateString(),
            contentSummary: 'Document contains business information and details related to the transaction.',
          },
          extractedText,
          confidence: 0.75,
          verificationTimestamp: new Date().toISOString(),
          documentId: `doc-${Date.now()}`,
        };
      }
    }
    
    // Default response for other file types
    extractedText = "Document content processed. The text extraction capabilities vary by file format, but the document has been analyzed for key information.";
    
    return {
      verified: true,
      documentType: 'Generic Document',
      extractedData: {
        fileName: file.name,
        fileSize: file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown',
        uploadDate: new Date().toLocaleDateString(),
        contentSummary: 'Document contains business information and details related to the transaction.',
      },
      extractedText,
      confidence: 0.75,
      verificationTimestamp: new Date().toISOString(),
      documentId: `doc-${Date.now()}`,
    };
  } catch (error) {
    console.error('Error in document verification:', error);
    return {
      verified: false,
      documentType: 'Unknown',
      extractedData: {},
      extractedText: '',
      confidence: 0,
      verificationTimestamp: new Date().toISOString(),
      documentId: `error-${Date.now()}`,
      error: 'Failed to process document. Please try again.',
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
      documentId,
    };
  } catch (error) {
    console.error('Error checking verification status:', error);
    return {
      verified: false,
      documentType: 'Unknown',
      extractedData: {},
      confidence: 0,
      verificationTimestamp: new Date().toISOString(),
      documentId: `error-${Date.now()}`,
      error: 'Failed to retrieve verification status.',
    };
  }
};

export default {
  verifyDocument,
  getVerificationStatus,
};
