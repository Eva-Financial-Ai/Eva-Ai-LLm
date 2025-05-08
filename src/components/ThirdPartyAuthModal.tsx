import React, { useState } from 'react';
// @ts-ignore
import { useSpring, animated } from '@react-spring/web';

interface ThirdPartyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (credentials: any) => void;
  provider: {
    name: string;
    logo?: string;
    description: string;
    fields: {
      name: string;
      label: string;
      type: 'text' | 'password' | 'email';
      required: boolean;
      placeholder?: string;
    }[];
  };
}

const ThirdPartyAuthModal: React.FC<ThirdPartyAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  provider
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation for modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 280, friction: 60 }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate required fields
    const missingFields = provider.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    // Simulate API connection
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Success - pass credentials back
      onSuccess({
        provider: provider.name,
        authData: formData,
        connected: true,
        timestamp: new Date().toISOString()
      });
      
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <animated.div 
        style={modalAnimation}
        className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Connect to {provider.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="mb-4 text-sm text-gray-600">
            {provider.description}
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {provider.fields.map(field => (
                <div key={field.name}>
                  <label 
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    id={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isSubmitting 
                    ? 'bg-primary-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  'Connect'
                )}
              </button>
            </div>
          </form>
        </div>
      </animated.div>
    </div>
  );
};

export default ThirdPartyAuthModal; 