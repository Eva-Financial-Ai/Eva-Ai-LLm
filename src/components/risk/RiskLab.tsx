import React, { useState, useEffect } from 'react';
import { useRiskConfig } from '../../contexts/RiskConfigContext';

const RiskLab: React.FC = () => {
  const { configType } = useRiskConfig();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [companyName, setCompanyName] = useState<string>('ABC Corp');
  
  // Risk assessment scores
  const [scores, setScores] = useState({
    overallRisk: 82,
    creditRisk: 88,
    repaymentCapacity: 82,
    capitalStructure: 90,
    collateralValue: 82,
    marketConditions: 85,
    managementAssessment: 85
  });

  // Category details
  const categoryDetails = {
    overallRisk: {
      description: 'Cumulative assessment of all risk categories',
      items: [
        { name: 'Aggregate Score', value: 'Strong' },
        { name: 'Risk Rating', value: 'Prime' }
      ],
      metrics: '92%'
    },
    creditRisk: {
      description: 'Assessment of credit history and payment behavior',
      items: [
        { name: 'Business Credit Score', value: '850' },
        { name: 'Personal Owner Score', value: 'Prime' }
      ],
      metrics: '92%'
    },
    repaymentCapacity: {
      description: 'Ability to meet financial obligations',
      items: [
        { name: 'Debt Service Coverage', value: '1.6x' },
        { name: 'Debt-to-income', value: '<30%' }
      ],
      metrics: '92%'
    },
    capitalStructure: {
      description: 'Assessment of business assets and investments',
      items: [
        { name: 'Debt-to-Equity', value: '55%' },
        { name: 'Equity Ratio', value: '45%' }
      ],
      metrics: '97%'
    },
    collateralValue: {
      description: 'Assessment of assets pledged as security',
      items: [
        { name: 'LTV Ratio', value: '65%' },
        { name: 'Loan-to-Value', value: '<70%' }
      ],
      metrics: '97%'
    },
    marketConditions: {
      description: 'Assessment of industry specific factors',
      items: [
        { name: 'Industry Growth', value: 'Rising' },
        { name: 'Market Cycles', value: 'Positive' }
      ],
      metrics: '93%'
    },
    managementAssessment: {
      description: 'Evaluation of business management and viability',
      items: [
        { name: 'Time in Business', value: '7 years' },
        { name: 'Management Experience', value: '11+ years' }
      ],
      metrics: '92%'
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Function to get proper color for score bars
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 65) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Function to get text color for scores
  const getTextColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div>
      {/* Top navigation */}
      <div className="flex flex-wrap border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center space-x-4 px-4">
          <button 
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Standard Risk Map
          </button>
          <button 
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Eva Risk Report
          </button>
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-primary-700 rounded-md hover:bg-primary-700"
          >
            RiskLab
          </button>
          <button 
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Eva Score
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar - Risk Categories */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <h3 className="text-lg font-medium text-blue-800">Unsecured Commercial Paper</h3>
              <p className="text-sm text-gray-500 mt-1">General credit application and intangible assets</p>
            </div>
            <nav className="p-3">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === 'all' 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <span className="mr-3">📊</span>
                    <span>Overview</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('credit')}
                    className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === 'credit' 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <span className="mr-3">💳</span>
                    <span>Credit</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('capacity')}
                    className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === 'capacity' 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <span className="mr-3">💼</span>
                    <span>Capacity</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('collateral')}
                    className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === 'collateral' 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <span className="mr-3">🏠</span>
                    <span>Collateral</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('capital')}
                    className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === 'capital' 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <span className="mr-3">💰</span>
                    <span>Capital</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('conditions')}
                    className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === 'conditions' 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <span className="mr-3">📈</span>
                    <span>Conditions</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('character')}
                    className={`w-full flex items-center text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === 'character' 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <span className="mr-3">👤</span>
                    <span>Character</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content - Risk Assessment Details */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Risk Assessment for {companyName}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Currently viewing <span className="text-blue-600 font-medium">All</span> category in <span className="text-blue-600 font-medium">unsecured</span> risk map
              </p>
            </div>

            {/* Overall Risk Profile */}
            <div className="mb-8 border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Overall Risk Profile</h3>
              <p className="text-sm text-gray-500 mb-4">Cumulative assessment of all risk categories</p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Risk Score</span>
                    <div className="flex items-center">
                      <span className={`text-lg font-bold ${getTextColor(scores.overallRisk)}`}>{scores.overallRisk}</span>
                      <span className="text-sm text-gray-500 ml-1">/100</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`${getScoreColor(scores.overallRisk)} h-2 rounded-full`} style={{ width: `${scores.overallRisk}%` }}></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Aggregate Score</span>
                    <span className="text-xs font-medium text-green-600">Strong</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Risk Rating</span>
                    <span className="text-xs font-medium text-green-600">Prime</span>
                  </div>
                  <div className="mt-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800">
                      View all metrics...
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Risk */}
            <div className="mb-8 border-b border-gray-200 pb-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Credit Risk</h3>
                  <p className="text-sm text-gray-500 mb-4">Assessment of credit history and payment behavior</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700"></span>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${getTextColor(scores.creditRisk)}`}>{scores.creditRisk}</span>
                        <span className="text-sm text-gray-500 ml-1">/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${getScoreColor(scores.creditRisk)} h-2 rounded-full`} style={{ width: `${scores.creditRisk}%` }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Business Credit Score</span>
                      <span className="text-xs font-medium text-green-600">850</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Personal Owner Score</span>
                      <span className="text-xs font-medium text-green-600">Prime</span>
                    </div>
                    <div className="mt-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        View all metrics...
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Repayment Capacity</h3>
                  <p className="text-sm text-gray-500 mb-4">Ability to meet financial obligations</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700"></span>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${getTextColor(scores.repaymentCapacity)}`}>{scores.repaymentCapacity}</span>
                        <span className="text-sm text-gray-500 ml-1">/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${getScoreColor(scores.repaymentCapacity)} h-2 rounded-full`} style={{ width: `${scores.repaymentCapacity}%` }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Debt Service Coverage</span>
                      <span className="text-xs font-medium text-green-600">1.6x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Debt-to-income</span>
                      <span className="text-xs font-medium text-green-600">&lt;30%</span>
                    </div>
                    <div className="mt-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        View all metrics...
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Capital Structure & Collateral Value */}
            <div className="mb-8 border-b border-gray-200 pb-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Capital Structure</h3>
                  <p className="text-sm text-gray-500 mb-4">Assessment of business assets and investments</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700"></span>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${getTextColor(scores.capitalStructure)}`}>{scores.capitalStructure}</span>
                        <span className="text-sm text-gray-500 ml-1">/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${getScoreColor(scores.capitalStructure)} h-2 rounded-full`} style={{ width: `${scores.capitalStructure}%` }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Debt-to-Equity</span>
                      <span className="text-xs font-medium text-green-600">55%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Equity Ratio</span>
                      <span className="text-xs font-medium text-green-600">45%</span>
                    </div>
                    <div className="mt-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        View all metrics...
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Collateral Value</h3>
                  <p className="text-sm text-gray-500 mb-4">Assessment of assets pledged as security</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700"></span>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${getTextColor(scores.collateralValue)}`}>{scores.collateralValue}</span>
                        <span className="text-sm text-gray-500 ml-1">/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${getScoreColor(scores.collateralValue)} h-2 rounded-full`} style={{ width: `${scores.collateralValue}%` }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">LTV Ratio</span>
                      <span className="text-xs font-medium text-green-600">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Loan-to-Value</span>
                      <span className="text-xs font-medium text-green-600">&lt;70%</span>
                    </div>
                    <div className="mt-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        View all metrics...
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Conditions & Management Assessment */}
            <div className="mb-8 border-b border-gray-200 pb-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Market Conditions</h3>
                  <p className="text-sm text-gray-500 mb-4">Assessment of industry specific factors</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700"></span>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${getTextColor(scores.marketConditions)}`}>{scores.marketConditions}</span>
                        <span className="text-sm text-gray-500 ml-1">/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${getScoreColor(scores.marketConditions)} h-2 rounded-full`} style={{ width: `${scores.marketConditions}%` }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Industry Growth</span>
                      <span className="text-xs font-medium text-green-600">Rising</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Market Cycles</span>
                      <span className="text-xs font-medium text-green-600">Positive</span>
                    </div>
                    <div className="mt-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        View all metrics...
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Management Assessment</h3>
                  <p className="text-sm text-gray-500 mb-4">Evaluation of business management and viability</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700"></span>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${getTextColor(scores.managementAssessment)}`}>{scores.managementAssessment}</span>
                        <span className="text-sm text-gray-500 ml-1">/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${getScoreColor(scores.managementAssessment)} h-2 rounded-full`} style={{ width: `${scores.managementAssessment}%` }}></div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Time in Business</span>
                      <span className="text-xs font-medium text-green-600">7 years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Management Experience</span>
                      <span className="text-xs font-medium text-green-600">11+ years</span>
                    </div>
                    <div className="mt-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        View all metrics...
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EVA AI Analysis */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Eva AI Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">
                Based on the AI analysis, this application shows strong performance across all major credit factors with minimal risk indicators.
              </p>
            </div>

            {/* Actions & Recommendations */}
            <div className="mt-8">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Actions & Recommendations</h3>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-blue-100 rounded-full mr-2 mt-1"></span>
                  <div>
                    <p className="text-sm font-medium text-blue-800">AI Recommendation</p>
                    <p className="text-sm text-gray-600">Approve with standard terms based on excellent credit profile</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="inline-block w-4 h-4 bg-green-100 rounded-full mr-2 mt-1"></span>
                  <div>
                    <p className="text-sm font-medium text-green-800">Compliance Check</p>
                    <p className="text-sm text-gray-600">All compliance requirements are within regulatory guidelines</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium">
                  Generate Risk Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskLab;
