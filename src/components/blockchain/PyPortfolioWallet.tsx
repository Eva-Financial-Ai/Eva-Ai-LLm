import React, { useState, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';

interface WalletProps {
  onVerify?: (result: { verified: boolean; timestamp: string; blockchainTx: string }) => void;
  documentId?: string;
  signatureData?: string;
}

const PyPortfolioWallet: React.FC<WalletProps> = ({ onVerify, documentId, signatureData }) => {
  const { userRole } = React.useContext(UserContext);
  const [walletStatus, setWalletStatus] = useState<'disconnected' | 'connecting' | 'connected'>(
    'disconnected'
  );
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    timestamp: string;
    blockchainTx: string;
  } | null>(null);

  // Simulate wallet connection
  const connectWallet = async () => {
    setWalletStatus('connecting');

    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock wallet address
    const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
    setWalletAddress(mockAddress);
    setWalletStatus('connected');
  };

  // Simulate verification of signature on blockchain
  const verifySignature = async () => {
    if (!documentId || !signatureData) {
      alert('No document or signature data to verify');
      return;
    }

    setVerificationInProgress(true);

    try {
      // Simulate blockchain verification process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful verification
      const result = {
        verified: true,
        timestamp: new Date().toISOString(),
        blockchainTx: '0x' + Math.random().toString(16).substring(2, 66),
      };

      setVerificationResult(result);

      // Call the callback if provided
      if (onVerify) {
        onVerify(result);
      }
    } catch (error) {
      console.error('Verification failed', error);
    } finally {
      setVerificationInProgress(false);
    }
  };

  // Submit signature to blockchain
  const submitSignatureToBlockchain = async () => {
    if (!documentId || !signatureData) {
      alert('No document or signature data to submit');
      return;
    }

    setVerificationInProgress(true);

    try {
      // Simulate blockchain submission process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful transaction
      const result = {
        verified: true,
        timestamp: new Date().toISOString(),
        blockchainTx: '0x' + Math.random().toString(16).substring(2, 66),
      };

      setVerificationResult(result);
      alert('Signature has been recorded on the blockchain');

      // Call the callback if provided
      if (onVerify) {
        onVerify(result);
      }
    } catch (error) {
      console.error('Submission failed', error);
    } finally {
      setVerificationInProgress(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Blockchain Verification</h3>

      {walletStatus === 'disconnected' && (
        <div className="text-center py-4">
          <p className="mb-4 text-gray-600">
            Connect your wallet to verify signatures on the blockchain
          </p>
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {walletStatus === 'connecting' && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to wallet...</p>
        </div>
      )}

      {walletStatus === 'connected' && (
        <div>
          <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium">Connected Wallet</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {walletAddress?.substring(0, 6)}...
              {walletAddress?.substring(walletAddress.length - 4)}
            </span>
          </div>

          {userRole === 'broker' || userRole === 'lender' ? (
            <div className="space-y-4">
              <button
                onClick={verifySignature}
                disabled={verificationInProgress}
                className={`w-full px-4 py-2 text-white rounded-md ${
                  verificationInProgress ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {verificationInProgress ? 'Verifying...' : 'Verify Signature on Blockchain'}
              </button>

              <button
                onClick={submitSignatureToBlockchain}
                disabled={verificationInProgress}
                className={`w-full px-4 py-2 text-white rounded-md ${
                  verificationInProgress ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {verificationInProgress ? 'Processing...' : 'Record Signature on Blockchain'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={submitSignatureToBlockchain}
                disabled={verificationInProgress}
                className={`w-full px-4 py-2 text-white rounded-md ${
                  verificationInProgress ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {verificationInProgress ? 'Processing...' : 'Sign Document on Blockchain'}
              </button>
            </div>
          )}

          {verificationResult && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <h4 className="text-sm font-medium text-green-800 mb-2">Verification Successful</h4>
              <div className="text-xs text-green-700 space-y-1">
                <p>Status: {verificationResult.verified ? 'Verified' : 'Failed'}</p>
                <p>Timestamp: {new Date(verificationResult.timestamp).toLocaleString()}</p>
                <p className="break-all">Transaction: {verificationResult.blockchainTx}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PyPortfolioWallet;
