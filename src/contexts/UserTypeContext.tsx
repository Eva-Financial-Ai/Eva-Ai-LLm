import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserType,
  FeatureAccess,
  defaultPermissions,
  EmployeeRole,
  roleHierarchy,
} from '../types/UserTypes';

interface UserTypeContextType {
  userType: UserType | null;
  permissions: FeatureAccess | null;
  employeeRole: EmployeeRole | null;
  hasPermission: (feature: keyof FeatureAccess, level: number) => boolean;
  hasRolePermission: (feature: keyof FeatureAccess, minimumRole: EmployeeRole) => boolean;
  setUserType: (type: UserType) => void;
  setEmployeeRole: (role: EmployeeRole) => void;
  loadingPermissions: boolean;
}

// Export the interface
export type { UserTypeContextType };

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

export const UserTypeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [employeeRole, setEmployeeRole] = useState<EmployeeRole | null>(null);
  const [permissions, setPermissions] = useState<FeatureAccess | null>(null);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    // Fetch user type from API or local storage
    const fetchUserType = async () => {
      try {
        // Get stored user role if available
        const storedUserType = localStorage.getItem('userRole');
        const mappedUserType = mapToUserType(storedUserType || '');

        if (mappedUserType) {
          setUserType(mappedUserType);
          // Set default permissions based on user type
          setPermissions(defaultPermissions[mappedUserType]);
        } else {
          // Default to business type if not found
          setUserType(UserType.BUSINESS);
          setPermissions(defaultPermissions[UserType.BUSINESS]);
        }

        // Set default employee role
        setEmployeeRole(EmployeeRole.VIEWER);
      } catch (error) {
        console.error('Failed to fetch user type', error);
        // Set defaults
        setUserType(UserType.BUSINESS);
        setPermissions(defaultPermissions[UserType.BUSINESS]);
        setEmployeeRole(EmployeeRole.VIEWER);
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
      default:
        return null;
    }
  };

  // Update permissions when user type changes
  useEffect(() => {
    if (userType) {
      setPermissions(defaultPermissions[userType]);
    }
  }, [userType]);

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

  const value = {
    userType,
    permissions,
    employeeRole,
    hasPermission,
    hasRolePermission,
    setUserType,
    setEmployeeRole,
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
