import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  status: string;
  statusColor: string;
  progress: number;
  assignee: {
    name: string;
    avatar: string;
  };
}

interface DealsTableProps {
  title: string;
  transactions: Transaction[];
  onViewTransaction: (id: string) => void;
}

export const DealsTable: React.FC<DealsTableProps> = ({ title, transactions: initialTransactions, onViewTransaction }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  
  // Function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Function to format date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Status badge styling
  const getStatusStyles = (statusColor: string) => {
    const styles: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    
    return styles[statusColor] || 'bg-gray-100 text-gray-800';
  };
  
  // Function to get next status
  const getNextStatus = (currentStatus: string): { name: string, color: string, progress: number } => {
    const statusFlow: Record<string, { name: string, color: string, progress: number }> = {
      'Document Collection': { name: 'Risk Assessment', color: 'yellow', progress: 40 },
      'Risk Assessment': { name: 'Deal Structuring', color: 'purple', progress: 60 },
      'Deal Structuring': { name: 'Document Execution', color: 'green', progress: 80 },
      'Document Execution': { name: 'Funding', color: 'indigo', progress: 90 },
      'Funding': { name: 'Completed', color: 'green', progress: 100 }
    };
    
    return statusFlow[currentStatus] || { name: 'Document Collection', color: 'blue', progress: 20 };
  };
  
  // Function to get the route based on status
  const getRouteForStatus = (status: string): string => {
    const statusRoutes: Record<string, string> = {
      'Document Collection': '/documents',
      'Risk Assessment': '/risk-assessment',
      'Deal Structuring': '/deal-structuring',
      'Document Execution': '/transactions',
      'Funding': '/transactions',
      'Completed': '/transactions'
    };
    
    return statusRoutes[status] || '/';
  };
  
  // Handle advancing a transaction to the next stage
  const handleAdvanceStage = (e: React.MouseEvent, transaction: Transaction, index: number) => {
    e.stopPropagation();
    
    // Get the next status info
    const nextStatus = getNextStatus(transaction.status);
    
    // Update the transaction in state
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = {
      ...transaction,
      status: nextStatus.name,
      statusColor: nextStatus.color,
      progress: nextStatus.progress
    };
    
    // Update the transactions state
    setTransactions(updatedTransactions);
    
    // Show a quick toast-like notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded z-50';
    notification.textContent = `Transaction ${transaction.id} status updated to: ${nextStatus.name}`;
    document.body.appendChild(notification);
    
    // Remove the notification after 3 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };
  
  // Handle view transaction click
  const handleViewTransaction = (e: React.MouseEvent, transaction: Transaction) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent any default behavior
    
    // Navigate to the appropriate route based on the transaction's status
    const route = getRouteForStatus(transaction.status);
    
    // Set the transaction ID in context or localStorage for reference on the destination page
    localStorage.setItem('currentTransactionId', transaction.id);
    
    // Navigate to the route without appending the transaction ID
    navigate(route);
    
    // Show a notification that we're loading the transaction
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded z-50';
    notification.textContent = `Loading transaction ${transaction.id}`;
    document.body.appendChild(notification);
    
    // Remove the notification after 2 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 2000);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr 
                key={transaction.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewTransaction(transaction.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatCurrency(transaction.amount)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(transaction.date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(transaction.statusColor)}`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        transaction.progress > 80 ? 'bg-green-500' : 
                        transaction.progress > 60 ? 'bg-blue-500' : 
                        transaction.progress > 40 ? 'bg-yellow-500' : 
                        transaction.progress > 20 ? 'bg-orange-500' : 
                        'bg-red-500'
                      }`} 
                      style={{ width: `${transaction.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">{transaction.progress}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <img className="h-8 w-8 rounded-full" src={transaction.assignee.avatar} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.assignee.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => handleAdvanceStage(e, transaction, index)}
                      className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded"
                    >
                      Advance
                    </button>
                    <button
                      onClick={(e) => handleViewTransaction(e, transaction)}
                      className="text-primary-600 hover:text-primary-900 bg-blue-50 px-2 py-1 rounded"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 