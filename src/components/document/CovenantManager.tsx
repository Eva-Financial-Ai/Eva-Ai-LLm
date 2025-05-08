import React, { useState, useEffect } from 'react';

interface CovenantTemplate {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'operational' | 'custom';
  defaultThreshold?: string | number;
  frequency: 'quarterly' | 'monthly' | 'annually' | 'continuous';
}

interface CustomCovenant {
  id?: string;
  name: string;
  type: 'financial' | 'operational' | 'custom';
  threshold?: string | number;
  hasThreshold: boolean;
  frequency: 'quarterly' | 'monthly' | 'annually' | 'continuous';
  description: string;
}

interface CovenantManagerProps {
  transactionId: string;
  onSave: (covenants: CustomCovenant[]) => void;
  onCancel: () => void;
  isVisible: boolean;
}

// Demo covenant templates
const demoCovenantTemplates: CovenantTemplate[] = [
  {
    id: 'cov-1',
    name: 'Current Ratio',
    description: 'Maintain a minimum current ratio of 1.5x',
    type: 'financial',
    defaultThreshold: '1.5x',
    frequency: 'quarterly'
  },
  {
    id: 'cov-2',
    name: 'Debt-to-EBITDA Ratio',
    description: 'Maintain maximum Debt-to-EBITDA ratio of 4.0x',
    type: 'financial',
    defaultThreshold: '4.0x',
    frequency: 'quarterly'
  },
  {
    id: 'cov-3',
    name: 'Equipment Maintenance',
    description: 'Maintain equipment according to manufacturer standards',
    type: 'operational',
    frequency: 'continuous'
  }
];

const CovenantManager: React.FC<CovenantManagerProps> = ({
  transactionId,
  onSave,
  onCancel,
  isVisible
}) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [customCovenants, setCustomCovenants] = useState<CustomCovenant[]>([]);
  const [newCovenant, setNewCovenant] = useState<CustomCovenant>({
    name: '',
    type: 'financial',
    hasThreshold: true,
    threshold: '',
    frequency: 'quarterly',
    description: ''
  });
  const [error, setError] = useState('');

  // Toggle selection of a template
  const toggleTemplateSelection = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  // Add a new custom covenant
  const addCustomCovenant = () => {
    if (!newCovenant.name.trim()) {
      setError('Covenant name is required');
      return;
    }

    if (newCovenant.hasThreshold && (newCovenant.threshold === '' || newCovenant.threshold === undefined)) {
      setError('Please fill out the threshold field or uncheck "Has Threshold"');
      return;
    }

    const covenantToAdd = {
      ...newCovenant,
      id: `custom-${Date.now()}`
    };

    // If threshold is not applicable, remove it from the covenant object
    if (!covenantToAdd.hasThreshold) {
      delete covenantToAdd.threshold;
    }

    setCustomCovenants(prev => [...prev, covenantToAdd]);
    
    // Reset the new covenant form
    setNewCovenant({
      name: '',
      type: 'financial',
      hasThreshold: true,
      threshold: '',
      frequency: 'quarterly',
      description: ''
    });
    
    setError('');
  };

  // Remove a custom covenant
  const removeCustomCovenant = (id: string) => {
    setCustomCovenants(prev => prev.filter(covenant => covenant.id !== id));
  };

  // Handle saving the covenants
  const handleSave = () => {
    // Combine selected templates and custom covenants
    const selectedTemplateCovenants = demoCovenantTemplates
      .filter(template => selectedTemplates.includes(template.id))
      .map(template => ({
        id: template.id,
        name: template.name,
        type: template.type,
        hasThreshold: !!template.defaultThreshold,
        threshold: template.defaultThreshold,
        frequency: template.frequency,
        description: template.description
      }));

    const allCovenants = [...selectedTemplateCovenants, ...customCovenants];
    onSave(allCovenants);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Manage Covenants</h2>
          <p className="text-sm text-gray-600">
            Select templates based on transaction type, amount, and structure to automatically add appropriate covenants.
          </p>
        </div>

        {/* Covenant Templates Section */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Covenant Templates</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select templates based on transaction type, amount, and structure to automatically add appropriate covenants.
          </p>

          <div className="space-y-3">
            {demoCovenantTemplates.map(template => (
              <div key={template.id} className="flex items-start">
                <input
                  type="checkbox"
                  id={`template-${template.id}`}
                  checked={selectedTemplates.includes(template.id)}
                  onChange={() => toggleTemplateSelection(template.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 mt-1"
                />
                <label htmlFor={`template-${template.id}`} className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">{template.name}</span>
                  <span className="block text-xs text-gray-500">{template.description}</span>
                  <div className="flex space-x-4 mt-1">
                    {template.defaultThreshold && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Threshold: {template.defaultThreshold}
                      </span>
                    )}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {template.frequency}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {template.type}
                    </span>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Covenants Section */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Custom Covenants</h3>
          <p className="text-sm text-gray-600 mb-4">
            Add custom covenants specific to this transaction.
          </p>

          {customCovenants.length > 0 && (
            <div className="border border-gray-200 rounded-md p-4 mb-4 space-y-4">
              {customCovenants.map(covenant => (
                <div key={covenant.id} className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{covenant.name}</h4>
                    <p className="text-xs text-gray-500">{covenant.description}</p>
                    <div className="flex space-x-2 mt-1">
                      {covenant.hasThreshold && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Threshold: {covenant.threshold}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {covenant.frequency}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {covenant.type}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomCovenant(covenant.id!)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {customCovenants.length === 0 && (
            <p className="text-sm text-gray-500 italic mb-4">No custom covenants added yet.</p>
          )}

          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Add Custom Covenant</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newCovenant.name}
                  onChange={(e) => setNewCovenant({...newCovenant, name: e.target.value})}
                  placeholder="e.g. Minimum Cash Balance"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newCovenant.type}
                  onChange={(e) => setNewCovenant({...newCovenant, type: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="financial">Financial</option>
                  <option value="operational">Operational</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <div className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id="has-threshold"
                  checked={newCovenant.hasThreshold}
                  onChange={(e) => setNewCovenant({...newCovenant, hasThreshold: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="has-threshold" className="ml-2 block text-sm font-medium text-gray-700">
                  Has Threshold
                </label>
              </div>
              
              {newCovenant.hasThreshold && (
                <div>
                  <input
                    type="text"
                    value={newCovenant.threshold || ''}
                    onChange={(e) => setNewCovenant({...newCovenant, threshold: e.target.value})}
                    placeholder="e.g. $500,000 or 1.5x"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the threshold value (e.g. '$500,000' or '1.5x')
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Frequency</label>
                <select
                  value={newCovenant.frequency}
                  onChange={(e) => setNewCovenant({...newCovenant, frequency: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="continuous">Continuous</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newCovenant.description}
                onChange={(e) => setNewCovenant({...newCovenant, description: e.target.value})}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the covenant requirements..."
              ></textarea>
            </div>
            
            {error && (
              <div className="p-2 bg-red-50 text-red-700 text-sm rounded-md mb-3">
                {error}
              </div>
            )}
            
            <button
              type="button"
              onClick={addCustomCovenant}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Covenant
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Covenants
          </button>
        </div>
      </div>
    </div>
  );
};

export default CovenantManager; 