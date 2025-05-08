import React, { useState } from 'react';

export interface BlockchainVerificationStatus {
  isVerified: boolean;
  transactionHash?: string;
  blockNumber?: number;
  timestamp?: string;
  network: 'ethereum' | 'polygon' | 'avalanche' | 'solana' | 'hedera' | 'internal';
  proofOfWork?: {
    difficulty: number;
    nonce: string;
    hashRate: string;
    verificationTime: string;
  };
  ownershipHistory?: {
    owner: string;
    stake: number;
    from: string;
    to?: string;
  }[];
  lienStatus?: {
    hasLien: boolean;
    lienHolder?: string;
    lienAmount?: number;
    lienDate?: string;
    lienExpiration?: string;
    uccFilingNumber?: string;
  };
}

interface BlockchainVerificationProps {
  asset: {
    id: string;
    name: string;
    type: string;
    value: number;
  };
  onVerify: () => Promise<BlockchainVerificationStatus>;
  verificationStatus?: BlockchainVerificationStatus;
}

const BlockchainVerification: React.FC<BlockchainVerificationProps> = ({ 
  asset, 
  onVerify,
  verificationStatus
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [currentVerificationStatus, setCurrentVerificationStatus] = useState<BlockchainVerificationStatus | undefined>(verificationStatus);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);
    setVerificationProgress(0);
    
    // Simulate verification progress
    const progressInterval = setInterval(() => {
      setVerificationProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 200);
    
    try {
      // Actual verification
      const result = await onVerify();
      setCurrentVerificationStatus(result);
      setVerificationProgress(100);
    } catch (err) {
      setError('Verification failed. Please try again.');
      console.error('Verification error:', err);
    } finally {
      clearInterval(progressInterval);
      setIsVerifying(false);
    }
  };

  const getNetworkName = (network: string) => {
    switch (network) {
      case 'ethereum': return 'Ethereum Mainnet';
      case 'polygon': return 'Polygon Network';
      case 'avalanche': return 'Avalanche C-Chain';
      case 'solana': return 'Solana';
      case 'hedera': return 'Hedera Hashgraph';
      case 'internal': return 'EVA Private Chain';
      default: return network;
    }
  };
  
  const getNetworkIcon = (network: string) => {
    switch (network) {
      case 'ethereum': return '⟠';
      case 'polygon': return '⬡';
      case 'avalanche': return '🔺';
      case 'solana': return '◎';
      case 'hedera': return 'ℏ';
      case 'internal': return '🔒';
      default: return '🔗';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Blockchain Verification</h3>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-700">
              Proof of Work verification creates an immutable record of your asset on the blockchain. This provides:
            </p>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tamper-proof ownership history
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Real-time lien status tracking
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cryptographic proof of existence and authenticity
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Asset Details</h4>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Asset Name</p>
              <p className="font-medium">{asset.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Asset Type</p>
              <p className="font-medium">{asset.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Asset ID</p>
              <p className="font-medium text-xs font-mono">{asset.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Value</p>
              <p className="font-medium">${asset.value.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      {currentVerificationStatus ? (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Verification Successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>This asset has been successfully verified on the blockchain using Proof of Work consensus.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Blockchain Record</h4>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Network</p>
                  <p className="font-medium flex items-center">
                    <span className="mr-1">{getNetworkIcon(currentVerificationStatus.network)}</span>
                    {getNetworkName(currentVerificationStatus.network)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Timestamp</p>
                  <p className="font-medium">{currentVerificationStatus.timestamp}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Transaction Hash</p>
                  <p className="font-mono text-xs break-all bg-gray-50 p-2 rounded">
                    {currentVerificationStatus.transactionHash}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Block Number</p>
                  <p className="font-medium">{currentVerificationStatus.blockNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Verification Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {currentVerificationStatus.proofOfWork && (
            <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Proof of Work Details</h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-gray-500">Difficulty</p>
                    <p className="font-medium">{currentVerificationStatus.proofOfWork.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Hash Rate</p>
                    <p className="font-medium">{currentVerificationStatus.proofOfWork.hashRate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Verification Time</p>
                    <p className="font-medium">{currentVerificationStatus.proofOfWork.verificationTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Nonce</p>
                    <p className="font-medium font-mono text-xs">{currentVerificationStatus.proofOfWork.nonce}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentVerificationStatus.ownershipHistory && currentVerificationStatus.ownershipHistory.length > 0 && (
            <div className="rounded-lg border border-gray-200 overflow-hidden mb-6">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Ownership History</h4>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {currentVerificationStatus.ownershipHistory.map((record, index) => (
                    <div key={index} className="flex items-center">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm">{record.owner}</p>
                        <p className="text-xs text-gray-500">
                          {record.from} {record.to ? `to ${record.to}` : '(current)'}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {record.stake}% Ownership
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {currentVerificationStatus.lienStatus && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-900">Lien Status</h4>
              </div>
              <div className="p-4">
                {currentVerificationStatus.lienStatus.hasLien ? (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Active Lien
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div>
                        <p className="text-gray-500">Lien Holder</p>
                        <p className="font-medium">{currentVerificationStatus.lienStatus.lienHolder}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Lien Amount</p>
                        <p className="font-medium">${currentVerificationStatus.lienStatus.lienAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Filing Date</p>
                        <p className="font-medium">{currentVerificationStatus.lienStatus.lienDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expiration</p>
                        <p className="font-medium">{currentVerificationStatus.lienStatus.lienExpiration}</p>
                      </div>
                      {currentVerificationStatus.lienStatus.uccFilingNumber && (
                        <div className="col-span-2">
                          <p className="text-gray-500">UCC Filing Number</p>
                          <p className="font-medium">{currentVerificationStatus.lienStatus.uccFilingNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">No active liens</p>
                      <p className="mt-1 text-sm text-green-700">
                        This asset has been verified to be free of liens or encumbrances.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-8">
          {isVerifying ? (
            <div className="text-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 max-w-md mx-auto">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${verificationProgress}%` }}></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Verification</h3>
              <p className="text-sm text-gray-600 mb-4">
                Creating a blockchain record with Proof of Work consensus...
              </p>
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 rounded-md bg-primary-50 text-primary-700">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Calculating proof of work: {Math.round(verificationProgress)}%</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <svg className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verify This Asset</h3>
              <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
                Press the button below to create an immutable blockchain record of this asset using 
                Proof of Work consensus. This process will verify ownership history, lien status,
                and create cryptographic proof of authenticity.
              </p>
              
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleVerify}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
              >
                Start Blockchain Verification
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BlockchainVerification; 