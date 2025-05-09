import React, { useState, useEffect, lazy, Suspense } from 'react';
import TopNavigation from '../components/layout/TopNavigation';
import ShieldProtocolDetails from '../components/blockchain/ShieldProtocolDetails';
import ShieldVaultLoader from '../components/document/ShieldVaultLoader';

// Transaction status types
type TransactionStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// Transaction participant roles
type ParticipantRole = 'lender' | 'borrower' | 'broker' | 'vendor';

// Shield verification status
type VerificationStatus = 'pending' | 'in_progress' | 'verified' | 'failed';

// Shield protocol verification interface
interface ShieldVerification {
  id: string;
  type: 'proof_of_cash' | 'proof_of_debt' | 'proof_of_asset' | 'proof_of_license';
  status: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  details: Record<string, any>;
}

// Transaction participant interface
interface TransactionParticipant {
  id: string;
  name: string;
  role: ParticipantRole;
  email: string;
  phone?: string;
  organizationName?: string;
  kycStatus: VerificationStatus;
  kybStatus?: VerificationStatus;
  verified: boolean;
  verificationDetails?: ShieldVerification[];
}

// Transaction interface
interface Transaction {
  id: string;
  name: string;
  description?: string;
  transactionType: 'financing' | 'leasing' | 'loan' | 'commercial_paper';
  assetType?: 'real_estate' | 'equipment' | 'vehicle' | 'intellectual_property' | 'none';
  assetDetails?: Record<string, any>;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  participants: TransactionParticipant[];
  shieldVerifications: {
    proofOfCash: ShieldVerification;
    proofOfDebt: ShieldVerification;
    proofOfAsset?: ShieldVerification;
    proofOfLicense: ShieldVerification;
  };
  blockchainRecordId?: string;
  documents: {
    id: string;
    name: string;
    type: string;
    status: 'draft' | 'pending_signature' | 'signed' | 'completed';
    url: string;
    uploadedAt: string;
    signedAt?: string;
  }[];
  invoices: {
    id: string;
    recipientId: string;
    amount: number;
    status: 'draft' | 'sent' | 'paid';
    sentAt?: string;
    paidAt?: string;
    dueDate: string;
  }[];
}

const TransactionExecution: React.FC = () => {
  // State for transactions and selected transaction
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserRole, setCurrentUserRole] = useState<ParticipantRole>('lender');
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);
  // Add active tab state for navigation
  const [activeTab, setActiveTab] = useState<
    'documents' | 'blockchain_verification' | 'covenants' | 'shield_vault'
  >('documents');

  // Load transactions (mock data for now)
  useEffect(() => {
    // This would be replaced with an actual API call
    setTimeout(() => {
      const mockTransactions: Transaction[] = generateMockTransactions();
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Generate mock transaction data
  const generateMockTransactions = (): Transaction[] => {
    return [
      {
        id: 'txn-1',
        name: 'Commercial Real Estate Financing - Downtown Office',
        description:
          'Financing for the acquisition of a 10-story office building in the financial district',
        transactionType: 'financing',
        assetType: 'real_estate',
        assetDetails: {
          address: '123 Financial District Blvd, New York, NY 10005',
          squareFeet: 45000,
          yearBuilt: 2005,
        },
        amount: 12500000,
        status: 'in_progress',
        createdAt: '2023-08-15T10:30:00Z',
        updatedAt: '2023-08-20T14:45:00Z',
        participants: [
          {
            id: 'user-1',
            name: 'Capital Funding Partners LLC',
            role: 'lender',
            email: 'funding@capitalpartners.com',
            organizationName: 'Capital Funding Partners',
            kycStatus: 'verified',
            kybStatus: 'verified',
            verified: true,
            verificationDetails: [],
          },
          {
            id: 'user-2',
            name: 'Blackstone Enterprises',
            role: 'borrower',
            email: 'finance@blackstone.com',
            organizationName: 'Blackstone Enterprises Inc',
            kycStatus: 'verified',
            kybStatus: 'verified',
            verified: true,
            verificationDetails: [],
          },
          {
            id: 'user-3',
            name: 'John Smith',
            role: 'broker',
            email: 'john@commercialbrokers.com',
            organizationName: 'Commercial Brokers International',
            kycStatus: 'verified',
            kybStatus: 'verified',
            verified: true,
            verificationDetails: [],
          },
          {
            id: 'user-4',
            name: 'Downtown Properties LLC',
            role: 'vendor',
            email: 'sales@downtownproperties.com',
            organizationName: 'Downtown Properties LLC',
            kycStatus: 'verified',
            kybStatus: 'verified',
            verified: true,
            verificationDetails: [],
          },
        ],
        shieldVerifications: {
          proofOfCash: {
            id: 'ver-1',
            type: 'proof_of_cash',
            status: 'verified',
            verifiedAt: '2023-08-16T09:30:00Z',
            verifiedBy: 'Plaid API & Compliance Officer',
            details: {
              plaidVerificationId: 'plaid-ver-12345',
              accountType: 'business_checking',
              sufficientFunds: true,
            },
          },
          proofOfDebt: {
            id: 'ver-2',
            type: 'proof_of_debt',
            status: 'verified',
            verifiedAt: '2023-08-17T11:20:00Z',
            verifiedBy: 'Compliance System',
            details: {
              debtType: 'commercial_mortgage',
              underwritingComplete: true,
            },
          },
          proofOfAsset: {
            id: 'ver-3',
            type: 'proof_of_asset',
            status: 'verified',
            verifiedAt: '2023-08-18T10:15:00Z',
            verifiedBy: 'Title Company & Compliance Officer',
            details: {
              assetValue: 15000000,
              titleVerified: true,
              liensFree: true,
            },
          },
          proofOfLicense: {
            id: 'ver-4',
            type: 'proof_of_license',
            status: 'verified',
            verifiedAt: '2023-08-15T14:45:00Z',
            verifiedBy: 'Compliance Officer',
            details: {
              licenseType: 'commercial_broker',
              licenseNumber: 'CBL-123456',
              expirationDate: '2024-06-30',
            },
          },
        },
        blockchainRecordId: 'block-12345678',
        documents: [
          {
            id: 'doc-1',
            name: 'Purchase Agreement',
            type: 'agreement',
            status: 'signed',
            url: '/documents/purchase-agreement.pdf',
            uploadedAt: '2023-08-15T11:30:00Z',
            signedAt: '2023-08-17T09:45:00Z',
          },
          {
            id: 'doc-2',
            name: 'Loan Agreement',
            type: 'agreement',
            status: 'signed',
            url: '/documents/loan-agreement.pdf',
            uploadedAt: '2023-08-16T13:20:00Z',
            signedAt: '2023-08-17T14:30:00Z',
          },
          {
            id: 'doc-3',
            name: 'Property Appraisal',
            type: 'appraisal',
            status: 'completed',
            url: '/documents/property-appraisal.pdf',
            uploadedAt: '2023-08-15T15:45:00Z',
          },
        ],
        invoices: [
          {
            id: 'inv-1',
            recipientId: 'user-2',
            amount: 12500000,
            status: 'draft',
            dueDate: '2023-09-01',
          },
          {
            id: 'inv-2',
            recipientId: 'user-3',
            amount: 125000,
            status: 'draft',
            dueDate: '2023-08-30',
          },
        ],
      },
      // Additional mock transactions would be added here
    ];
  };

  // Function to determine the current user's role in a transaction
  const getUserRoleInTransaction = (transaction: Transaction): ParticipantRole | null => {
    // This would use the actual user ID from authentication context
    // For demo purposes, we'll just return the currently set role
    return currentUserRole;
  };

  // Handler for funding a transaction (Lender)
  const handleFundTransaction = async (transaction: Transaction) => {
    setActionInProgress(true);

    try {
      // This would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update transaction in state
      const updatedTransaction = {
        ...transaction,
        status: 'completed' as TransactionStatus,
        updatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        invoices: transaction.invoices.map(invoice => ({
          ...invoice,
          status: 'paid' as 'draft' | 'sent' | 'paid',
          paidAt: new Date().toISOString(),
        })),
      };

      setTransactions(transactions.map(t => (t.id === transaction.id ? updatedTransaction : t)));

      setSelectedTransaction(updatedTransaction);

      // Show success message
      alert('Transaction successfully funded! Funds have been disbursed to all parties.');
    } catch (error) {
      console.error('Error funding transaction:', error);
      alert('Failed to fund transaction. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Handler for requesting verification (Lender)
  const handleRequestVerification = async (transaction: Transaction) => {
    setActionInProgress(true);

    try {
      // This would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success message
      alert(
        'Verification request sent to compliance officer. You will be notified once the review is complete.'
      );
    } catch (error) {
      console.error('Error requesting verification:', error);
      alert('Failed to request verification. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Handler for releasing commission (Broker)
  const handleReleaseCommission = async (transaction: Transaction) => {
    setActionInProgress(true);

    try {
      // This would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update transaction in state - update relevant invoice
      const updatedTransaction = {
        ...transaction,
        updatedAt: new Date().toISOString(),
        invoices: transaction.invoices.map(invoice => {
          // Find broker invoice and mark as paid
          const brokerParticipant = transaction.participants.find(p => p.role === 'broker');
          if (brokerParticipant && invoice.recipientId === brokerParticipant.id) {
            return {
              ...invoice,
              status: 'paid' as 'draft' | 'sent' | 'paid',
              paidAt: new Date().toISOString(),
            };
          }
          return invoice;
        }),
      };

      setTransactions(transactions.map(t => (t.id === transaction.id ? updatedTransaction : t)));

      setSelectedTransaction(updatedTransaction);

      // Show success message
      alert('Commission successfully released! Payment has been initiated.');
    } catch (error) {
      console.error('Error releasing commission:', error);
      alert('Failed to release commission. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Handler for receiving funds (Borrower)
  const handleReceiveFunds = async (transaction: Transaction) => {
    setActionInProgress(true);

    try {
      // This would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update transaction in state
      const updatedTransaction = {
        ...transaction,
        updatedAt: new Date().toISOString(),
        // Update relevant fields to indicate funds received
      };

      setTransactions(transactions.map(t => (t.id === transaction.id ? updatedTransaction : t)));

      setSelectedTransaction(updatedTransaction);

      // Show success message
      alert('Receipt of funds confirmed! The transaction has been recorded on the blockchain.');
    } catch (error) {
      console.error('Error confirming receipt of funds:', error);
      alert('Failed to confirm receipt of funds. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Handler for paying vendor (Borrower)
  const handlePayVendor = async (transaction: Transaction) => {
    setActionInProgress(true);

    try {
      // This would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update transaction in state - find vendor invoice and mark as paid
      const updatedTransaction = {
        ...transaction,
        updatedAt: new Date().toISOString(),
        invoices: transaction.invoices.map(invoice => {
          const vendorParticipant = transaction.participants.find(p => p.role === 'vendor');
          if (vendorParticipant && invoice.recipientId === vendorParticipant.id) {
            return {
              ...invoice,
              status: 'paid' as 'draft' | 'sent' | 'paid',
              paidAt: new Date().toISOString(),
            };
          }
          return invoice;
        }),
      };

      setTransactions(transactions.map(t => (t.id === transaction.id ? updatedTransaction : t)));

      setSelectedTransaction(updatedTransaction);

      // Show success message
      alert('Vendor payment authorized! Payment has been initiated to the vendor.');
    } catch (error) {
      console.error('Error paying vendor:', error);
      alert('Failed to pay vendor. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Handler for confirming payment (Vendor)
  const handleConfirmPayment = async (transaction: Transaction) => {
    setActionInProgress(true);

    try {
      // This would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update transaction in state
      const updatedTransaction = {
        ...transaction,
        updatedAt: new Date().toISOString(),
        // Update relevant fields to indicate payment confirmed
      };

      setTransactions(transactions.map(t => (t.id === transaction.id ? updatedTransaction : t)));

      setSelectedTransaction(updatedTransaction);

      // Show success message
      alert('Payment receipt confirmed! The transaction has been recorded on the blockchain.');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Handler for sending invoices (Any role)
  const handleSendInvoices = async (transaction: Transaction) => {
    setActionInProgress(true);

    try {
      // This would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update transaction in state - update all invoices to 'sent' status
      const updatedTransaction = {
        ...transaction,
        updatedAt: new Date().toISOString(),
        invoices: transaction.invoices.map(invoice => ({
          ...invoice,
          status: invoice.status === 'draft' ? 'sent' : invoice.status,
          sentAt: invoice.status === 'draft' ? new Date().toISOString() : invoice.sentAt,
        })),
      };

      setTransactions(transactions.map(t => (t.id === transaction.id ? updatedTransaction : t)));

      setSelectedTransaction(updatedTransaction);

      // Show success message
      alert('Invoices have been generated and sent to all parties!');
    } catch (error) {
      console.error('Error sending invoices:', error);
      alert('Failed to send invoices. Please try again.');
    } finally {
      setActionInProgress(false);
    }
  };

  // Select a transaction
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  // Clear selected transaction
  const handleClearSelection = () => {
    setSelectedTransaction(null);
  };

  // Render function for the transactions list
  const renderTransactionsList = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading transactions...</p>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No active transactions found.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Transactions</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {transactions.map(transaction => (
            <li
              key={transaction.id}
              className={`hover:bg-gray-50 cursor-pointer ${selectedTransaction?.id === transaction.id ? 'bg-primary-50' : ''}`}
              onClick={() => handleSelectTransaction(transaction)}
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100'
                            : transaction.status === 'in_progress'
                              ? 'bg-blue-100'
                              : transaction.status === 'pending'
                                ? 'bg-yellow-100'
                                : 'bg-red-100'
                        }`}
                      >
                        {transaction.status === 'completed' ? (
                          <svg
                            className="h-6 w-6 text-green-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : transaction.status === 'in_progress' ? (
                          <svg
                            className="h-6 w-6 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : transaction.status === 'pending' ? (
                          <svg
                            className="h-6 w-6 text-yellow-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-6 w-6 text-red-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{transaction.name}</div>
                      <div className="text-sm text-gray-500">
                        {transaction.transactionType.replace('_', ' ')} - $
                        {transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render transaction details
  const renderTransactionDetails = () => {
    if (!selectedTransaction) {
      return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No transaction selected</p>
          <p className="text-sm text-gray-400 mt-2">
            Select a transaction from the list to view details
          </p>
        </div>
      );
    }

    const userRole = getUserRoleInTransaction(selectedTransaction);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
          <button onClick={handleClearSelection} className="text-gray-400 hover:text-gray-500">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Add the tab navigation here */}
        <div className="px-6 pt-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('blockchain_verification')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'blockchain_verification'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Blockchain Verification
              </button>
              <button
                onClick={() => setActiveTab('covenants')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'covenants'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Covenants
              </button>
              <button
                onClick={() => setActiveTab('shield_vault')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shield_vault'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Shield Vault
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Documents Tab (default) */}
          {activeTab === 'documents' && (
            <>
              {/* Basic information section */}
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-2">
                  Transaction Information
                </h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Transaction ID</p>
                      <p className="text-sm font-medium">{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-sm font-medium">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedTransaction.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : selectedTransaction.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : selectedTransaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {selectedTransaction.status.replace('_', ' ')}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-sm font-medium">
                        ${selectedTransaction.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transaction Type</p>
                      <p className="text-sm font-medium">
                        {selectedTransaction.transactionType.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedTransaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Updated</p>
                      <p className="text-sm font-medium">
                        {new Date(selectedTransaction.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-specific action buttons */}
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-2">Available Actions</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  {userRole === 'lender' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Fund Transaction</h5>
                          <p className="text-xs text-gray-500">
                            Release funds to the appropriate parties
                          </p>
                        </div>
                        <button
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                          disabled={actionInProgress || selectedTransaction.status === 'completed'}
                          onClick={() => handleFundTransaction(selectedTransaction)}
                        >
                          Fund Transaction
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Request Manual Verification</h5>
                          <p className="text-xs text-gray-500">
                            Initiate manager review for compliance
                          </p>
                        </div>
                        <button
                          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                          disabled={actionInProgress}
                          onClick={() => handleRequestVerification(selectedTransaction)}
                        >
                          Request Verification
                        </button>
                      </div>
                    </div>
                  )}

                  {userRole === 'broker' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Release Commission</h5>
                          <p className="text-xs text-gray-500">
                            Release commission payments to brokers
                          </p>
                        </div>
                        <button
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                          disabled={
                            actionInProgress || selectedTransaction.status !== 'in_progress'
                          }
                          onClick={() => handleReleaseCommission(selectedTransaction)}
                        >
                          Release Commission
                        </button>
                      </div>
                    </div>
                  )}

                  {userRole === 'borrower' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Receive Funds</h5>
                          <p className="text-xs text-gray-500">Confirm receipt of loan funds</p>
                        </div>
                        <button
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                          disabled={
                            actionInProgress || selectedTransaction.status !== 'in_progress'
                          }
                          onClick={() => handleReceiveFunds(selectedTransaction)}
                        >
                          Confirm Receipt
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Pay Vendor</h5>
                          <p className="text-xs text-gray-500">Authorize payment to vendor</p>
                        </div>
                        <button
                          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                          disabled={
                            actionInProgress || selectedTransaction.status !== 'in_progress'
                          }
                          onClick={() => handlePayVendor(selectedTransaction)}
                        >
                          Pay Vendor
                        </button>
                      </div>
                    </div>
                  )}

                  {userRole === 'vendor' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium">Confirm Payment</h5>
                          <p className="text-xs text-gray-500">
                            Confirm receipt of payment for goods/services
                          </p>
                        </div>
                        <button
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                          disabled={
                            actionInProgress || selectedTransaction.status !== 'in_progress'
                          }
                          onClick={() => handleConfirmPayment(selectedTransaction)}
                        >
                          Confirm Payment
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium">Send Invoices</h5>
                        <p className="text-xs text-gray-500">
                          Automatically generate and send invoices to all parties
                        </p>
                      </div>
                      <button
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                        disabled={actionInProgress}
                        onClick={() => handleSendInvoices(selectedTransaction)}
                      >
                        Send Invoices
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents section */}
              <div className="mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-2">Documents</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {selectedTransaction.documents.map(document => (
                      <li key={document.id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-gray-400 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium">{document.name}</p>
                            <p className="text-xs text-gray-500">{document.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                              document.status === 'completed' || document.status === 'signed'
                                ? 'bg-green-100 text-green-800'
                                : document.status === 'pending_signature'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {document.status.replace('_', ' ')}
                          </span>
                          <a
                            href={document.url}
                            className="text-primary-600 hover:text-primary-900 text-sm"
                          >
                            View
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Blockchain Verification Tab */}
          {activeTab === 'blockchain_verification' && (
            <div className="mb-6">
              <ShieldProtocolDetails
                verifications={selectedTransaction.shieldVerifications}
                blockchainRecordId={selectedTransaction.blockchainRecordId}
              />
            </div>
          )}

          {/* Covenants Tab */}
          {activeTab === 'covenants' && (
            <div className="mb-6">
              <h4 className="text-base font-medium text-gray-900 mb-2">Transaction Covenants</h4>
              <div className="bg-gray-50 rounded-md p-6 text-center">
                <p className="text-gray-500">No covenants available for this transaction</p>
              </div>
            </div>
          )}

          {/* Shield Vault Tab */}
          {renderShieldVaultTab()}
        </div>
      </div>
    );
  };

  // Replace that specific section with:
  // This is a simplified example - you'll need to adapt it to your specific render method
  const renderShieldVaultTab = () => {
    // Only render when this tab is active to further improve performance
    if (activeTab !== 'shield_vault') return null;

    if (!selectedTransaction) {
      return (
        <div className="mt-4 bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No transaction selected</p>
        </div>
      );
    }

    const transactionDocs = selectedTransaction.documents || [];

    // If there are no documents, show a helpful message
    if (transactionDocs.length === 0) {
      return (
        <div className="mt-4 bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            This transaction has no documents to display in the Shield Vault.
          </p>
        </div>
      );
    }

    // Convert to FileItem format expected by the vault
    const fileItems = transactionDocs.map(doc => ({
      id: doc.id,
      name: doc.name,
      type: doc.type,
      size: 0, // Since we don't have this info from the mock data
      lastModified: doc.uploadedAt, // Use the string directly instead of converting to timestamp
      url: doc.url,
      // Add missing required properties
      createdAt: doc.uploadedAt,
      path: `/transactions/${selectedTransaction.id}/documents/${doc.id}`,
      parentId: selectedTransaction.id,
      owner: 'system',
    }));

    // Handle document updates from the Shield Vault
    const handleDocumentUpdates = (updatedDocs: any[]) => {
      console.log('Documents updated:', updatedDocs);

      // In a real app, you would update your transaction state here
      // For demo purposes, just show a toast or alert
      alert('Document status updated in Shield Vault');

      // You could also update your transaction state like this:
      // const updatedTransaction = {
      //   ...selectedTransaction,
      //   documents: selectedTransaction.documents.map(doc => {
      //     const updatedDoc = updatedDocs.find(updated => updated.id === doc.id);
      //     if (updatedDoc) {
      //       return {
      //         ...doc,
      //         status: updatedDoc.blockchainVerified ? 'completed' : doc.status
      //       };
      //     }
      //     return doc;
      //   })
      // };
      // setSelectedTransaction(updatedTransaction);
    };

    return (
      <div className="mt-4">
        <ShieldVaultLoader
          documents={fileItems}
          transactionId={selectedTransaction.id}
          transactionStatus={
            selectedTransaction.status === 'in_progress'
              ? 'in_progress'
              : selectedTransaction.status === 'completed'
                ? 'completed'
                : 'draft'
          }
          userType={currentUserRole}
          collateralType="equipment" // Add actual collateral type if available
          requestType="loan" // Add actual request type if available
          instrumentType="lease" // Add actual instrument type if available
          onUpdateDocuments={handleDocumentUpdates}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation title="Transaction Execution" />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction Execution</h1>
            <p className="text-gray-600">
              Generate, sign, and securely store transaction documents on blockchain
            </p>
          </div>

          {/* Simulation controls for demo purposes */}
          <div className="bg-white p-2 rounded-md shadow">
            <label className="text-sm text-gray-500 mr-2">Simulate Role:</label>
            <select
              value={currentUserRole}
              onChange={e => setCurrentUserRole(e.target.value as ParticipantRole)}
              className="border border-gray-300 rounded-md text-sm p-1"
            >
              <option value="lender">Lender</option>
              <option value="borrower">Borrower</option>
              <option value="broker">Broker</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions list column */}
          <div>{renderTransactionsList()}</div>

          {/* Transaction details column */}
          <div>{renderTransactionDetails()}</div>
        </div>
      </div>
    </div>
  );
};

export default TransactionExecution;
