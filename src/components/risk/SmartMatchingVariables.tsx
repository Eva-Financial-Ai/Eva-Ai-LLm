import React, { useState } from 'react';

// Define types for smart matching variables
interface DealType {
  id: string;
  name: string;
  isActive: boolean;
}

interface DealSizeRange {
  min: number;
  max: number;
  sweetSpot: number;
}

interface GeographicPreference {
  state: string;
  isActive: boolean;
}

interface IndustryPreference {
  industry: string;
  strength: number;
}

interface MatchingPreferences {
  dealTypes: DealType[];
  dealSizeRange: DealSizeRange;
  geographicPreferences: GeographicPreference[];
  industryPreferences: IndustryPreference[];
  dealComplexityTolerance: 'Low' | 'Medium' | 'High';
  speedPriority: number;
  pricingCompetitiveness: number;
  documentationFlexibility: number;
}

interface RelationshipMatchingAlgorithm {
  relationshipWeightingFactor: number;
  performanceThreshold: number;
  recentSuccessBoost: boolean;
  relationshipLongevityFactor: {
    new: number;
    established: number;
    longTerm: number;
  };
  issueResolutionImpact: number;
  relationshipStatusMultipliers: {
    preferred: number;
    active: number;
    probation: number;
    inactive: number;
    terminated: number;
  };
}

interface TransactionHistoryAnalysis {
  similarDealSuccessFactor: number;
  transactionRecencyDecay: {
    last30Days: number;
    last90Days: number;
    last180Days: number;
    lastYear: number;
    older: number;
  };
  volumeBasedScoring: {
    highVolume: number;
    mediumVolume: number;
    lowVolume: number;
  };
  transactionSizeMatch: boolean;
  geographicPerformance: boolean;
}

interface FeedbackIntegrationSystem {
  clientFeedbackWeight: number;
  feedbackRecencyDecay: {
    last30Days: number;
    last90Days: number;
    last180Days: number;
    older: number;
  };
  specificDealTypeFeedback: boolean;
  continuousFeedbackThreshold: number;
  negativeFeedbackImpact: {
    severe: number;
    moderate: number;
    minor: number;
  };
}

interface FinancialInstrumentType {
  id: string;
  name: string;
  isSelected: boolean;
}

interface SmartMatchingConfiguration {
  financialInstrumentTypes: FinancialInstrumentType[];
  activeInstrumentType: string;
  matchingPreferences: MatchingPreferences;
  relationshipMatchingAlgorithm: RelationshipMatchingAlgorithm;
  transactionHistoryAnalysis: TransactionHistoryAnalysis;
  feedbackIntegrationSystem: FeedbackIntegrationSystem;
}

const SmartMatchingVariables: React.FC = () => {
  // Initial default values
  const defaultFinancialInstrumentTypes: FinancialInstrumentType[] = [
    { id: 'equipment_financing', name: 'Equipment Financing', isSelected: true },
    { id: 'commercial_real_estate', name: 'Commercial Real Estate', isSelected: false },
    { id: 'working_capital', name: 'Working Capital', isSelected: false },
    { id: 'invoice_factoring', name: 'Invoice Factoring', isSelected: false },
    { id: 'term_loan', name: 'Term Loan', isSelected: false },
    { id: 'construction', name: 'Construction', isSelected: false },
  ];

  // Part 1 - State definitions
  const [config, setConfig] = useState<SmartMatchingConfiguration>({
    financialInstrumentTypes: defaultFinancialInstrumentTypes,
    activeInstrumentType: 'equipment_financing',
    matchingPreferences: {
      dealTypes: [
        { id: 'equipment_financing', name: 'Equipment Financing', isActive: true },
        { id: 'commercial_real_estate', name: 'Commercial Real Estate', isActive: true },
        { id: 'construction', name: 'Construction', isActive: true },
      ],
      dealSizeRange: {
        min: 100000,
        max: 2500000,
        sweetSpot: 750000,
      },
      geographicPreferences: [
        { state: 'TX', isActive: true },
        { state: 'OK', isActive: true },
        { state: 'AR', isActive: true },
        { state: 'LA', isActive: true },
      ],
      industryPreferences: [
        { industry: 'Healthcare', strength: 9 },
        { industry: 'Manufacturing', strength: 8 },
        { industry: 'Professional Services', strength: 7 },
      ],
      dealComplexityTolerance: 'High',
      speedPriority: 8,
      pricingCompetitiveness: 7,
      documentationFlexibility: 6,
    },
    relationshipMatchingAlgorithm: {
      relationshipWeightingFactor: 25,
      performanceThreshold: 7.0,
      recentSuccessBoost: true,
      relationshipLongevityFactor: {
        new: 0.7,
        established: 0.9,
        longTerm: 1.0,
      },
      issueResolutionImpact: -0.15,
      relationshipStatusMultipliers: {
        preferred: 1.25,
        active: 1.0,
        probation: 0.6,
        inactive: 0.4,
        terminated: 0,
      },
    },
    transactionHistoryAnalysis: {
      similarDealSuccessFactor: 0.2,
      transactionRecencyDecay: {
        last30Days: 1.0,
        last90Days: 0.8,
        last180Days: 0.6,
        lastYear: 0.4,
        older: 0.2,
      },
      volumeBasedScoring: {
        highVolume: 0.15,
        mediumVolume: 0.1,
        lowVolume: 0.05,
      },
      transactionSizeMatch: true,
      geographicPerformance: true,
    },
    feedbackIntegrationSystem: {
      clientFeedbackWeight: 8,
      feedbackRecencyDecay: {
        last30Days: 1.0,
        last90Days: 0.75,
        last180Days: 0.5,
        older: 0.25,
      },
      specificDealTypeFeedback: true,
      continuousFeedbackThreshold: 5,
      negativeFeedbackImpact: {
        severe: -0.3,
        moderate: -0.15,
        minor: -0.05,
      },
    },
  });

  // State for UI
  const [activeTab, setActiveTab] = useState<
    'preferences' | 'relationship' | 'transaction' | 'feedback'
  >('preferences');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  // Update functions
  const handleInstrumentTypeSelect = (id: string) => {
    setConfig(prev => ({
      ...prev,
      activeInstrumentType: id,
      financialInstrumentTypes: prev.financialInstrumentTypes.map(type => ({
        ...type,
        isSelected: type.id === id,
      })),
    }));
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage for persistence
      localStorage.setItem('smart_matching_config', JSON.stringify(config));

      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render the Matching Preferences tab
  const renderMatchingPreferencesTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Deal Matching Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Deal Types */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Preferred Deal Types
              </label>
              <div className="flex flex-wrap gap-2">
                {config.matchingPreferences.dealTypes.map(dealType => (
                  <button
                    key={dealType.id}
                    className={`px-3 py-1 rounded-full text-sm ${
                      dealType.isActive
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                    onClick={() => {
                      setConfig(prev => ({
                        ...prev,
                        matchingPreferences: {
                          ...prev.matchingPreferences,
                          dealTypes: prev.matchingPreferences.dealTypes.map(dt =>
                            dt.id === dealType.id ? { ...dt, isActive: !dt.isActive } : dt
                          ),
                        },
                      }));
                    }}
                  >
                    {dealType.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Deal Size Range */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Deal Size Range</label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Minimum: {formatCurrency(config.matchingPreferences.dealSizeRange.min)}
                  </span>
                  <span>
                    Maximum: {formatCurrency(config.matchingPreferences.dealSizeRange.max)}
                  </span>
                </div>
                <div className="flex justify-center text-sm font-medium text-primary-600">
                  Sweet Spot: {formatCurrency(config.matchingPreferences.dealSizeRange.sweetSpot)}
                </div>
              </div>
            </div>

            {/* Geographic Preferences */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Geographic Preferences
              </label>
              <div className="flex flex-wrap gap-2">
                {config.matchingPreferences.geographicPreferences.map(geo => (
                  <button
                    key={geo.state}
                    className={`px-3 py-1 rounded-full text-sm ${
                      geo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                    }`}
                    onClick={() => {
                      setConfig(prev => ({
                        ...prev,
                        matchingPreferences: {
                          ...prev.matchingPreferences,
                          geographicPreferences: prev.matchingPreferences.geographicPreferences.map(
                            g => (g.state === geo.state ? { ...g, isActive: !g.isActive } : g)
                          ),
                        },
                      }));
                    }}
                  >
                    {geo.state}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Preferences */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Industry Preferences
              </label>
              <div className="space-y-2">
                {config.matchingPreferences.industryPreferences.map(industry => (
                  <div key={industry.industry} className="flex justify-between items-center">
                    <span className="text-sm">{industry.industry}</span>
                    <span className="text-sm font-medium text-primary-600">
                      Strength: {industry.strength}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deal Complexity Tolerance */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Deal Complexity Tolerance
              </label>
              <select
                className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                value={config.matchingPreferences.dealComplexityTolerance}
                onChange={e => {
                  setConfig(prev => ({
                    ...prev,
                    matchingPreferences: {
                      ...prev.matchingPreferences,
                      dealComplexityTolerance: e.target.value as 'Low' | 'Medium' | 'High',
                    },
                  }));
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Speed Priority */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">Speed Priority</label>
                <span className="text-sm font-medium text-primary-600">
                  {config.matchingPreferences.speedPriority}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={config.matchingPreferences.speedPriority}
                onChange={e => {
                  setConfig(prev => ({
                    ...prev,
                    matchingPreferences: {
                      ...prev.matchingPreferences,
                      speedPriority: parseInt(e.target.value),
                    },
                  }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            {/* Pricing Competitiveness */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Pricing Competitiveness
                </label>
                <span className="text-sm font-medium text-primary-600">
                  {config.matchingPreferences.pricingCompetitiveness}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={config.matchingPreferences.pricingCompetitiveness}
                onChange={e => {
                  setConfig(prev => ({
                    ...prev,
                    matchingPreferences: {
                      ...prev.matchingPreferences,
                      pricingCompetitiveness: parseInt(e.target.value),
                    },
                  }));
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the Relationship Matching tab
  const renderRelationshipMatchingTab = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Relationship Matching Algorithm
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Relationship Weighting Factor */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Relationship Weighting Factor
              </label>
              <span className="text-sm font-medium text-primary-600">
                {config.relationshipMatchingAlgorithm.relationshipWeightingFactor}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={config.relationshipMatchingAlgorithm.relationshipWeightingFactor}
              onChange={e => {
                setConfig(prev => ({
                  ...prev,
                  relationshipMatchingAlgorithm: {
                    ...prev.relationshipMatchingAlgorithm,
                    relationshipWeightingFactor: parseInt(e.target.value),
                  },
                }));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500">
              How heavily to weight relationship history in match scoring
            </p>
          </div>

          {/* Performance Threshold */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Performance Threshold
              </label>
              <span className="text-sm font-medium text-primary-600">
                {config.relationshipMatchingAlgorithm.performanceThreshold.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={config.relationshipMatchingAlgorithm.performanceThreshold}
              onChange={e => {
                setConfig(prev => ({
                  ...prev,
                  relationshipMatchingAlgorithm: {
                    ...prev.relationshipMatchingAlgorithm,
                    performanceThreshold: parseFloat(e.target.value),
                  },
                }));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500">
              Minimum performance score to consider a relationship
            </p>
          </div>

          {/* Recent Success Boost */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="recentSuccessBoost"
              checked={config.relationshipMatchingAlgorithm.recentSuccessBoost}
              onChange={e => {
                setConfig(prev => ({
                  ...prev,
                  relationshipMatchingAlgorithm: {
                    ...prev.relationshipMatchingAlgorithm,
                    recentSuccessBoost: e.target.checked,
                  },
                }));
              }}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="recentSuccessBoost" className="text-sm font-medium text-gray-700">
              Recent Success Boost
            </label>
          </div>
        </div>
      </div>
    );
  };

  // Render Transaction History Analysis tab
  const renderTransactionHistoryTab = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction History Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Similar Deal Success Factor */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Similar Deal Success Factor
              </label>
              <span className="text-sm font-medium text-primary-600">
                {config.transactionHistoryAnalysis.similarDealSuccessFactor.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.transactionHistoryAnalysis.similarDealSuccessFactor}
              onChange={e => {
                setConfig(prev => ({
                  ...prev,
                  transactionHistoryAnalysis: {
                    ...prev.transactionHistoryAnalysis,
                    similarDealSuccessFactor: parseFloat(e.target.value),
                  },
                }));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500">Boost for success with similar deals</p>
          </div>

          {/* Transaction Size Match & Geographic Performance */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="transactionSizeMatch"
                checked={config.transactionHistoryAnalysis.transactionSizeMatch}
                onChange={e => {
                  setConfig(prev => ({
                    ...prev,
                    transactionHistoryAnalysis: {
                      ...prev.transactionHistoryAnalysis,
                      transactionSizeMatch: e.target.checked,
                    },
                  }));
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="transactionSizeMatch" className="text-sm font-medium text-gray-700">
                Consider Transaction Size Match
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="geographicPerformance"
                checked={config.transactionHistoryAnalysis.geographicPerformance}
                onChange={e => {
                  setConfig(prev => ({
                    ...prev,
                    transactionHistoryAnalysis: {
                      ...prev.transactionHistoryAnalysis,
                      geographicPerformance: e.target.checked,
                    },
                  }));
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="geographicPerformance" className="text-sm font-medium text-gray-700">
                Consider Geographic Performance
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Feedback Integration tab
  const renderFeedbackIntegrationTab = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback Integration System</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Feedback Weight */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Client Feedback Weight
              </label>
              <span className="text-sm font-medium text-primary-600">
                {config.feedbackIntegrationSystem.clientFeedbackWeight}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={config.feedbackIntegrationSystem.clientFeedbackWeight}
              onChange={e => {
                setConfig(prev => ({
                  ...prev,
                  feedbackIntegrationSystem: {
                    ...prev.feedbackIntegrationSystem,
                    clientFeedbackWeight: parseInt(e.target.value),
                  },
                }));
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500">How heavily to weight client feedback</p>
          </div>

          {/* Specific Deal Type Feedback */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="specificDealTypeFeedback"
                checked={config.feedbackIntegrationSystem.specificDealTypeFeedback}
                onChange={e => {
                  setConfig(prev => ({
                    ...prev,
                    feedbackIntegrationSystem: {
                      ...prev.feedbackIntegrationSystem,
                      specificDealTypeFeedback: e.target.checked,
                    },
                  }));
                }}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="specificDealTypeFeedback"
                className="text-sm font-medium text-gray-700"
              >
                Segment Feedback by Deal Type
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Smart Matching Variables</h2>

          {/* Status message */}
          {saveSuccess !== null && (
            <div
              className={`text-sm px-3 py-1 rounded-md ${saveSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {saveSuccess ? 'Configuration saved successfully!' : 'Failed to save configuration'}
            </div>
          )}
        </div>
        <p className="text-gray-600">
          Configure matching criteria and weights for different financial instrument types.
        </p>
      </div>

      {/* Instrument Type Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          Select Financial Instrument Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {config.financialInstrumentTypes.map(instrumentType => (
            <button
              key={instrumentType.id}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                instrumentType.isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleInstrumentTypeSelect(instrumentType.id)}
            >
              {instrumentType.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'preferences'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Deal Matching Preferences
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'relationship'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('relationship')}
          >
            Relationship Matching
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'transaction'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('transaction')}
          >
            Transaction History
          </button>
          <button
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'feedback'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            Feedback Integration
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'preferences' && renderMatchingPreferencesTab()}
        {activeTab === 'relationship' && renderRelationshipMatchingTab()}
        {activeTab === 'transaction' && renderTransactionHistoryTab()}
        {activeTab === 'feedback' && renderFeedbackIntegrationTab()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 shadow-sm"
          onClick={() => {
            // Reset to defaults for the active instrument type
            if (
              window.confirm(
                'Are you sure you want to reset to defaults? This will discard all changes.'
              )
            ) {
              // In a real app, we would have default values for each instrument type
              // For this example, we'll just use the current values
              const savedConfig = localStorage.getItem('smart_matching_config');
              if (savedConfig) {
                setConfig(JSON.parse(savedConfig));
              }
            }
          }}
        >
          Reset to Defaults
        </button>

        <button
          className={`px-6 py-2 ${isSaving ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'} text-white rounded-md shadow-sm flex items-center`}
          onClick={handleSaveConfiguration}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            'Save Configuration'
          )}
        </button>
      </div>
    </div>
  );
};

export default SmartMatchingVariables;
