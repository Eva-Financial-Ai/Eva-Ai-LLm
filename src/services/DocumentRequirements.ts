import { FileItem } from '../components/document/FilelockDriveApp';

export type ApplicationType =
  | 'equipment_finance'
  | 'working_capital'
  | 'commercial_real_estate'
  | 'business_information'
  | 'line_of_credit'
  | 'sba_loan'
  | 'inventory_financing';

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'application' | 'financial' | 'collateral' | 'entity' | 'tax' | 'other';
  fileTypes: string[];
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadedFileId?: string;
}

// Map of application types to required documents
const documentRequirements: Record<ApplicationType, DocumentRequirement[]> = {
  equipment_finance: [
    {
      id: 'equip_application',
      name: 'Equipment Loan Application',
      description: 'Completed loan application form',
      required: true,
      category: 'application',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
    {
      id: 'equip_invoice',
      name: 'Equipment Invoice/Quote',
      description: 'Vendor quote or invoice for equipment to be purchased',
      required: true,
      category: 'collateral',
      fileTypes: ['pdf', 'docx', 'jpg', 'png'],
      status: 'pending',
    },
    {
      id: 'business_financials',
      name: 'Business Financial Statements',
      description: 'Last 2 years of financial statements',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'bank_statements',
      name: 'Business Bank Statements',
      description: 'Last 3 months of business bank statements',
      required: true,
      category: 'financial',
      fileTypes: ['pdf'],
      status: 'pending',
    },
    {
      id: 'business_tax_returns',
      name: 'Business Tax Returns',
      description: 'Last 2 years of business tax returns',
      required: true,
      category: 'tax',
      fileTypes: ['pdf'],
      status: 'pending',
    },
  ],
  working_capital: [
    {
      id: 'working_cap_application',
      name: 'Working Capital Application',
      description: 'Completed working capital application form',
      required: true,
      category: 'application',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
    {
      id: 'accounts_receivable',
      name: 'Accounts Receivable Aging',
      description: 'Current accounts receivable aging report',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'cash_flow_projection',
      name: 'Cash Flow Projection',
      description: '12-month cash flow projection',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'business_debt_schedule',
      name: 'Business Debt Schedule',
      description: 'Current business debt obligations',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'bank_statements_wc',
      name: 'Business Bank Statements',
      description: 'Last 6 months of business bank statements',
      required: true,
      category: 'financial',
      fileTypes: ['pdf'],
      status: 'pending',
    },
  ],
  commercial_real_estate: [
    {
      id: 'cre_application',
      name: 'Commercial Real Estate Loan Application',
      description: 'Completed CRE loan application form',
      required: true,
      category: 'application',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
    {
      id: 'property_info',
      name: 'Property Information',
      description: 'Property details, photos, and current lease agreements',
      required: true,
      category: 'collateral',
      fileTypes: ['pdf', 'docx', 'jpg', 'png'],
      status: 'pending',
    },
    {
      id: 'purchase_agreement',
      name: 'Purchase Agreement',
      description: 'Executed purchase agreement or letter of intent',
      required: true,
      category: 'collateral',
      fileTypes: ['pdf'],
      status: 'pending',
    },
    {
      id: 'rent_roll',
      name: 'Rent Roll',
      description: 'Current rent roll and lease information for income-producing properties',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'property_financial',
      name: 'Property Financial Statements',
      description: 'Last 2 years of property financial statements',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'environmental_report',
      name: 'Environmental Report',
      description: 'Phase I Environmental Report (if available)',
      required: false,
      category: 'other',
      fileTypes: ['pdf'],
      status: 'pending',
    },
  ],
  business_information: [
    {
      id: 'business_info_application',
      name: 'General Credit Application',
      description: 'Completed business information form',
      required: true,
      category: 'application',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
    {
      id: 'business_formation',
      name: 'Business Formation Documents',
      description: 'Articles of incorporation, operating agreement, or similar documentation',
      required: true,
      category: 'entity',
      fileTypes: ['pdf'],
      status: 'pending',
    },
    {
      id: 'business_license',
      name: 'Business License',
      description: 'Current business license',
      required: true,
      category: 'entity',
      fileTypes: ['pdf', 'jpg', 'png'],
      status: 'pending',
    },
    {
      id: 'owner_id',
      name: 'Owner Identification',
      description: 'Government-issued ID for all owners with 20% or more ownership',
      required: true,
      category: 'entity',
      fileTypes: ['pdf', 'jpg', 'png'],
      status: 'pending',
    },
    {
      id: 'resume',
      name: 'Owner Resume/Bio',
      description: 'Professional resume or bio for all key management',
      required: false,
      category: 'entity',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
  ],
  line_of_credit: [
    {
      id: 'loc_application',
      name: 'Line of Credit Application',
      description: 'Completed line of credit application form',
      required: true,
      category: 'application',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
    {
      id: 'accounts_receivable_loc',
      name: 'Accounts Receivable Aging',
      description: 'Current accounts receivable aging report',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'accounts_payable',
      name: 'Accounts Payable Aging',
      description: 'Current accounts payable aging report',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'inventory_list',
      name: 'Inventory List',
      description: 'Current inventory list with values',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'bank_statements_loc',
      name: 'Business Bank Statements',
      description: 'Last 6 months of business bank statements',
      required: true,
      category: 'financial',
      fileTypes: ['pdf'],
      status: 'pending',
    },
  ],
  sba_loan: [
    {
      id: 'sba_application',
      name: 'SBA Loan Application',
      description: 'Completed SBA loan application (Form 1919)',
      required: true,
      category: 'application',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
    {
      id: 'personal_financial',
      name: 'Personal Financial Statement',
      description:
        'SBA Form 413 - Personal Financial Statement for all owners with 20% or more ownership',
      required: true,
      category: 'financial',
      fileTypes: ['pdf'],
      status: 'pending',
    },
    {
      id: 'business_plan',
      name: 'Business Plan',
      description: 'Detailed business plan with projections',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
    {
      id: 'personal_tax_returns',
      name: 'Personal Tax Returns',
      description: 'Last 3 years of personal tax returns for all owners with 20% or more ownership',
      required: true,
      category: 'tax',
      fileTypes: ['pdf'],
      status: 'pending',
    },
    {
      id: 'business_tax_returns_sba',
      name: 'Business Tax Returns',
      description: 'Last 3 years of business tax returns',
      required: true,
      category: 'tax',
      fileTypes: ['pdf'],
      status: 'pending',
    },
    {
      id: 'collateral_documentation',
      name: 'Collateral Documentation',
      description: 'Documentation for all collateral to be used for the loan',
      required: true,
      category: 'collateral',
      fileTypes: ['pdf', 'jpg', 'png'],
      status: 'pending',
    },
  ],
  inventory_financing: [
    {
      id: 'inventory_application',
      name: 'Inventory Financing Application',
      description: 'Completed inventory financing application',
      required: true,
      category: 'application',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
    {
      id: 'detailed_inventory',
      name: 'Detailed Inventory List',
      description: 'Detailed inventory list with cost, market value, and turnover rates',
      required: true,
      category: 'collateral',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'supplier_contracts',
      name: 'Supplier Contracts',
      description: 'Current supplier/vendor contracts and terms',
      required: true,
      category: 'financial',
      fileTypes: ['pdf'],
      status: 'pending',
    },
    {
      id: 'sales_projections',
      name: 'Sales Projections',
      description: '12-month sales and inventory turnover projections',
      required: true,
      category: 'financial',
      fileTypes: ['pdf', 'xlsx'],
      status: 'pending',
    },
    {
      id: 'inventory_management',
      name: 'Inventory Management System Details',
      description: 'Description of inventory management system and processes',
      required: false,
      category: 'other',
      fileTypes: ['pdf', 'docx'],
      status: 'pending',
    },
  ],
};

export class DocumentRequirementsService {
  // Get required documents for an application type
  static getRequiredDocuments(applicationType: ApplicationType): DocumentRequirement[] {
    return documentRequirements[applicationType] || [];
  }

  // Map form names to application types
  static getApplicationTypeFromFormName(formName: string): ApplicationType | null {
    const formNameToType: Record<string, ApplicationType> = {
      'Equipment Finance Application': 'equipment_finance',
      'Working Capital Application': 'working_capital',
      'Commercial Real Estate Application': 'commercial_real_estate',
      'General Credit Application': 'business_information',
      'Line of Credit Application': 'line_of_credit',
      'SBA Loan Application': 'sba_loan',
      'Inventory Financing Application': 'inventory_financing',
    };

    return formNameToType[formName] || null;
  }

  // Update document status
  static updateDocumentStatus(
    requirements: DocumentRequirement[],
    documentId: string,
    status: 'pending' | 'uploaded' | 'verified' | 'rejected',
    fileId?: string
  ): DocumentRequirement[] {
    return requirements.map(req => {
      if (req.id === documentId) {
        return {
          ...req,
          status,
          uploadedFileId: fileId || req.uploadedFileId,
        };
      }
      return req;
    });
  }

  // Check if all required documents are provided
  static areAllRequiredDocumentsProvided(requirements: DocumentRequirement[]): boolean {
    const requiredDocs = requirements.filter(doc => doc.required);
    return requiredDocs.every(doc => doc.status === 'uploaded' || doc.status === 'verified');
  }

  // Get document progress percentage
  static getDocumentProgress(requirements: DocumentRequirement[]): number {
    const requiredDocs = requirements.filter(doc => doc.required);
    if (requiredDocs.length === 0) return 100;

    const completedDocs = requiredDocs.filter(
      doc => doc.status === 'uploaded' || doc.status === 'verified'
    );

    return Math.round((completedDocs.length / requiredDocs.length) * 100);
  }
}
