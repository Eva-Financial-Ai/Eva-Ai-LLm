import { useState, useEffect } from 'react';
import riskMapService from '../components/risk/RiskMapService';

export type TransactionType = 'general' | 'equipment' | 'realestate';
export type RiskMapType = 'unsecured' | 'equipment' | 'realestate';

interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  status: string;
  date: string;
}

// For demo purposes, use only one transaction of each type to reduce load
const mockTransactions: Transaction[] = [
  {
    id: 'tx-unsecured-1',
    type: 'general',
    name: 'ABC Corp Working Capital Loan',
    status: 'Completed',
    date: '2023-05-15',
  },
  {
    id: 'tx-equipment-1',
    type: 'equipment',
    name: 'XYZ Manufacturing Equipment Finance',
    status: 'Completed',
    date: '2023-06-22',
  },
  {
    id: 'tx-realestate-1',
    type: 'realestate',
    name: 'Metropolis Office Building Acquisition',
    status: 'Completed',
    date: '2023-07-10',
  }
];

// Map transaction types to risk map types
const transactionToRiskMapType: Record<TransactionType, RiskMapType> = {
  general: 'unsecured',
  equipment: 'equipment',
  realestate: 'realestate',
};

export const useRiskMapTypes = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>('general');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize but don't load any risk map data yet
  useEffect(() => {
    // Only set transaction type and filter transactions, but don't select any by default
    if (!selectedTransaction) {
      const defaultType = 'general';
      setTransactionType(defaultType);
      
      // Find the transactions of this type
      const filtered = mockTransactions.filter(tx => tx.type === defaultType);
      setFilteredTransactions(filtered);
    }
  }, [selectedTransaction]);

  // Filter transactions by type
  const filterByType = (type: TransactionType) => {
    // Don't do anything if already loading or if it's the same type
    if (isLoading || type === transactionType) return;
    
    setIsLoading(true);
    
    // Clear the risk map service cache when switching types
    riskMapService.clearCache();
    
    setTransactionType(type);
    
    // Unselect current transaction
    setSelectedTransaction(null);
    
    // Filter to show only transactions of this type
    const filtered = mockTransactions.filter(tx => tx.type === type);
    setFilteredTransactions(filtered);
    
    setIsLoading(false);
  };

  // Handle transaction selection - in demo there should be only one per type
  const selectTransaction = (transactionId: string) => {
    // Don't do anything if already loading or if it's the same transaction
    if (isLoading || transactionId === selectedTransaction) return;
    
    setIsLoading(true);
    
    // Clear cache when selecting a new transaction
    riskMapService.clearCache();
    
    setSelectedTransaction(transactionId);
    
    const selected = mockTransactions.find(tx => tx.id === transactionId);
    if (selected) {
      setTransactionType(selected.type);
    }
    
    setIsLoading(false);
  };

  // Get the current risk map type based on the selected transaction type
  const getCurrentRiskMapType = (): RiskMapType => {
    return transactionToRiskMapType[transactionType];
  };

  return {
    transactions: mockTransactions,
    filteredTransactions,
    selectedTransaction,
    transactionType,
    riskMapType: getCurrentRiskMapType(),
    isLoading,
    filterByType,
    selectTransaction,
  };
};

export default useRiskMapTypes;
