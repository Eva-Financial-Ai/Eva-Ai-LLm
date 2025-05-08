import React, { useState, useEffect } from 'react';
import { usePQCryptography } from './PQCryptographyProvider';
import WrittenPasswordVerification from './WrittenPasswordVerification';

interface PQCTransactionVerificationProps {
  transaction: any;
  onVerificationComplete: (success: boolean, transactionWithProof: any) => void;
  onCancel: () => void;
}

interface VerificationParty {
  id: string;
  name: string;
  role: string;
  publicKey: string;
}

interface VerificationStatus {
  sender: {
    verified: boolean;
    signature?: string;
    timestamp?: string;
  };
  receiver: {
    verified: boolean;
    signature?: string;
    timestamp?: string;
  };
  writtenPassword?: {
    verified: boolean;
    portfolioManagerId?: string;
    portfolioManagerName?: string;
    timestamp?: string;
  };
}

const PQCTransactionVerification: React.FC<PQCTransactionVerificationProps> = ({
  transaction,
  onVerificationComplete,
  onCancel
}) => {
  const { isReady, signData, verifySignature, verifyTransaction, sessionTimeRemaining } = usePQCryptography();
  
  const [currentRole, setCurrentRole] = useState<'sender' | 'receiver'>('sender');
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    sender: { verified: false },
    receiver: { verified: false }
  });
  
  // Determine if written password verification is required
  const isHighValueTransaction = transaction?.amount >= 100000;
  const [showWrittenPasswordVerification, setShowWrittenPasswordVerification] = useState(false);

  // Mock parties for this demonstration
  const [parties, setParties] = useState<{
    sender: VerificationParty;
    receiver: VerificationParty;
  }>({
    sender: {
      id: transaction.senderId || '1001',
      name: transaction.senderName || 'Financial Corp LLC',
      role: 'lender',
      publicKey: transaction.senderPublicKey || 'dilithium-pk-7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e'
    },
    receiver: {
      id: transaction.receiverId || '1002',
      name: transaction.receiverName || 'John Smith',
      role: 'borrower',
      publicKey: transaction.receiverPublicKey || 'dilithium-pk-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
    }
  });
  
  useEffect(() => {
    // If both parties have verified, check if written password is required
    if (verificationStatus.sender.verified && verificationStatus.receiver.verified) {
      if (isHighValueTransaction && !verificationStatus.writtenPassword?.verified) {
        setShowWrittenPasswordVerification(true);
      } else {
        // If no written password needed or it's already verified, complete the verification process
        completeVerification();
      }
    }
  }, [verificationStatus]);
  
  const completeVerification = () => {
    const verifiedTransaction = {
      ...transaction,
      verification: {
        sender: {
          signature: verificationStatus.sender.signature,
          timestamp: verificationStatus.sender.timestamp,
          publicKey: parties.sender.publicKey
        },
        receiver: {
          signature: verificationStatus.receiver.signature,
          timestamp: verificationStatus.receiver.timestamp,
          publicKey: parties.receiver.publicKey
        },
        writtenPassword: verificationStatus.writtenPassword,
        blockchainStatus: 'pending'
      }
    };
    
    onVerificationComplete(true, verifiedTransaction);
  };
  
  const handleSignTransaction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be handled by the user's secure wallet or HSM
      // For this demo, we'll simulate the signing process
      
      // Validate passphrase (in a real app, this would use the private key)
      if (passphrase !== 'quantum') {
        throw new Error('Invalid passphrase. Use "quantum" for this demo.');
      }
      
      // Create a string representation of the transaction to sign
      const transactionData = JSON.stringify({
        id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency || 'USD',
        type: transaction.type,
        timestamp: new Date().toISOString(),
        details: transaction.details || {},
        // Add any other relevant transaction data
      });
      
      // Mock private key (in a real app, this would be securely stored)
      const mockPrivateKey = currentRole === 'sender'
        ? 'dilithium-sk-7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e'
        : 'dilithium-sk-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b';
      
      // Sign the transaction data
      const signature = await signData(transactionData, mockPrivateKey);
      const timestamp = new Date().toISOString();
      
      // Update verification status
      setVerificationStatus(prev => ({
        ...prev,
        [currentRole]: {
          verified: true,
          signature,
          timestamp
        }
      }));
      
      // If sender is verifying, switch to receiver role
      if (currentRole === 'sender' && !verificationStatus.receiver.verified) {
        setCurrentRole('receiver');
        setPassphrase('');
      }
      
    } catch (err: any) {
      setError(err.message || 'Transaction signing failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleWrittenPasswordVerification = (success: boolean, verificationDetails: any) => {
    if (success) {
      setVerificationStatus(prev => ({
        ...prev,
        writtenPassword: {
          verified: true,
          portfolioManagerId: verificationDetails.portfolioManagerId,
          portfolioManagerName: verificationDetails.portfolioManagerName,
          timestamp: verificationDetails.timestamp
        }
      }));
      
      setShowWrittenPasswordVerification(false);
      
      // Complete the verification process
      setTimeout(() => {
        completeVerification();
      }, 500);
    } else {
      setError('Written password verification failed');
      setShowWrittenPasswordVerification(false);
    }
  };
  
  // Render loading spinner when PQC modules are initializing
  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Initializing quantum-resistant cryptography...</p>
        </div>
      </div>
    );
  }
  
  // Show written password verification if needed
  if (showWrittenPasswordVerification) {
    return (
      <WrittenPasswordVerification
        transactionId={transaction.id}
        onVerificationComplete={handleWrittenPasswordVerification}
        onCancel={() => setShowWrittenPasswordVerification(false)}
      />
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Post-Quantum Transaction Verification</h2>
        <p className="text-sm text-gray-500 mt-1">
          Both parties must cryptographically sign to approve this transaction
        </p>
        <div className="text-xs text-gray-400 mt-1">
          Session time remaining: {sessionTimeRemaining} seconds
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Transaction Details</h3>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="text-sm font-medium">{transaction.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-sm font-medium">${transaction.amount?.toLocaleString()}</p>
              {isHighValueTransaction && (
                <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Requires Written Password
                </span>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="text-sm font-medium">{transaction.type || 'Payment'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          {transaction.approvedDeal && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Approved Deal Terms</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Term</p>
                  <p className="font-medium">{transaction.approvedDeal.term} months</p>
                </div>
                <div>
                  <p className="text-gray-500">Rate</p>
                  <p className="font-medium">{transaction.approvedDeal.rate}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-medium">${transaction.approvedDeal.payment?.toLocaleString()}/mo</p>
                </div>
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className="font-medium">{transaction.approvedDeal.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-900 mb-2">Verification Status</h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          {/* Sender Verification */}
          <div className={`p-4 border-b border-gray-200 ${currentRole === 'sender' ? 'bg-blue-50' : ''}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{parties.sender.name}</span>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                    {parties.sender.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Using PQC Dilithium signatures</p>
              </div>
              
              {verificationStatus.sender.verified ? (
                <div className="flex items-center text-green-600">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                currentRole === 'sender' ? (
                  <span className="text-xs text-blue-600 font-medium">Current Signer</span>
                ) : (
                  <span className="text-xs text-yellow-600">Pending</span>
                )
              )}
            </div>
            
            {verificationStatus.sender.verified && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Signed: {new Date(verificationStatus.sender.timestamp || '').toLocaleString()}</p>
                <p className="font-mono text-xs mt-1 truncate">
                  Sig: {verificationStatus.sender.signature?.substring(0, 20)}...
                </p>
              </div>
            )}
          </div>
          
          {/* Receiver Verification */}
          <div className={`p-4 ${currentRole === 'receiver' ? 'bg-blue-50' : ''}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{parties.receiver.name}</span>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800">
                    {parties.receiver.role}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Using PQC Dilithium signatures</p>
              </div>
              
              {verificationStatus.receiver.verified ? (
                <div className="flex items-center text-green-600">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                currentRole === 'receiver' ? (
                  <span className="text-xs text-blue-600 font-medium">Current Signer</span>
                ) : (
                  <span className="text-xs text-yellow-600">Pending</span>
                )
              )}
            </div>
            
            {verificationStatus.receiver.verified && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Signed: {new Date(verificationStatus.receiver.timestamp || '').toLocaleString()}</p>
                <p className="font-mono text-xs mt-1 truncate">
                  Sig: {verificationStatus.receiver.signature?.substring(0, 20)}...
                </p>
              </div>
            )}
          </div>
          
          {/* Written Password Section */}
          {isHighValueTransaction && (
            <div className="p-4 border-t border-gray-200 bg-yellow-50">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">Portfolio Manager Verification</span>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Required
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Written password for high-value transaction</p>
                </div>
                
                {verificationStatus.writtenPassword?.verified ? (
                  <div className="flex items-center text-green-600">
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                ) : (
                  verificationStatus.sender.verified && verificationStatus.receiver.verified ? (
                    <span className="text-xs text-blue-600 font-medium">Next Step</span>
                  ) : (
                    <span className="text-xs text-yellow-600">Pending</span>
                  )
                )}
              </div>
              
              {verificationStatus.writtenPassword?.verified && (
                <div className="mt-2 text-xs text-gray-500">
                  <p>Verified by: {verificationStatus.writtenPassword.portfolioManagerName}</p>
                  <p>Time: {new Date(verificationStatus.writtenPassword.timestamp || '').toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Current Signer Action */}
      {(!verificationStatus.sender.verified || !verificationStatus.receiver.verified) && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 mb-2">
            {currentRole === 'sender' ? 'Lender Verification' : 'Borrower Verification'}
          </h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              {currentRole === 'sender'
                ? "As the lender, please verify and approve this transaction by signing with your quantum-resistant key."
                : "As the borrower, please verify and approve this transaction by signing with your quantum-resistant key."}
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="passphrase" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Passphrase
            </label>
            <input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter 'quantum' for this demo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              In a real app, this would use your hardware security module or secure wallet
            </p>
          </div>
          
          <button
            onClick={handleSignTransaction}
            disabled={loading || !passphrase}
            className={`w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                Signing Transaction...
              </span>
            ) : (
              'Sign & Approve Transaction'
            )}
          </button>
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        
        {verificationStatus.sender.verified && verificationStatus.receiver.verified && !isHighValueTransaction && (
          <button
            onClick={completeVerification}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Submit to Blockchain
          </button>
        )}
        
        {verificationStatus.sender.verified && verificationStatus.receiver.verified && isHighValueTransaction && !verificationStatus.writtenPassword?.verified && (
          <button
            onClick={() => setShowWrittenPasswordVerification(true)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Continue to Password Verification
          </button>
        )}
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>
          This transaction is secured with post-quantum cryptography.
          <br />
          <span className="font-mono">Using CRYSTALS-Dilithium signatures (NIST standardized)</span>
        </p>
      </div>
    </div>
  );
};

export default PQCTransactionVerification; 