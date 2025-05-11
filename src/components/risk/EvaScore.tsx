import React, { useState, useEffect } from 'react';
import EvaScoreLoader from './EvaScoreLoader';

interface ScoreCategory {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

interface ScoreBreakdown {
  overallScore: number;
  maxScore: number;
  rating: string;
  categories: ScoreCategory[];
  lastUpdated: string;
}

// Simplified score type options
type ScoreType = 'unsecured' | 'equipment' | 'real-estate' | 'debt-equity';

const EvaScore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'history'>('summary');
  const [loading, setLoading] = useState<boolean>(true);
  const [scoreType, setScoreType] = useState<ScoreType>('unsecured');
  
  // Add debug log to verify the component is being rendered
  console.log('EvaScore component rendering');

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Re-fetch data when score type changes
  useEffect(() => {
    setLoading(true);

    // Simulated API call based on selected score type
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [scoreType]);

  // Score type labels for display
  const scoreTypeLabels = {
    unsecured: 'Eva - Unsecured Commercial Paper Score',
    equipment: 'Eva - Commercial Equipment, Vehicles Paper Score',
    'real-estate': 'Eva - Commercial Real Estate & Land Paper Score',
    'debt-equity': 'Asset Back Collaterized Debt Equity Report',
  };

  // Mock data for Eva Score
  const scoreBreakdown: ScoreBreakdown = {
    overallScore: 725,
    maxScore: 850,
    rating: 'Good',
    lastUpdated: 'April 15, 2023',
    categories: [
      {
        id: 'credit',
        name: 'Credit History',
        score: 165,
        maxScore: 200,
        impact: 'high',
        description: 'Assessment of business and personal credit history.',
      },
      {
        id: 'capacity',
        name: 'Cash Flow Capacity',
        score: 140,
        maxScore: 200,
        impact: 'high',
        description: 'Evaluation of ability to service debt from operating cash flow.',
      },
      {
        id: 'collateral',
        name: 'Collateral Coverage',
        score: 120,
        maxScore: 150,
        impact: 'medium',
        description: 'Value and quality of assets offered as security.',
      },
      {
        id: 'capital',
        name: 'Capital Reserves',
        score: 110,
        maxScore: 150,
        impact: 'medium',
        description: 'Assessment of available capital and equity investment.',
      },
      {
        id: 'conditions',
        name: 'Market Conditions',
        score: 95,
        maxScore: 100,
        impact: 'low',
        description: 'Industry and economic factors affecting the business.',
      },
      {
        id: 'character',
        name: 'Management Experience',
        score: 95,
        maxScore: 100,
        impact: 'low',
        description: 'Assessment of management capability and character.',
      },
    ],
  };

  // Historical data for score trends
  const scoreHistory = [
    { date: 'Apr 2023', score: 725 },
    { date: 'Mar 2023', score: 715 },
    { date: 'Feb 2023', score: 705 },
    { date: 'Jan 2023', score: 690 },
    { date: 'Dec 2022', score: 675 },
    { date: 'Nov 2022', score: 670 },
  ];

  // Rating scale explanation
  const scoreRanges = [
    { range: '800-850', rating: 'Excellent', description: 'Minimal risk, highly favorable terms' },
    { range: '740-799', rating: 'Very Good', description: 'Low risk, favorable terms available' },
    { range: '670-739', rating: 'Good', description: 'Moderate risk, standard terms' },
    { range: '580-669', rating: 'Fair', description: 'Medium risk, may require additional review' },
    { range: '300-579', rating: 'Poor', description: 'High risk, limited funding options' },
  ];

  // Helper function to get color based on score
  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-teal-600 bg-teal-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Render selection options for score types
  const renderScoreTypeSelector = () => {
    return (
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-3">Score Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setScoreType('unsecured')}
              className={`px-3 py-2 text-sm rounded-md text-left ${
                scoreType === 'unsecured'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Eva - Unsecured Commercial Paper Score
            </button>
            <button
              onClick={() => setScoreType('equipment')}
              className={`px-3 py-2 text-sm rounded-md text-left ${
                scoreType === 'equipment'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Eva - Commercial Equipment, Vehicles Paper Score
            </button>
            <button
              onClick={() => setScoreType('real-estate')}
              className={`px-3 py-2 text-sm rounded-md text-left ${
                scoreType === 'real-estate'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Eva - Commercial Real Estate & Land Paper Score
            </button>
            <button
              onClick={() => setScoreType('debt-equity')}
              className={`px-3 py-2 text-sm rounded-md text-left ${
                scoreType === 'debt-equity'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Asset Back Collaterized Debt Equity Report
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render score gauge
  const renderScoreGauge = () => {
    const percentage = (scoreBreakdown.overallScore / scoreBreakdown.maxScore) * 100;

    return (
      <div className="relative pt-5 px-8 pb-8">
        <div className="flex flex-col items-center">
          {/* Score Display */}
          <div className="relative">
            <div className="text-6xl font-bold text-primary-600">{scoreBreakdown.overallScore}</div>
            <div className="absolute top-0 right-0 -mr-10 -mt-1 text-sm text-gray-400">
              /{scoreBreakdown.maxScore}
            </div>
          </div>

          <div className="mt-2 text-lg font-medium text-gray-700">
            Eva Score Rating: <span className="text-primary-600">{scoreBreakdown.rating}</span>
          </div>

          <div className="text-sm text-gray-500 mt-1">
            Last updated: {scoreBreakdown.lastUpdated}
          </div>

          {/* Score Gauge */}
          <div className="w-full mt-6">
            <div className="overflow-hidden h-3 mb-1 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600"
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>300</span>
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Very Good</span>
              <span>850</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render score breakdown
  const renderScoreBreakdown = () => {
    return (
      <div className="mt-6 px-4">
        <h3 className="font-medium text-gray-800 mb-4">Score Breakdown</h3>
        <div className="space-y-4">
          {scoreBreakdown.categories.map(category => (
            <div key={category.id} className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{category.name}</h4>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(category.score, category.maxScore)}`}
                >
                  {category.score}/{category.maxScore}
                </div>
              </div>

              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(category.score / category.maxScore) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-600"
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{category.description}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    category.impact === 'high'
                      ? 'bg-red-100 text-red-800'
                      : category.impact === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {category.impact.charAt(0).toUpperCase() + category.impact.slice(1)} Impact
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render score history
  const renderScoreHistory = () => {
    return (
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-4">Score History</h3>

        <div className="relative h-64 mb-6">
          {/* This would be a line chart in a real implementation */}
          <div className="absolute inset-0 flex items-end">
            {scoreHistory.map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">{point.score}</div>
                <div
                  className="w-full mx-1 bg-primary-600 rounded-t"
                  style={{ height: `${(point.score / 850) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">{point.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
          <h4 className="font-medium text-gray-700 mb-2">What Affects Your Score?</h4>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>Credit inquiries and new account applications</li>
            <li>Payment history and delinquencies</li>
            <li>Changes in debt utilization</li>
            <li>Business performance metrics</li>
            <li>Financial statement updates</li>
          </ul>
        </div>
      </div>
    );
  };

  // If loading, show the custom loader
  if (loading) {
    return <EvaScoreLoader />;
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Eva Score</h2>
        <p className="mt-1 text-sm text-gray-600">
          Comprehensive AI-powered creditworthiness score based on the 5C's framework
        </p>
      </div>

      {/* Score Type Selector */}
      {renderScoreTypeSelector()}

      {/* Score gauge visualization */}
      <div className="bg-white p-4">
        {renderScoreGauge()}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mt-4">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'summary'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'details'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detailed Breakdown
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Score History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-4">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              {renderScoreBreakdown()}

              {/* Rating Scale Explanation */}
              <div className="px-4 mt-6">
                <h3 className="font-medium text-gray-800 mb-4">Eva Score Rating Scale</h3>
                <div className="overflow-hidden bg-white shadow sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {scoreRanges.map((range, index) => (
                      <li key={index}>
                        <div className="px-4 py-3 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`mr-3 flex-shrink-0 h-4 w-4 rounded-full ${
                                  range.rating === 'Excellent'
                                    ? 'bg-green-400'
                                    : range.rating === 'Very Good'
                                      ? 'bg-teal-400'
                                      : range.rating === 'Good'
                                        ? 'bg-blue-400'
                                        : range.rating === 'Fair'
                                          ? 'bg-yellow-400'
                                          : 'bg-red-400'
                                }`}
                              ></div>
                              <p className="text-sm font-medium text-gray-700">
                                {range.rating} ({range.range})
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 text-sm text-gray-500">
                              {range.description}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && renderScoreBreakdown()}
          {activeTab === 'history' && renderScoreHistory()}
        </div>
      </div>
    </div>
  );
};

export default EvaScore;
