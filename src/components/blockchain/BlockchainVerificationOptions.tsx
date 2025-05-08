import React, { useState } from 'react';
import { AssetClass } from '../../types/AssetClassTypes';

interface BlockchainVerificationProps {
  assetType: AssetClass;
  onChange: (data: any) => void;
}

interface BlockchainOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  transactionCost: string;
  confirmationTime: string;
  securityLevel: 'high' | 'medium' | 'standard';
}

// Blockchain options with varying costs and features
const blockchainOptions: BlockchainOption[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: '⟠',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Public blockchain with smart contracts and strong security',
    transactionCost: '$25-45',
    confirmationTime: '30-60 seconds',
    securityLevel: 'high'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    icon: '⬡',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Ethereum sidechain optimized for lower fees and faster transactions',
    transactionCost: '$0.05-0.10',
    confirmationTime: '5-10 seconds',
    securityLevel: 'medium'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    icon: '🔺',
    color: 'bg-red-100 text-red-800 border-red-200',
    description: 'High-throughput blockchain with low latency',
    transactionCost: '$0.50-1.00',
    confirmationTime: '1-2 seconds',
    securityLevel: 'high'
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: '◎',
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    description: 'High-performance blockchain with extremely low fees',
    transactionCost: '$0.01-0.02',
    confirmationTime: '<1 second',
    securityLevel: 'medium'
  },
  {
    id: 'hedera',
    name: 'Hedera',
    icon: 'ℏ',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Enterprise-grade public network with governance',
    transactionCost: '$0.01',
    confirmationTime: '3-5 seconds',
    securityLevel: 'high'
  },
  {
    id: 'eva_ledger',
    name: 'EVA Ledger (Private)',
    icon: '🔒',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    description: 'Private ledger optimized for enterprise asset management',
    transactionCost: 'Free',
    confirmationTime: '<1 second',
    securityLevel: 'standard'
  }
];

// Asset class recommendations for blockchain networks
const blockchainRecommendations: Record<AssetClass, string[]> = {
  [AssetClass.CASH_EQUIVALENTS]: ['eva_ledger', 'polygon'],
  [AssetClass.COMMERCIAL_PAPER_SECURED]: ['ethereum', 'hedera', 'eva_ledger'],
  [AssetClass.GOVERNMENT_BONDS]: ['ethereum', 'hedera', 'eva_ledger'],
  [AssetClass.CORPORATE_BONDS]: ['ethereum', 'hedera'],
  [AssetClass.EQUITIES]: ['ethereum', 'avalanche'],
  [AssetClass.MUTUAL_FUNDS]: ['eva_ledger', 'polygon'],
  [AssetClass.REAL_ESTATE]: ['ethereum', 'avalanche'],
  [AssetClass.COMMODITIES]: ['solana', 'polygon'],
  [AssetClass.CRYPTO]: ['ethereum', 'solana'],
  [AssetClass.DERIVATIVES]: ['ethereum', 'avalanche'],
  [AssetClass.PRIVATE_EQUITY]: ['ethereum', 'hedera', 'eva_ledger'],
  [AssetClass.FOREX]: ['solana', 'polygon'],
  [AssetClass.EQUIPMENT]: ['polygon', 'eva_ledger'],
  [AssetClass.VEHICLES]: ['polygon', 'eva_ledger'],
  [AssetClass.UNSECURED_COMMERCIAL_PAPER]: ['ethereum', 'hedera'],
  [AssetClass.INTELLECTUAL_PROPERTY]: ['ethereum', 'avalanche', 'hedera'],
  [AssetClass.DIGITAL_ASSETS]: ['ethereum', 'solana'],
  [AssetClass.OTHER]: ['eva_ledger', 'polygon', 'ethereum'],
};

const BlockchainVerificationOptions: React.FC<BlockchainVerificationProps> = ({ 
  assetType, 
  onChange 
}) => {
  const [selectedBlockchain, setSelectedBlockchain] = useState('eva_ledger');
  const [verificationFeatures, setVerificationFeatures] = useState({
    enableProofOfOwnership: true,
    enableUccLienTracking: false,
    enableSmartContracts: false,
    enableAutomaticDepreciation: false,
    enablePublicDisclosure: false
  });

  // Find recommended blockchains for this asset type
  const recommendations = blockchainRecommendations[assetType] || ['eva_ledger'];

  const handleBlockchainSelect = (blockchainId: string) => {
    setSelectedBlockchain(blockchainId);
    onChange({ blockchainNetwork: blockchainId });
  };

  const handleFeatureToggle = (feature: string) => {
    setVerificationFeatures(prev => {
      const newFeatures = { ...prev, [feature]: !prev[feature as keyof typeof prev] };
      onChange({ 
        verificationFeatures: newFeatures,
        verificationLevel: Object.values(newFeatures).filter(Boolean).length
      });
      return newFeatures;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select Blockchain Network</h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose the blockchain network for verifying and tracking your asset.
          {recommendations.length > 0 && (
            <span className="block mt-1">
              <span className="font-medium">Recommended for this asset type:</span>{' '}
              {recommendations.map(r => {
                const option = blockchainOptions.find(o => o.id === r);
                return option ? option.name : r;
              }).join(', ')}
            </span>
          )}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {blockchainOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleBlockchainSelect(option.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedBlockchain === option.id
                  ? `border-2 ${option.color} shadow-sm`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`h-8 w-8 flex items-center justify-center rounded-full ${option.color.split(' ')[0]}`}>
                  <span className="text-lg">{option.icon}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{option.name}</h4>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">{option.description}</p>
              <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                <div>
                  <span className="text-gray-500">Cost:</span>{' '}
                  <span className="font-medium">{option.transactionCost}</span>
                </div>
                <div>
                  <span className="text-gray-500">Time:</span>{' '}
                  <span className="font-medium">{option.confirmationTime}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Security:</span>{' '}
                  <span className={`font-medium ${
                    option.securityLevel === 'high' ? 'text-green-600' : 
                    option.securityLevel === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                  }`}>
                    {option.securityLevel.charAt(0).toUpperCase() + option.securityLevel.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Features</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select the verification features to enable for this asset.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Proof of Ownership</h4>
              <p className="text-xs text-gray-500">Immutable record of ownership history</p>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${verificationFeatures.enableProofOfOwnership ? 'bg-indigo-600' : 'bg-gray-200'}
                `}
                onClick={() => handleFeatureToggle('enableProofOfOwnership')}
              >
                <span className="sr-only">Enable proof of ownership</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${verificationFeatures.enableProofOfOwnership ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">UCC Lien Tracking</h4>
              <p className="text-xs text-gray-500">Real-time tracking of liens and encumbrances</p>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${verificationFeatures.enableUccLienTracking ? 'bg-indigo-600' : 'bg-gray-200'}
                `}
                onClick={() => handleFeatureToggle('enableUccLienTracking')}
              >
                <span className="sr-only">Enable UCC lien tracking</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${verificationFeatures.enableUccLienTracking ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Smart Contract Integration</h4>
              <p className="text-xs text-gray-500">Enable programmable terms and conditions</p>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${verificationFeatures.enableSmartContracts ? 'bg-indigo-600' : 'bg-gray-200'}
                `}
                onClick={() => handleFeatureToggle('enableSmartContracts')}
              >
                <span className="sr-only">Enable smart contracts</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${verificationFeatures.enableSmartContracts ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Automatic Depreciation</h4>
              <p className="text-xs text-gray-500">Time-based value adjustment for applicable assets</p>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${verificationFeatures.enableAutomaticDepreciation ? 'bg-indigo-600' : 'bg-gray-200'}
                `}
                onClick={() => handleFeatureToggle('enableAutomaticDepreciation')}
              >
                <span className="sr-only">Enable automatic depreciation</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${verificationFeatures.enableAutomaticDepreciation ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Public Disclosure</h4>
              <p className="text-xs text-gray-500">Make asset visible on public blockchain explorers</p>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none
                  ${verificationFeatures.enablePublicDisclosure ? 'bg-indigo-600' : 'bg-gray-200'}
                `}
                onClick={() => handleFeatureToggle('enablePublicDisclosure')}
              >
                <span className="sr-only">Enable public disclosure</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${verificationFeatures.enablePublicDisclosure ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVerificationOptions; 