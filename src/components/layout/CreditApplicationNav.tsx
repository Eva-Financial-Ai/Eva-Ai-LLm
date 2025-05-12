import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  BuildingOffice2Icon,
  BuildingLibraryIcon,
  TableCellsIcon,
  CalculatorIcon,
  CircleStackIcon,
  CreditCardIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { UserContext } from '../../contexts/UserContext';
import { useUserType } from '../../contexts/UserTypeContext';
import { UserType } from '../../types/UserTypes';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  const baseClasses = `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
    isActive
      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600 pl-3'
      : 'text-gray-700 hover:bg-gray-100'
  }`;

  return (
    <Link to={to} className={baseClasses}>
      <span className="mr-3 text-gray-500">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

interface SubNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SubNavItem: React.FC<SubNavItemProps> = ({ to, icon, label, isActive }) => {
  const baseClasses = `flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
    isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700 hover:bg-gray-50'
  }`;

  return (
    <Link to={to} className={baseClasses}>
      <span className="mr-3 text-gray-500">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

interface CreditApplicationNavProps {
  activeSection?: string;
}

const CreditApplicationNav: React.FC<CreditApplicationNavProps> = ({
  activeSection = 'credit-application',
}) => {
  const location = useLocation();
  const userContext = useContext(UserContext);
  const userRole = userContext?.userRole || 'borrower'; // Provide fallback value
  const { userType } = useUserType();
  const [effectiveRole, setEffectiveRole] = useState(userRole);

  // Sync the role with the userType when it changes
  useEffect(() => {
    if (userType) {
      // Map UserType to corresponding role string
      switch (userType) {
        case UserType.BUSINESS:
          setEffectiveRole('borrower');
          break;
        case UserType.VENDOR:
          setEffectiveRole('vendor');
          break;
        case UserType.BROKERAGE:
          setEffectiveRole('broker');
          break;
        case UserType.LENDER:
          setEffectiveRole('lender');
          break;
        default:
          setEffectiveRole(userRole); // Fall back to UserContext's role
      }
    }
  }, [userType, userRole]);

  // Main navigation items - Define all possible items
  const allNavItems = [
    {
      id: 'credit-application',
      label: 'Credit Application',
      path: '/credit-application',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      roles: ['borrower', 'lender', 'vendor', 'broker', 'admin'], // Everyone can see this
    },
    {
      id: 'additional-owner-individual',
      label: 'Additional Owner (Individual)',
      path: '/credit-application/owner/individual',
      icon: <UserGroupIcon className="h-5 w-5" />,
      roles: ['admin', 'lender'],
    },
    {
      id: 'additional-owner-business',
      label: 'Additional Owner (Business)',
      path: '/credit-application/owner/business',
      icon: <BuildingOffice2Icon className="h-5 w-5" />,
      roles: ['admin', 'lender'],
    },
    {
      id: 'additional-owner-trust',
      label: 'Additional Owner (Trust)',
      path: '/credit-application/owner/trust',
      icon: <BuildingLibraryIcon className="h-5 w-5" />,
      roles: ['admin', 'lender'],
    },
    {
      id: 'business-debt-schedule',
      label: 'Business Debt Schedule',
      path: '/credit-application/debt-schedule',
      icon: <TableCellsIcon className="h-5 w-5" />,
      roles: ['admin', 'lender', 'borrower'],
    },
    {
      id: 'personal-finance-statement',
      label: 'Personal Finance Statement',
      path: '/credit-application/finance-statement',
      icon: <CalculatorIcon className="h-5 w-5" />,
      roles: ['admin', 'lender', 'borrower'],
    },
    {
      id: 'lender-payment-instructions',
      label: 'Lender Payment Instructions',
      path: '/credit-application/lender-payment',
      icon: <CreditCardIcon className="h-5 w-5" />,
      roles: ['admin', 'lender'],
    },
    {
      id: 'ny-ca-lender-disclosure',
      label: 'NY/CA Lender Disclosure',
      path: '/credit-application/state-disclosure',
      icon: <DocumentTextIcon className="h-5 w-5" />,
      roles: ['admin', 'lender', 'borrower'],
    },
  ];

  // Filter the nav items based on user role
  const navItems = allNavItems.filter(item => item.roles.includes(effectiveRole));

  // For borrowers, only show the main credit application if they're in the initial application process
  const showSimplifiedNav =
    effectiveRole === 'borrower' && location.pathname === '/credit-application';

  // Current active path
  const currentPath = location.pathname;

  // Find active item
  const activeItem = navItems.find(
    item =>
      currentPath === item.path ||
      (item.id === 'credit-application' && currentPath.startsWith('/credit-application'))
  ) ||
    navItems[0] || {
      id: 'credit-application',
      label: 'Credit Application',
      path: '/credit-application',
      icon: <DocumentTextIcon className="h-5 w-5" />,
    };

  // For borrowers, simplify the view to just the credit application form
  if (showSimplifiedNav) {
    return (
      <div className="w-full bg-white rounded-lg shadow">
        <div className="border-l-4 border-primary-600 bg-primary-50">
          <NavItem
            to="/credit-application"
            icon={<DocumentTextIcon className="h-5 w-5" />}
            label="Credit Application"
            isActive={true}
          />
        </div>

        {/* Show information panel instead of other nav items */}
        <div className="p-4 mt-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800 text-sm mb-2">Application Information</h3>
          <p className="text-xs text-blue-700 mb-2">
            Please complete your application information. Once submitted, you'll be able to:
          </p>
          <ul className="text-xs text-blue-600 space-y-1 ml-4 list-disc">
            <li>Track your application status</li>
            <li>Upload supporting documents</li>
            <li>Communicate with your lender</li>
            <li>Review offers when approved</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow">
      {/* Main item */}
      <div className="border-l-4 border-primary-600 bg-primary-50">
        <NavItem
          to={activeItem.path}
          icon={activeItem.icon}
          label={activeItem.label}
          isActive={true}
        />
      </div>

      {/* Sub items */}
      <div className="mt-1">
        {navItems
          .filter(item => item.id !== activeItem.id)
          .map(item => (
            <SubNavItem
              key={item.id}
              to={item.path}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.path}
            />
          ))}
      </div>
    </div>
  );
};

export default CreditApplicationNav;
