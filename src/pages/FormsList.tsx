import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  path: string;
}

const FormsList: React.FC = () => {
  // Use the same templates defined in Sidebar.tsx
  const safeFormsTemplates: FormTemplate[] = [
    {
      id: 'credit-application',
      name: 'Credit Application',
      description: 'Standard credit application form',
      path: '/forms/credit-application',
    },
    {
      id: 'additional-owner-individual',
      name: 'Additional Owner (Individual)',
      description: 'Form for additional individual owners',
      path: '/forms/additional-owner-individual',
    },
    {
      id: 'additional-owner-business',
      name: 'Additional Owner (Business)',
      description: 'Form for business entity owners',
      path: '/forms/additional-owner-business',
    },
    {
      id: 'additional-owner-trust',
      name: 'Additional Owner (Trust)',
      description: 'Form for trust entity owners',
      path: '/forms/additional-owner-trust',
    },
    {
      id: 'business-debt-schedule',
      name: 'Business Debt Schedule',
      description: 'Table template for business debt',
      path: '/forms/business-debt-schedule',
    },
    {
      id: 'personal-finance-statement',
      name: 'Personal Finance Statement',
      description: 'SBA Form 413 compliant template',
      path: '/forms/personal-finance-statement',
    },
    {
      id: 'asset-ledger',
      name: 'Asset Ledger',
      description: 'Asset details verification table',
      path: '/forms/asset-ledger',
    },
    {
      id: 'vendor-verification',
      name: 'Vendor Payment & KYB',
      description: 'Vendor verification and KYB',
      path: '/forms/vendor-verification',
    },
    {
      id: 'broker-kyb',
      name: 'Broker KYB & Payment',
      description: 'Broker verification and payment',
      path: '/forms/broker-kyb',
    },
    {
      id: 'lender-payment',
      name: 'Lender Payment Instructions',
      description: 'Funding recipient instructions',
      path: '/forms/lender-payment',
    },
    {
      id: 'broker-commission',
      name: 'Broker Commission Split',
      description: 'Broker commission agreement',
      path: '/forms/broker-commission',
    },
    {
      id: 'lender-commission',
      name: 'Lender Commission Split',
      description: 'Lender commission agreement',
      path: '/forms/lender-commission',
    },
    {
      id: 'state-disclosure',
      name: 'NY/CA Lender Disclosure',
      description: 'State-specific disclosure forms',
      path: '/forms/state-disclosure',
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeFormsTemplates.map(template => (
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
