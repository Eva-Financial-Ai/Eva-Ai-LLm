// UserTypes.ts - Core definitions
export enum UserType {
  BUSINESS = 'business', // Borrowers seeking financing
  VENDOR = 'vendor', // Service providers
  BROKERAGE = 'brokerage', // Financial intermediaries
  LENDER = 'lender', // Financial institutions providing loans
  ADMIN = 'admin', // System administrators
  DEVELOPER = 'developer', // System developers
}

// Core Staff roles
export enum CoreRole {
  SALES_MANAGER = 'sales_manager',
  LOAN_PROCESSOR = 'loan_processor',
  CREDIT_UNDERWRITER = 'credit_underwriter',
  CREDIT_COMMITTEE = 'credit_committee',
  PORTFOLIO_MANAGER = 'portfolio_manager',
}

// Business Owner (Borrower) roles
export enum BusinessRole {
  OWNER = 'owners',
  EMPLOYEE = 'employees',
  CPA_BOOKKEEPER = 'cpa_bookkeeper',
  AUTHORIZED_PROXY = 'authorized_proxy',
}

// Vendor roles
export enum VendorRole {
  BUSINESS_OWNER = 'business_owner',
  FINANCE_DEPARTMENT = 'finance_department',
  SALES_DEPARTMENT = 'sales_department',
  MARKETING = 'marketing',
  MAINTENANCE_SERVICE = 'maintenance_service',
  MANAGERS = 'managers',
}

// Lender/Broker roles
export enum LenderBrokerRole {
  DEFAULT = 'default_role',
  CPA_BOOKKEEPER = 'cpa_bookkeeper',
}

// User interface for application-wide use
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profilePhoto?: string;
  type?: UserType;
  specificRole?: string;
  businessName?: string;
  taxId?: string;
  profileData?: Record<string, any>;
}

// Permission levels from most restricted to most permissive
export enum PermissionLevel {
  NONE = 0,
  VIEW = 1,
  INTERACT = 2,
  MODIFY = 3,
  ADMIN = 4,
}

// Feature access mapping
export interface FeatureAccess {
  dashboard: PermissionLevel;
  transactions: PermissionLevel;
  documents: PermissionLevel;
  userManagement: PermissionLevel;
  reporting: PermissionLevel;
  messaging: PermissionLevel;
  settings: PermissionLevel;
  // Add other features as needed
}

// Define default permissions by user type
export const defaultPermissions: Record<UserType, FeatureAccess> = {
  [UserType.BUSINESS]: {
    dashboard: PermissionLevel.VIEW,
    transactions: PermissionLevel.INTERACT,
    documents: PermissionLevel.VIEW,
    userManagement: PermissionLevel.NONE,
    reporting: PermissionLevel.NONE,
    messaging: PermissionLevel.INTERACT,
    settings: PermissionLevel.VIEW,
  },
  [UserType.VENDOR]: {
    dashboard: PermissionLevel.VIEW,
    transactions: PermissionLevel.VIEW,
    documents: PermissionLevel.VIEW,
    userManagement: PermissionLevel.NONE,
    reporting: PermissionLevel.NONE,
    messaging: PermissionLevel.INTERACT,
    settings: PermissionLevel.VIEW,
  },
  [UserType.BROKERAGE]: {
    dashboard: PermissionLevel.ADMIN,
    transactions: PermissionLevel.ADMIN,
    documents: PermissionLevel.ADMIN,
    userManagement: PermissionLevel.ADMIN,
    reporting: PermissionLevel.ADMIN,
    messaging: PermissionLevel.ADMIN,
    settings: PermissionLevel.ADMIN,
  },
  [UserType.LENDER]: {
    dashboard: PermissionLevel.ADMIN,
    transactions: PermissionLevel.ADMIN,
    documents: PermissionLevel.ADMIN,
    userManagement: PermissionLevel.ADMIN,
    reporting: PermissionLevel.ADMIN,
    messaging: PermissionLevel.ADMIN,
    settings: PermissionLevel.ADMIN,
  },
  [UserType.ADMIN]: {
    dashboard: PermissionLevel.ADMIN,
    transactions: PermissionLevel.ADMIN,
    documents: PermissionLevel.ADMIN,
    userManagement: PermissionLevel.ADMIN,
    reporting: PermissionLevel.ADMIN,
    messaging: PermissionLevel.ADMIN,
    settings: PermissionLevel.ADMIN,
  },
  [UserType.DEVELOPER]: {
    dashboard: PermissionLevel.ADMIN,
    transactions: PermissionLevel.ADMIN,
    documents: PermissionLevel.ADMIN,
    userManagement: PermissionLevel.ADMIN,
    reporting: PermissionLevel.ADMIN,
    messaging: PermissionLevel.ADMIN,
    settings: PermissionLevel.ADMIN,
  },
};

// Employee roles for additional permission granularity
export enum EmployeeRole {
  VIEWER = 'viewer',
  OPERATOR = 'operator',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

// Role hierarchy for permission checks
export const roleHierarchy: Record<EmployeeRole, number> = {
  [EmployeeRole.VIEWER]: 1,
  [EmployeeRole.OPERATOR]: 2,
  [EmployeeRole.MANAGER]: 3,
  [EmployeeRole.ADMIN]: 4,
};

// Map for getting available specific roles based on user type
export const userTypeToRolesMap: Record<string, string[]> = {
  'lender': ['default_role', 'cpa_bookkeeper'],
  'broker': ['default_role', 'cpa_bookkeeper'],
  'borrower': ['owners', 'employees', 'cpa_bookkeeper', 'authorized_proxy'],
  'vendor': ['business_owner', 'finance_department', 'sales_department', 'marketing', 'maintenance_service', 'managers'],
  'admin': ['admin'],
  'developer': ['developer'],
  'sales_manager': ['sales_manager'],
  'loan_processor': ['loan_processor'],
  'credit_underwriter': ['credit_underwriter'],
  'credit_committee': ['credit_committee'],
  'portfolio_manager': ['portfolio_manager'],
};

// Role display names for UI rendering
export const roleDisplayNames: Record<string, string> = {
  // Core Staff roles
  'sales_manager': 'Sales & Relationship Manager',
  'loan_processor': 'Loan Processor',
  'credit_underwriter': 'Credit Underwriter & Analyst',
  'credit_committee': 'Credit Committee',
  'portfolio_manager': 'Portfolio Manager',
  
  // User types
  'lender': 'Lender',
  'broker': 'Broker',
  'borrower': 'Borrower',
  'vendor': 'Vendor',
  
  // Admin roles
  'admin': 'System Root Admin',
  'developer': 'Developer',
  
  // Specific roles
  'default_role': 'Default Role',
  'cpa_bookkeeper': 'CPA, Bookkeeper',
  'owners': 'Owners',
  'employees': 'Employees',
  'authorized_proxy': 'Authorized Proxy',
  'business_owner': 'Business Owner',
  'finance_department': 'Finance Department & Titling',
  'sales_department': 'Sales Department',
  'marketing': 'Marketing',
  'maintenance_service': 'Maintenance and Service',
  'managers': 'Managers',
};
