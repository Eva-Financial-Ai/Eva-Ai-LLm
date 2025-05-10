import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

type UserTypeOption = 'borrower' | 'broker' | 'lender' | 'vendor';

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  path: string;
  userTypes: UserTypeOption[]; // Which user types can see this template
}

const FormsList: React.FC = () => {
  // State to track the current selected user type
  const [selectedUserType, setSelectedUserType] = useState<UserTypeOption>('borrower');

  // Use the same templates defined in Sidebar.tsx, but with userTypes property
  const safeFormsTemplates: FormTemplate[] = [
    {
      id: 'credit-application',
      name: 'Credit Application',
      description: 'Standard credit application form',
      path: '/forms/credit-application',
      userTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'additional-owner-individual',
      name: 'Additional Owner (Individual)',
      description: 'Form for additional individual owners',
      path: '/forms/additional-owner-individual',
      userTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'additional-owner-business',
      name: 'Additional Owner (Business)',
      description: 'Form for business entity owners',
      path: '/forms/additional-owner-business',
      userTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'additional-owner-trust',
      name: 'Additional Owner (Trust)',
      description: 'Form for trust entity owners',
      path: '/forms/additional-owner-trust',
      userTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'business-debt-schedule',
      name: 'Business Debt Schedule',
      description: 'Table template for business debt',
      path: '/forms/business-debt-schedule',
      userTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'personal-finance-statement',
      name: 'Personal Finance Statement',
      description: 'SBA Form 413 compliant template',
      path: '/forms/personal-finance-statement',
      userTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'asset-ledger',
      name: 'Asset Ledger',
      description: 'Asset details verification table',
      path: '/forms/asset-ledger',
      userTypes: ['borrower', 'broker', 'lender', 'vendor'],
    },
    {
      id: 'vendor-verification',
      name: 'Vendor Payment & KYB',
      description: 'Vendor verification and KYB',
      path: '/forms/vendor-verification',
      userTypes: ['vendor', 'lender'],
    },
    {
      id: 'broker-kyb',
      name: 'Broker KYB & Payment',
      description: 'Broker verification and payment',
      path: '/forms/broker-kyb',
      userTypes: ['broker', 'lender'],
    },
    {
      id: 'lender-payment',
      name: 'Lender Payment Instructions',
      description: 'Funding recipient instructions',
      path: '/forms/lender-payment',
      userTypes: ['lender'],
    },
    {
      id: 'broker-commission',
      name: 'Broker Commission Split',
      description: 'Broker commission agreement',
      path: '/forms/broker-commission',
      userTypes: ['broker', 'lender'],
    },
    {
      id: 'lender-commission',
      name: 'Lender Commission Split',
      description: 'Lender commission agreement',
      path: '/forms/lender-commission',
      userTypes: ['lender'],
    },
    {
      id: 'state-disclosure',
      name: 'NY/CA Lender Disclosure',
      description: 'State-specific disclosure forms',
      path: '/forms/state-disclosure',
      userTypes: ['lender'],
    },
    {
      id: 'equipment-listing',
      name: 'Equipment Listing Form',
      description: 'List equipment for sale or lease',
      path: '/forms/equipment-listing',
      userTypes: ['vendor'],
    },
    {
      id: 'manufacturer-warranty',
      name: 'Manufacturer Warranty Form',
      description: 'Equipment warranty documentation',
      path: '/forms/manufacturer-warranty',
      userTypes: ['vendor'],
    },
    {
      id: 'repossession-form',
      name: 'Asset Repossession Form',
      description: 'Document repossessed asset details',
      path: '/forms/repossession-form',
      userTypes: ['lender'],
    },
  ];

  // Filter templates based on selected user type
  const filteredTemplates = safeFormsTemplates.filter(template =>
    template.userTypes.includes(selectedUserType)
  );

  // User type options for the toggle
  const userTypeOptions: { label: string; value: UserTypeOption }[] = [
    { label: 'Borrower', value: 'borrower' },
    { label: 'Broker', value: 'broker' },
    { label: 'Lender', value: 'lender' },
    { label: 'Vendor', value: 'vendor' },
  ];

  // Handle user type change
  const handleUserTypeChange = (type: UserTypeOption) => {
    setSelectedUserType(type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Safe Forms Templates</h1>
          <p className="text-xl text-gray-600 mt-1">Select a form template to get started</p>
        </div>
        <div>
          <Link
            to="/"
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded text-lg font-medium hover:bg-gray-200"
          >
            Dashboard
          </Link>
        </div>
      </div>

      {/* User Type Toggle */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="mb-2 text-lg font-medium text-gray-700">View templates as:</div>
        <div className="flex flex-wrap gap-2">
          {userTypeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleUserTypeChange(option.value)}
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                selectedUserType === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing templates available for{' '}
          <span className="font-semibold">
            {userTypeOptions.find(opt => opt.value === selectedUserType)?.label}
          </span>{' '}
          users
        </div>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-lg text-gray-600">No templates available for this user type.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map(template => (
          <Link
            key={template.id}
            to={template.path}
            className="block p-5 bg-white rounded-lg border-2 border-gray-200 shadow-lg hover:bg-gray-50 hover:border-primary-400 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <DocumentDuplicateIcon className="h-10 w-10 text-primary-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h2>
                <p className="text-lg text-gray-600">{template.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FormsList;
