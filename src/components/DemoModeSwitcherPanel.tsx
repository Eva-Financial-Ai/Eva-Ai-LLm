import React, { useState } from 'react';
import ViewSwitcher from './common/ViewSwitcher';

interface DemoModeSwitcherPanelProps {
  onUserTypeChange: (userType: string) => void;
  currentUserType: string;
}

const DemoModeSwitcherPanel: React.FC<DemoModeSwitcherPanelProps> = ({
  onUserTypeChange,
  currentUserType,
}) => {
  const userTypeOptions = [
    { id: 'borrower', label: 'Business (Borrower)', value: 'borrower' },
    { id: 'vendor', label: 'Vendor (Asset Seller)', value: 'vendor' },
    { id: 'broker', label: 'Broker/Originator', value: 'broker' },
    { id: 'lender', label: 'Lender/Lessor', value: 'lender' },
    { id: 'investor', label: 'Investor (Coming Soon)', value: 'investor', disabled: true },
    {
      id: 'commercial-bank',
      label: 'Commercial Bank (Coming Soon)',
      value: 'commercial-bank',
      disabled: true,
    },
    {
      id: 'investment-bank',
      label: 'Investment Bank (Coming Soon)',
      value: 'investment-bank',
      disabled: true,
    },
    {
      id: 'insurance',
      label: 'Insurance Provider (Coming Soon)',
      value: 'insurance',
      disabled: true,
    },
  ];

  const handleUserTypeChange = (value: string) => {
    onUserTypeChange(value);
  };

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex items-center mb-3 md:mb-0 md:mr-6">
          <svg
            className="h-5 w-5 text-blue-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-sm font-medium text-blue-700">Demo Mode: Switch User Type</span>
        </div>

        <div className="w-full md:w-64">
          <ViewSwitcher
            options={userTypeOptions}
            selectedOption={currentUserType}
            onChange={handleUserTypeChange}
            label=""
            className="w-full"
          />
        </div>
      </div>

      <p className="text-xs text-blue-600 mt-2">
        Each user type represents a different stakeholder in the credit origination process. Switch
        between them to see customized dashboards and workflows.
      </p>
    </div>
  );
};

export default DemoModeSwitcherPanel;
