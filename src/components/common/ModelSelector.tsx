import React, { useState } from 'react';

interface Model {
  id: string;
  name: string;
  description?: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleModelSelect = (model: Model) => {
    onModelChange(model);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        <span className="mr-1 text-gray-700">{selectedModel.name}</span>
        <svg 
          className={`h-4 w-4 text-gray-500 transform ${isOpen ? 'rotate-180' : ''} transition-transform`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  model.id === selectedModel.id
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <div className="font-medium">{model.name}</div>
                {model.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{model.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ModelSelector); 