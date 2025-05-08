import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TopNavigationProps {
  title?: string;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Always show back button except on dashboard
  const showBackButton = location.pathname !== '/';

  const handleBack = () => {
    navigate(-1); // Go back in history
  };

  const handleExit = () => {
    navigate('/'); // Go to dashboard
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 mb-4 flex items-center justify-between rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="p-1.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition-colors flex items-center"
            title="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="ml-1 text-sm font-medium">Back</span>
          </button>
        )}
        {title && <h1 className="text-sm font-medium text-gray-900">{title}</h1>}
      </div>
      
      {location.pathname !== '/' && (
        <button
          onClick={handleExit}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors"
          title="Return to dashboard"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
          </svg>
          <span>Dashboard</span>
        </button>
      )}
    </div>
  );
};

export default TopNavigation; 