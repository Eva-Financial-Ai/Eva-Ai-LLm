import React from 'react';
import { Route, Navigate, RouteProps } from 'react-router-dom';
import { useUserType } from '../../contexts/UserTypeContext';
import { UserType, PermissionLevel, FeatureAccess } from '../../types/UserTypes';

interface ProtectedRouteProps extends Omit<RouteProps, 'children'> {
  allowedUserTypes?: UserType[];
  requiredFeature?: keyof FeatureAccess;
  minimumPermission?: PermissionLevel;
  redirectPath?: string;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedUserTypes,
  requiredFeature,
  minimumPermission = PermissionLevel.VIEW,
  redirectPath = '/unauthorized',
  children,
  ...routeProps
}) => {
  const { userType, hasPermission, loadingPermissions } = useUserType();

  if (loadingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Check if user type is allowed
  const isUserTypeAllowed = !allowedUserTypes || (userType && allowedUserTypes.includes(userType));

  // Check if user has necessary feature permission
  const hasFeaturePermission =
    !requiredFeature || hasPermission(requiredFeature, minimumPermission);

  // Only allow access if both conditions are met
  if (!isUserTypeAllowed || !hasFeaturePermission) {
    return <Navigate to={redirectPath} replace />;
  }

  // Render the route normally
  return <>{children}</>;
};
