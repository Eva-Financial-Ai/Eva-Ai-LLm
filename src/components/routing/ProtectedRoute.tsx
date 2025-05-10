import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Whitelist of allowed emails
const ALLOWED_EMAILS = [
  'justin@evafi.ai',
  'rao@evafi.ai',
  'abel@evafi.ai',
  'lahari@evafi.ai',
  'tech@evafi.ai',
  'demo@evafi.ai',
  'customer@lender.com',
  'investor@gmail.com',
];

// Allowed phone number for development access
const ALLOWED_PHONE = '7027654321';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="ml-3 text-primary-600">Verifying access...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the current location for redirecting back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
