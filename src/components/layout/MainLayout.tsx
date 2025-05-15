import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title = 'Auto Originations' }) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-full mx-auto py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-primary-600 font-bold text-lg">EVA</span>
              <span className="text-gray-500 text-sm ml-1">Platform</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Existing controls */}
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center px-4 py-2 border-b border-gray-200">
        <button onClick={handleBackClick} className="text-gray-600 hover:text-gray-900 mr-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-gray-800 font-medium text-sm">Back</span>
        <span className="text-gray-900 font-semibold text-base ml-4">{title}</span>
      </div>
      
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 