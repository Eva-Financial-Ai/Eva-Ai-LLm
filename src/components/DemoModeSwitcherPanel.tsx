import React from 'react';

interface DemoModeSwitcherPanelProps {
  onUserTypeChange: (userType: string) => void;
  currentUserType: string;
}

const DemoModeSwitcherPanel: React.FC<DemoModeSwitcherPanelProps> = ({
  onUserTypeChange,
  currentUserType,
}) => {
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

        <div className="md:ml-auto space-y-2 md:space-y-0 flex flex-col md:flex-row md:space-x-3">
          <button
            onClick={() => onUserTypeChange('borrower')}
            className={`px-3 py-2 rounded-md text-sm ${
              currentUserType === 'borrower'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white border border-blue-300 text-blue-600 hover:bg-blue-50'
            }`}
          >
            Business (Borrower)
          </button>
          <button
            onClick={() => onUserTypeChange('vendor')}
            className={`px-3 py-2 rounded-md text-sm ${
              currentUserType === 'vendor'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white border border-blue-300 text-blue-600 hover:bg-blue-50'
            }`}
          >
            Vendor (Asset Seller)
          </button>
          <button
            onClick={() => onUserTypeChange('broker')}
            className={`px-3 py-2 rounded-md text-sm ${
              currentUserType === 'broker'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white border border-blue-300 text-blue-600 hover:bg-blue-50'
            }`}
          >
            Broker/Originator
          </button>
          <button
            onClick={() => onUserTypeChange('lender')}
            className={`px-3 py-2 rounded-md text-sm ${
              currentUserType === 'lender'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-white border border-blue-300 text-blue-600 hover:bg-blue-50'
            }`}
          >
            Lender/Lessor
          </button>
        </div>
      </div>
      <p className="text-xs text-blue-600 mt-2">
        Each user type represents a different stakeholder in the credit origination process.
        Switch between them to see customized dashboards and workflows.
      </p>
    </div>
  );
};

export default DemoModeSwitcherPanel;
