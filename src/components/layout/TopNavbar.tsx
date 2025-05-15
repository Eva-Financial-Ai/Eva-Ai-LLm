import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserType } from '../../contexts/UserTypeContext';
import { roleDisplayNames, userTypeToRolesMap } from '../../types/UserTypes';

// Define user role types
export type UserRoleType = 
  // Core staff roles
  | 'sales_manager' 
  | 'loan_processor' 
  | 'credit_underwriter' 
  | 'credit_committee' 
  | 'portfolio_manager'
  // External user types
  | 'lender'
  | 'broker'
  | 'borrower'
  | 'vendor'
  // System roles
  | 'admin'
  | 'developer';

// Define user specific roles based on user type
export type CoreRoleType =
  | 'sales_manager' 
  | 'loan_processor' 
  | 'credit_underwriter' 
  | 'credit_committee' 
  | 'portfolio_manager';

export type BusinessRoleType =
  | 'business_owner'
  | 'finance_department'
  | 'sales_department'
  | 'marketing'
  | 'maintenance_service'
  | 'managers';

export type LenderBrokerRoleType =
  | 'default_role'
  | 'cpa_bookkeeper';

export type BorrowerRoleType =
  | 'owners'
  | 'employees'
  | 'cpa_bookkeeper'
  | 'authorized_proxy';

export type UserSpecificRoleType = CoreRoleType | BusinessRoleType | LenderBrokerRoleType | BorrowerRoleType;

export type DemoContextType = 'all' | 'lender' | 'broker' | 'borrower' | 'vendor' | 'admin' | 'core';

export interface UserTypeConfig {
  type: UserRoleType;
  specificRoles: UserSpecificRoleType[];
  displayName: string;
  category: 'core' | 'user' | 'admin';
}

interface TopNavbarProps {
  currentTransaction?: string;
  demoContext?: DemoContextType;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ 
  currentTransaction,
  demoContext = 'all'
}) => {
  const navigate = useNavigate();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isSpecificRoleDropdownOpen, setIsSpecificRoleDropdownOpen] = useState(false);
  const userTypeContext = useUserType();

  // Keep local state in sync with UserTypeContext
  const [currentUserType, setCurrentUserType] = useState<UserRoleType>(
    localStorage.getItem('userRole') as UserRoleType || 'lender'
  );

  // Group roles by category for the dropdown
  const coreRoles = ['sales_manager', 'loan_processor', 'credit_underwriter', 'credit_committee', 'portfolio_manager'];
  const userRoles = ['lender', 'broker', 'borrower', 'vendor'];
  const adminRoles = ['admin', 'developer'];

  // Filter roles based on demo context
  const getFilteredCoreRoles = () => {
    if (demoContext === 'all' || demoContext === 'core') return coreRoles;
    return [];
  };

  const getFilteredUserRoles = () => {
    if (demoContext === 'all') return userRoles;
    if (demoContext === 'lender') return ['lender'];
    if (demoContext === 'broker') return ['broker'];
    if (demoContext === 'borrower') return ['borrower'];
    if (demoContext === 'vendor') return ['vendor'];
    return userRoles.filter(role => role === demoContext);
  };

  const getFilteredAdminRoles = () => {
    if (demoContext === 'all' || demoContext === 'admin') return adminRoles;
    return [];
  };

  // Sync with localStorage on component mount
  useEffect(() => {
    const storedUserType = localStorage.getItem('userRole') as UserRoleType;
    const storedSpecificRole = localStorage.getItem('specificRole');
    
    if (storedUserType) {
      // Verify the stored user type is valid for the current demo context
      const filteredCoreRoles = getFilteredCoreRoles();
      const filteredUserRoles = getFilteredUserRoles();
      const filteredAdminRoles = getFilteredAdminRoles();
      
      const isValidRole = [
        ...filteredCoreRoles,
        ...filteredUserRoles,
        ...filteredAdminRoles
      ].includes(storedUserType);
      
      // If valid, set it; otherwise, set to a default based on context
      if (isValidRole) {
        setCurrentUserType(storedUserType);
      } else {
        // Set a default based on demo context
        let defaultRole: UserRoleType;
        
        if (demoContext === 'core' && filteredCoreRoles.length > 0) {
          defaultRole = filteredCoreRoles[0] as UserRoleType;
        } else if (filteredUserRoles.length > 0) {
          defaultRole = filteredUserRoles[0] as UserRoleType;
        } else if (filteredAdminRoles.length > 0) {
          defaultRole = filteredAdminRoles[0] as UserRoleType;
        } else {
          defaultRole = 'lender'; // Fallback default
        }
        
        setCurrentUserType(defaultRole);
        localStorage.setItem('userRole', defaultRole);
      }
    }
    
    if (storedSpecificRole && userTypeContext.availableSpecificRoles.includes(storedSpecificRole)) {
      userTypeContext.setSpecificRole(storedSpecificRole);
    }
  }, [demoContext]);

  // Handle role change
  const handleRoleChange = (role: string) => {
    // Convert role string to UserRoleType
    const newRole = role as UserRoleType;
    setCurrentUserType(newRole);
    
    // Different handling for core roles vs user types
    if (coreRoles.includes(role)) {
      // For core roles, we set both the user type and specific role to the same value
      localStorage.setItem('userRole', role);
      localStorage.setItem('specificRole', role);
      
      // Set specific role
      if (userTypeContext.setSpecificRole) {
        userTypeContext.setSpecificRole(role);
      }
    } else {
      // For user types, we get the default specific role
      const defaultSpecificRole = userTypeToRolesMap[role]?.[0] || role;
      
      localStorage.setItem('userRole', role);
      localStorage.setItem('specificRole', defaultSpecificRole);
      
      // Set specific role
      if (userTypeContext.setSpecificRole) {
        userTypeContext.setSpecificRole(defaultSpecificRole);
      }
    }
    
    // Refresh the page to apply changes
    window.location.reload();
    
    setIsRoleDropdownOpen(false);
  };

  // Handle specific role change
  const handleSpecificRoleChange = (role: string) => {
    if (userTypeContext.availableSpecificRoles.includes(role)) {
      userTypeContext.setSpecificRole(role);
      localStorage.setItem('specificRole', role);
    }
    setIsSpecificRoleDropdownOpen(false);
  };

  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  // Go to dashboard
  const handleGoToDashboard = () => {
    navigate('/');
  };

  // Only show the specific role selector if there are multiple roles
  const shouldShowSpecificRoleSelector = userTypeContext.availableSpecificRoles.length > 1;

  // Get current user type and role display names
  const currentUserTypeDisplay = userTypeContext.getUserTypeDisplayName();
  const currentSpecificRoleDisplay = userTypeContext.getSpecificRoleDisplayName();

  // Get filtered roles based on the demo context
  const filteredCoreRoles = getFilteredCoreRoles();
  const filteredUserRoles = getFilteredUserRoles();
  const filteredAdminRoles = getFilteredAdminRoles();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section - Logo and navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {/* EVA Logo */}
              <button onClick={handleGoToDashboard} className="flex items-center text-primary-600 font-bold text-xl">
                <span className="text-2xl mr-1">EVA</span>
                <span className="text-gray-500 text-sm">Platform</span>
              </button>
            </div>
            
            {/* Navigation buttons */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <button 
                onClick={handleGoBack}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                <span className="flex items-center">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </span>
              </button>
            </div>
          </div>

          {/* Middle section - Transaction ID if available */}
          <div className="flex-1 flex justify-center items-center">
            {currentTransaction && (
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-gray-600">Transaction: {currentTransaction}</span>
              </div>
            )}
          </div>

          {/* Right section - User Type and Role selectors */}
          <div className="flex items-center space-x-4">
            {/* User Type selector */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="mr-2">{currentUserTypeDisplay}</span>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isRoleDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {filteredCoreRoles.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs font-bold text-gray-500">Core Roles</div>
                        {filteredCoreRoles.map(role => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`w-full text-left px-4 py-2 text-sm ${currentUserType === role ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            role="menuitem"
                          >
                            {roleDisplayNames[role] || role}
                          </button>
                        ))}
                      </>
                    )}
                    
                    {filteredUserRoles.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs font-bold text-gray-500 border-t border-gray-100 mt-1">User Types</div>
                        {filteredUserRoles.map(role => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`w-full text-left px-4 py-2 text-sm ${currentUserType === role ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            role="menuitem"
                          >
                            {roleDisplayNames[role] || role}
                          </button>
                        ))}
                      </>
                    )}
                    
                    {filteredAdminRoles.length > 0 && (
                      <>
                        <div className="px-3 py-2 text-xs font-bold text-gray-500 border-t border-gray-100 mt-1">Admin</div>
                        {filteredAdminRoles.map(role => (
                          <button
                            key={role}
                            onClick={() => handleRoleChange(role)}
                            className={`w-full text-left px-4 py-2 text-sm ${currentUserType === role ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                            role="menuitem"
                          >
                            {roleDisplayNames[role] || role}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Specific Role selector - only show if there are multiple roles available */}
            {shouldShowSpecificRoleSelector && (
              <div className="relative">
                <button
                  onClick={() => setIsSpecificRoleDropdownOpen(!isSpecificRoleDropdownOpen)}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span className="mr-2">{currentSpecificRoleDisplay}</span>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isSpecificRoleDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <div className="px-3 py-2 text-xs font-bold text-gray-500">Available Roles</div>
                      {userTypeContext.availableSpecificRoles.map(role => (
                        <button
                          key={role}
                          onClick={() => handleSpecificRoleChange(role)}
                          className={`w-full text-left px-4 py-2 text-sm ${userTypeContext.specificRole === role ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
                          role="menuitem"
                        >
                          {roleDisplayNames[role] || role}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User profile icon */}
            <div className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500">
              <span className="sr-only">View profile</span>
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar; 