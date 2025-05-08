// AssetClassTypes.ts - Asset classifications based on Asset Press Standardization Rules

// 18 main asset class categories
export enum AssetClass {
  CASH_EQUIVALENTS = 'cash_equivalents',
  COMMERCIAL_PAPER_SECURED = 'commercial_paper_secured',
  GOVERNMENT_BONDS = 'government_bonds',
  CORPORATE_BONDS = 'corporate_bonds',
  EQUITIES = 'equities',
  MUTUAL_FUNDS = 'mutual_funds',
  REAL_ESTATE = 'real_estate',
  COMMODITIES = 'commodities',
  CRYPTO = 'crypto',
  DERIVATIVES = 'derivatives',
  PRIVATE_EQUITY = 'private_equity',
  FOREX = 'forex',
  EQUIPMENT = 'equipment',
  VEHICLES = 'vehicles',
  UNSECURED_COMMERCIAL_PAPER = 'unsecured_commercial_paper',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  DIGITAL_ASSETS = 'digital_assets',
  OTHER = 'other'
}

// Asset class display names for UI
export const AssetClassNames: Record<AssetClass, string> = {
  [AssetClass.CASH_EQUIVALENTS]: 'Cash & Cash Equivalents',
  [AssetClass.COMMERCIAL_PAPER_SECURED]: 'Commercial Paper (Secured)',
  [AssetClass.GOVERNMENT_BONDS]: 'Government Bonds',
  [AssetClass.CORPORATE_BONDS]: 'Corporate Bonds',
  [AssetClass.EQUITIES]: 'Equities',
  [AssetClass.MUTUAL_FUNDS]: 'Mutual Funds / ETFs',
  [AssetClass.REAL_ESTATE]: 'Real Estate',
  [AssetClass.COMMODITIES]: 'Commodities',
  [AssetClass.CRYPTO]: 'Cryptocurrency & Blockchain',
  [AssetClass.DERIVATIVES]: 'Derivatives',
  [AssetClass.PRIVATE_EQUITY]: 'Private Equity / VC',
  [AssetClass.FOREX]: 'Forex',
  [AssetClass.EQUIPMENT]: 'Equipment & Machinery',
  [AssetClass.VEHICLES]: 'Motor Vehicles & Aircraft',
  [AssetClass.UNSECURED_COMMERCIAL_PAPER]: 'Unsecured Commercial Paper',
  [AssetClass.INTELLECTUAL_PROPERTY]: 'Intellectual Property',
  [AssetClass.DIGITAL_ASSETS]: 'Digital Assets (Non-Crypto)',
  [AssetClass.OTHER]: 'Other Assets'
};

// Blockchain verification status
export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed'
}

// Ownership structure
export interface Ownership {
  owner: string;
  percentage: number;
  since: string;
  organizationId?: string;
}

// Financial data structure
export interface FinancialData {
  marketValue: number;
  originalValue?: number;
  yield?: number;
  depreciationRate?: number;
  forecastingScore?: number; // AI prediction confidence (1-100)
}

// Lien/UCC status tracking
export interface LienStatus {
  hasLien: boolean;
  lienHolder?: string;
  lienAmount?: number;
  lienExpirationDate?: string;
  uccFilingNumber?: string;
  uccFilingDate?: string;
}

// Asset tracking data
export interface TrackingInfo {
  location?: string;
  liquidityRating: number; // 1-10 scale
  utilizationRate?: number; // For physical assets
  riskAssessment?: number; // 1-10 scale
  maintenanceSchedule?: string; // For physical assets
}

// Advanced blockchain verification data
export interface BlockchainVerification {
  status: VerificationStatus;
  transactionHash?: string;
  verificationDate?: string;
  smartContractAddress?: string;
  ledgerType?: 'ethereum' | 'hyperledger' | 'shield_ledger' | 'other';
}

// Complete Asset structure
export interface Asset {
  id: string;
  name: string;
  assetID: string; // Shield ID standard identifier
  assetClass: AssetClass;
  assetSubclass?: string;
  description?: string;
  
  // Core financial data
  financialData: FinancialData;
  
  // Risk and performance
  risk: 'Low' | 'Medium' | 'High';
  performance?: number;
  performanceTrend?: number; // Year-over-year change
  
  // Ownership and legal information
  ownership: Ownership[];
  lienStatus?: LienStatus;
  
  // Tracking and utilization
  trackingInfo: TrackingInfo;
  
  // Advanced features
  blockchainVerification: BlockchainVerification;
  
  // Metadata
  lastUpdate: string;
  dateCreated: string;
  attachments?: string[]; // Document/image URIs
}

// Role-specific portfolio view configuration
export enum PortfolioUserRole {
  OWNER = 'owner',           // Asset owner (e.g., borrower)
  MANAGER = 'manager',       // Portfolio manager (e.g., broker)
  SERVICER = 'servicer',     // Asset servicer (e.g., lender)
  VENDOR = 'vendor'          // Service provider
}

// Role-specific views and permissions
export const RoleViewPermissions: Record<PortfolioUserRole, {
  viewableAssetClasses: AssetClass[],
  canInitiateVerification: boolean,
  canTransferOwnership: boolean,
  canUpdateAssetInfo: boolean,
  defaultSortField: string
}> = {
  [PortfolioUserRole.OWNER]: {
    viewableAssetClasses: Object.values(AssetClass),
    canInitiateVerification: true,
    canTransferOwnership: true,
    canUpdateAssetInfo: true,
    defaultSortField: 'assetClass'
  },
  [PortfolioUserRole.MANAGER]: {
    viewableAssetClasses: Object.values(AssetClass),
    canInitiateVerification: true,
    canTransferOwnership: false,
    canUpdateAssetInfo: true,
    defaultSortField: 'marketValue'
  },
  [PortfolioUserRole.SERVICER]: {
    viewableAssetClasses: [
      AssetClass.COMMERCIAL_PAPER_SECURED,
      AssetClass.UNSECURED_COMMERCIAL_PAPER,
      AssetClass.EQUIPMENT,
      AssetClass.VEHICLES,
      AssetClass.REAL_ESTATE
    ],
    canInitiateVerification: true,
    canTransferOwnership: false,
    canUpdateAssetInfo: true,
    defaultSortField: 'blockchainVerification'
  },
  [PortfolioUserRole.VENDOR]: {
    viewableAssetClasses: [
      AssetClass.EQUIPMENT,
      AssetClass.VEHICLES,
      AssetClass.DIGITAL_ASSETS
    ],
    canInitiateVerification: false,
    canTransferOwnership: false,
    canUpdateAssetInfo: false,
    defaultSortField: 'lastUpdate'
  }
}; 