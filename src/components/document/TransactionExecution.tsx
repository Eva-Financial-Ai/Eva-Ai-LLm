import React, { useState, useEffect } from 'react';
import { useWorkflow } from '../../contexts/WorkflowContext';
import WrittenPasswordVerification from './WrittenPasswordVerification';
import CovenantManager from './CovenantManager';

interface TransactionExecutionProps {
  transactionId?: string;
}

interface PartyDistribution {
  id: string;
  name: string;
  role: string;
  amount: number;
  status: 'pending' | 'complete' | 'failed';
  accountNumber: string;
}

const TransactionExecution: React.FC<TransactionExecutionProps> = ({ 
  transactionId 
}) => {
  const { currentTransaction, fetchTransactions } = useWorkflow();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'documents' | 'blockchain' | 'covenants' | 'shield'>('blockchain');
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [fundsDistributed, setFundsDistributed] = useState(false);
  const [distributingFunds, setDistributingFunds] = useState(false);
  const [distributions, setDistributions] = useState<PartyDistribution[]>([]);
  const [showCovenantManager, setShowCovenantManager] = useState(false);
  const [covenants, setCovenants] = useState<any[]>([]);
  
  const effectiveTransactionId = transactionId || currentTransaction?.id || 'TX-102';
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!currentTransaction) {
          await fetchTransactions();
        }
        
        // Demo distributions - would come from API in real app
        const demoDistributions: PartyDistribution[] = [
          {
            id: 'party-1',
            name: 'Horizon Manufacturing Inc.',
            role: 'Borrower',
            amount: 1000000,
            status: 'pending',
            accountNumber: '****3456'
          },
          {
            id: 'party-2',
            name: 'Tech-One Solutions LLC',
            role: 'Vendor',
            amount: 950000,
            status: 'pending',
            accountNumber: '****7890'
          },
          {
            id: 'party-3',
            name: 'EVA Financial Services',
            role: 'Lender Fee',
            amount: 25000,
            status: 'pending',
            accountNumber: '****1234'
          },
          {
            id: 'party-4',
            name: 'Capital Brokers Inc.',
            role: 'Broker Fee',
            amount: 15000,
            status: 'pending',
            accountNumber: '****5678'
          },
          {
            id: 'party-5',
            name: 'Title Guarantee Group',
            role: 'Title Insurance',
            amount: 10000,
            status: 'pending',
            accountNumber: '****9012'
          }
        ];
        
        setDistributions(demoDistributions);
      } catch (err) {
        console.error('Error loading transaction execution data:', err);
        setError('Failed to load transaction data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentTransaction, fetchTransactions]);
  
  const handleVerificationSuccess = () => {
    setShowPasswordVerification(false);
    setVerificationComplete(true);
    
    // Show success notification
    // In a real app, this would be a proper toast notification
    console.log('Verification successful! Transaction is now ready for funding.');
  };
  
  const distributeFunds = async () => {
    if (!verificationComplete) {
      setShowPasswordVerification(true);
      return;
    }
    
    setDistributingFunds(true);
    
    // Simulate API call to distribute funds
    setTimeout(() => {
      // Update distribution statuses
      const updatedDistributions = distributions.map(dist => ({
        ...dist,
        status: 'complete' as const
      }));
      
      setDistributions(updatedDistributions);
      setFundsDistributed(true);
      setDistributingFunds(false);
      
      // Log blockchain verification
      console.log('All funds distributed and verified on blockchain');
      console.log('Transaction complete: TX Hash: 0x8ba1f109e5d9bd42fb3c83506a4e5e250d09a02a82e942c903f73ea3bee916c7');
    }, 3000);
  };
  
  // Handle saving covenants
  const handleSaveCovenants = (savedCovenants: any[]) => {
    setCovenants(savedCovenants);
    setShowCovenantManager(false);
    
    // Here you would typically save the covenants to your backend
    console.log('Saved covenants:', savedCovenants);
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction Execution</h1>
            <p className="text-sm text-gray-600">Generate, sign, and securely store transaction documents on blockchain</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700">Transaction ID</div>
              <div className="text-sm text-gray-900">TX-{effectiveTransactionId}</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('documents')}
              className={`mr-8 py-4 px-1 ${
                activeTab === 'documents'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } font-medium text-sm transition-colors duration-200`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab('blockchain')}
              className={`mr-8 py-4 px-1 ${
                activeTab === 'blockchain'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } font-medium text-sm transition-colors duration-200`}
            >
              Blockchain Verification
            </button>
            <button
              onClick={() => setActiveTab('covenants')}
              className={`mr-8 py-4 px-1 ${
                activeTab === 'covenants'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } font-medium text-sm transition-colors duration-200`}
            >
              Covenants
            </button>
            <button
              onClick={() => setActiveTab('shield')}
              className={`py-4 px-1 ${
                activeTab === 'shield'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } font-medium text-sm transition-colors duration-200`}
            >
              Shield Vault
            </button>
          </nav>
        </div>
        
        {/* Blockchain Verification Tab Content */}
        {activeTab === 'blockchain' && (
          <div>
            <div className="mb-6">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Blockchain verification creates an immutable record of your contract terms and covenants. This provides a tamper-proof way to ensure contract integrity and enables automated covenant monitoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Verify on Blockchain</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-4">
                  Secure your transaction with post-quantum cryptography verification before blockchain recording.
                </p>
                
                {verificationComplete ? (
                  <div className="rounded-md bg-green-50 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Written password verification complete!
                        </p>
                        <p className="mt-2 text-sm text-green-700">
                          Your transaction is now ready for fund distribution.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md bg-yellow-50 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-800">
                          Verification required
                        </p>
                        <p className="mt-2 text-sm text-yellow-700">
                          You need a written password from a portfolio manager to verify this transaction.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => verificationComplete ? distributeFunds() : setShowPasswordVerification(true)}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {verificationComplete ? 'Distribute Funds' : 'Verify Written Password'}
                </button>
              </div>
            </div>
            
            {/* Fund Distribution Section */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Fund Distribution</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-4">
                  Once verification is complete, funds will be distributed to all parties involved in the transaction.
                </p>
                
                <div className="overflow-hidden rounded-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Party
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {distributions.map((party) => (
                        <tr key={party.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {party.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {party.role}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            ${party.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {party.accountNumber}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {party.status === 'complete' ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Complete
                              </span>
                            ) : party.status === 'failed' ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Failed
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {distributingFunds && (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600 mr-3"></div>
                    <span className="text-sm text-gray-600">Distributing funds...</span>
                  </div>
                )}
                
                {fundsDistributed && (
                  <div className="mt-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Funds distribution complete!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>All funds have been distributed to the respective parties.</p>
                          <p className="mt-1">Transaction hash: <span className="font-mono text-xs">0x8ba1f109e5d9bd42fb3c83506a4e5e250d09a02a82e942c903f73ea3bee916c7</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Smart Contracts Information */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Smart Contracts</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-4">
                  Smart contracts automatically enforce covenant compliance and payment schedules.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Payment Schedule Contract</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Enforces monthly payment schedule for the entire duration of the loan term.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Financial Reporting Contract</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Enforces quarterly financial reporting with automatic notification system.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Collateral Monitoring Contract</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Pending
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Monitors collateral value and triggers alerts if value falls below predetermined threshold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Covenants Tab Content */}
        {activeTab === 'covenants' && (
          <div>
            <div className="mb-6">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Contract covenants define requirements and restrictions that the borrower must adhere to throughout the loan term. These help protect the lender's interests and ensure ongoing financial health of the borrower.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Contract Covenants</h2>
              <button
                type="button"
                onClick={() => setShowCovenantManager(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Manage Covenants
              </button>
            </div>
            
            {covenants.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {covenants.map((covenant, index) => (
                    <li key={covenant.id || index}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-primary-600 truncate">{covenant.name}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                {covenant.type}
                              </p>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {covenant.frequency}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {covenant.description}
                            </p>
                          </div>
                          {covenant.hasThreshold && covenant.threshold && (
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>Threshold: {covenant.threshold}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No covenants added</h3>
                <p className="mt-1 text-sm text-gray-500">Add covenants to define requirements for this transaction.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCovenantManager(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Covenants
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {activeTab === 'documents' && (
          <div className="py-12 text-center text-gray-500">
            <p>Documents tab content would appear here</p>
          </div>
        )}
        
        {activeTab === 'shield' && (
          <div className="py-12 text-center text-gray-500">
            <p>Shield Vault tab content would appear here</p>
          </div>
        )}
      </div>
      
      {/* Transaction sidebar with key information */}
      <div className="fixed right-4 top-24 w-64 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Transaction</h3>
          <p className="text-xs text-gray-500">TX-102</p>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Applicant</p>
              <p className="text-sm font-medium">Horizon Solutions Inc.</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-medium">Equipment Loan</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-sm font-medium">$1,000,000</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Approved Terms</p>
              <p className="text-sm font-medium">60 months @ 5.25%</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500">Term</p>
          <div className="mt-1 text-sm font-medium flex items-center justify-between">
            <span>60 months</span>
            <span className="text-right text-xs text-gray-500">Monthly: $19,326</span>
          </div>
        </div>
      </div>
      
      {/* Covenant Manager Modal */}
      <CovenantManager
        transactionId={effectiveTransactionId}
        onSave={handleSaveCovenants}
        onCancel={() => setShowCovenantManager(false)}
        isVisible={showCovenantManager}
      />
      
      {/* Written Password Verification Modal */}
      <WrittenPasswordVerification
        transactionId={effectiveTransactionId}
        onVerificationSuccess={handleVerificationSuccess}
        onCancel={() => setShowPasswordVerification(false)}
        isVisible={showPasswordVerification}
      />
    </div>
  );
};

export default TransactionExecution; 