import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Owner {
  id: string;
  name: string;
  type: 'individual' | 'entity';
  ownershipPercentage: string;
  email: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'invited' | 'completed' | 'expired' | null;
  lastVerificationDate?: Date;
}

interface PlaidAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution: string;
  ownerId: string;
}

interface PlaidStatement {
  id: string;
  month: string;
  dateGenerated: string;
  url: string;
  accounts: string[];
  type?: string;
}

interface PlaidOwnerVerificationProps {
  owners: Owner[];
  onOwnersUpdate: (updatedOwners: Owner[]) => void;
  onAccountsConnected: (accounts: PlaidAccount[]) => void;
  onStatementsReceived: (statements: PlaidStatement[]) => void;
}

const PlaidOwnerVerification: React.FC<PlaidOwnerVerificationProps> = ({
  owners,
  onOwnersUpdate,
  onAccountsConnected,
  onStatementsReceived
}) => {
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [plaidLinkToken, setPlaidLinkToken] = useState<string | null>(null);
  const [isPlaidLoading, setIsPlaidLoading] = useState(false);
  const [statementPeriod, setStatementPeriod] = useState('6');
  const [currentVerifyingOwner, setCurrentVerifyingOwner] = useState<Owner | null>(null);
  const [completedOwners, setCompletedOwners] = useState<string[]>([]);
  
  // Initialize Plaid for current owner
  const initializePlaidForOwner = async (owner: Owner) => {
    setIsPlaidLoading(true);
    setCurrentVerifyingOwner(owner);
    
    try {
      // This would call your backend to generate a link token
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock link token generation
      setPlaidLinkToken('link-sandbox-mock-token-' + Math.random().toString(36).substring(2, 15));
      setIsPlaidLoading(false);
    } catch (error) {
      console.error('Error initializing Plaid:', error);
      setIsPlaidLoading(false);
    }
  };
  
  // Launch Plaid Link
  const openPlaidLink = () => {
    if (!plaidLinkToken || !currentVerifyingOwner) return;
    
    // In a real implementation, this would launch the Plaid Link UI
    // For now, simulating a successful connection
    setTimeout(() => {
      // Mock connected accounts
      const ownerId = currentVerifyingOwner.id;
      const mockAccounts: PlaidAccount[] = [
        { 
          id: `acc-${uuidv4()}`, 
          name: 'Business Checking', 
          type: 'checking', 
          balance: 25430.21, 
          institution: 'Chase',
          ownerId
        },
        { 
          id: `acc-${uuidv4()}`, 
          name: 'Business Savings', 
          type: 'savings', 
          balance: 158750.82, 
          institution: 'Chase',
          ownerId
        },
        { 
          id: `acc-${uuidv4()}`, 
          name: 'Business Line of Credit', 
          type: 'credit', 
          balance: -15000, 
          institution: 'Chase',
          ownerId
        }
      ];
      
      // Generate mock statements based on current date
      const today = new Date();
      const isPast15th = today.getDate() > 15;
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      const mockStatements: PlaidStatement[] = [];
      
      // Last 6 months of statements
      for (let i = 0; i < parseInt(statementPeriod); i++) {
        const statementMonth = new Date(currentYear, currentMonth - i, 1);
        mockStatements.push({
          id: `stmt-${uuidv4()}`,
          month: statementMonth.toLocaleString('default', { month: 'long', year: 'numeric' }),
          dateGenerated: new Date().toISOString(),
          url: '#',
          accounts: mockAccounts.map(acc => acc.id)
        });
      }
      
      // Add month-to-date if past 15th
      if (isPast15th) {
        mockStatements.unshift({
          id: `stmt-mtd-${uuidv4()}`,
          month: `${today.toLocaleString('default', { month: 'long', year: 'numeric' })} (MTD)`,
          dateGenerated: new Date().toISOString(),
          url: '#',
          accounts: mockAccounts.map(acc => acc.id),
          type: 'mtd'
        });
      }
      
      // Update completed owners
      setCompletedOwners(prev => [...prev, currentVerifyingOwner.id]);
      
      // Update owner verification status
      const updatedOwners = owners.map(owner => {
        if (owner.id === currentVerifyingOwner.id) {
          return {
            ...owner,
            isVerified: true,
            verificationStatus: 'completed' as const,
            lastVerificationDate: new Date()
          };
        }
        return owner;
      });
      
      // Callbacks
      onOwnersUpdate(updatedOwners);
      onAccountsConnected(mockAccounts);
      onStatementsReceived(mockStatements);
      
      // Reset current owner
      setCurrentVerifyingOwner(null);
      setPlaidLinkToken(null);
      
    }, 1500);
  };
  
  // Handle owner selection
  const toggleOwnerSelection = (ownerId: string) => {
    setSelectedOwners(prev => 
      prev.includes(ownerId) 
        ? prev.filter(id => id !== ownerId) 
        : [...prev, ownerId]
    );
  };
  
  // Start verification process
  const startVerification = () => {
    setIsVerifying(true);
    
    // Find the first non-verified owner
    const nextOwner = owners.find(owner => 
      selectedOwners.includes(owner.id) && 
      !completedOwners.includes(owner.id)
    );
    
    if (nextOwner) {
      initializePlaidForOwner(nextOwner);
    }
  };
  
  // Send verification invites to owners
  const sendVerificationInvites = () => {
    const updatedOwners = owners.map(owner => {
      if (selectedOwners.includes(owner.id) && owner.verificationStatus !== 'completed') {
        return {
          ...owner,
          verificationStatus: 'invited' as const
        };
      }
      return owner;
    });
    
    onOwnersUpdate(updatedOwners);
    alert(`Verification invites sent to ${selectedOwners.length} owners.`);
  };
  
  // Get verification status label and color
  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      case 'invited':
        return { label: 'Invited', color: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { label: 'Verified', color: 'bg-green-100 text-green-800' };
      case 'expired':
        return { label: 'Expired', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Not Started', color: 'bg-gray-100 text-gray-800' };
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-md border border-light-border mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Bank Account Verification</h3>
        
        {!isVerifying && (
          <div className="flex items-center space-x-2">
            <select
              value={statementPeriod}
              onChange={(e) => setStatementPeriod(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
              <option value="12">Last 12 months</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Select business owners who need to verify their identity and connect bank accounts.
          This is required for regulatory compliance and loan processing.
        </p>
      </div>
      
      {isVerifying && currentVerifyingOwner ? (
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">Verifying: {currentVerifyingOwner.name}</h4>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Connecting bank accounts for {currentVerifyingOwner.name} ({currentVerifyingOwner.ownershipPercentage}% ownership)
            </p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>Institution data will be securely retrieved through Plaid.</p>
            </div>
            
            <button
              type="button"
              onClick={plaidLinkToken ? openPlaidLink : () => initializePlaidForOwner(currentVerifyingOwner)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
              disabled={isPlaidLoading}
            >
              {isPlaidLoading ? 'Loading...' : plaidLinkToken ? 'Connect Accounts' : 'Initialize Plaid'}
            </button>
          </div>
          
          {completedOwners.length > 0 && completedOwners.length < selectedOwners.length && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Verified {completedOwners.length} of {selectedOwners.length} selected owners</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${(completedOwners.length / selectedOwners.length) * 100}%` }} 
                ></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedOwners.length === owners.length}
                      onChange={() => {
                        if (selectedOwners.length === owners.length) {
                          setSelectedOwners([]);
                        } else {
                          setSelectedOwners(owners.map(owner => owner.id));
                        }
                      }}
                      className="mr-2"
                    />
                    Owner
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ownership %
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Verified
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {owners.map(owner => {
                  const status = getStatusLabel(owner.verificationStatus);
                  return (
                    <tr key={owner.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedOwners.includes(owner.id)}
                            onChange={() => toggleOwnerSelection(owner.id)}
                            className="mr-2"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                            <div className="text-xs text-gray-500">{owner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {owner.ownershipPercentage}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                        {owner.lastVerificationDate 
                          ? new Date(owner.lastVerificationDate).toLocaleDateString() 
                          : 'Never'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between">
            <div className="text-sm text-gray-500">
              {selectedOwners.length > 0 
                ? `${selectedOwners.length} owners selected for verification` 
                : 'Select owners to verify'}
            </div>
            
            <div className="space-x-3">
              <button
                type="button"
                onClick={sendVerificationInvites}
                className="border border-primary-600 text-primary-600 px-4 py-2 rounded-md hover:bg-primary-50"
                disabled={selectedOwners.length === 0}
              >
                Send Verification Invites
              </button>
              <button
                type="button"
                onClick={startVerification}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                disabled={selectedOwners.length === 0}
              >
                Start Verification Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaidOwnerVerification; 