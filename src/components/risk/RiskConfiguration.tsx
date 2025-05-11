import React, { useState } from 'react';
import {
  useRiskConfig,
  RiskFactorWeight,
  RiskLevel,
  RiskConfigType,
} from '../../contexts/RiskConfigContext';

const RiskConfiguration: React.FC = () => {
  const {
    riskFactors,
    setRiskFactors,
    collateralCoverage,
    setCollateralCoverage,
    guarantorStrength,
    setGuarantorStrength,
    riskAppetite,
    setRiskAppetite,
    riskAppetiteLevels,
    configType,
    setConfigType,
    loadConfigForType,
    saveRiskConfiguration,
    resetToDefaults,
  } = useRiskConfig();

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);

  const handleFactorWeightChange = (id: string, newValue: number) => {
    const updatedFactors = riskFactors.map(factor =>
      factor.id === id ? { ...factor, weight: newValue } : factor
    );

    // Calculate total weight
    const totalWeight = updatedFactors.reduce((sum, factor) => sum + factor.weight, 0);

    // Normalize weights to ensure they sum to 100
    if (totalWeight !== 100) {
      const normalizedFactors = updatedFactors.map(factor => ({
        ...factor,
        weight: Math.round((factor.weight / totalWeight) * 100),
      }));
      setRiskFactors(normalizedFactors);
    } else {
      setRiskFactors(updatedFactors);
    }
  };

  const handleConfigTypeChange = (type: RiskConfigType) => {
    if (type !== configType) {
      loadConfigForType(type);
    }
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    setSaveSuccess(null);

    try {
      const success = await saveRiskConfiguration();
      setSaveSuccess(success);
    } catch (error) {
      setSaveSuccess(false);
      console.error('Error saving risk configuration:', error);
    } finally {
      setIsSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(null);
      }, 3000);
    }
  };

  const getCurrentRiskLevel = () => {
    if (riskAppetite < 20) return riskAppetiteLevels[0];
    if (riskAppetite < 40) return riskAppetiteLevels[1];
    if (riskAppetite < 60) return riskAppetiteLevels[2];
    if (riskAppetite < 80) return riskAppetiteLevels[3];
    return riskAppetiteLevels[4];
  };

  const currentRiskLevel = getCurrentRiskLevel();

  // Function to get the title based on config type
  const getConfigTitle = () => {
    switch (configType) {
      case 'real_estate':
        return 'For Real Estate Credit App';
      case 'equipment_vehicles':
        return 'For Equipment & Vehicles Credit App';
      default:
        return 'General';
    }
  };

  return (
    <div className="space-y-8">
      {/* Risk Configuration Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Risk Configuration Dashboard</h2>

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
          Customize your lending risk parameters to align with your institution's goals and
          appetite.
        </p>
      </div>

      {/* Configuration Type Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Score And Report</h3>
        <p className="text-sm text-gray-500 mb-4">
          Depending on whether it's an equipment or a real estate loan, a 5th category will be added
          based on the loan type.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div
            className={`flex-1 rounded-lg p-4 text-center cursor-pointer border-2 transition-all ${
              configType === 'general'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
            onClick={() => handleConfigTypeChange('general')}
          >
            <h4 className="font-semibold">General</h4>
          </div>

          <div
            className={`flex-1 rounded-lg p-4 text-center cursor-pointer border-2 transition-all ${
              configType === 'real_estate'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
            onClick={() => handleConfigTypeChange('real_estate')}
          >
            <h4 className="font-semibold">For Real Estate Credit App</h4>
          </div>

          <div
            className={`flex-1 rounded-lg p-4 text-center cursor-pointer border-2 transition-all ${
              configType === 'equipment_vehicles'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
            onClick={() => handleConfigTypeChange('equipment_vehicles')}
          >
            <h4 className="font-semibold">For Equipment & Vehicles Credit App</h4>
          </div>
        </div>
      </div>

      {/* Risk Balance Weighting Tool */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Risk Balance Weighting Tool - {getConfigTitle()}
        </h3>
        <p className="text-gray-600 mb-6">
          Adjust the relative importance of different risk factors in your assessment model. The
          total weight will automatically be normalized to 100%.
        </p>

        <div className="space-y-6">
          {riskFactors.map(factor => (
            <div key={factor.id} className="space-y-2">
              <div className="flex justify-between">
                <div>
                  <label htmlFor={factor.id} className="font-medium text-gray-700">
                    {factor.name}
                  </label>
                  <p className="text-sm text-gray-500">{factor.description}</p>
                </div>
                <span className="font-medium text-primary-600">{factor.weight}%</span>
              </div>
              <input
                id={factor.id}
                type="range"
                min="0"
                max="100"
                value={factor.weight}
                onChange={e => handleFactorWeightChange(factor.id, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Collateral Importance Slider */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Collateral Importance</h3>
        <p className="text-gray-600 mb-6">
          Define the importance of collateral in your lending decisions on a scale of 0-100%.
        </p>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">0% (Low Importance)</span>
            <span className="font-medium text-primary-600">{collateralCoverage}%</span>
            <span className="text-sm text-gray-500">100% (High Importance)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={collateralCoverage}
            onChange={e => setCollateralCoverage(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />

          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">
              Current Collateral Setting: {collateralCoverage}%
            </h4>
            <p className="text-sm text-gray-600">
              {collateralCoverage < 33
                ? 'Low importance: Less emphasis on collateral value, focusing more on other factors like cash flow and credit history.'
                : collateralCoverage < 66
                  ? 'Balanced importance: Moderate emphasis on collateral as one of several important factors in lending decisions.'
                  : 'High importance: Strong emphasis on collateral value, requiring substantial assets to secure loans.'}
            </p>
          </div>
        </div>
      </div>

      {/* Guarantor Strength Slider */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Guarantor Strength</h3>
        <p className="text-gray-600 mb-6">
          Set the required strength of guarantors for lending approvals on a scale of 0-100%.
        </p>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">0% (Minimal Requirements)</span>
            <span className="font-medium text-primary-600">{guarantorStrength}%</span>
            <span className="text-sm text-gray-500">100% (Stringent Requirements)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={guarantorStrength}
            onChange={e => setGuarantorStrength(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />

          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">
              Current Guarantor Setting: {guarantorStrength}%
            </h4>
            <p className="text-sm text-gray-600">
              {guarantorStrength < 33
                ? "Minimal requirements: Limited reliance on guarantors, focusing instead on borrower's primary qualifications and assets."
                : guarantorStrength < 66
                  ? 'Moderate requirements: Guarantors should have good credit and reasonable financial strength to support the borrower.'
                  : 'Stringent requirements: Strong emphasis on guarantor quality, requiring substantial financial strength and impeccable credit.'}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Appetite Level Slider */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Appetite Level</h3>
        <p className="text-gray-600 mb-6">
          Define your organization's overall risk tolerance for lending decisions.
        </p>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Conservative</span>
            <span className="text-sm text-gray-500">Moderate</span>
            <span className="text-sm text-gray-500">Balanced</span>
            <span className="text-sm text-gray-500">Aggressive</span>
            <span className="text-sm text-gray-500">Very Aggressive</span>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex">
              {riskAppetiteLevels.map(level => (
                <div key={level.id} className={`h-2 ${level.color} flex-1`} />
              ))}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={riskAppetite}
              onChange={e => setRiskAppetite(parseInt(e.target.value))}
              className="relative w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer z-10"
              style={{ WebkitAppearance: 'none', appearance: 'none' }}
            />
          </div>

          <div
            className="mt-6 p-4 rounded-md"
            style={{
              backgroundColor: `rgba(${currentRiskLevel.id === 'conservative' ? '59, 130, 246' : currentRiskLevel.id === 'moderate' ? '16, 185, 129' : currentRiskLevel.id === 'balanced' ? '245, 158, 11' : currentRiskLevel.id === 'aggressive' ? '249, 115, 22' : '239, 68, 68'}, 0.1)`,
            }}
          >
            <h4 className="font-medium text-gray-800 mb-2">
              Current Setting: {currentRiskLevel.level}
            </h4>
            <p className="text-sm text-gray-600">{currentRiskLevel.description}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSaveConfiguration}
          disabled={isSaving}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
};

export default RiskConfiguration;
