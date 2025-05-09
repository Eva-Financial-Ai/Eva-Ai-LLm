import React, { useState } from 'react';

interface AssetPressFeatureProps {
  onAssetPress: (assetData: AssetPressData) => Promise<void>;
  className?: string;
}

export interface AssetPressData {
  assetName: string;
  assetType: 'invoice' | 'commercialPaper' | 'bond' | 'receivable' | 'realEstate';
  tokenType: 'NFT' | 'STO' | 'fungible';
  amount: number;
  maturityDate?: Date;
  description: string;
}

const AssetPressFeature: React.FC<AssetPressFeatureProps> = ({ onAssetPress, className = '' }) => {
  const [assetData, setAssetData] = useState<AssetPressData>({
    assetName: '',
    assetType: 'commercialPaper',
    tokenType: 'fungible',
    amount: 0,
    description: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAssetData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    setAssetData(prev => ({
      ...prev,
      maturityDate: date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await onAssetPress(assetData);
      // Reset form after successful submission
      setAssetData({
        assetName: '',
        assetType: 'commercialPaper',
        tokenType: 'fungible',
        amount: 0,
        description: '',
      });
    } catch (error) {
      console.error('Error pressing asset:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Asset Press</h2>
        <div className="flex items-center">
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            Beta Feature
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Tokenize your commercial assets into blockchain-based tokens for improved liquidity and
        trading.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
            <input
              type="text"
              name="assetName"
              value={assetData.assetName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="e.g. Commercial Paper Series A"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
            <select
              name="assetType"
              value={assetData.assetType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="commercialPaper">Commercial Paper</option>
              <option value="bond">Bond</option>
              <option value="invoice">Invoice</option>
              <option value="receivable">Account Receivable</option>
              <option value="realEstate">Real Estate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Token Type</label>
            <select
              name="tokenType"
              value={assetData.tokenType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="fungible">Fungible Token</option>
              <option value="NFT">Non-Fungible Token (NFT)</option>
              <option value="STO">Security Token (STO)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              name="amount"
              value={assetData.amount || ''}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>

          {showAdvanced && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maturity Date (if applicable)
                </label>
                <input
                  type="date"
                  name="maturityDate"
                  value={
                    assetData.maturityDate ? assetData.maturityDate.toISOString().split('T')[0] : ''
                  }
                  onChange={handleDateChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={assetData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Add details about this asset..."
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-medium 
                ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
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
                  Processing...
                </span>
              ) : (
                'Tokenize Asset'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AssetPressFeature;
