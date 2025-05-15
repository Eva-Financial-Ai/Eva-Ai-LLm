import React, { useState, useEffect } from 'react';
import { addDemoCredits, resetDemoCreditsAndReports } from '../../utils/initDemoCredits';
import riskMapService from '../risk/RiskMapService';

/**
 * Development tools for the Risk Report feature
 * This component provides UI controls for adding credits and resetting reports
 * during development and testing.
 * 
 * NOTE: This component should only be included in development builds!
 */
const RiskReportDevTools: React.FC = () => {
  const [availableCredits, setAvailableCredits] = useState(riskMapService.getAvailableCredits());
  const [isOpen, setIsOpen] = useState(false);
  const [purchasedReports, setPurchasedReports] = useState<any[]>(riskMapService.getPurchasedReports());
  
  // Update credits on mount and when localStorage changes
  useEffect(() => {
    const checkCredits = () => {
      setAvailableCredits(riskMapService.getAvailableCredits());
      setPurchasedReports(riskMapService.getPurchasedReports());
    };
    
    // Check on mount
    checkCredits();
    
    // Check when localStorage changes
    const handleStorageChange = () => {
      checkCredits();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set up a periodic check
    const interval = setInterval(checkCredits, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // Add credits
  const handleAddCredits = (amount: number) => {
    addDemoCredits(amount);
    setAvailableCredits(riskMapService.getAvailableCredits());
  };
  
  // Reset all
  const handleReset = () => {
    resetDemoCreditsAndReports();
    setAvailableCredits(riskMapService.getAvailableCredits());
    setPurchasedReports(riskMapService.getPurchasedReports());
  };
  
  // Toggle visibility
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Button to toggle tools */}
      <button
        onClick={toggleOpen}
        className="bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-full shadow-lg"
        title="Risk Report Dev Tools"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      
      {/* Dev tools panel */}
      {isOpen && (
        <div className="bg-white shadow-xl rounded-lg p-4 w-72 absolute bottom-12 right-0 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Report DevTools</h3>
            <button 
              onClick={toggleOpen}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Available Credits:</span>
              <span className="font-bold text-gray-900">{availableCredits}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Add Test Credits:</div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAddCredits(1)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                +1
              </button>
              <button
                onClick={() => handleAddCredits(5)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                +5
              </button>
              <button
                onClick={() => handleAddCredits(10)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                +10
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Purchased Reports: {purchasedReports.length}</div>
            {purchasedReports.length > 0 ? (
              <div className="max-h-32 overflow-y-auto">
                {purchasedReports.map((report, index) => (
                  <div key={index} className="text-xs p-2 bg-gray-50 rounded mb-1 border border-gray-200">
                    <div>ID: {report.id.substring(0, 10)}...</div>
                    <div>Type: {report.riskMapType}</div>
                    <div>Expires: {new Date(report.expiryDate).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-600 italic">No purchased reports</div>
            )}
          </div>
          
          <div className="mt-4">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Reset Credits & Reports
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskReportDevTools; 