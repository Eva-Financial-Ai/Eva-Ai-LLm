import React from 'react';
import { useBlockchain } from './BlockchainProvider';

interface BlockchainButtonProps {
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'small' | 'medium' | 'large';
}

const BlockchainButton: React.FC<BlockchainButtonProps> = ({ 
  variant = 'primary',
  size = 'medium'
}) => {
  const { toggleWidget } = useBlockchain();
  
  // Size classes
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    minimal: 'bg-transparent hover:bg-gray-100 text-indigo-600'
  };
  
  return (
    <button
      onClick={toggleWidget}
      className={`rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Commercial Instruments
      </div>
    </button>
  );
};

export default BlockchainButton; 