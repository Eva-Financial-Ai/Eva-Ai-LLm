import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formTemplates, FormTemplate } from './SafeForms/FormTemplates';

// Add interface for business and owner data
interface BusinessProfile {
  id: string;
  name: string;
  taxId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  industry: string;
  annualRevenue: number;
  timeInBusiness: number;
  description: string;
}

interface OwnerProfile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  ownership: number;
  ssn: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface SafeFormsProps {
  userType: string;
  requestMode?: boolean;
  onApplicationFormSelected?: (formName: string) => void;
}

interface FormOption {
  id: string;
  name: string;
  description: string;
  forUserTypes: string[];
}

const SafeForms: React.FC<SafeFormsProps> = ({
  userType,
  requestMode = false,
  onApplicationFormSelected,
}) => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([]);
  const [ownerProfiles, setOwnerProfiles] = useState<OwnerProfile[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const navigate = useNavigate();

  // Available form options - in a real app, this would come from an API
  const availableForms: FormOption[] = [
    {
      id: 'equipment_finance',
      name: 'Equipment Finance Application',
      description: 'Standard application for equipment financing',
      forUserTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'working_capital',
      name: 'Working Capital Application',
      description: 'Application for short-term working capital',
      forUserTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'commercial_real_estate',
      name: 'Commercial Real Estate Application',
      description: 'Commercial real estate loan application',
      forUserTypes: ['borrower', 'broker', 'lender'],
    },
    {
      id: 'general_credit',
      name: 'General Credit Application',
      description: 'General credit application for all purposes',
      forUserTypes: ['borrower', 'broker', 'lender', 'admin'],
    },
  ];

  // Mock data for business profiles - in a real app, this would come from an API
  useEffect(() => {
    // Simulated API call to get business profiles
    const fetchBusinessProfiles = async () => {
      // This would be an API call in a real application
      const mockProfiles: BusinessProfile[] = [
        {
          id: 'business-1',
          name: 'Acme Corporation',
          taxId: '12-3456789',
          address: '123 Main St',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10001',
          industry: 'manufacturing',
          annualRevenue: 5000000,
          timeInBusiness: 12.5,
          description: 'Manufacturing company specializing in industrial equipment.',
        },
        {
          id: 'business-2',
          name: 'TechStart Solutions',
          taxId: '98-7654321',
          address: '456 Innovation Dr',
          city: 'Silicon Valley',
          state: 'CA',
          zipCode: '94025',
          industry: 'technology',
          annualRevenue: 2500000,
          timeInBusiness: 3.5,
          description: 'Tech startup focused on AI solutions for small businesses.',
        },
      ];

      setBusinessProfiles(mockProfiles);
    };

    // Simulated API call to get owner profiles
    const fetchOwnerProfiles = async () => {
      // This would be an API call in a real application
      const mockProfiles: OwnerProfile[] = [
        {
          id: 'owner-1',
          firstName: 'John',
          lastName: 'Smith',
          title: 'CEO',
          ownership: 60,
          ssn: '123-45-6789',
          email: 'john@acmecorp.com',
          phone: '(555) 123-4567',
          address: '789 Residential Ave',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10002',
        },
        {
          id: 'owner-2',
          firstName: 'Jane',
          lastName: 'Doe',
          title: 'CTO',
          ownership: 40,
          ssn: '987-65-4321',
          email: 'jane@techstart.com',
          phone: '(555) 987-6543',
          address: '321 Tech Blvd',
          city: 'Silicon Valley',
          state: 'CA',
          zipCode: '94025',
        },
      ];

      setOwnerProfiles(mockProfiles);
    };

    fetchBusinessProfiles();
    fetchOwnerProfiles();

    // Set default form to General Credit Application
    const defaultForm = 'general_credit';
    setSelectedForm(defaultForm);

    // If there's a callback, call it with the form name
    const defaultFormName = availableForms.find(form => form.id === defaultForm)?.name;
    if (onApplicationFormSelected && defaultFormName) {
      onApplicationFormSelected(defaultFormName);
    }
  }, [onApplicationFormSelected]);

  // Pre-fill form data when a business is selected
  useEffect(() => {
    if (selectedBusinessId) {
      const selectedBusiness = businessProfiles.find(bp => bp.id === selectedBusinessId);
      if (selectedBusiness) {
        // Pre-fill the form data with business information
        setFormData({
          businessName: selectedBusiness.name,
          taxId: selectedBusiness.taxId,
          businessAddress: selectedBusiness.address,
          businessCity: selectedBusiness.city,
          businessState: selectedBusiness.state,
          businessZip: selectedBusiness.zipCode,
          industryType: selectedBusiness.industry,
          annualRevenue: selectedBusiness.annualRevenue.toString(),
          timeInBusiness: selectedBusiness.timeInBusiness.toString(),
          businessDescription: selectedBusiness.description,
        });
      }
    }
  }, [selectedBusinessId, businessProfiles]);

  // Filter forms based on user type
  const filteredForms = availableForms.filter(form => form.forUserTypes.includes(userType));

  // Handle form selection
  const handleFormSelect = (formId: string) => {
    setSelectedForm(formId);
    setShowTemplates(true);
    
    // Reset form data when switching forms
    setFormData({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle business profile selection
  const handleBusinessSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBusinessId(e.target.value);
  };

  // For demo purposes only - handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);

    // Associate with Filelock drive and database here
    // This would be an API call in a real application

    // Show success message instead of redirecting
    alert('Form submitted successfully and associated with business profile!');
  };

  // Handle loading a template
  const handleLoadTemplate = (templateId: string) => {
    // Find the template across all form type arrays
    let foundTemplate: FormTemplate | undefined;
    
    // Get all templates from each form type
    Object.values(formTemplates).forEach(templatesArray => {
      const template = templatesArray.find(t => t.id === templateId);
      if (template) {
        foundTemplate = template;
      }
    });
    
    if (foundTemplate) {
      setSelectedForm(foundTemplate.formType);
      setFormData(foundTemplate.data);
      setShowTemplates(false);

      // If there's a callback, call it with the form name
      const formType = foundTemplate.formType;
      const formName = availableForms.find(form => form.id === formType)?.name;
      if (onApplicationFormSelected && formName) {
        onApplicationFormSelected(formName);
      }
    }
  };

  // Handle template selection
  const handleTemplateSelect = (formType: string, templateId: string) => {
    // Find the selected template from the imported formTemplates
    const templates = formTemplates[formType];
    if (!templates) return;
    
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      // Load the template data
      setFormData(template.data);
      setShowTemplates(false);
      
      // If callback provided, notify parent component
      if (onApplicationFormSelected) {
        onApplicationFormSelected(template.name);
      }
    }
  };

  // Render business profile selector
  const renderBusinessSelector = () => (
    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-medium text-blue-800 mb-4">Pre-fill with Business Profile</h3>
      <div className="flex items-center">
        <select
          name="businessProfile"
          id="businessProfile"
          value={selectedBusinessId || ''}
          onChange={handleBusinessSelect}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
        >
          <option value="">Select a Business Profile</option>
          {businessProfiles.map(profile => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  // Render form selection UI with improved click handling
  const renderFormSelection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-gray-900 mb-4">Safe Forms Templates</h3>
      <p className="text-gray-600 mb-6">Select a form template to get started</p>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-4">View templates as:</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {}} // Filter by user type
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Borrower
          </button>
          <button
            onClick={() => {}} // Filter by user type
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Broker
          </button>
          <button
            onClick={() => {}} // Filter by user type
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Lender
          </button>
          <button
            onClick={() => {}} // Filter by user type
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Vendor
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-3">Showing templates available for Borrower users</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credit Application */}
        <div 
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleFormSelect('credit-application')}
        >
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4 text-blue-500">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Credit Application</h3>
              <p className="text-sm text-gray-600 mt-1">Standard credit application form</p>
            </div>
          </div>
        </div>
        
        {/* Additional Owner (Individual) */}
        <div 
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleFormSelect('additional-owner-individual')}
        >
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4 text-blue-500">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Additional Owner (Individual)</h3>
              <p className="text-sm text-gray-600 mt-1">Form for additional individual owners</p>
            </div>
          </div>
        </div>
        
        {/* Additional Owner (Business) */}
        <div 
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleFormSelect('additional-owner-business')}
        >
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4 text-blue-500">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Additional Owner (Business)</h3>
              <p className="text-sm text-gray-600 mt-1">Form for business entity owners</p>
            </div>
          </div>
        </div>
        
        {/* Additional Owner (Trust) */}
        <div 
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleFormSelect('additional-owner-trust')}
        >
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4 text-blue-500">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Additional Owner (Trust)</h3>
              <p className="text-sm text-gray-600 mt-1">Form for trust entity owners</p>
            </div>
          </div>
        </div>
        
        {/* Business Debt Schedule */}
        <div 
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleFormSelect('business-debt-schedule')}
        >
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4 text-blue-500">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Business Debt Schedule</h3>
              <p className="text-sm text-gray-600 mt-1">Table template for business debt</p>
            </div>
          </div>
        </div>
        
        {/* Personal Finance Statement */}
        <div 
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleFormSelect('personal-finance-statement')}
        >
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4 text-blue-500">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Personal Finance Statement</h3>
              <p className="text-sm text-gray-600 mt-1">SBA Form 413 compliant template</p>
            </div>
          </div>
        </div>
        
        {/* Asset Ledger */}
        <div 
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer"
          onClick={() => handleFormSelect('asset-ledger')}
        >
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4 text-blue-500">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Asset Ledger</h3>
              <p className="text-sm text-gray-600 mt-1">Asset details verification table</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the basic equipment finance form as an example
  const renderEquipmentFinanceForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Equipment Finance Application</h3>
        <p className="text-sm text-gray-500 mb-6">
          Please provide information about the equipment you wish to finance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700">
            Equipment Type
          </label>
          <input
            type="text"
            name="equipmentType"
            id="equipmentType"
            value={formData.equipmentType || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="equipmentCost" className="block text-sm font-medium text-gray-700">
            Equipment Cost ($)
          </label>
          <input
            type="number"
            name="equipmentCost"
            id="equipmentCost"
            min="0"
            value={formData.equipmentCost || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
            Vendor Name
          </label>
          <input
            type="text"
            name="vendorName"
            id="vendorName"
            value={formData.vendorName || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="financeAmount" className="block text-sm font-medium text-gray-700">
            Finance Amount ($)
          </label>
          <input
            type="number"
            name="financeAmount"
            id="financeAmount"
            min="0"
            value={formData.financeAmount || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="equipmentDescription" className="block text-sm font-medium text-gray-700">
          Equipment Description
        </label>
        <textarea
          name="equipmentDescription"
          id="equipmentDescription"
          rows={3}
          value={formData.equipmentDescription || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="term" className="block text-sm font-medium text-gray-700">
            Term (months)
          </label>
          <select
            name="term"
            id="term"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            value={formData.term || ''}
            onChange={e => handleInputChange(e as any)}
          >
            <option value="">Select Term</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="48">48 months</option>
            <option value="60">60 months</option>
            <option value="72">72 months</option>
          </select>
        </div>

        <div>
          <label htmlFor="equipmentCondition" className="block text-sm font-medium text-gray-700">
            Equipment Condition
          </label>
          <select
            name="equipmentCondition"
            id="equipmentCondition"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            value={formData.equipmentCondition || ''}
            onChange={e => handleInputChange(e as any)}
          >
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </div>

        <div>
          <label htmlFor="equipmentYear" className="block text-sm font-medium text-gray-700">
            Year (if used)
          </label>
          <input
            type="number"
            name="equipmentYear"
            id="equipmentYear"
            min="1900"
            max={new Date().getFullYear()}
            value={formData.equipmentYear || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {requestMode && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Request Documents
          </button>
        </div>
      )}
    </form>
  );

  // Render the working capital application form as an example
  const renderWorkingCapitalForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Working Capital Application</h3>
        <p className="text-sm text-gray-500 mb-6">
          Please provide information about your working capital needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700">
            Requested Amount ($)
          </label>
          <input
            type="number"
            name="requestedAmount"
            id="requestedAmount"
            min="0"
            value={formData.requestedAmount || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="useOfFunds" className="block text-sm font-medium text-gray-700">
            Use of Funds
          </label>
          <select
            name="useOfFunds"
            id="useOfFunds"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            value={formData.useOfFunds || ''}
            onChange={e => handleInputChange(e as any)}
          >
            <option value="">Select Purpose</option>
            <option value="inventory">Inventory Purchase</option>
            <option value="payroll">Payroll</option>
            <option value="marketing">Marketing Expansion</option>
            <option value="operations">Operations</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-gray-700">
            Monthly Revenue ($)
          </label>
          <input
            type="number"
            name="monthlyRevenue"
            id="monthlyRevenue"
            min="0"
            value={formData.monthlyRevenue || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="timeInBusiness" className="block text-sm font-medium text-gray-700">
            Time in Business (years)
          </label>
          <input
            type="number"
            name="timeInBusiness"
            id="timeInBusiness"
            min="0"
            step="0.5"
            value={formData.timeInBusiness || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700">
          Business Description
        </label>
        <textarea
          name="businessDescription"
          id="businessDescription"
          rows={3}
          value={formData.businessDescription || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {requestMode && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Request Documents
          </button>
        </div>
      )}
    </form>
  );

  // Render the commercial real estate form as an example
  const renderCommercialRealEstateForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Commercial Real Estate Application
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Please provide information about the commercial property you want to finance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
            Property Type
          </label>
          <select
            name="propertyType"
            id="propertyType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            value={formData.propertyType || ''}
            onChange={e => handleInputChange(e as any)}
          >
            <option value="">Select Property Type</option>
            <option value="retail">Retail</option>
            <option value="office">Office</option>
            <option value="industrial">Industrial</option>
            <option value="multifamily">Multi-family</option>
            <option value="hospitality">Hospitality</option>
            <option value="mixed">Mixed Use</option>
          </select>
        </div>

        <div>
          <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700">
            Property Address
          </label>
          <input
            type="text"
            name="propertyAddress"
            id="propertyAddress"
            value={formData.propertyAddress || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700">
            Purchase Price ($)
          </label>
          <input
            type="number"
            name="purchasePrice"
            id="purchasePrice"
            min="0"
            value={formData.purchasePrice || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700">
            Loan Amount Requested ($)
          </label>
          <input
            type="number"
            name="loanAmount"
            id="loanAmount"
            min="0"
            value={formData.loanAmount || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="propertyDescription" className="block text-sm font-medium text-gray-700">
          Property Description
        </label>
        <textarea
          name="propertyDescription"
          id="propertyDescription"
          rows={3}
          value={formData.propertyDescription || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {requestMode && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Request Documents
          </button>
        </div>
      )}
    </form>
  );

  // Render the general credit application form
  const renderGeneralCreditForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">General Credit Application</h3>
        <p className="text-sm text-gray-500 mb-6">
          Please provide general information for your credit application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="loanPurpose" className="block text-sm font-medium text-gray-700">
            Loan Purpose
          </label>
          <select
            name="loanPurpose"
            id="loanPurpose"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            value={formData.loanPurpose || ''}
            onChange={e => handleInputChange(e as any)}
          >
            <option value="">Select Purpose</option>
            <option value="expansion">Business Expansion</option>
            <option value="refinance">Debt Refinancing</option>
            <option value="startup">Startup Funding</option>
            <option value="equipment">Equipment Purchase</option>
            <option value="inventory">Inventory Financing</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="requestedAmount" className="block text-sm font-medium text-gray-700">
            Requested Amount ($)
          </label>
          <input
            type="number"
            name="requestedAmount"
            id="requestedAmount"
            min="0"
            value={formData.requestedAmount || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            name="businessName"
            id="businessName"
            value={formData.businessName || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
            Tax ID / EIN
          </label>
          <input
            type="text"
            name="taxId"
            id="taxId"
            value={formData.taxId || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label htmlFor="industryType" className="block text-sm font-medium text-gray-700">
            Industry
          </label>
          <select
            name="industryType"
            id="industryType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            value={formData.industryType || ''}
            onChange={e => handleInputChange(e as any)}
          >
            <option value="">Select Industry</option>
            <option value="retail">Retail</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="healthcare">Healthcare</option>
            <option value="technology">Technology</option>
            <option value="construction">Construction</option>
            <option value="hospitality">Hospitality</option>
            <option value="services">Professional Services</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="annualRevenue" className="block text-sm font-medium text-gray-700">
            Annual Revenue ($)
          </label>
          <input
            type="number"
            name="annualRevenue"
            id="annualRevenue"
            min="0"
            value={formData.annualRevenue || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
          Additional Information
        </label>
        <textarea
          name="additionalInfo"
          id="additionalInfo"
          rows={3}
          value={formData.additionalInfo || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {requestMode && (
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Request Documents
          </button>
        </div>
      )}
    </form>
  );

  // Render template selection
  const renderTemplateSelection = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-medium text-gray-900">Select a Template</h3>
        <button
          onClick={() => setShowTemplates(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {selectedForm && formTemplates[selectedForm] ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formTemplates[selectedForm].map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(selectedForm, template.id)}
              className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
            >
              <h4 className="text-lg font-medium text-gray-800 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <button
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Use this template
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center">
          <p className="text-gray-600">No templates available for this form type.</p>
        </div>
      )}
    </div>
  );

  // Render selected form or form selection
  const renderForm = () => {
    if (!selectedForm) {
      return renderFormSelection();
    }

    // First show the business selector for pre-filling data
    return (
      <div>
        {renderBusinessSelector()}

        {/* Then render the appropriate form */}
        {selectedForm === 'equipment_finance' && renderEquipmentFinanceForm()}
        {selectedForm === 'working_capital' && renderWorkingCapitalForm()}
        {selectedForm === 'commercial_real_estate' && renderCommercialRealEstateForm()}
        {selectedForm === 'general_credit' && renderGeneralCreditForm()}
        {/* For other forms, show a placeholder */}
        {![
          'equipment_finance',
          'working_capital',
          'commercial_real_estate',
          'general_credit',
        ].includes(selectedForm) && (
          <div className="p-6 text-center bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {availableForms.find(form => form.id === selectedForm)?.name}
            </h3>
            <p className="text-gray-500">Form content will be implemented soon.</p>
            {requestMode && (
              <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Request Documents
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium text-gray-900">Safe Forms</h2>
              <p className="mt-1 text-sm text-gray-600">
                Securely submit and manage regulatory-compliant financial documents
              </p>
            </div>
            <div>
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="mr-2 h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                {showTemplates ? 'Hide Templates' : 'Load Templates'}
              </button>
            </div>
          </div>
        </div>

        {showTemplates && renderTemplateSelection()}

        {/* Existing form rendering */}
        {renderFormSelection()}
        {selectedForm && renderForm()}
      </div>
    </div>
  );
};

export default SafeForms;
