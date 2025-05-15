import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserType,
  FeatureAccess,
  defaultPermissions,
  EmployeeRole,
  roleHierarchy,
  userTypeToRolesMap,
  roleDisplayNames,
  CoreRole,
} from '../types/UserTypes';
import { UserRoleType, UserSpecificRoleType } from '../components/layout/TopNavbar';

interface UserTypeContextType {
  userType: UserType | null;
  permissions: FeatureAccess | null;
  employeeRole: EmployeeRole | null;
  specificRole: string | null;
  availableSpecificRoles: string[];
  hasPermission: (feature: keyof FeatureAccess, level: number) => boolean;
  hasRolePermission: (feature: keyof FeatureAccess, minimumRole: EmployeeRole) => boolean;
  setUserType: (type: UserType) => void;
  setEmployeeRole: (role: EmployeeRole) => void;
  setSpecificRole: (role: string) => void;
  getUserTypeDisplayName: () => string;
  getSpecificRoleDisplayName: () => string;
  loadingPermissions: boolean;
}

// Export the interface
export type { UserTypeContextType };

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

export const UserTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [employeeRole, setEmployeeRole] = useState<EmployeeRole | null>(null);
  const [specificRole, setSpecificRole] = useState<string | null>(null);
  const [availableSpecificRoles, setAvailableSpecificRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<FeatureAccess | null>(null);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        setLoadingPermissions(true);
        // Default to 'borrower' if nothing is in localStorage, which aligns with a common default.
        const storedRoleString = localStorage.getItem('userRole') || 'borrower';
        const storedSpecificRoleString = localStorage.getItem('specificRole');

        const mappedUserTypeEnum = mapToUserType(storedRoleString);

        if (mappedUserTypeEnum) { // Handles UserType.LENDER, UserType.BROKERAGE, UserType.BUSINESS, UserType.VENDOR, UserType.ADMIN, UserType.DEVELOPER
          setUserType(mappedUserTypeEnum);
          setPermissions(defaultPermissions[mappedUserTypeEnum]);
        } else if (Object.values(CoreRole).includes(storedRoleString as CoreRole)) { // Handles CoreRoles like 'sales_manager'
          // For Core Staff Roles, their UserType for permissions might be a general one like LENDER, or specific if defined.
          // This part needs careful consideration based on the desired permission model for CoreRoles.
          // For now, assuming they operate under LENDER permissions as a placeholder.
          setUserType(UserType.LENDER); 
          setPermissions(defaultPermissions[UserType.LENDER]);
        } else { // Unrecognized role string, fallback to a default
          setUserType(UserType.BUSINESS); // Default UserType
          setPermissions(defaultPermissions[UserType.BUSINESS]);
          // If the storedRoleString was unrecognized, update localStorage to reflect the default 'borrower'
          if (storedRoleString !== 'borrower') {
            localStorage.setItem('userRole', 'borrower');
          }
        }

        // Determine available specific roles based on the string role from localStorage (storedRoleString)
        // This ensures that 'sales_manager' (a string) correctly fetches its specific roles, e.g., ['sales_manager']
        const specificRolesForStoredRole = userTypeToRolesMap[storedRoleString] || [];
        setAvailableSpecificRoles(specificRolesForStoredRole);

        // Set the specificRole state
        if (storedSpecificRoleString && specificRolesForStoredRole.includes(storedSpecificRoleString)) {
          setSpecificRole(storedSpecificRoleString);
        } else if (specificRolesForStoredRole.length > 0) {
          const defaultSpecific = specificRolesForStoredRole[0];
          setSpecificRole(defaultSpecific);
          localStorage.setItem('specificRole', defaultSpecific); // Persist if it was missing or invalid
        } else {
          setSpecificRole(null); // No specific roles available or applicable
          localStorage.removeItem('specificRole'); // Clean up localStorage if no specific role is set
        }

      } catch (error) {
        console.error('Failed to fetch user type', error);
        // Fallback to a known safe default state in case of any error during initialization
        setUserType(UserType.BUSINESS);
        setPermissions(defaultPermissions[UserType.BUSINESS]);
        const borrowerSpecificRoles = userTypeToRolesMap['borrower'] || ['owners'];
        setAvailableSpecificRoles(borrowerSpecificRoles);
        const defaultBorrowerSpecificRole = borrowerSpecificRoles[0] || 'owners';
        setSpecificRole(defaultBorrowerSpecificRole);
        // Ensure localStorage reflects these defaults
        localStorage.setItem('userRole', 'borrower');
        localStorage.setItem('specificRole', defaultBorrowerSpecificRole);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchUserType();
  }, []);

  // Helper function to map existing roles to new UserType enum
  const mapToUserType = (role: string): UserType | null => {
    switch (role.toLowerCase()) {
      case 'borrower':
        return UserType.BUSINESS;
      case 'vendor':
        return UserType.VENDOR;
      case 'broker':
        return UserType.BROKERAGE;
      case 'lender':
        return UserType.LENDER;
      case 'admin':
        return UserType.ADMIN;
      case 'developer':
        return UserType.DEVELOPER;
      case 'sales_manager':
      case 'loan_processor':
      case 'credit_underwriter':
      case 'credit_committee':
      case 'portfolio_manager':
        // Core roles are stored as-is, not mapped to UserType
        return null;
      default:
        return null;
    }
  };

  // Helper function to map from UserType enum to string
  const mapFromUserTypeEnum = (userType: UserType): string => {
    switch (userType) {
      case UserType.BUSINESS:
        return 'borrower';
      case UserType.VENDOR:
        return 'vendor';
      case UserType.BROKERAGE:
        return 'broker';
      case UserType.LENDER:
        return 'lender';
      case UserType.ADMIN:
        return 'admin';
      case UserType.DEVELOPER:
        return 'developer';
      default:
        return 'borrower'; // Default to borrower if not found
    }
  };

  // Update permissions and available roles when user type changes
  useEffect(() => {
    if (userType) {
      setPermissions(defaultPermissions[userType]);
      
      // Update available specific roles
      const userTypeString = mapFromUserTypeEnum(userType);
      const roles = userTypeToRolesMap[userTypeString] || [];
      setAvailableSpecificRoles(roles);
      
      // Set a valid specific role
      if (roles.length > 0) {
        if (!specificRole || !roles.includes(specificRole)) {
          setSpecificRole(roles[0]);
          localStorage.setItem('specificRole', roles[0]);
        }
      }
    }
  }, [userType]);

  // Helper to set user type with side effects
  const handleSetUserType = (type: UserType) => {
    setUserType(type);
    
    // Save to localStorage
    const userTypeString = mapFromUserTypeEnum(type);
    localStorage.setItem('userRole', userTypeString);
    
    // Update available specific roles
    const roles = userTypeToRolesMap[userTypeString] || [];
    setAvailableSpecificRoles(roles);
    
    // Set a valid specific role
    if (roles.length > 0) {
      setSpecificRole(roles[0]);
      localStorage.setItem('specificRole', roles[0]);
    }
  };

  // Helper to set specific role with side effects
  const handleSetSpecificRole = (role: string) => {
    // First check if the role is valid for the current user type
    const storedRoleString = localStorage.getItem('userRole') || '';
    const validRolesForType = userTypeToRolesMap[storedRoleString] || [];
    
    // Only set the role if it's valid for the current user type
    if (validRolesForType.includes(role)) {
      setSpecificRole(role);
      localStorage.setItem('specificRole', role);
      setAvailableSpecificRoles(validRolesForType);
    } else {
      // If the requested role isn't valid for the current user type,
      // set a valid default instead
      if (validRolesForType.length > 0) {
        const defaultRole = validRolesForType[0];
        setSpecificRole(defaultRole);
        localStorage.setItem('specificRole', defaultRole);
      }
    }
  };

  const hasPermission = (feature: keyof FeatureAccess, level: number): boolean => {
    if (!permissions) return false;
    return permissions[feature] >= level;
  };

  const hasRolePermission = (feature: keyof FeatureAccess, minimumRole: EmployeeRole): boolean => {
    if (!permissions || !employeeRole) return false;

    // First check if the user type has access to this feature
    const hasFeatureAccess = permissions[feature] > 0;

    // Then check if the employee role is sufficient
    const hasRoleAccess = roleHierarchy[employeeRole] >= roleHierarchy[minimumRole];

    return hasFeatureAccess && hasRoleAccess;
  };

  // Get display name for current user type
  const getUserTypeDisplayName = (): string => {
    if (!userType) return '';
    
    const userTypeString = mapFromUserTypeEnum(userType);
    return roleDisplayNames[userTypeString] || userTypeString;
  };

  // Get display name for current specific role
  const getSpecificRoleDisplayName = (): string => {
    if (!specificRole) return '';
    
    return roleDisplayNames[specificRole] || specificRole;
  };

  const value = {
    userType,
    permissions,
    employeeRole,
    specificRole,
    availableSpecificRoles,
    hasPermission,
    hasRolePermission,
    setUserType: handleSetUserType,
    setEmployeeRole,
    setSpecificRole: handleSetSpecificRole,
    getUserTypeDisplayName,
    getSpecificRoleDisplayName,
    loadingPermissions,
  };

  return <UserTypeContext.Provider value={value}>{children}</UserTypeContext.Provider>;
};

export const useUserType = (): UserTypeContextType => {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error('useUserType must be used within a UserTypeProvider');
  }
  return context;
};
