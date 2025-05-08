import { useState, useEffect, useCallback } from 'react';
import BlockchainService from '../services/blockchainService';
import {
  CommercialInstrument,
  PortfolioSummary,
  Transaction
} from '../services/blockchainService';

// Hook for managing blockchain data
const useBlockchainData = () => {
  // State for instruments (commercial papers, bonds, etc.)
  const [instruments, setInstruments] = useState<CommercialInstrument[]>([]);
  const [instrumentsLoading, setInstrumentsLoading] = useState(false);
  const [instrumentsError, setInstrumentsError] = useState<string | null>(null);
  
  // State for portfolio
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);
  
  // State for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  
  // Fetch all instruments
  const fetchInstruments = useCallback(async () => {
    setInstrumentsLoading(true);
    setInstrumentsError(null);
    
    try {
      const data = await BlockchainService.getInstruments();
      setInstruments(data);
    } catch (error) {
      setInstrumentsError(error instanceof Error ? error.message : 'Failed to fetch instruments');
      console.error('Error fetching instruments:', error);
    } finally {
      setInstrumentsLoading(false);
    }
  }, []);
  
  // Fetch portfolio data
  const fetchPortfolio = useCallback(async () => {
    setPortfolioLoading(true);
    setPortfolioError(null);
    
    try {
      const data = await BlockchainService.getPortfolio();
      setPortfolio(data);
    } catch (error) {
      setPortfolioError(error instanceof Error ? error.message : 'Failed to fetch portfolio');
      console.error('Error fetching portfolio:', error);
    } finally {
      setPortfolioLoading(false);
    }
  }, []);
  
  // Fetch transaction history
  const fetchTransactions = useCallback(async (limit = 10) => {
    setTransactionsLoading(true);
    setTransactionsError(null);
    
    try {
      const data = await BlockchainService.getTransactions(limit);
      setTransactions(data);
    } catch (error) {
      setTransactionsError(error instanceof Error ? error.message : 'Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);
  
  // Execute a transaction
  const executeTransaction = useCallback(async (type: 'buy' | 'sell', instrumentId: number, amount: number) => {
    try {
      const transaction = await BlockchainService.executeTransaction(type, instrumentId, amount);
      
      // Update transactions list immediately with pending transaction
      setTransactions(prev => [transaction, ...prev]);
      
      // After the transaction might be processed in the background, 
      // we can refresh our data after a delay
      setTimeout(() => {
        fetchPortfolio();
        fetchTransactions();
      }, 3500); // Wait longer than the simulated transaction processing time (3000ms)
      
      return transaction;
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  }, [fetchPortfolio, fetchTransactions]);
  
  // Fetch market data for a specific instrument
  const fetchMarketData = useCallback(async (instrumentId: number, period: string = '24h') => {
    try {
      return await BlockchainService.getMarketData(instrumentId, period);
    } catch (error) {
      console.error(`Error fetching market data for instrument ${instrumentId}:`, error);
      throw error;
    }
  }, []);
  
  // Initial data fetch
  useEffect(() => {
    fetchInstruments();
    fetchPortfolio();
    fetchTransactions();
    
    // Set up periodic refresh (every 30 seconds)
    const refreshInterval = setInterval(() => {
      fetchInstruments();
      fetchPortfolio();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchInstruments, fetchPortfolio, fetchTransactions]);
  
  return {
    // Data
    instruments,
    portfolio,
    transactions,
    
    // Loading states
    instrumentsLoading,
    portfolioLoading,
    transactionsLoading,
    
    // Error states
    instrumentsError,
    portfolioError,
    transactionsError,
    
    // Methods
    fetchInstruments,
    fetchPortfolio,
    fetchTransactions,
    executeTransaction,
    fetchMarketData
  };
};

export default useBlockchainData; 