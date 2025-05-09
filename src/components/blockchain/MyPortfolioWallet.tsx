import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import or define necessary types
interface TokenBalance {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  icon?: string;
}

interface SmartContract {
  id: string;
  name: string;
  description: string;
  language: 'python' | 'solidity';
  functions: {
    name: string;
    description: string;
    params: {
      name: string;
      type: string;
      description: string;
    }[];
  }[];
  deployedAt: string;
}

interface MyPortfolioWalletProps {
  userId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  // Add the missing props passed from BlockchainWidget
  walletBalance: number;
  walletAddress: string;
  tokenBalances: TokenBalance[];
  smartContracts: SmartContract[];
  onExecuteContract: (contractId: string, functionName: string, params: any) => Promise<any>;
  onTransferFunds: (amount: number, to: string) => Promise<any>;
}

const MyPortfolioWallet: React.FC<MyPortfolioWalletProps> = ({
  userId,
  isOpen = false,
  onClose,
  walletBalance,
  walletAddress,
  tokenBalances,
  smartContracts,
  onExecuteContract,
  onTransferFunds,
}) => {
  const [assets, setAssets] = useState<
    Array<{ id: string; name: string; balance: string; tokenId: string }>
  >([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock wallet connection
  const connectWallet = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAssets([
        { id: '1', name: 'Commercial Paper Token', balance: '50,000', tokenId: 'CPT-001' },
        { id: '2', name: 'Equipment Finance Token', balance: '75,000', tokenId: 'EFT-002' },
      ]);
      setIsConnected(true);
      setIsLoading(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Portfolio Wallet</h2>
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

        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">$125,000.00</p>
            </div>

            <div>
              <h3 className="text-md font-medium mb-2">Your Assets</h3>
              <div className="space-y-2">
                {assets.map(asset => (
                  <div key={asset.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-gray-500">Token ID: {asset.tokenId}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${asset.balance}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <Link
                to="/blockchain/marketplace"
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Marketplace
              </Link>
              <button className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Transfer Assets
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-500">Connecting wallet...</p>
              </div>
            ) : (
              <div>
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-1">Connect Your Wallet</p>
                <p className="text-gray-500 mb-4">
                  Connect your wallet to view your blockchain assets
                </p>
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

export default MyPortfolioWallet;
