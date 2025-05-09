import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
interface Asset {
  id: string;
  tokenId: string;
  name: string;
  type:
    | 'real_estate'
    | 'equipment'
    | 'vehicle'
    | 'intellectual_property'
    | 'account_receivable'
    | 'inventory'
    | 'other';
  value: number;
  description: string;
  acquisitionDate: Date;
  blockchainTxId: string;
  blockchainNetwork: 'ethereum' | 'polygon' | 'avalanche' | 'solana' | 'hedera' | 'internal';
  documents: string[];
  metadataUri: string;
}

interface DebtInstrument {
  id: string;
  tokenId: string;
  name: string;
  type: 'loan' | 'bond' | 'note' | 'line_of_credit' | 'lease' | 'other';
  value: number;
  interestRate: number;
  term: number; // months
  issuanceDate: Date;
  maturityDate: Date;
  description: string;
  blockchainTxId: string;
  blockchainNetwork: 'ethereum' | 'polygon' | 'avalanche' | 'solana' | 'hedera' | 'internal';
  documents: string[];
  metadataUri: string;
}

interface Transaction {
  id: string;
  date: Date;
  type: 'acquisition' | 'disposal' | 'issuance' | 'payment' | 'transfer' | 'other';
  assetId?: string;
  debtId?: string;
  amount: number;
  description: string;
  blockchainTxId: string;
  blockchainNetwork: 'ethereum' | 'polygon' | 'avalanche' | 'solana' | 'hedera' | 'internal';
}

interface PortfolioWalletProps {
  userId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

// Component
const PortfolioWallet: React.FC<PortfolioWalletProps> = ({ userId, isOpen = false, onClose }) => {
  const [balance, setBalance] = useState<string>('0.00');
  const [assets, setAssets] = useState<
    Array<{ id: string; name: string; amount: string; value: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Placeholder for future blockchain integration
  const connectWallet = () => {
    setIsLoading(true);
    // Mock loading state
    setTimeout(() => {
      setBalance('125,000.00');
      setAssets([
        { id: 'asset-1', name: 'Commercial Paper A', amount: '50,000', value: '50,000.00' },
        { id: 'asset-2', name: 'Equipment Loan B', amount: '75,000', value: '75,000.00' },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Portfolio Wallet</h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg mb-4">
          <div className="text-gray-500 text-sm mb-1">Portfolio Balance</div>
          <div className="text-2xl font-bold text-gray-900">${balance}</div>
        </div>

        {assets.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-900">Your Assets</h3>
            <div className="space-y-2">
              {assets.map(asset => (
                <div key={asset.id} className="border rounded-lg p-3 bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-gray-500">Amount: {asset.amount}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${asset.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-500">Connecting wallet...</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">Connect your wallet to view your assets</p>
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioWallet;
