import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface FormTemplate {
  id: string;
  name: string;
  description: string;
  formType: string;
  data: Record<string, string>;
}

const SafeForms: React.FC<SafeFormsProps> = ({
  userType,
  requestMode = false,
  onApplicationFormSelected,
}) => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
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

  // Available form templates - in a real app, this would come from an API
  const formTemplates: FormTemplate[] = [
    {
      id: 'equipment_finance_template_1',
      name: 'Construction Equipment Finance',
      description: 'Template for construction companies financing heavy equipment',
      formType: 'equipment_finance',
      data: {
        businessName: 'ABC Construction',
        businessType: 'Corporation',
        taxId: '12-3456789',
        yearEstablished: '2010',
        contactFirstName: 'John',
        contactLastName: 'Smith',
        contactTitle: 'CEO',
        contactPhone: '(555) 123-4567',
        contactEmail: 'john@abcconstruction.com',
        streetAddress: '123 Builder Ave',
        city: 'Construction City',
        state: 'CA',
        zipCode: '90210',
        equipmentType: 'Excavator',
        equipmentCost: '250000',
        downPayment: '50000',
        loanTerm: '60',
        equipmentDescription: 'CAT 320 Excavator with extended warranty',
      },
    },
    {
      id: 'equipment_finance_template_2',
      name: 'Medical Equipment Finance',
      description: 'Template for healthcare providers financing medical equipment',
      formType: 'equipment_finance',
      data: {
        businessName: 'City Medical Center',
        businessType: 'Non-Profit',
        taxId: '45-6789123',
        yearEstablished: '1995',
        contactFirstName: 'Sarah',
        contactLastName: 'Johnson',
        contactTitle: 'CFO',
        contactPhone: '(555) 987-6543',
        contactEmail: 'sarah@citymedical.org',
        streetAddress: '456 Health Blvd',
        city: 'Wellness',
        state: 'NY',
        zipCode: '10001',
        equipmentType: 'Imaging System',
        equipmentCost: '500000',
        downPayment: '100000',
        loanTerm: '72',
        equipmentDescription: 'Full digital imaging system with 5-year service agreement',
      },
    },
    {
      id: 'working_capital_template_1',
      name: 'Retail Working Capital',
      description: 'Template for retail businesses seeking working capital',
      formType: 'working_capital',
      data: {
        businessName: 'Fashion First Boutique',
        businessType: 'LLC',
        taxId: '78-9123456',
        yearEstablished: '2018',
        contactFirstName: 'Emily',
        contactLastName: 'Brown',
        contactTitle: 'Owner',
        contactPhone: '(555) 456-7890',
        contactEmail: 'emily@fashionfirst.com',
        streetAddress: '789 Retail Row',
        city: 'Style',
        state: 'FL',
        zipCode: '33101',
        loanAmount: '75000',
        purposeOfFunds: 'Inventory purchase for holiday season',
        currentMonthlyRevenue: '35000',
        timeInBusiness: '4',
      },
    },
    {
      id: 'commercial_real_estate_template_1',
      name: 'Office Building Purchase',
      description: 'Template for office building acquisition',
      formType: 'commercial_real_estate',
      data: {
        businessName: 'Tech Innovations LLC',
        businessType: 'LLC',
        taxId: '98-7654321',
        yearEstablished: '2015',
        contactFirstName: 'Michael',
        contactLastName: 'Wilson',
        contactTitle: 'Managing Partner',
        contactPhone: '(555) 789-0123',
        contactEmail: 'michael@techinnovations.com',
        streetAddress: '101 Tech Blvd',
        city: 'Innovation',
        state: 'CA',
        zipCode: '94105',
        propertyAddress: '200 Office Park Drive',
        propertyCity: 'Innovation',
        propertyState: 'CA',
        propertyZipCode: '94105',
        purchasePrice: '1200000',
        downPayment: '300000',
        loanTerm: '240',
        propertyType: 'Office',
        propertySquareFeet: '5000',
      },
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
    const selectedFormName = availableForms.find(form => form.id === formId)?.name || '';
    setSelectedForm(formId);
    console.log(`Selected form: ${formId}, ${selectedFormName}`);

    // When a form is selected, pass it up to the parent component
    if (onApplicationFormSelected && selectedFormName) {
      onApplicationFormSelected(selectedFormName);
    }
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
    const template = formTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedForm(template.formType);
      setFormData(template.data);
      setShowTemplates(false);

      // If there's a callback, call it with the form name
      const formName = availableForms.find(form => form.id === template.formType)?.name;
      if (onApplicationFormSelected && formName) {
        onApplicationFormSelected(formName);
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
    <div>
      <h2 className="text-xl font-medium text-gray-900 mb-4">Select Application Form</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredForms.map(form => (
          <div
            key={form.id}
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedForm === form.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300'
            }`}
            onClick={() => handleFormSelect(form.id)}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="formSelection"
                id={form.id}
                checked={selectedForm === form.id}
                onChange={() => handleFormSelect(form.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label
                htmlFor={form.id}
                className="ml-3 flex flex-col cursor-pointer w-full"
                onClick={e => {
                  e.preventDefault(); // Prevent default to ensure the click is handled properly
                  handleFormSelect(form.id);
                }}
              >
                <span className="block text-sm font-medium text-gray-900">{form.name}</span>
                <span className="block text-sm text-gray-500">{form.description}</span>
              </label>
            </div>
          </div>
        ))}
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
    <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Form Templates</h3>
        <p className="mt-1 text-sm text-gray-600">
          Select a template to quickly populate the form with sample data
        </p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {formTemplates
          .filter(template => !selectedForm || template.formType === selectedForm)
          .map(template => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition"
              onClick={() => handleLoadTemplate(template.id)}
            >
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              <p className="mt-1 text-sm text-gray-600">{template.description}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {availableForms.find(form => form.id === template.formType)?.name}
                </span>
              </div>
            </div>
          ))}
      </div>
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
