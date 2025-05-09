import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CreditApplicationForm from '../components/CreditApplicationForm';

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
}

const FormTemplate: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<TemplateInfo | null>(null);

  // Define all the templates and their associated components
  const templates: TemplateInfo[] = [
    {
      id: 'credit-application',
      name: 'Credit Application',
      description: 'Standard credit application form for new loan requests',
      component: <CreditApplicationForm />,
    },
    {
      id: 'additional-owner-individual',
      name: 'Additional Owner (Individual)',
      description: 'Form for additional individual owners to provide personal information',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Additional Owner (Individual) Form</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'additional-owner-business',
      name: 'Additional Owner (Business)',
      description: 'Form for business entity owners to provide company information',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Additional Owner (Business) Form</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'additional-owner-trust',
      name: 'Additional Owner (Trust)',
      description: 'Form for trust entity owners to provide trust information',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Additional Owner (Trust) Form</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'business-debt-schedule',
      name: 'Business Debt Schedule',
      description: 'Table template for business debt tracking',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Business Debt Schedule</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'personal-finance-statement',
      name: 'Personal Finance Statement',
      description: 'SBA Form 413 compliant financial statement',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Personal Finance Statement</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'asset-ledger',
      name: 'Asset Ledger',
      description: 'Form for listing and verifying asset ownership',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Asset Ledger</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'vendor-verification',
      name: 'Vendor Payment & KYB',
      description: 'Vendor verification and payment details form',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Vendor Payment & KYB Form</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'broker-kyb',
      name: 'Broker KYB & Payment',
      description: 'Broker verification and payment details form',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Broker KYB & Payment Form</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'lender-payment',
      name: 'Lender Payment Instructions',
      description: 'Lender funding instructions form',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Lender Payment Instructions</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'broker-commission',
      name: 'Broker Commission Split',
      description: 'Broker commission agreement form',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Broker Commission Split Agreement</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'lender-commission',
      name: 'Lender Commission Split',
      description: 'Lender commission agreement form',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Lender Commission Split Agreement</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
    {
      id: 'state-disclosure',
      name: 'NY/CA Lender Disclosure',
      description: 'State-specific lender disclosure forms',
      component: (
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">NY/CA Lender Disclosure Forms</h2>
          <p className="text-lg text-gray-600 mb-6">
            This template will be implemented in a future update.
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Find the template that matches the templateId
    const foundTemplate = templates.find(t => t.id === templateId);

    if (foundTemplate) {
      setTemplate(foundTemplate);
    }

    setLoading(false);
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
          <span className="text-xl font-medium text-gray-700">Loading template...</span>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-8 rounded-lg border-2 border-red-200 text-center shadow-md">
          <h2 className="text-2xl font-bold text-red-700 mb-3">Template Not Found</h2>
          <p className="text-xl text-red-600 mb-6">
            The form template "{templateId}" could not be found.
          </p>
          <Link
            to="/forms"
            className="inline-block px-6 py-3 bg-primary-600 text-white text-lg font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            Return to Forms List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{template.name}</h1>
          <p className="text-xl text-gray-600 mt-1">{template.description}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/forms"
            className="px-5 py-3 bg-gray-100 text-gray-700 rounded text-lg font-medium hover:bg-gray-200"
          >
            Back to Forms
          </Link>
          <button className="px-5 py-3 bg-primary-100 text-primary-700 rounded text-lg font-medium hover:bg-primary-200">
            Save as Template
          </button>
        </div>
      </div>

      {/* Render the selected template component */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {template.component}
      </div>
    </div>
  );
};

export default FormTemplate;
