import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

// Icons for the sidebar menu items
const icons = {
  creditApplication: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  additionalOwnerIndividual: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  additionalOwnerBusiness: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  additionalOwnerTrust: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2"
      />
    </svg>
  ),
  businessDebtSchedule: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  personalFinanceStatement: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
      />
    </svg>
  ),
  assetLedger: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  ),
  vendorPaymentKYB: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  ),
  brokerKYBPayment: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  lenderPaymentInstructions: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  ),
  brokerCommissionSplit: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  ),
  lenderCommissionSplit: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  ),
  nycaLenderDisclosure: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  bankStatementVerification: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
      />
    </svg>
  ),
  plaidBankConnection: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  ),
};

interface CreditApplicationSidebarProps {
  applicationId?: string;
}

const CreditApplicationSidebar: React.FC<CreditApplicationSidebarProps> = ({ applicationId }) => {
  const location = useLocation();
  const { userRole } = useContext(UserContext);

  // Only lenders and brokers can see and access the additional forms
  const isLenderOrBroker = userRole === 'lender' || userRole === 'broker';

  const basePath = '/credit-application';
  const basePathWithId = applicationId ? `/credit-application/${applicationId}` : basePath;

  // Define menu items with permissions
  const menuItems = [
    {
      id: 'credit-application',
      name: 'Credit Application',
      path: basePathWithId,
      icon: icons.creditApplication,
      visibleTo: ['borrower', 'lender', 'broker', 'vendor', 'admin'],
    },
    {
      id: 'additional-owner-individual',
      name: 'Additional Owner (Individual)',
      path: `${basePathWithId}/additional-owner-individual`,
      icon: icons.additionalOwnerIndividual,
      visibleTo: ['lender', 'broker', 'admin'],
    },
    {
      id: 'additional-owner-business',
      name: 'Additional Owner (Business)',
      path: `${basePathWithId}/additional-owner-business`,
      icon: icons.additionalOwnerBusiness,
      visibleTo: ['lender', 'broker', 'admin'],
    },
    {
      id: 'additional-owner-trust',
      name: 'Additional Owner (Trust)',
      path: `${basePathWithId}/additional-owner-trust`,
      icon: icons.additionalOwnerTrust,
      visibleTo: ['lender', 'broker', 'admin'],
    },
    {
      id: 'business-debt-schedule',
      name: 'Business Debt Schedule',
      path: `${basePathWithId}/business-debt-schedule`,
      icon: icons.businessDebtSchedule,
      visibleTo: ['lender', 'broker', 'admin'],
    },
    {
      id: 'personal-finance-statement',
      name: 'Personal Finance Statement',
      path: `${basePathWithId}/personal-finance-statement`,
      icon: icons.personalFinanceStatement,
      visibleTo: ['lender', 'broker', 'admin'],
    },
    {
      id: 'lender-payment-instructions',
      name: 'Lender Payment Instructions',
      path: `${basePathWithId}/lender-payment-instructions`,
      icon: icons.lenderPaymentInstructions,
      visibleTo: ['lender', 'admin'],
    },
    {
      id: 'nyca-lender-disclosure',
      name: 'NY/CA Lender Disclosure',
      path: `${basePathWithId}/nyca-lender-disclosure`,
      icon: icons.nycaLenderDisclosure,
      visibleTo: ['lender', 'admin'],
    },
    {
      id: 'bank-statement-verification',
      name: 'Bank Statement Verification',
      path: `${basePathWithId}/bank-statement-verification`,
      icon: icons.bankStatementVerification,
      visibleTo: ['lender', 'broker', 'admin'],
    },
    {
      id: 'plaid-bank-connection',
      name: 'Plaid Bank Connection',
      path: `${basePathWithId}/plaid-bank-connection`,
      icon: icons.plaidBankConnection,
      visibleTo: ['lender', 'broker', 'admin'],
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="py-4 px-4 bg-gray-50">
          <h3 className="text-base font-medium text-gray-900">Application Forms</h3>
          <p className="mt-1 text-xs text-gray-500">
            {isLenderOrBroker
              ? 'Manage forms and request information'
              : 'Complete required application forms'}
          </p>
        </div>
      </div>

      <nav className="py-2">
        <ul className="space-y-1">
          {menuItems
            .filter(item => item.visibleTo.includes(userRole || 'borrower'))
            .map(item => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 font-medium border-l-4 border-primary-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>

      {/* Information Panel for Broker/Lender */}
      {isLenderOrBroker && (
        <div className="border-t border-gray-200 mt-4 py-4 px-4 bg-blue-50">
          <h4 className="text-sm font-medium text-blue-800">Actions</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="flex items-center text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Request Plaid connection
            </li>
            <li className="flex items-center text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Verify bank statements
            </li>
            <li className="flex items-center text-blue-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Check UCC filings
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CreditApplicationSidebar;
