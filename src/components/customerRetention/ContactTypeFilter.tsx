import React from 'react';

export type ContactType = 'all' | 'customer' | 'prospect' | 'partner' | 'vendor' | 'employee';

interface ContactTypeFilterProps {
  selectedType: ContactType;
  onChange: (type: ContactType) => void;
  className?: string;
}

const ContactTypeFilter: React.FC<ContactTypeFilterProps> = ({ 
  selectedType, 
  onChange,
  className = '' 
}) => {
  const contactTypes: Array<{ value: ContactType; label: string }> = [
    { value: 'all', label: 'All Contacts' },
    { value: 'customer', label: 'Customers' },
    { value: 'prospect', label: 'Prospects' },
    { value: 'partner', label: 'Partners' },
    { value: 'vendor', label: 'Vendors' },
    { value: 'employee', label: 'Employees' }
  ];

  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`}>
      {contactTypes.map((type) => (
        <button
          key={type.value}
          type="button"
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
            selectedType === type.value
              ? 'bg-primary-600 text-white hover:bg-primary-700 z-10'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } ${
            type.value === 'all' ? 'rounded-l-md' : ''
          } ${
            type.value === 'employee' ? 'rounded-r-md' : ''
          } border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
          onClick={() => onChange(type.value)}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default ContactTypeFilter; 