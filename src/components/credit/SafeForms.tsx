import React from 'react';

interface SafeFormsProps {
  userType: string;
  requestMode: boolean;
}

const SafeForms: React.FC<SafeFormsProps> = ({ userType, requestMode }) => {
  // Mock data for form templates
  const formTemplates = [
    {
      id: 'form-1',
      name: 'Equipment Finance Application',
      description: 'Standard application for equipment financing',
      requiredFor: ['equipment_finance', 'equipment_lease'],
      fileType: 'pdf'
    },
    {
      id: 'form-2',
      name: 'Working Capital Application',
      description: 'Application for short-term working capital',
      requiredFor: ['working_capital', 'line_of_credit'],
      fileType: 'pdf'
    },
    {
      id: 'form-3',
      name: 'Commercial Real Estate Form',
      description: 'Commercial real estate loan application',
      requiredFor: ['commercial_real_estate'],
      fileType: 'pdf'
    },
    {
      id: 'form-4',
      name: 'Business Information Form',
      description: 'General business information collection',
      requiredFor: ['all'],
      fileType: 'pdf'
    }
  ];

  return (
    <div className="safe-forms">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {requestMode ? 'Request Forms' : 'Required Forms'}
      </h3>

      <div className="form-templates">
        {formTemplates.map(template => (
          <div key={template.id} className="p-4 border rounded-md mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-800">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              {requestMode ? (
                <button 
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                  Request
                </button>
              ) : (
                <button 
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                >
                  Fill Form
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafeForms; 