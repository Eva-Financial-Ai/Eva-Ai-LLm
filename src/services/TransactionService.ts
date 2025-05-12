import { Transaction } from '../components/common/TransactionSelector';

// Mock transaction data
const mockTransactions: Transaction[] = [
  { id: 'TX-123', name: 'Horizon Solutions Inc.', type: 'Equipment Loan', amount: '$1,000,000' },
  { id: 'TX-124', name: 'Apex Manufacturing', type: 'Commercial Loan', amount: '$750,000' },
  { id: 'TX-125', name: 'Summit Industries', type: 'Equipment Lease', amount: '$320,000' },
  { id: 'TX-126', name: 'Coastal Enterprises', type: 'Working Capital', amount: '$180,000' },
];

// In a real application, these would call an API
export const TransactionService = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTransactions), 300);
    });
  },
  
  getTransactionById: async (id: string): Promise<Transaction | undefined> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const transaction = mockTransactions.find(tx => tx.id === id);
        resolve(transaction);
      }, 300);
    });
  },
  
  searchTransactions: async (query: string): Promise<Transaction[]> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredTransactions = mockTransactions.filter(tx => 
          tx.name.toLowerCase().includes(query.toLowerCase()) || 
          tx.id.toLowerCase().includes(query.toLowerCase()) ||
          tx.type.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filteredTransactions);
      }, 300);
    });
  }
};

export default TransactionService; 