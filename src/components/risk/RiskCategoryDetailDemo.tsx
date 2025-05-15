import React, { useState } from 'react';
import RiskCategoryDetail from './RiskCategoryDetail';
import { RiskCategory } from './RiskMapOptimized';
import { RiskMapType } from './RiskMapNavigator';
import FileLock from './FileLock';

const RiskCategoryDetailDemo: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory>('credit');
  const [riskMapType, setRiskMapType] = useState<RiskMapType>('unsecured');
  
  const categories: RiskCategory[] = [
    'credit',
    'capacity',
    'collateral',
    'capital',
    'conditions',
    'character'
  ];
  
  const mapTypes: RiskMapType[] = [
    'unsecured',
    'equipment',
    'realestate'
  ];
  
  const handleCategoryChange = (category: RiskCategory) => {
    setSelectedCategory(category);
  };
  
  const handleRiskMapTypeChange = (type: RiskMapType) => {
    setRiskMapType(type);
  };
  
  // Map category to score for demo
  const getCategoryScore = (category: RiskCategory): number => {
    const scores: Record<RiskCategory, number> = {
      credit: 85,
      capacity: 78,
      collateral: 82,
      capital: 90,
      conditions: 94,
      character: 95,
      all: 87,
      customer_retention: 88
    };
    
    return scores[category] || 80;
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Risk Assessment Dashboard</h1>
          <div className="text-sm text-gray-500">Transaction ID: TX-12246</div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md mb-6 p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Risk Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Risk Map Type</h2>
              <div className="flex flex-wrap gap-2">
                {mapTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      riskMapType === type
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleRiskMapTypeChange(type)}
                  >
                    {type === 'unsecured' ? 'Unsecured' : 
                     type === 'equipment' ? 'Equipment' : 'Real Estate'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <RiskCategoryDetail
              category={selectedCategory}
              score={getCategoryScore(selectedCategory)}
              transactionId="TX-12246"
              riskMapType={riskMapType}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Approve Application
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Request More Documentation
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            Decline
          </button>
        </div>
      </div>
      
      {/* Add the FileLock component */}
      <FileLock variant="advanced" position="bottom-right" />
    </div>
  );
};

export default RiskCategoryDetailDemo; 