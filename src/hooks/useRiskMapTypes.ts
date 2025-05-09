import { useState, useEffect } from 'react';

export type TransactionType = 'general' | 'equipment' | 'realestate';
export type RiskMapType = 'unsecured' | 'equipment' | 'realestate';

interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  status: string;
  date: string;
}

// Mock transactions for demo purposes
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
  },
  {
    id: 'tx-unsecured-2',
    type: 'general',
    name: 'StartUp Inc Line of Credit',
    status: 'In Progress',
    date: '2023-08-05',
  },
  {
    id: 'tx-equipment-2',
    type: 'equipment',
    name: 'Logistics Pro Fleet Expansion',
    status: 'Completed',
    date: '2023-08-18',
  },
  {
    id: 'tx-realestate-2',
    type: 'realestate',
    name: 'Retail Plaza Development Project',
    status: 'In Progress',
    date: '2023-09-01',
  },
];

// Map transaction types to risk map types
const transactionToRiskMapType: Record<TransactionType, RiskMapType> = {
  general: 'unsecured',
  equipment: 'equipment',
  realestate: 'realestate',
};

export const useRiskMapTypes = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>('general');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Initialize with mock data
  useEffect(() => {
    // Set the first transaction as selected if none is already selected
    if (!selectedTransaction && mockTransactions.length > 0) {
      setSelectedTransaction(mockTransactions[0].id);
      setTransactionType(mockTransactions[0].type);
      setFilteredTransactions(mockTransactions.filter(tx => tx.type === mockTransactions[0].type));
    }
  }, [selectedTransaction]);

  // Filter transactions by type
  const filterByType = (type: TransactionType) => {
    setTransactionType(type);
    const filtered = mockTransactions.filter(tx => tx.type === type);
    setFilteredTransactions(filtered);

    // Select the first transaction of this type
    if (filtered.length > 0) {
      setSelectedTransaction(filtered[0].id);
    } else {
      setSelectedTransaction(null);
    }
  };

  // Handle transaction selection
  const selectTransaction = (transactionId: string) => {
    setSelectedTransaction(transactionId);
    const selected = mockTransactions.find(tx => tx.id === transactionId);
    if (selected) {
      setTransactionType(selected.type);
    }
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
    filterByType,
    selectTransaction,
  };
};

export default useRiskMapTypes;
