import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import * as transactionService from '../api/transactionService';
import { Metrics, TimeMetrics, TransactionTimeTracking } from '../types/transaction';
import { useLocation, useNavigate } from 'react-router-dom';
import performanceMonitor from '../utils/performance';

// Workflow stages
export type WorkflowStage =
  | 'document_collection'
  | 'risk_assessment'
  | 'deal_structuring'
  | 'approval_decision'
  | 'document_execution'
  | 'post_closing';

// Transaction data interfaces
export interface Applicant {
  id: string;
  name: string;
  entityType: string;
  industryCode: string;
  financials?: any;
}

export interface Transaction {
  id: string;
  applicantData: Applicant;
  type: string;
  amount: number;
  riskTier?: string;
  details: any;
  data?: any;
  requestedTerms?: any;
  riskProfile?: any;
  approvedDeal?: any;
  parties?: any[];
  currentStage: WorkflowStage;
  timeTracking?: TransactionTimeTracking;
  createdAt?: string;
  blockchainVerified?: boolean;
  blockchainTxId?: string;
  verificationTimestamp?: string;
}

interface WorkflowContextType {
  currentTransaction: Transaction | null;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  currentStage: WorkflowStage | null;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<Transaction | null>;
  updateTransaction: (transaction: Transaction) => Promise<Transaction | null>;
  advanceStage: (transactionId: string | Transaction, stage: WorkflowStage) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  updateTimeTracking: (transactionId: string) => void;
  getTimeElapsedFormatted: (transactionIdOrObject: string | Transaction) => string;
  getTimeInStageFormatted: (transactionIdOrObject: string | Transaction) => string;
  generateMetrics: (transactionId: string) => Metrics;
  navigateToRiskAssessment: () => Transaction | null;
  retryLastFailedOperation: () => Promise<void>;
}

const defaultContext: WorkflowContextType = {
  currentTransaction: null,
  transactions: [],
  loading: false,
  error: null,
  currentStage: null,
  setCurrentTransaction: () => {},
  addTransaction: async () => null,
  updateTransaction: async () => null,
  advanceStage: async () => {},
  fetchTransactions: async () => {},
  updateTimeTracking: () => {},
  getTimeElapsedFormatted: () => '0d 0h 0m',
  getTimeInStageFormatted: () => '0d 0h 0m',
  generateMetrics: () => ({
    complianceScore: 0,
    regulatoryCompliance: { keyPoints: [], complianceCoverage: 0, riskExposures: [] },
    legalHistoryScore: 0,
    legalRecord: { judgmentsCount: 0, litigationRisk: 0, recentCases: 0, pendingLitigation: 0 },
    businessDurationScore: 0,
    businessAge: {
      yearsInBusiness: 0,
      industryPeerPercentile: 0,
      stabilityRating: 0,
      historicalConsistency: 0,
    },
    industryReputationScore: 0,
    reputation: {
      marketPerception: 0,
      publicSentiment: 0,
      customerSatisfaction: 0,
      industryAwards: 0,
    },
    businessStabilityScore: 0,
    stability: {
      cashFlowConsistency: 0,
      revenueGrowth: 0,
      employeeRetention: 0,
      marketPositionStrength: 0,
    },
  }),
  navigateToRiskAssessment: () => null,
  retryLastFailedOperation: async () => {},
};

const WorkflowContext = createContext<WorkflowContextType>(defaultContext);

export const useWorkflow = () => useContext(WorkflowContext);

interface WorkflowProviderProps {
  children: React.ReactNode;
}

export const WorkflowProvider = ({ children }: WorkflowProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPageVisit, setLastPageVisit] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const location = useLocation();

  // Get navigate function (for use in callbacks)
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  // Update the ref when navigate changes
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  // Optimized transaction fetching with caching and deduplication
  const fetchTransactions = useCallback(
    async (force: boolean = false) => {
      // Prevent multiple simultaneous fetches
      if (isFetching && !force) {
        console.log('[WorkflowContext] Fetch already in progress, skipping duplicate request');
        return;
      }

      // Check if we need to fetch (either forced or we don't have data yet)
      if (!force && transactions.length > 0) {
        console.log('[WorkflowContext] Using cached transactions, skipping fetch');
        return;
      }

      setLoading(true);
      setError(null);
      setIsFetching(true);
      setLastOperation('fetchTransactions');

      console.log('[WorkflowContext] Starting transaction fetch...');

      // Track performance of transaction loading
      const endTracking = performanceMonitor.monitorTransactionLoading();

      try {
        // Add a timeout to prevent hanging requests
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Transaction fetch timed out after 8 seconds')), 8000);
        });

        // Race the actual request against the timeout
        const data = await Promise.race([transactionService.getTransactions(), timeoutPromise]);

        // Log the response for debugging
        console.log('[WorkflowContext] Transaction data received:', data?.length || 0, 'items');

        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn('[WorkflowContext] No transactions returned from service');
          throw new Error('No transactions returned from service');
        }

        // Make sure we're setting an array (defensive)
        setTransactions(Array.isArray(data) ? [...data] : []);

        console.log('[WorkflowContext] Transactions loaded successfully:', data.length);

        // If no current transaction is set, set the first one
        if (!currentTransaction && data.length > 0) {
          setCurrentTransaction(data[0]);
        }

        setLoading(false);
        setIsFetching(false);
        endTracking();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[WorkflowContext] Failed to fetch transactions:', errorMessage, err);
        setError(`Failed to fetch transactions: ${errorMessage}`);

        // Track the error in performance monitor
        performanceMonitor.trackError('transaction_loading', errorMessage);

        // Check if we have mock data to fall back to
        try {
          console.log('[WorkflowContext] Attempting to use mock data as fallback');
          const mockData = await import('../api/mockData').then(module => module.mockTransactions);

          if (mockData && mockData.length > 0) {
            console.log('[WorkflowContext] Using mock data fallback:', mockData.length);
            setTransactions([...mockData]);

            // If no current transaction is set, set the first one from mock data
            if (!currentTransaction && mockData.length > 0) {
              setCurrentTransaction(mockData[0]);
            }
          } else {
            console.error('[WorkflowContext] Mock data fallback also failed');
          }
        } catch (fallbackErr) {
          console.error('[WorkflowContext] Error loading mock data fallback:', fallbackErr);
        }

        setLoading(false);
        setIsFetching(false);
      }
    },
    [transactions.length, currentTransaction, isFetching]
  );

  // Retry mechanism for failed operations
  const retryLastFailedOperation = useCallback(async () => {
    console.log('[WorkflowContext] Retrying last failed operation:', lastOperation);

    if (lastOperation === 'fetchTransactions') {
      await fetchTransactions(true);
    } else if (lastOperation === 'updateTransaction' && currentTransaction) {
      await updateTransaction(currentTransaction);
    } else if (lastOperation === 'advanceStage' && currentTransaction) {
      // Can't retry advance stage without knowing the target stage
      setError('Cannot retry advance stage operation without additional information');
    } else {
      setError('No operation to retry or retry not supported for this operation');
    }
  }, [lastOperation, fetchTransactions, currentTransaction]);

  // Fetch transactions on component mount with improved error handling
  useEffect(() => {
    const initialLoad = async () => {
      try {
        await fetchTransactions();
      } catch (err) {
        console.error('[WorkflowContext] Error during initial transaction load:', err);
        setError('Failed to load initial transactions. Please try again.');
      }
    };

    initialLoad();
  }, [fetchTransactions]);

  // Track page visits for time tracking with debounce to avoid excessive updates
  useEffect(() => {
    const path = location.pathname;
    const currentTime = new Date().toISOString();

    // Debounce the page visit tracking to avoid too many updates
    const timeoutId = setTimeout(() => {
      setLastPageVisit(path);

      if (currentTransaction) {
        try {
          // Update last page visit time
          const updatedTransaction = { ...currentTransaction };
          
          // Ensure timeTracking is initialized
          if (!updatedTransaction.timeTracking) {
            initializeTimeTracking(updatedTransaction);
          }

          // Add additional safety check - if timeTracking is still undefined after initialization
          // or if timeMetrics is undefined, don't proceed
          if (!updatedTransaction.timeTracking || !updatedTransaction.timeTracking.timeMetrics) {
            console.error('[WorkflowContext] Error: timeTracking or timeMetrics is undefined after initialization');
            return;
          }

          // Now we know timeTracking and timeMetrics exist
          const timeMetrics = updatedTransaction.timeTracking.timeMetrics;
          
          // Initialize lastPageVisit and totalTimeSpent if they don't exist
          if (!timeMetrics.lastPageVisit) {
            timeMetrics.lastPageVisit = {};
          }
          
          if (!timeMetrics.totalTimeSpent) {
            timeMetrics.totalTimeSpent = {};
          }
            
          // Calculate time spent on previous page
          const prevPath = lastPageVisit;
          const lastVisitTime = timeMetrics.lastPageVisit[prevPath];

          if (prevPath && lastVisitTime) {
            const timeSpent = new Date().getTime() - new Date(lastVisitTime).getTime();
            timeMetrics.totalTimeSpent[prevPath] =
              (timeMetrics.totalTimeSpent[prevPath] || 0) + timeSpent;
          }

          // Update the current page visit time
          timeMetrics.lastPageVisit[path] = currentTime;

          // Calculate total elapsed time
          if (updatedTransaction.createdAt) {
            timeMetrics.totalTimeElapsed =
              new Date().getTime() - new Date(updatedTransaction.createdAt).getTime();
          }

          // Don't await here to avoid blocking
          updateTransaction(updatedTransaction).catch(err => {
            console.error('[WorkflowContext] Error updating page visit tracking:', err);
          });
        } catch (err) {
          // Catch any errors to prevent the app from crashing
          console.error('[WorkflowContext] Error in page visit tracking:', err);
        }
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, currentTransaction?.id, lastPageVisit]);

  const initializeTimeTracking = useCallback((transaction: Transaction) => {
    const now = new Date().toISOString();
    if (!transaction.createdAt) {
      transaction.createdAt = now;
    }

    // Create a robust default timeMetrics object with all required properties
    const defaultTimeMetrics: TimeMetrics = {
      createdAt: transaction.createdAt,
      stageStartTimes: {
        [transaction.currentStage]: now,
      },
      stageDurations: {},
      lastPageVisit: {},
      totalTimeSpent: {},
      totalTimeElapsed: 0,
    };

    // Create the timeTracking object with all defaults explicitly set
    transaction.timeTracking = {
      metrics: generateMetrics(transaction.id),
      timeMetrics: defaultTimeMetrics,
    };

    // Add defensive check to ensure timeTracking was properly initialized
    if (!transaction.timeTracking || !transaction.timeTracking.timeMetrics) {
      console.error('[WorkflowContext] Failed to initialize timeTracking properly');
      
      // Force initialization of the minimal required structure
      transaction.timeTracking = {
        metrics: generateMetrics(transaction.id),
        timeMetrics: {
          createdAt: now,
          stageStartTimes: {},
          stageDurations: {},
          lastPageVisit: {},
          totalTimeSpent: {},
          totalTimeElapsed: 0,
        }
      };
    }

    return transaction;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateMetrics = useCallback(
    (transactionId: string): Metrics => {
      // Function to generate random metrics based on transaction data
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return defaultContext.generateMetrics('');

      // Generate metrics based on transaction data - this would normally be calculated from actual data
      const metrics: Metrics = {
        complianceScore: Math.round(Math.random() * 40) + 60, // 60-100
        regulatoryCompliance: {
          keyPoints: ['KYC completed', 'AML verified', 'BSA requirements met'],
          complianceCoverage: Math.round(Math.random() * 30) + 70, // 70-100%
          riskExposures: [
            { name: 'OFAC', value: Math.round(Math.random() * 20) + 5 },
            { name: 'PEP', value: Math.round(Math.random() * 15) + 5 },
          ],
        },
        legalHistoryScore: Math.round(Math.random() * 30) + 70, // 70-100
        legalRecord: {
          judgmentsCount: Math.round(Math.random() * 3),
          litigationRisk: Math.round(Math.random() * 30) + 10, // 10-40
          recentCases: Math.round(Math.random() * 2),
          pendingLitigation: Math.round(Math.random() * 2),
        },
        businessDurationScore: Math.round(Math.random() * 40) + 60, // 60-100
        businessAge: {
          yearsInBusiness: Math.round(Math.random() * 15) + 5, // 5-20 years
          industryPeerPercentile: Math.round(Math.random() * 40) + 60, // 60-100
          stabilityRating: Math.round(Math.random() * 20) + 80, // 80-100
          historicalConsistency: Math.round(Math.random() * 20) + 80, // 80-100
        },
        industryReputationScore: Math.round(Math.random() * 30) + 70, // 70-100
        reputation: {
          marketPerception: Math.round(Math.random() * 20) + 80, // 80-100
          publicSentiment: Math.round(Math.random() * 20) + 80, // 80-100
          customerSatisfaction: Math.round(Math.random() * 20) + 80, // 80-100
          industryAwards: Math.round(Math.random() * 5), // 0-5 awards
        },
        businessStabilityScore: Math.round(Math.random() * 30) + 70, // 70-100
        stability: {
          cashFlowConsistency: Math.round(Math.random() * 20) + 80, // 80-100
          revenueGrowth: Math.round(Math.random() * 20) + 5, // 5-25%
          employeeRetention: Math.round(Math.random() * 20) + 80, // 80-100
          marketPositionStrength: Math.round(Math.random() * 20) + 80, // 80-100
        },
      };

      return metrics;
    },
    [transactions]
  );

  const updateTimeTracking = useCallback(
    (transactionId: string) => {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      const updatedTransaction = { ...transaction };
      if (!updatedTransaction.timeTracking) {
        initializeTimeTracking(updatedTransaction);
      }

      // Update transaction with new time tracking data - we don't await this to avoid blocking
      // Using a nested function rather than including updateTransaction in the dependency array
      const saveTransaction = () => {
        updateTransaction(updatedTransaction).catch(err => {
          console.error('[WorkflowContext] Error updating time tracking:', err);
        });
      };
      saveTransaction();
    },
    [transactions, initializeTimeTracking]
  );

  const formatTimeElapsed = useCallback((milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;

    return `${days}d ${remainingHours}h ${remainingMinutes}m`;
  }, []);

  const getTimeElapsedFormatted = useCallback(
    (transactionIdOrObject: string | Transaction): string => {
      let transaction: Transaction | undefined;

      // Allow passing transaction object directly to avoid unnecessary lookups
      if (typeof transactionIdOrObject === 'string') {
        transaction = transactions.find(t => t.id === transactionIdOrObject);
      } else {
        transaction = transactionIdOrObject;
      }

      if (!transaction || (!transaction?.timeTracking?.timeMetrics?.totalTimeElapsed && !transaction?.createdAt)) {
        return '0d 0h 0m';
      }

      // If we have cached totalTimeElapsed, use it
      if (transaction.timeTracking?.timeMetrics?.totalTimeElapsed) {
        return formatTimeElapsed(transaction.timeTracking.timeMetrics.totalTimeElapsed);
      }

      // Otherwise calculate it from createdAt
      if (transaction.createdAt) {
        const createdTime = new Date(transaction.createdAt).getTime();
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - createdTime;
        return formatTimeElapsed(elapsedTime);
      }

      return '0d 0h 0m';
    },
    [transactions, formatTimeElapsed]
  );

  const getTimeInStageFormatted = useCallback(
    (transactionIdOrObject: string | Transaction): string => {
      let transaction: Transaction | undefined;

      // Allow passing transaction object directly to avoid unnecessary lookups
      if (typeof transactionIdOrObject === 'string') {
        transaction = transactions.find(t => t.id === transactionIdOrObject);
      } else {
        transaction = transactionIdOrObject;
      }

      if (!transaction) return '0d 0h 0m';

      // Get the current stage
      const currentStage = transaction.currentStage;

      // If we don't have time tracking data or stageStartTimes isn't initialized, return default
      if (!transaction.timeTracking?.timeMetrics?.stageStartTimes || 
          !transaction.timeTracking?.timeMetrics?.stageStartTimes[currentStage]) {
        return '0d 0h 0m';
      }

      // Calculate time in current stage
      const stageStartTime = new Date(
        transaction.timeTracking.timeMetrics.stageStartTimes[currentStage]
      ).getTime();
      const currentTime = new Date().getTime();
      const timeInStage = currentTime - stageStartTime;

      return formatTimeElapsed(timeInStage);
    },
    [transactions, formatTimeElapsed]
  );

  // Memoized addTransaction function with improved error handling
  const addTransaction = useCallback(
    async (transactionData: Omit<Transaction, 'id'>): Promise<Transaction | null> => {
      setLoading(true);
      setError(null);
      setLastOperation('addTransaction');

      console.log('[WorkflowContext] Adding new transaction:', transactionData);

      try {
        const newTransaction = await transactionService.createTransaction(transactionData);

        if (newTransaction) {
          console.log('[WorkflowContext] Transaction added successfully:', newTransaction.id);

          // Update the transactions list with the new transaction
          setTransactions(prevTransactions => [...prevTransactions, newTransaction]);

          // Set the new transaction as current
          setCurrentTransaction(newTransaction);

          setLoading(false);
          return newTransaction;
        } else {
          throw new Error('Failed to create transaction');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[WorkflowContext] Error adding transaction:', errorMessage, err);
        setError(`Failed to add transaction: ${errorMessage}`);
        setLoading(false);
        return null;
      }
    },
    []
  );

  // Memoized updateTransaction function with optimistic updates
  const updateTransaction = useCallback(
    async (updatedTransaction: Transaction): Promise<Transaction | null> => {
      // Don't set global loading state for updates to avoid UI flicker
      setError(null);
      setLastOperation('updateTransaction');

      if (!updatedTransaction.id) {
        console.error('[WorkflowContext] Cannot update transaction without ID');
        setError('Cannot update transaction without ID');
        return null;
      }

      // Do an optimistic update to improve UI responsiveness
      setTransactions(prevTransactions =>
        prevTransactions.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
      );

      // If this is the current transaction, update that too
      if (currentTransaction?.id === updatedTransaction.id) {
        setCurrentTransaction(updatedTransaction);
      }

      try {
        const result = await transactionService.updateTransaction(updatedTransaction);

        if (result) {
          console.log('[WorkflowContext] Transaction updated successfully:', result.id);

          // Ensure our state is in sync with what came back from the server
          setTransactions(prevTransactions =>
            prevTransactions.map(t => (t.id === result.id ? result : t))
          );

          // Update current transaction if relevant
          if (currentTransaction?.id === result.id) {
            setCurrentTransaction(result);
          }

          return result;
        } else {
          throw new Error('Failed to update transaction');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('[WorkflowContext] Error updating transaction:', errorMessage, err);
        setError(`Failed to update transaction: ${errorMessage}`);

        // Revert the optimistic update on failure
        await fetchTransactions(true);

        return null;
      }
    },
    [currentTransaction, fetchTransactions]
  );

  // Memoized advanceStage function
  const advanceStage = useCallback(
    async (transactionIdOrObject: string | Transaction, stage: WorkflowStage): Promise<void> => {
      setLoading(true);
      setError(null);
      setLastOperation('advanceStage');

      let transactionId: string;
      let transaction: Transaction | undefined;

      if (typeof transactionIdOrObject === 'string') {
        transactionId = transactionIdOrObject;
        transaction = transactions.find(t => t.id === transactionId);
      } else {
        transactionId = transactionIdOrObject.id;
        transaction = transactionIdOrObject;
      }

      if (!transaction) {
        console.error(
          `[WorkflowContext] Cannot advance stage: transaction not found with ID ${transactionId}`
        );
        setError(`Transaction not found with ID ${transactionId}`);
        setLoading(false);
        return;
      }

      try {
        // First, update the transaction in our local state for better UX
        const now = new Date().toISOString();
        const updatedTransaction = { ...transaction };

        // Initialize time tracking if it doesn't exist
        if (!updatedTransaction.timeTracking) {
          initializeTimeTracking(updatedTransaction);
        }

        // Update stage information
        const prevStage = updatedTransaction.currentStage;
        updatedTransaction.currentStage = stage;

        // Update time tracking data for stages
        if (updatedTransaction.timeTracking) {
          const timeMetrics = updatedTransaction.timeTracking.timeMetrics;
          
          // Ensure all required objects are initialized
          if (!timeMetrics.stageStartTimes) {
            timeMetrics.stageStartTimes = {};
          }
          
          if (!timeMetrics.stageDurations) {
            timeMetrics.stageDurations = {};
          }
          
          // Record stage duration for the previous stage
          const stageStartTime = timeMetrics.stageStartTimes[prevStage];
          if (stageStartTime) {
            const stageEndTime = now;
            const stageDuration =
              new Date(stageEndTime).getTime() - new Date(stageStartTime).getTime();
            timeMetrics.stageDurations[prevStage] = stageDuration;
          }

          // Set start time for the new stage
          timeMetrics.stageStartTimes[stage] = now;
        }

        // Optimistically update our state
        setTransactions(prevTransactions =>
          prevTransactions.map(t => (t.id === transactionId ? updatedTransaction : t))
        );

        if (currentTransaction?.id === transactionId) {
          setCurrentTransaction(updatedTransaction);
        }

        // Send the update to the service
        const result = await transactionService.updateTransactionStage(transactionId, stage);

        if (result) {
          console.log(`[WorkflowContext] Advanced transaction ${transactionId} to stage ${stage}`);

          // Sync with server state
          setTransactions(prevTransactions =>
            prevTransactions.map(t => (t.id === transactionId ? result : t))
          );

          if (currentTransaction?.id === transactionId) {
            setCurrentTransaction(result);
          }
        } else {
          throw new Error(`Failed to advance transaction ${transactionId} to stage ${stage}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[WorkflowContext] Error advancing transaction stage:`, errorMessage, err);
        setError(`Failed to advance transaction stage: ${errorMessage}`);

        // Reload transactions to ensure we're back in sync
        await fetchTransactions(true);
      } finally {
        setLoading(false);
      }
    },
    [transactions, currentTransaction, initializeTimeTracking, fetchTransactions]
  );

  // Navigate to risk assessment (using useMemo for stability)
  const navigateToRiskAssessment = useCallback((): Transaction | null => {
    navigateRef.current('/risk-assessment');
    return currentTransaction;
  }, [currentTransaction]);

  // Derive current stage from currentTransaction (memoized)
  const currentStage = useMemo(
    () => currentTransaction?.currentStage || null,
    [currentTransaction]
  );

  // Create a memoized value for the context to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentTransaction,
      transactions,
      loading,
      error,
      currentStage,
      setCurrentTransaction,
      addTransaction,
      updateTransaction,
      advanceStage,
      fetchTransactions,
      updateTimeTracking,
      getTimeElapsedFormatted,
      getTimeInStageFormatted,
      generateMetrics,
      navigateToRiskAssessment,
      retryLastFailedOperation,
    }),
    [
      currentTransaction,
      transactions,
      loading,
      error,
      currentStage,
      addTransaction,
      updateTransaction,
      advanceStage,
      fetchTransactions,
      updateTimeTracking,
      getTimeElapsedFormatted,
      getTimeInStageFormatted,
      generateMetrics,
      navigateToRiskAssessment,
      retryLastFailedOperation,
    ]
  );

  return <WorkflowContext.Provider value={contextValue}>{children}</WorkflowContext.Provider>;
};
