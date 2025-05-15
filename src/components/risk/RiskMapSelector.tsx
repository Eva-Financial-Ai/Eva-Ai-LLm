import React, { useState, useEffect } from 'react';
import { RiskMapEvaReport } from './RiskMapEvaReport';
import { useRiskMapTypes } from '../../hooks/useRiskMapTypes';
import riskMapService from './RiskMapService';

const RiskMapSelector: React.FC = () => {
  const {
    filteredTransactions,
    selectedTransaction,
    transactionType,
    riskMapType,
    filterByType,
    selectTransaction,
  } = useRiskMapTypes();
  
  // Add state to track whether a risk map should be displayed
  const [showRiskMap, setShowRiskMap] = useState(false);
  
  // Reset the display when transaction type changes
  useEffect(() => {
    setShowRiskMap(false);
  }, [transactionType]);

  // Clear risk map service cache when component unmounts
  useEffect(() => {
    return () => {
      riskMapService.clearCache();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Transaction Type Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Type</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => filterByType('general')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
              transactionType === 'general'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Unsecured Commercial Paper
          </button>
          <button
            onClick={() => filterByType('equipment')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
              transactionType === 'equipment'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Commercial Equipment
          </button>
          <button
            onClick={() => filterByType('realestate')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${
              transactionType === 'realestate'
                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            Commercial Real Estate
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Transaction</h3>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-2">
            {filteredTransactions.map(transaction => (
              <div
                key={transaction.id}
                onClick={() => {
                  selectTransaction(transaction.id);
                  setShowRiskMap(false); // Reset display when selecting a new transaction
                }}
                className={`p-3 rounded-md cursor-pointer ${
                  selectedTransaction === transaction.id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.name}</h4>
                    <p className="text-sm text-gray-500">Date: {transaction.date}</p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">No transactions of this type found.</div>
        )}
      </div>

      {/* Load Risk Map Button */}
      {selectedTransaction && !showRiskMap && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // Clear cache before loading to ensure fresh data
              riskMapService.clearCache();
              setShowRiskMap(true);
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md shadow-sm"
          >
            Load Risk Map
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Click to load the risk map for this transaction
          </p>
        </div>
      )}

      {/* Risk Map Display - Only show when explicitly requested */}
      {selectedTransaction && showRiskMap && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Risk Map</h3>
            <button
              onClick={() => {
                setShowRiskMap(false);
                riskMapService.clearCache();
              }}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Hide Risk Map
            </button>
          </div>
          <RiskMapEvaReport
            // In a real app, you would pass the actual transaction ID
            transactionId={selectedTransaction}
            // Map the transaction type to risk map type
            riskMapType={riskMapType}
          />
        </div>
      )}
    </div>
  );
};

export default RiskMapSelector;
