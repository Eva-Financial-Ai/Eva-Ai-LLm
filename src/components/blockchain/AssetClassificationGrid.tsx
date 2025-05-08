import React from 'react';
import { AssetClass, AssetClassNames } from '../../types/AssetClassTypes';

// Asset class icons (import from @heroicons/react if needed)
const assetClassIcons: Record<AssetClass, React.ReactNode> = {
  [AssetClass.CASH_EQUIVALENTS]: <span className="text-blue-500">💰</span>,
  [AssetClass.COMMERCIAL_PAPER_SECURED]: <span className="text-green-500">📄</span>,
  [AssetClass.GOVERNMENT_BONDS]: <span className="text-yellow-500">🏛️</span>,
  [AssetClass.CORPORATE_BONDS]: <span className="text-purple-500">🏢</span>,
  [AssetClass.EQUITIES]: <span className="text-red-500">📈</span>,
  [AssetClass.MUTUAL_FUNDS]: <span className="text-indigo-500">📊</span>,
  [AssetClass.REAL_ESTATE]: <span className="text-amber-500">🏠</span>,
  [AssetClass.COMMODITIES]: <span className="text-yellow-600">🌾</span>,
  [AssetClass.CRYPTO]: <span className="text-blue-600">₿</span>,
  [AssetClass.DERIVATIVES]: <span className="text-purple-600">🔄</span>,
  [AssetClass.PRIVATE_EQUITY]: <span className="text-green-600">🤝</span>,
  [AssetClass.FOREX]: <span className="text-blue-400">💱</span>,
  [AssetClass.EQUIPMENT]: <span className="text-gray-600">🔧</span>,
  [AssetClass.VEHICLES]: <span className="text-red-600">🚗</span>,
  [AssetClass.UNSECURED_COMMERCIAL_PAPER]: <span className="text-orange-500">📝</span>,
  [AssetClass.INTELLECTUAL_PROPERTY]: <span className="text-indigo-600">💡</span>,
  [AssetClass.DIGITAL_ASSETS]: <span className="text-cyan-500">🖥️</span>,
  [AssetClass.OTHER]: <span className="text-gray-500">❓</span>,
};

// Asset class descriptions
const assetClassDescriptions: Record<AssetClass, string> = {
  [AssetClass.CASH_EQUIVALENTS]: 'Cash and highly liquid short-term investments',
  [AssetClass.COMMERCIAL_PAPER_SECURED]: 'Short-term debt instruments backed by collateral',
  [AssetClass.GOVERNMENT_BONDS]: 'Debt securities issued by government entities',
  [AssetClass.CORPORATE_BONDS]: 'Debt securities issued by corporations',
  [AssetClass.EQUITIES]: 'Stocks and shares representing ownership',
  [AssetClass.MUTUAL_FUNDS]: 'Pooled investment vehicles including ETFs',
  [AssetClass.REAL_ESTATE]: 'Property and real estate assets',
  [AssetClass.COMMODITIES]: 'Raw materials and agricultural products',
  [AssetClass.CRYPTO]: 'Cryptocurrency and blockchain-based assets',
  [AssetClass.DERIVATIVES]: 'Financial contracts deriving value from underlying assets',
  [AssetClass.PRIVATE_EQUITY]: 'Investments in private companies',
  [AssetClass.FOREX]: 'Foreign currency holdings and investments',
  [AssetClass.EQUIPMENT]: 'Machinery, equipment, and industrial assets',
  [AssetClass.VEHICLES]: 'Cars, trucks, aircraft, and other vehicles',
  [AssetClass.UNSECURED_COMMERCIAL_PAPER]: 'Short-term debt without collateral backing',
  [AssetClass.INTELLECTUAL_PROPERTY]: 'Patents, copyrights, and other IP assets',
  [AssetClass.DIGITAL_ASSETS]: 'Non-crypto digital assets including NFTs',
  [AssetClass.OTHER]: 'Other asset types not classified above',
};

interface AssetClassificationGridProps {
  onSelect: (assetClass: AssetClass) => void;
  selectedAsset: AssetClass | null;
}

const AssetClassificationGrid: React.FC<AssetClassificationGridProps> = ({ 
  onSelect, 
  selectedAsset 
}) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Select the classification that best describes your asset to proceed with pressing.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.values(AssetClass).map((assetClass) => (
          <div
            key={assetClass}
            onClick={() => onSelect(assetClass)}
            className={`p-4 rounded-lg border cursor-pointer transition-all
              ${selectedAsset === assetClass 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex items-center justify-center bg-white rounded-full border border-gray-100 shadow-sm">
                {assetClassIcons[assetClass]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {AssetClassNames[assetClass]}
                </h3>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 line-clamp-2">
              {assetClassDescriptions[assetClass]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetClassificationGrid; 