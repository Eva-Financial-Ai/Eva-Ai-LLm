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
      component: <CreditApplicationForm />
    },
    {
      id: 'additional-owner-individual',
      name: 'Additional Owner (Individual)',
      description: 'Form for additional individual owners to provide personal information',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Additional Owner (Individual) Form</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'additional-owner-business',
      name: 'Additional Owner (Business)',
      description: 'Form for business entity owners to provide company information',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Additional Owner (Business) Form</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'additional-owner-trust',
      name: 'Additional Owner (Trust)',
      description: 'Form for trust entity owners to provide trust information',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Additional Owner (Trust) Form</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'business-debt-schedule',
      name: 'Business Debt Schedule',
      description: 'Table template for business debt tracking',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Business Debt Schedule</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'personal-finance-statement',
      name: 'Personal Finance Statement',
      description: 'SBA Form 413 compliant financial statement',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Personal Finance Statement</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'asset-ledger',
      name: 'Asset Ledger',
      description: 'Form for listing and verifying asset ownership',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Asset Ledger</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'vendor-verification',
      name: 'Vendor Payment & KYB',
      description: 'Vendor verification and payment details form',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Vendor Payment & KYB Form</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'broker-kyb',
      name: 'Broker KYB & Payment',
      description: 'Broker verification and payment details form',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Broker KYB & Payment Form</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'lender-payment',
      name: 'Lender Payment Instructions',
      description: 'Lender funding instructions form',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Lender Payment Instructions</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'broker-commission',
      name: 'Broker Commission Split',
      description: 'Broker commission agreement form',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Broker Commission Split Agreement</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'lender-commission',
      name: 'Lender Commission Split',
      description: 'Lender commission agreement form',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Lender Commission Split Agreement</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    },
    {
      id: 'state-disclosure',
      name: 'NY/CA Lender Disclosure',
      description: 'State-specific lender disclosure forms',
      component: <div className="p-6 bg-white rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">NY/CA Lender Disclosure Forms</h2>
                  <p className="text-gray-500 mb-6">This template will be implemented in a future update.</p>
                </div>
    }
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Template Not Found</h2>
          <p className="text-red-600 mb-4">The form template "{templateId}" could not be found.</p>
          <Link to="/forms/credit-application" className="inline-block px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
            Go to Credit Application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{template.name}</h1>
          <p className="text-gray-600">{template.description}</p>
        </div>
        <div className="flex space-x-2">
          <Link to="/" className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            Dashboard
          </Link>
          <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200">
            Save as Template
          </button>
        </div>
      </div>
      
      {/* Render the selected template component */}
      {template.component}
    </div>
  );
};

export default FormTemplate; 