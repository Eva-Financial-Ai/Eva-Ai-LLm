import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { TokenBalance, SmartContract, ContractFunction } from './MyPortfolioTypes';

interface PortfolioNavigatorProps {
  // Props for verification mode
  onVerify?: (result: {
    verified: boolean;
    timestamp: string;
    blockchainTx: string;
  }) => void;
  documentId?: string;
  signatureData?: string;

  // Props for wallet mode
  walletBalance?: number;
  walletAddress?: string;
  tokenBalances?: TokenBalance[];
  smartContracts?: SmartContract[];
  onExecuteContract?: (contractId: string, functionName: string, params: any) => Promise<void>;
  onTransferFunds?: (amount: number, to: string) => Promise<void>;
  className?: string;
}

const PortfolioNavigator: React.FC<PortfolioNavigatorProps> = ({ 
  // Verification props
  onVerify, 
  documentId, 
  signatureData,
  // Wallet props
  walletBalance,
  walletAddress,
  tokenBalances = [],
  smartContracts = [],
  onExecuteContract,
  onTransferFunds,
  className = ''
}) => {
  const { userRole } = React.useContext(UserContext);
  const [walletStatus, setWalletStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [localWalletAddress, setLocalWalletAddress] = useState<string | null>(walletAddress || null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    timestamp: string;
    blockchainTx: string;
  } | null>(null);
  
  const [activeTab, setActiveTab] = useState<'assets' | 'contracts' | 'transactions'>('assets');
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<SmartContract | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<ContractFunction | null>(null);
  const [functionParams, setFunctionParams] = useState<Record<string, any>>({});
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [transferTo, setTransferTo] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Update state when wallet address changes from props
  useEffect(() => {
    if (walletAddress) {
      setLocalWalletAddress(walletAddress);
      setWalletStatus('connected');
    }
  }, [walletAddress]);

  // Simulate wallet connection
  const connectWallet = async () => {
    setWalletStatus('connecting');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock wallet address
    const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
    setLocalWalletAddress(mockAddress);
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
        blockchainTx: '0x' + Math.random().toString(16).substring(2, 66)
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
        blockchainTx: '0x' + Math.random().toString(16).substring(2, 66)
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

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Handle function parameter changes
  const handleParamChange = (paramName: string, value: string) => {
    setFunctionParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  // Execute smart contract function
  const handleExecuteFunction = async () => {
    if (!selectedContract || !selectedFunction || !onExecuteContract) return;
    
    setIsProcessing(true);
    try {
      await onExecuteContract(selectedContract.id, selectedFunction.name, functionParams);
      // Reset form
      setSelectedFunction(null);
      setFunctionParams({});
    } catch (error) {
      console.error('Error executing smart contract function:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Transfer funds
  const handleTransferFunds = async () => {
    if (!onTransferFunds) return;
    
    setIsProcessing(true);
    try {
      await onTransferFunds(transferAmount, transferTo);
      // Reset form
      setTransferAmount(0);
      setTransferTo('');
      setShowSendModal(false);
    } catch (error) {
      console.error('Error transferring funds:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine which view to show based on props
  const isWalletMode = walletBalance !== undefined && onExecuteContract !== undefined;
  
  // Verification mode UI
  const renderVerificationView = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Portfolio Navigator</h3>
      
      {walletStatus === 'disconnected' && (
        <div className="text-center py-4">
          <p className="mb-4 text-gray-600">Connect your wallet to verify signatures on the blockchain</p>
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
              {localWalletAddress?.substring(0, 6)}...{localWalletAddress?.substring((localWalletAddress?.length || 0) - 4)}
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
                <p className="break-all">
                  Transaction: {verificationResult.blockchainTx}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Wallet mode UI
  const renderWalletView = () => (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Wallet Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold mb-1">My Portfolio Smart Wallet</h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                {formatAddress(walletAddress || '')}
              </p>
              <button 
                className="text-white opacity-70 hover:opacity-100"
                onClick={() => navigator.clipboard.writeText(walletAddress || '')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Wallet Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(walletBalance || 0)}</p>
          </div>
        </div>
        
        <div className="flex mt-4 space-x-2">
          <button 
            className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-md text-sm font-medium"
            onClick={() => setShowSendModal(true)}
          >
            Send
          </button>
          <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-md text-sm font-medium">
            Receive
          </button>
        </div>
      </div>
      
      {/* Rest of wallet UI would go here */}
      <div className="p-4">
        <p className="text-gray-600">Wallet functionality enabled</p>
      </div>
    </div>
  );
  
  return isWalletMode ? renderWalletView() : renderVerificationView();
};

export default PortfolioNavigator; 