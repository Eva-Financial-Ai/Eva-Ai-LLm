import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionService from '../../services/TransactionService';

export interface Transaction {
  id: string;
  name: string;
  type: string;
  amount: string;
}

interface TransactionSelectorProps {
  onClose?: () => void;
  currentTransactionId?: string;
  transactions?: Transaction[];
}

const TransactionSelector: React.FC<TransactionSelectorProps> = ({ 
  onClose,
  currentTransactionId = 'TX-123',
  transactions: propTransactions
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load transactions if not provided via props
  useEffect(() => {
    if (propTransactions) {
      setTransactions(propTransactions);
    } else {
      const fetchTransactions = async () => {
        setIsLoading(true);
        try {
          const data = await TransactionService.getAllTransactions();
          setTransactions(data);
          setFilteredTransactions(data);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchTransactions();
    }
  }, [propTransactions]);
  
  // Find and set current transaction whenever transactions or currentTransactionId changes
  useEffect(() => {
    if (transactions.length > 0) {
      const current = transactions.find(tx => tx.id === currentTransactionId) || transactions[0];
      setCurrentTransaction(current);
    }
  }, [transactions, currentTransactionId]);
  
  // Update filtered transactions whenever search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTransactions(transactions);
    } else {
      const fetchResults = async () => {
        setIsLoading(true);
        try {
          const results = await TransactionService.searchTransactions(searchQuery);
          setFilteredTransactions(results);
        } catch (error) {
          console.error('Error searching transactions:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchResults();
    }
  }, [searchQuery, transactions]);
  
  const selectTransaction = (txId: string) => {
    // Navigate to transaction detail
    navigate(`/transaction-execution/${txId}`);
    setIsDropdownOpen(false);
  };
  
  if (!currentTransaction) {
    return null; // or a loading spinner
  }
  
  return (
    <div className="flex items-center border border-gray-200 rounded-lg shadow-sm bg-white px-2 py-1">
      <div className="flex flex-col mr-3">
        <div className="text-xs text-gray-500">Transaction</div>
        <div className="text-sm font-medium" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="flex items-center cursor-pointer">
            <span>{currentTransaction.id}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onClose} 
        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {isDropdownOpen && (
        <div className="absolute top-16 right-4 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">Loading...</div>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map(tx => (
                <div 
                  key={tx.id}
                  className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${tx.id === currentTransactionId ? 'bg-blue-50' : ''}`}
                  onClick={() => selectTransaction(tx.id)}
                >
                  <div className="font-medium text-sm">{tx.name}</div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{tx.id}</span>
                    <span>{tx.amount}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No transactions found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionSelector; 