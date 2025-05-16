import React, { useState, useEffect } from 'react';
import riskMapService from '../risk/RiskMapService';
import { addDemoCredits, resetDemoCreditsAndReports } from '../../utils/initDemoCredits';

/**
 * This component provides a floating button that allows adding and managing demo credits
 * for testing purposes. Only used in development mode.
 */
const DemoCreditsManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(riskMapService.getAvailableCredits());
  const [purchasedReports, setPurchasedReports] = useState<any[]>(riskMapService.getPurchasedReports());

  // Update credits when localStorage changes
  useEffect(() => {
    const updateState = () => {
      setAvailableCredits(riskMapService.getAvailableCredits());
      setPurchasedReports(riskMapService.getPurchasedReports());
    };

    // Listen for storage changes
    window.addEventListener('storage', updateState);
    
    // Set an interval to check for changes (since we might modify from multiple components)
    const interval = setInterval(updateState, 2000);
    
    return () => {
      window.removeEventListener('storage', updateState);
      clearInterval(interval);
    };
  }, []);

  // Toggle the panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // Add credits
  const handleAddCredits = (amount: number) => {
    addDemoCredits(amount);
    setAvailableCredits(riskMapService.getAvailableCredits());
  };

  // Reset credits and reports
  const handleReset = () => {
    resetDemoCreditsAndReports();
    setAvailableCredits(riskMapService.getAvailableCredits());
    setPurchasedReports(riskMapService.getPurchasedReports());
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development mode
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating button */}
      <button
        onClick={togglePanel}
        className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600"
        title="Demo Credits Manager"
      >
        💰
      </button>

      {/* Credits panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 w-64 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-700">Demo Credits Manager</h3>
            <button
              onClick={togglePanel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Available Credits:</span>
              <span className="font-semibold">{availableCredits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Purchased Reports:</span>
              <span className="font-semibold">{purchasedReports.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => handleAddCredits(1)}
              className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded hover:bg-blue-200"
            >
              +1
            </button>
            <button
              onClick={() => handleAddCredits(5)}
              className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded hover:bg-blue-200"
            >
              +5
            </button>
            <button
              onClick={() => handleAddCredits(10)}
              className="bg-blue-100 text-blue-700 text-xs py-1 px-2 rounded hover:bg-blue-200"
            >
              +10
            </button>
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-red-100 text-red-700 text-xs py-1 px-2 rounded hover:bg-red-200"
          >
            Reset All
          </button>

          <div className="mt-3 text-xs text-gray-400">
            Dev tools only - not shown in production
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoCreditsManager; 