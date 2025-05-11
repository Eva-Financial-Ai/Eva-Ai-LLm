import React, { useState } from 'react';
import RiskConfiguration from './RiskConfiguration';
import SmartMatchingVariables from './SmartMatchingVariables';
import { useRiskConfig } from '../../contexts/RiskConfigContext';

const RiskLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'smart-matching'>('config');
  const { configType } = useRiskConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800">Risk Lab</h2>
        <p className="text-gray-600 mt-1">
          Advanced configuration for risk assessment and matching algorithms.
        </p>
        {configType !== 'general' && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md text-sm text-blue-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              <strong>Active Configuration:</strong>{' '}
              {configType === 'real_estate' ? 'Real Estate Credit' : 'Equipment & Vehicles Credit'}{' '}
              - You can change the configuration type in the settings below.
            </span>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'config'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('config')}
          >
            Risk Configuration
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'smart-matching'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('smart-matching')}
          >
            Smart Matching Variables
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'config' && <RiskConfiguration />}
        {activeTab === 'smart-matching' && <SmartMatchingVariables />}
      </div>
    </div>
  );
};

export default RiskLab;
