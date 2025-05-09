import React from 'react';
import { useUserType } from '../contexts/UserTypeContext';
import { FeatureAccess, PermissionLevel, EmployeeRole } from '../types/UserTypes';

interface PermissionGuardProps {
  feature: keyof FeatureAccess;
  minimumPermission: PermissionLevel;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  feature,
  minimumPermission,
  children,
  fallback = null,
}) => {
  const { hasPermission, loadingPermissions } = useUserType();

  if (loadingPermissions) {
    return <div className="animate-pulse bg-gray-100 rounded h-10"></div>;
  }

  if (hasPermission(feature, minimumPermission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

interface RolePermissionGuardProps {
  feature: keyof FeatureAccess;
  minimumRole: EmployeeRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RolePermissionGuard: React.FC<RolePermissionGuardProps> = ({
  feature,
  minimumRole,
  children,
  fallback = null,
}) => {
  const { hasRolePermission, loadingPermissions } = useUserType();

  if (loadingPermissions) {
    return <div className="animate-pulse bg-gray-100 rounded h-10"></div>;
  }

  if (hasRolePermission(feature, minimumRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
