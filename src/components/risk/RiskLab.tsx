import React, { useState } from 'react';
import RiskConfiguration from './RiskConfiguration';
import SmartMatchingVariables from './SmartMatchingVariables';

const RiskLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'config' | 'smart-matching'>('config');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800">Risk Lab</h2>
        <p className="text-gray-600 mt-1">
          Advanced configuration for risk assessment and matching algorithms.
        </p>
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
