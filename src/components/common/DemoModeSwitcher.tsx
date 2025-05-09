import React, { useState } from 'react';
import ViewSwitcher from './ViewSwitcher';

export interface UserType {
  id: string;
  label: string;
  value: string;
  description?: string;
}

interface DemoModeSwitcherProps {
  onUserTypeChange?: (userType: string) => void;
  initialUserType?: string;
  className?: string;
}

const DemoModeSwitcher: React.FC<DemoModeSwitcherProps> = ({
  onUserTypeChange,
  initialUserType = 'borrower',
  className = '',
}) => {
  const [currentUserType, setCurrentUserType] = useState(initialUserType);

  const userTypeOptions: UserType[] = [
    {
      id: 'borrower',
      label: 'Business (Borrower)',
      value: 'borrower',
      description: 'View as a business seeking funding',
    },
    {
      id: 'vendor',
      label: 'Vendor (Asset Seller)',
      value: 'vendor',
      description: 'View as an asset seller',
    },
    {
      id: 'broker',
      label: 'Broker/Originator',
      value: 'broker',
      description: 'View as a broker or originator',
    },
    {
      id: 'lender',
      label: 'Lender/Lessor',
      value: 'lender',
      description: 'View as a lender or lessor',
    },
  ];

  const handleUserTypeChange = (userType: string) => {
    setCurrentUserType(userType);
    if (onUserTypeChange) {
      onUserTypeChange(userType);
    }
  };

  return (
    <div className={className}>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h3 className="text-lg font-medium text-red-600">Demo Mode: Switch User Type</h3>
        </div>

        <div className="w-full">
          <ViewSwitcher
            options={userTypeOptions}
            selectedOption={currentUserType}
            onChange={handleUserTypeChange}
            label="Select User Type"
          />
        </div>

        <p className="mt-4 text-sm text-gray-500">Click a user type to switch the dashboard view</p>
      </div>
    </div>
  );
};

export default DemoModeSwitcher;
