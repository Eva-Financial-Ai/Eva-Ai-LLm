// UserTypes.ts - Core definitions
export enum UserType {
  BUSINESS = 'business', // Borrowers seeking financing
  VENDOR = 'vendor', // Service providers
  BROKERAGE = 'brokerage', // Financial intermediaries
  LENDER = 'lender', // Financial institutions providing loans
}

// User interface for application-wide use
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  profilePhoto?: string;
  type?: UserType;
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
