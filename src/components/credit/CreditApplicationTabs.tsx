import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import TaxReturnsUpload from '../tax/TaxReturnsUpload';
// These components will be created later
// import PlaidIntegration from './PlaidIntegration';
// import CollateralFiles from './CollateralFiles';
// import BusinessLegalDocuments from './BusinessLegalDocuments';

type UserType = 'lender' | 'broker' | 'vendor' | 'borrower';

interface CreditApplicationTabsProps {
  applicationId: string;
  applicationType: string;
}

const CreditApplicationTabs: React.FC<CreditApplicationTabsProps> = ({
  applicationId,
  applicationType,
}) => {
  const { userRole } = useContext(UserContext) as { userRole: UserType };
  const [activeTab, setActiveTab] = useState('application');

  // Define tabs based on user type
  const getTabs = () => {
    const commonTabs = [
      { id: 'application', label: 'Application Details' },
      { id: 'tax-files', label: 'Tax Files' },
      { id: 'collateral', label: 'Collateral Files' },
      { id: 'legal', label: 'Business Legal Documents' },
    ];

    // User type specific tabs
    switch (userRole) {
      case 'lender':
        return [
          ...commonTabs,
          { id: 'underwriting', label: 'Underwriting' },
          { id: 'risk', label: 'Risk Analysis' },
          { id: 'decision', label: 'Decision & Funding' },
        ];
      case 'broker':
        return [
          ...commonTabs,
          { id: 'commission', label: 'Commission' },
          { id: 'status', label: 'Application Status' },
        ];
      case 'vendor':
        return [
          ...commonTabs,
          { id: 'equipment', label: 'Equipment Details' },
          { id: 'invoices', label: 'Invoices' },
        ];
      case 'borrower':
      default:
        return commonTabs;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'application':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Application Details</h3>
            <p className="text-gray-600 mb-2">Application ID: {applicationId}</p>
            <p className="text-gray-600 mb-2">Application Type: {applicationType}</p>
            {/* Application details would be rendered here */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="text-sm text-yellow-700">
                This section displays the main application details and status.
              </p>
            </div>
          </div>
        );
      case 'tax-files':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Files</h3>
            {/* Use TaxReturnsUpload component */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-sm text-blue-700">
                Upload and manage business and personal tax returns.
              </p>
            </div>
            {/* TaxReturnsUpload component would be properly instantiated here */}
          </div>
        );
      case 'collateral':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Collateral Files</h3>
            {/* CollateralFiles component */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-sm text-blue-700">
                Upload and manage collateral documentation for secured loans.
              </p>
            </div>
            {/* CollateralFiles component would be properly instantiated here */}
          </div>
        );
      case 'legal':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Business Legal Documents</h3>
            {/* BusinessLegalDocuments component */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-sm text-blue-700">
                Upload and manage business formation documents, operating agreements, and other
                legal documents.
              </p>
            </div>
            {/* BusinessLegalDocuments component would be properly instantiated here */}
          </div>
        );
      case 'underwriting':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Underwriting</h3>
            {/* Lender-specific underwriting content */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="text-sm text-green-700">
                Lender-specific view for underwriting evaluation and documentation.
              </p>
            </div>
          </div>
        );
      case 'risk':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Analysis</h3>
            {/* Lender-specific risk analysis content */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="text-sm text-green-700">
                Lender-specific view for risk assessment and analysis.
              </p>
            </div>
          </div>
        );
      case 'commission':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Commission</h3>
            {/* Broker-specific commission content */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="text-sm text-green-700">
                Broker-specific view for tracking commissions on applications.
              </p>
            </div>
          </div>
        );
      case 'equipment':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Details</h3>
            {/* Vendor-specific equipment details content */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <p className="text-sm text-green-700">
                Vendor-specific view for equipment specifications and details.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Content not available</h3>
            <p className="text-gray-600">The selected tab content is not available.</p>
          </div>
        );
    }
  };

  const tabs = getTabs();

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="min-h-[400px]">{renderTabContent()}</div>
    </div>
  );
};

export default CreditApplicationTabs;
