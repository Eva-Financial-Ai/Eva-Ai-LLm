import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface BankAccount {
  id: string;
  institutionName: string;
  accountName: string;
  accountNumber: string; // Last 4 digits only for display
  accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'other';
  balance?: number;
  balanceAsOf?: string;
  plaidConnected: boolean;
  verified: boolean;
  verifiedDate?: string;
  verifiedBy?: string;
}

interface BankStatement {
  id: string;
  accountId: string;
  month: string;
  year: string;
  isMonthToDate: boolean;
  dateReceived: string;
  requestedBy?: string;
  uploadedBy?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  verified: boolean;
  verifiedDate?: string;
  verifiedBy?: string;
  status: 'pending' | 'received' | 'verified' | 'rejected';
  transactionCount?: number;
  totalDeposits?: number;
  totalWithdrawals?: number;
  notes?: string;
}

interface BankStatementVerificationProps {
  borrowerId: string;
  borrowerName: string;
  applicationId: string;
  userRole: 'lender' | 'broker' | 'admin';
  readOnly?: boolean;
}

const BankStatementVerification: React.FC<BankStatementVerificationProps> = ({
  borrowerId,
  borrowerName,
  applicationId,
  userRole,
  readOnly = false
}) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [statements, setStatements] = useState<BankStatement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [monthsToRequest, setMonthsToRequest] = useState<string[]>([]);
  const [includeMTD, setIncludeMTD] = useState(true);
  const [showPlaidModal, setShowPlaidModal] = useState(false);
  
  // Load accounts and statements data
  useEffect(() => {
    setIsLoading(true);
    
    // Simulating API call to get accounts and statements
    setTimeout(() => {
      // Mock bank accounts data
      const mockAccounts: BankAccount[] = [
        {
          id: 'acc-' + uuidv4().substring(0, 8),
          institutionName: 'Chase Bank',
          accountName: 'Business Checking',
          accountNumber: '1234',
          accountType: 'checking',
          balance: 25430.55,
          balanceAsOf: new Date().toISOString(),
          plaidConnected: true,
          verified: true,
          verifiedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          verifiedBy: 'John Smith'
        },
        {
          id: 'acc-' + uuidv4().substring(0, 8),
          institutionName: 'Bank of America',
          accountName: 'Business Savings',
          accountNumber: '5678',
          accountType: 'savings',
          balance: 158750.82,
          balanceAsOf: new Date().toISOString(),
          plaidConnected: true,
          verified: true,
          verifiedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          verifiedBy: 'John Smith'
        },
        {
          id: 'acc-' + uuidv4().substring(0, 8),
          institutionName: 'Wells Fargo',
          accountName: 'Business Credit Line',
          accountNumber: '9012',
          accountType: 'credit',
          balance: -15000,
          balanceAsOf: new Date().toISOString(),
          plaidConnected: false,
          verified: false
        }
      ];
      
      // Generate mock bank statements for the last 3 months
      const today = new Date();
      const mockStatements: BankStatement[] = [];
      
      // For each account, create statements for last 3 months
      mockAccounts.forEach(account => {
        for (let i = 1; i <= 3; i++) {
          const statementDate = new Date(today);
          statementDate.setMonth(today.getMonth() - i);
          
          mockStatements.push({
            id: 'stmt-' + uuidv4().substring(0, 8),
            accountId: account.id,
            month: statementDate.toLocaleString('default', { month: 'long' }),
            year: statementDate.getFullYear().toString(),
            isMonthToDate: false,
            dateReceived: new Date(today.getFullYear(), today.getMonth() - i + 1, 3).toISOString(),
            requestedBy: 'System',
            fileUrl: '#',
            fileName: `${account.institutionName.replace(/\s+/g, '_')}_${statementDate.getFullYear()}_${(statementDate.getMonth() + 1).toString().padStart(2, '0')}.pdf`,
            fileSize: Math.floor(Math.random() * 1000000) + 500000,
            verified: i === 1, // Only most recent statement is verified
            verifiedDate: i === 1 ? new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString() : undefined,
            verifiedBy: i === 1 ? 'John Smith' : undefined,
            status: i === 1 ? 'verified' : 'received',
            transactionCount: Math.floor(Math.random() * 100) + 50,
            totalDeposits: Math.floor(Math.random() * 100000) + 10000,
            totalWithdrawals: Math.floor(Math.random() * 90000) + 5000
          });
        }
        
        // Add a month-to-date statement for accounts with Plaid connection
        if (account.plaidConnected) {
          mockStatements.push({
            id: 'stmt-mtd-' + uuidv4().substring(0, 8),
            accountId: account.id,
            month: today.toLocaleString('default', { month: 'long' }),
            year: today.getFullYear().toString(),
            isMonthToDate: true,
            dateReceived: new Date().toISOString(),
            requestedBy: 'System',
            fileUrl: '#',
            fileName: `${account.institutionName.replace(/\s+/g, '_')}_${today.getFullYear()}_${(today.getMonth() + 1).toString().padStart(2, '0')}_MTD.pdf`,
            fileSize: Math.floor(Math.random() * 500000) + 100000,
            verified: false,
            status: 'received',
            transactionCount: Math.floor(Math.random() * 50) + 10,
            totalDeposits: Math.floor(Math.random() * 50000) + 5000,
            totalWithdrawals: Math.floor(Math.random() * 40000) + 2000
          });
        }
      });
      
      setAccounts(mockAccounts);
      setStatements(mockStatements);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Handle request for bank statements
  const handleRequestStatements = () => {
    if (!selectedAccount || monthsToRequest.length === 0) return;
    
    const requests = [...monthsToRequest].map(month => {
      const [year, monthIndex] = month.split('-');
      const monthName = new Date(parseInt(year), parseInt(monthIndex) - 1).toLocaleString('default', { month: 'long' });
      
      return {
        id: 'stmt-req-' + uuidv4().substring(0, 8),
        accountId: selectedAccount,
        month: monthName,
        year: year,
        isMonthToDate: false,
        dateReceived: new Date().toISOString(),
        requestedBy: 'You',
        status: 'pending' as const,
        verified: false
      };
    });
    
    // Add month-to-date request if selected
    if (includeMTD) {
      const today = new Date();
      requests.push({
        id: 'stmt-req-mtd-' + uuidv4().substring(0, 8),
        accountId: selectedAccount,
        month: today.toLocaleString('default', { month: 'long' }),
        year: today.getFullYear().toString(),
        isMonthToDate: true,
        dateReceived: new Date().toISOString(),
        requestedBy: 'You',
        status: 'pending' as const,
        verified: false
      });
    }
    
    // Add the requests to statements
    setStatements(prevStatements => [...prevStatements, ...requests]);
    setShowRequestForm(false);
    setMonthsToRequest([]);
    
    // Show confirmation message
    alert(`Statement request sent to ${borrowerName}. They will receive an email with instructions to upload the requested statements.`);
  };
  
  // Generate options for month selection
  const getMonthOptions = (): { value: string; label: string }[] => {
    const options: { value: string; label: string }[] = [];
    const today = new Date();
    
    // Generate options for the last 24 months
    for (let i = 1; i <= 24; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const label = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      
      options.push({ value, label });
    }
    
    return options;
  };
  
  // Handle toggling a month selection
  const toggleMonthSelection = (month: string) => {
    if (monthsToRequest.includes(month)) {
      setMonthsToRequest(monthsToRequest.filter(m => m !== month));
    } else {
      setMonthsToRequest([...monthsToRequest, month]);
    }
  };
  
  // Handle Plaid connection request
  const handlePlaidRequest = () => {
    setShowPlaidModal(false);
    
    // Simulated API call to send Plaid connection request
    setTimeout(() => {
      alert(`Plaid connection request sent to ${borrowerName}. They will receive an email with instructions to connect their bank accounts.`);
    }, 500);
  };
  
  // Handle file verification
  const handleVerifyFile = (statementId: string) => {
    setStatements(prevStatements => 
      prevStatements.map(statement => 
        statement.id === statementId ? 
        {
          ...statement,
          verified: true,
          verifiedDate: new Date().toISOString(),
          verifiedBy: 'You',
          status: 'verified'
        } : 
        statement
      )
    );
  };
  
  // Handle file rejection
  const handleRejectFile = (statementId: string, reason: string) => {
    setStatements(prevStatements => 
      prevStatements.map(statement => 
        statement.id === statementId ? 
        {
          ...statement,
          verified: false,
          notes: reason,
          status: 'rejected'
        } : 
        statement
      )
    );
  };
  
  // Get statements for a specific account
  const getStatementsForAccount = (accountId: string) => {
    return statements.filter(statement => statement.accountId === accountId);
  };
  
  // Format date for display
  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format filesize for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  // Render the Plaid connection request modal
  const renderPlaidModal = () => {
    if (!showPlaidModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          
          {/* Modal panel */}
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Request Plaid Connection
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You are about to request that {borrowerName} connect their bank accounts using Plaid. 
                      This will allow for real-time access to account data and automated bank statement verification.
                    </p>
                    <div className="mt-4 bg-blue-50 p-3 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 text-sm text-blue-700">
                          <p>
                            The borrower will receive an email with instructions to connect their accounts securely through Plaid. 
                            They will have to authorize access to their accounts.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handlePlaidRequest}
              >
                Send Request
              </button>
              <button 
                type="button" 
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowPlaidModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render verification status badge
  const renderStatusBadge = (status: BankStatement['status'], verified?: boolean) => {
    let bgColor;
    let textColor;
    let label;
    
    switch (status) {
      case 'pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        label = 'Pending';
        break;
      case 'received':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        label = 'Received';
        break;
      case 'verified':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        label = 'Verified';
        break;
      case 'rejected':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        label = 'Rejected';
        break;
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {label}
      </span>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Bank Statement Verification</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Verify bank statements for {borrowerName}
            </p>
          </div>
          
          {!readOnly && (
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowPlaidModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Request Plaid Connection
              </button>
              <button
                type="button"
                onClick={() => setShowRequestForm(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Request Statements
              </button>
            </div>
          )}
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="px-4 py-12 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
              <span className="mt-2 text-gray-500">Loading bank accounts and statements...</span>
            </div>
          </div>
        )}
        
        {/* Bank Accounts List */}
        {!isLoading && accounts.length === 0 && (
          <div className="px-4 py-5 sm:p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bank accounts</h3>
            <p className="mt-1 text-sm text-gray-500">
              The borrower hasn't connected any bank accounts yet.
            </p>
          </div>
        )}
        
        {!isLoading && accounts.length > 0 && (
          <div>
            {/* Accounts List */}
            <div className="border-t border-gray-200 py-5 px-4">
              <h4 className="text-base font-medium text-gray-900 mb-4">Bank Accounts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map(account => (
                  <div
                    key={account.id}
                    className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                      selectedAccount === account.id ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedAccount(account.id)}
                  >
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                      <div className="font-medium truncate">{account.institutionName}</div>
                      {account.plaidConnected && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Plaid
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-sm mb-1">
                        <span className="font-medium">{account.accountName}</span>
                        <span className="text-gray-500 ml-1">••••{account.accountNumber}</span>
                      </div>
                      {account.balance !== undefined && (
                        <div className="flex justify-between items-baseline">
                          <div className={`text-lg font-medium ${account.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                            {formatCurrency(account.balance)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {account.balanceAsOf && `as of ${formatDate(account.balanceAsOf)}`}
                          </div>
                        </div>
                      )}
                      <div className="mt-2 flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${account.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                        <span className="text-xs text-gray-500">
                          {account.verified 
                            ? `Verified on ${formatDate(account.verifiedDate || '')}` 
                            : 'Not verified'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Statements for Selected Account */}
            {selectedAccount && (
              <div className="border-t border-gray-200 py-5 px-4">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Statements for {accounts.find(a => a.id === selectedAccount)?.accountName}
                </h4>
                
                {getStatementsForAccount(selectedAccount).length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-10 w-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No statements</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are no statements for this account yet.
                    </p>
                    {!readOnly && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => setShowRequestForm(true)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Request Statements
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statement Period
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            File
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                          {!readOnly && (
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {getStatementsForAccount(selectedAccount)
                          .sort((a, b) => {
                            // Sort by year and month, with MTD statements at the top
                            if (a.isMonthToDate && !b.isMonthToDate) return -1;
                            if (!a.isMonthToDate && b.isMonthToDate) return 1;
                            
                            const aDate = new Date(parseInt(a.year), new Date(a.month + ' 1').getMonth());
                            const bDate = new Date(parseInt(b.year), new Date(b.month + ' 1').getMonth());
                            
                            return bDate.getTime() - aDate.getTime();
                          })
                          .map(statement => (
                            <tr key={statement.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {statement.month} {statement.year}
                                  {statement.isMonthToDate && <span className="ml-1 text-sm font-normal text-blue-600">(Month-to-Date)</span>}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {statement.status !== 'pending' ? `Received on ${formatDate(statement.dateReceived)}` : 'Requested'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {renderStatusBadge(statement.status, statement.verified)}
                                {statement.verifiedBy && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    By: {statement.verifiedBy}
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {statement.fileName ? (
                                  <div>
                                    <a 
                                      href={statement.fileUrl || '#'} 
                                      className="text-sm text-primary-600 hover:text-primary-900 flex items-center"
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                                      </svg>
                                      {statement.fileName}
                                    </a>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {statement.fileSize && formatFileSize(statement.fileSize)}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-500">No file uploaded</span>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {statement.transactionCount !== undefined && (
                                  <div className="text-sm text-gray-900">
                                    {statement.transactionCount} transactions
                                  </div>
                                )}
                                {statement.totalDeposits !== undefined && (
                                  <div className="text-xs text-green-600">
                                    {formatCurrency(statement.totalDeposits)} deposits
                                  </div>
                                )}
                                {statement.totalWithdrawals !== undefined && (
                                  <div className="text-xs text-red-600">
                                    {formatCurrency(statement.totalWithdrawals)} withdrawals
                                  </div>
                                )}
                                {statement.notes && (
                                  <div className="text-xs text-yellow-600 mt-1">
                                    Note: {statement.notes}
                                  </div>
                                )}
                              </td>
                              {!readOnly && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  {statement.status === 'received' && (
                                    <>
                                      <button
                                        onClick={() => handleVerifyFile(statement.id)}
                                        className="text-green-600 hover:text-green-900 mr-3"
                                      >
                                        Verify
                                      </button>
                                      <button
                                        onClick={() => handleRejectFile(statement.id, 'Insufficient detail')}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {statement.status === 'pending' && (
                                    <span className="text-gray-500">Awaiting upload</span>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Request Bank Statements
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Select the account and statement periods you want to request from the borrower.
                      </p>
                      
                      {/* Account selection */}
                      <div className="mb-4">
                        <label htmlFor="account-select" className="block text-sm font-medium text-gray-700 mb-1">
                          Select Account
                        </label>
                        <select
                          id="account-select"
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={selectedAccount || ''}
                          onChange={(e) => setSelectedAccount(e.target.value)}
                          required
                        >
                          <option value="">Select an account</option>
                          {accounts.map(account => (
                            <option key={account.id} value={account.id}>
                              {account.institutionName} - {account.accountName} (••••{account.accountNumber})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Months selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Statement Periods to Request
                        </label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {getMonthOptions().map(month => (
                            <div key={month.value} className="flex items-center">
                              <input
                                id={`month-${month.value}`}
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={monthsToRequest.includes(month.value)}
                                onChange={() => toggleMonthSelection(month.value)}
                              />
                              <label htmlFor={`month-${month.value}`} className="ml-2 text-sm text-gray-700">
                                {month.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Month-to-date option */}
                      <div className="mb-4">
                        <div className="flex items-center">
                          <input
                            id="include-mtd"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={includeMTD}
                            onChange={(e) => setIncludeMTD(e.target.checked)}
                          />
                          <label htmlFor="include-mtd" className="ml-2 text-sm text-gray-700">
                            Include current month-to-date statement
                          </label>
                        </div>
                      </div>
                      
                      {/* Warning about request */}
                      <div className="bg-yellow-50 p-3 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              The borrower will receive an email requesting they upload the selected statements. 
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleRequestStatements}
                  disabled={!selectedAccount || (monthsToRequest.length === 0 && !includeMTD)}
                >
                  Send Request
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Plaid Connection Request Modal */}
      {renderPlaidModal()}
    </div>
  );
};

export default BankStatementVerification; 