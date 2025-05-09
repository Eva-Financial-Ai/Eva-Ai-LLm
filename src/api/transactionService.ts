import { Transaction } from '../contexts/WorkflowContext';
import { mockTransactions as initialMockTransactions } from './mockData';

// API base URL - update this to your actual backend URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Flag to use mock data when API is unavailable
const USE_MOCK_DATA = true; // Set to false when your API is ready

// Load transactions from localStorage or use initial mock data
const loadMockTransactions = (): Transaction[] => {
  try {
    const storedTransactions = localStorage.getItem('eva_mock_transactions');
    if (storedTransactions) {
      return JSON.parse(storedTransactions);
    }
  } catch (err) {
    console.error('Error loading transactions from localStorage:', err);
  }
  return [...initialMockTransactions];
};

// Store transactions to localStorage
const saveMockTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem('eva_mock_transactions', JSON.stringify(transactions));
  } catch (err) {
    console.error('Error saving transactions to localStorage:', err);
  }
};

// Mock transactions that persist across page reloads
let mockTransactions = loadMockTransactions();

// Interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

// Get all transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  if (USE_MOCK_DATA) {
    console.log('Using mock transaction data:', mockTransactions);
    // Add a small delay to simulate network request
    return new Promise(resolve => {
      setTimeout(() => {
        // Ensure we're using the latest data
        mockTransactions = loadMockTransactions();
        resolve([...mockTransactions]);
      }, 300); // Small delay for realistic loading but not too long
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse<Transaction[]> = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch transactions:', error);

    // Fallback to mock data if API request fails
    console.log('Falling back to mock transaction data');
    return [...mockTransactions]; // Return a copy of mockTransactions
  }
};

// Get a transaction by ID
export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  if (USE_MOCK_DATA) {
    console.log(`Using mock data for transaction ${id}`);
    // Ensure we're using the latest data
    mockTransactions = loadMockTransactions();
    const transaction = mockTransactions.find(t => t.id === id);
    if (transaction) {
      return Promise.resolve({ ...transaction }); // Return a copy to prevent reference issues
    }
    return Promise.resolve(null);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse<Transaction> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Failed to fetch transaction ${id}:`, error);

    // Fallback to mock data if API request fails
    console.log(`Falling back to mock data for transaction ${id}`);
    return mockTransactions.find(t => t.id === id) || null;
  }
};

// Create a new transaction
export const createTransaction = async (
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction | null> => {
  if (USE_MOCK_DATA) {
    console.log('Creating mock transaction with data:', transaction);
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: 'TX-' + Math.floor(Math.random() * 900000 + 100000),
        createdAt: new Date().toISOString(),
      };

      // Update the mockTransactions array
      mockTransactions.push(newTransaction);

      // Save to localStorage
      saveMockTransactions(mockTransactions);

      console.log('Created new transaction:', newTransaction);
      console.log('Updated mock transactions:', mockTransactions);

      // Add a small delay to simulate network request
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ ...newTransaction });
        }, 300);
      });
    } catch (err) {
      console.error('Error creating mock transaction:', err);
      return Promise.resolve(null);
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse<Transaction> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Failed to create transaction:', error);

    // Fallback to creating a mock transaction
    console.log('Creating fallback mock transaction');
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: 'TX-' + Math.floor(Math.random() * 900000 + 100000),
        createdAt: new Date().toISOString(),
      };
      mockTransactions.push(newTransaction);
      saveMockTransactions(mockTransactions);
      return newTransaction;
    } catch (err) {
      console.error('Error creating fallback transaction:', err);
      return null;
    }
  }
};

// Update an existing transaction
export const updateTransaction = async (transaction: Transaction): Promise<Transaction | null> => {
  if (USE_MOCK_DATA) {
    console.log(`Updating mock transaction ${transaction.id}`);
    try {
      const index = mockTransactions.findIndex(t => t.id === transaction.id);
      if (index >= 0) {
        mockTransactions[index] = { ...transaction };
        saveMockTransactions(mockTransactions);
        return { ...transaction };
      }
      return null;
    } catch (err) {
      console.error(`Error updating mock transaction ${transaction.id}:`, err);
      return null;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${transaction.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse<Transaction> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Failed to update transaction ${transaction.id}:`, error);

    // Fallback to updating mock transaction
    console.log(`Updating fallback mock transaction ${transaction.id}`);
    try {
      const index = mockTransactions.findIndex(t => t.id === transaction.id);
      if (index >= 0) {
        mockTransactions[index] = transaction;
        saveMockTransactions(mockTransactions);
        return transaction;
      }
      return null;
    } catch (err) {
      console.error(`Error updating fallback transaction ${transaction.id}:`, err);
      return null;
    }
  }
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<boolean> => {
  if (USE_MOCK_DATA) {
    console.log(`Deleting mock transaction ${id}`);
    try {
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index >= 0) {
        mockTransactions.splice(index, 1);
        saveMockTransactions(mockTransactions);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Error deleting mock transaction ${id}:`, err);
      return false;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    return response.ok;
  } catch (error) {
    console.error(`Failed to delete transaction ${id}:`, error);

    // Fallback to deleting mock transaction
    console.log(`Deleting fallback mock transaction ${id}`);
    try {
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index >= 0) {
        mockTransactions.splice(index, 1);
        saveMockTransactions(mockTransactions);
        return true;
      }
      return false;
    } catch (err) {
      console.error(`Error deleting fallback transaction ${id}:`, err);
      return false;
    }
  }
};

// Update transaction stage
export const updateTransactionStage = async (
  id: string,
  stage: string
): Promise<Transaction | null> => {
  if (USE_MOCK_DATA) {
    console.log(`Updating mock transaction ${id} stage to ${stage}`);
    try {
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index >= 0) {
        mockTransactions[index] = {
          ...mockTransactions[index],
          currentStage: stage as any,
        };
        saveMockTransactions(mockTransactions);
        return { ...mockTransactions[index] };
      }
      return null;
    } catch (err) {
      console.error(`Error updating stage for mock transaction ${id}:`, err);
      return null;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}/stage`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ stage }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: ApiResponse<Transaction> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Failed to update stage for transaction ${id}:`, error);

    // Fallback to updating mock transaction stage
    console.log(`Updating fallback mock transaction ${id} stage to ${stage}`);
    try {
      const index = mockTransactions.findIndex(t => t.id === id);
      if (index >= 0) {
        mockTransactions[index] = {
          ...mockTransactions[index],
          currentStage: stage as any,
        };
        saveMockTransactions(mockTransactions);
        return { ...mockTransactions[index] };
      }
      return null;
    } catch (err) {
      console.error(`Error updating stage for fallback transaction ${id}:`, err);
      return null;
    }
  }
};
