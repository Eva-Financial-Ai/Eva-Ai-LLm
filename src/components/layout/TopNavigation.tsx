import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TransactionSelector from '../common/TransactionSelector';

interface TopNavigationProps {
  title?: string;
  backPath?: string;
  showBackButton?: boolean;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  orientation?: 'portrait' | 'landscape';
  showTransactionSelector?: boolean;
  currentTransactionId?: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  title,
  backPath = '/',
  showBackButton = false,
  deviceType = 'desktop',
  orientation = 'landscape',
  showTransactionSelector = true,
  currentTransactionId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showTransaction, setShowTransaction] = useState(showTransactionSelector);

  const handleBack = () => {
    navigate(backPath);
  };

  const renderBackButton = () => (
    <button
      onClick={handleBack}
      className="inline-flex items-center p-2 mr-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none"
    >
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );

  return (
    <div className="bg-white shadow-sm z-40 relative mb-4">
      <div className="px-4 py-3 mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center">
          {showBackButton && renderBackButton()}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          {showTransaction && (
            <div className="w-full sm:w-auto">
              <TransactionSelector 
                onClose={() => setShowTransaction(false)}
                currentTransactionId={currentTransactionId}
              />
            </div>
          )}
          
          <button className="text-gray-600 hover:text-gray-900 focus:outline-none ml-auto">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
