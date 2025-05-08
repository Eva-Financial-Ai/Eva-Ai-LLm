import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import * as transactionService from '../api/transactionService';
import { Transaction, WorkflowStage } from '../contexts/WorkflowContext';
import { z } from 'zod';

// Transaction validation schema
const ApplicantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  entityType: z.string(),
  industryCode: z.string(),
  financials: z.any().optional(),
});

const TransactionSchema = z.object({
  id: z.string(),
  applicantData: ApplicantSchema,
  type: z.string(),
  amount: z.number().positive("Amount must be positive"),
  currentStage: z.enum([
    'document_collection',
    'risk_assessment',
    'deal_structuring',
    'approval_decision',
    'document_execution',
    'post_closing'
  ]),
  details: z.any(),
  createdAt: z.string().optional(),
  timeTracking: z.any().optional(),
  riskTier: z.string().optional(),
  data: z.any().optional(),
  requestedTerms: z.any().optional(),
  riskProfile: z.any().optional(),
  approvedDeal: z.any().optional(),
  parties: z.array(z.any()).optional(),
});

// New transaction input schema (without id)
const NewTransactionSchema = z.object({
  applicantData: ApplicantSchema,
  type: z.string(),
  amount: z.number().positive(),
  details: z.any(),
  currentStage: z.enum([
    'document_collection',
    'risk_assessment',
    'deal_structuring',
    'approval_decision',
    'document_execution',
    'post_closing'
  ]),
});

type TransactionError = {
  message: string;
  code: string;
  details?: any;
};

// Interface for the transaction store
interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  loading: boolean;
  error: TransactionError | null;
  
  // Actions
  fetchTransactions: () => Promise<void>;
  createTransaction: (data: Omit<Transaction, 'id'>) => Promise<Transaction | null>;
  updateTransaction: (transaction: Transaction) => Promise<Transaction | null>;
  advanceStage: (transactionId: string, stage: WorkflowStage) => Promise<void>;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  clearError: () => void;
}

// Create the Zustand store with middleware
export const useTransactionStore = create<TransactionState>()(
  devtools(
    persist(
      (set, get) => ({
        transactions: [],
        currentTransaction: null,
        loading: false,
        error: null,

        fetchTransactions: async () => {
          set({ loading: true, error: null });
          try {
            console.log('Fetching transactions...');
            const data = await transactionService.getTransactions();
            console.log('Transactions fetched:', data.length, 'transactions');
            
            // Validate fetched transactions
            const validatedTransactions: Transaction[] = [];
            
            for (const transaction of data) {
              try {
                // Validate each transaction
                TransactionSchema.parse(transaction);
                validatedTransactions.push(transaction);
              } catch (err) {
                console.error('Invalid transaction found:', transaction.id, err);
                // Continue with other transactions
              }
            }
            
            set({ transactions: validatedTransactions });
          } catch (err) {
            console.error('Error fetching transactions:', err);
            set({ 
              error: { 
                message: 'Failed to fetch transactions', 
                code: 'FETCH_ERROR',
                details: err 
              } 
            });
          } finally {
            set({ loading: false });
          }
        },

        createTransaction: async (data) => {
          set({ loading: true, error: null });
          try {
            console.log('Validating new transaction data:', data);
            
            // Validate the input data
            try {
              NewTransactionSchema.parse(data);
            } catch (validationError) {
              console.error('Transaction validation failed:', validationError);
              set({ 
                error: { 
                  message: 'Transaction validation failed', 
                  code: 'VALIDATION_ERROR',
                  details: validationError 
                } 
              });
              return null;
            }
            
            console.log('Creating transaction with data:', data);
            const result = await transactionService.createTransaction(data);
            console.log('Transaction creation result:', result);
            
            if (result) {
              // Add to local state
              set(state => ({ 
                transactions: [...state.transactions, result] 
              }));
              return result;
            }
            return null;
          } catch (err) {
            console.error('Error creating transaction:', err);
            set({ 
              error: { 
                message: 'Failed to create transaction', 
                code: 'CREATE_ERROR',
                details: err 
              } 
            });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        updateTransaction: async (transaction) => {
          set({ loading: true, error: null });
          try {
            console.log('Updating transaction:', transaction.id);
            
            // Validate the transaction
            try {
              TransactionSchema.parse(transaction);
            } catch (validationError) {
              console.error('Transaction validation failed:', validationError);
              set({ 
                error: { 
                  message: 'Transaction validation failed', 
                  code: 'VALIDATION_ERROR',
                  details: validationError 
                } 
              });
              return null;
            }
            
            const result = await transactionService.updateTransaction(transaction);
            
            if (result) {
              // Update the local state
              set(state => ({
                transactions: state.transactions.map(t => 
                  t.id === result.id ? result : t
                ),
                currentTransaction: state.currentTransaction?.id === result.id 
                  ? result 
                  : state.currentTransaction
              }));
              return result;
            }
            return null;
          } catch (err) {
            console.error('Error updating transaction:', err);
            set({ 
              error: { 
                message: 'Failed to update transaction', 
                code: 'UPDATE_ERROR',
                details: err 
              } 
            });
            return null;
          } finally {
            set({ loading: false });
          }
        },

        advanceStage: async (transactionId, stage) => {
          set({ loading: true, error: null });
          try {
            console.log(`Advancing transaction ${transactionId} to stage ${stage}`);
            const transaction = get().transactions.find(t => t.id === transactionId);
            
            if (!transaction) {
              throw new Error(`Transaction with ID ${transactionId} not found`);
            }
            
            const result = await transactionService.updateTransactionStage(transactionId, stage);
            
            if (result) {
              // Update the local state
              set(state => ({
                transactions: state.transactions.map(t => 
                  t.id === result.id ? result : t
                ),
                currentTransaction: state.currentTransaction?.id === result.id 
                  ? result 
                  : state.currentTransaction
              }));
            }
          } catch (err) {
            console.error('Error advancing transaction stage:', err);
            set({ 
              error: { 
                message: 'Failed to advance transaction stage', 
                code: 'ADVANCE_ERROR',
                details: err 
              } 
            });
          } finally {
            set({ loading: false });
          }
        },

        setCurrentTransaction: (transaction) => {
          set({ currentTransaction: transaction });
        },

        clearError: () => {
          set({ error: null });
        }
      }),
      {
        name: 'transaction-storage',
        partialize: (state) => ({ 
          transactions: state.transactions,
          currentTransaction: state.currentTransaction 
        }),
      }
    )
  )
);

export default useTransactionStore; 