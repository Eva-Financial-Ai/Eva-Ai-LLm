import { v4 as uuidv4 } from 'uuid';
import { AssetPressData } from '../components/blockchain/AssetPressFeature';
import { SmartContract, TokenBalance } from '../components/blockchain/MyPortfolioTypes';

// Types for commercial instruments
export interface CommercialInstrument {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  marketCap: number;
  volume24h: number;
  totalSupply: number;
  description: string;
  contractAddress: string;
}

// Types for transactions
export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  instrumentId: number;
  instrument: string;
  symbol: string;
  amount: number;
  price: number;
  total: number;
  fee: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  hash: string;
}

// Types for portfolio assets
export interface PortfolioAsset {
  id: number;
  name: string;
  symbol: string;
  balance: number;
  value: number;
  costBasis: number;
  profitLoss: number;
}

// Types for portfolio summary
export interface PortfolioSummary {
  totalValue: number;
  totalCostBasis: number;
  totalProfitLoss: number;
  percentChange: number;
  instruments: PortfolioAsset[];
}

// Types for tokenized assets
export interface TokenizedAsset {
  id: string;
  assetName: string;
  assetType: string;
  tokenType: string;
  amount: number;
  maturityDate?: string;
  description: string;
  tokenAddress: string;
  createdAt: string;
  status: 'pending' | 'active' | 'matured';
}

// Mock data for commercial instruments
const mockInstruments: CommercialInstrument[] = [
  { 
    id: 1, 
    name: 'Commercial Paper', 
    symbol: 'CP', 
    price: 98.75, 
    change: +0.25, 
    marketCap: 985000000,
    volume24h: 15200000,
    totalSupply: 10000000,
    description: 'Short-term debt instrument issued by corporations to meet short-term liabilities',
    contractAddress: '0xabc123def456789abcdef1234567890abcdef123'
  },
  { 
    id: 2, 
    name: 'Treasury Bills', 
    symbol: 'TB', 
    price: 995.50, 
    change: -0.10, 
    marketCap: 19950000000,
    volume24h: 560000000,
    totalSupply: 20000000,
    description: 'Short-term U.S. government debt obligation backed by the Treasury Department',
    contractAddress: '0xdef456789abcdef1234567890abcdef123abc123'
  },
  { 
    id: 3, 
    name: 'Corporate Bonds', 
    symbol: 'CB', 
    price: 102.25, 
    change: +1.15, 
    marketCap: 5112500000,
    volume24h: 245000000,
    totalSupply: 50000000,
    description: 'Fixed-income security issued by corporations to raise capital for expansions or operations',
    contractAddress: '0x123abc456def789abc1234567890abcdef123def'
  },
  { 
    id: 4, 
    name: 'Municipal Bonds', 
    symbol: 'MB', 
    price: 105.50, 
    change: +0.45, 
    marketCap: 3165000000,
    volume24h: 87500000,
    totalSupply: 30000000,
    description: 'Debt securities issued by states, cities, counties to finance capital projects',
    contractAddress: '0x789abc123def456789abcdef1234567890abc123'
  },
  { 
    id: 5, 
    name: 'Certificate of Deposit', 
    symbol: 'CD', 
    price: 100.00, 
    change: 0.00, 
    marketCap: 1500000000,
    volume24h: 32500000,
    totalSupply: 15000000,
    description: 'Time deposit product that provides higher interest rates than traditional savings accounts',
    contractAddress: '0x456def789abc1234567890abcdef123abc456def'
  }
];

// Mock portfolio data
let mockPortfolio: PortfolioSummary = {
  totalValue: 156750.25,
  totalCostBasis: 153115.00,
  totalProfitLoss: 3635.25,
  percentChange: 2.35,
  instruments: [
    { 
      id: 1, 
      name: 'Commercial Paper', 
      symbol: 'CP', 
      balance: 50000, 
      value: 49375.00,
      costBasis: 48500.00,
      profitLoss: 875.00
    },
    { 
      id: 3, 
      name: 'Corporate Bonds', 
      symbol: 'CB', 
      balance: 1000, 
      value: 102250.00,
      costBasis: 99750.00,
      profitLoss: 2500.00
    },
    { 
      id: 4, 
      name: 'Municipal Bonds', 
      symbol: 'MB', 
      balance: 50, 
      value: 5275.25,
      costBasis: 4865.00,
      profitLoss: 410.25
    }
  ]
};

// Mock transactions
let mockTransactions: Transaction[] = [
  { 
    id: 't1', 
    type: 'buy', 
    instrumentId: 1,
    instrument: 'Commercial Paper', 
    symbol: 'CP', 
    amount: 10000, 
    price: 98.50, 
    total: 9850.00,
    fee: 9.85,
    timestamp: '2023-10-25T14:30:00', 
    status: 'completed',
    hash: '0xabc123def456789abcdef1234567890abcdef123abc123def4567890'
  },
  { 
    id: 't2', 
    type: 'sell', 
    instrumentId: 2,
    instrument: 'Treasury Bills', 
    symbol: 'TB', 
    amount: 5000, 
    price: 995.75, 
    total: 4978750.00,
    fee: 49.78,
    timestamp: '2023-10-24T09:15:00', 
    status: 'completed',
    hash: '0xdef456789abcdef1234567890abcdef123abc123def456789abcdef'
  },
  { 
    id: 't3', 
    type: 'buy', 
    instrumentId: 3,
    instrument: 'Corporate Bonds', 
    symbol: 'CB', 
    amount: 200, 
    price: 101.10, 
    total: 20220.00,
    fee: 20.22,
    timestamp: '2023-10-22T11:45:00', 
    status: 'completed',
    hash: '0x123abc456def789abc1234567890abcdef123def456789abcdef1234'
  }
];

// Mock smart wallet data
const mockWalletAddress = '0x7f23d325dF10Ad18C6bbDB3aAE3d4d1a4E42cB70';
let mockWalletBalance = 187650.50;

// Mock token balances for the smart wallet
const mockTokenBalances: TokenBalance[] = [
  {
    id: 'token1',
    name: 'Commercial Paper Token',
    symbol: 'CPT',
    amount: 50000,
    value: 49375.00,
    icon: 'https://via.placeholder.com/32/4f46e5/FFFFFF/?text=CPT'
  },
  {
    id: 'token2',
    name: 'Corporate Bond Token',
    symbol: 'CBT',
    amount: 1000,
    value: 102250.00,
    icon: 'https://via.placeholder.com/32/3b82f6/FFFFFF/?text=CBT'
  },
  {
    id: 'token3',
    name: 'Treasury Bill Token',
    symbol: 'TBT',
    amount: 2500,
    value: 24887.50
  }
];

// Mock smart contracts
const mockSmartContracts: SmartContract[] = [
  {
    id: 'contract1',
    name: 'Commercial Paper Contract',
    description: 'Manages issuance and trading of tokenized commercial paper',
    language: 'python',
    deployedAt: '2023-09-15T10:00:00Z',
    functions: [
      {
        name: 'issueCommercialPaper',
        description: 'Issue new commercial paper tokens',
        params: [
          { name: 'issuer', type: 'string', description: 'Name of the issuing entity' },
          { name: 'amount', type: 'number', description: 'Face value amount' },
          { name: 'maturityDays', type: 'number', description: 'Days until maturity' }
        ]
      },
      {
        name: 'transferPaper',
        description: 'Transfer commercial paper tokens to another wallet',
        params: [
          { name: 'tokenId', type: 'string', description: 'ID of the commercial paper token' },
          { name: 'recipient', type: 'string', description: 'Recipient wallet address' }
        ]
      }
    ]
  },
  {
    id: 'contract2',
    name: 'Treasury Bill Manager',
    description: 'Smart contract for managing treasury bill tokenization and trading',
    language: 'python',
    deployedAt: '2023-10-05T14:30:00Z',
    functions: [
      {
        name: 'issueTBill',
        description: 'Issue new treasury bill tokens',
        params: [
          { name: 'amount', type: 'number', description: 'Face value amount' },
          { name: 'maturityDays', type: 'number', description: 'Days until maturity' },
          { name: 'interestRate', type: 'number', description: 'Annual interest rate percentage' }
        ]
      },
      {
        name: 'redeemAtMaturity',
        description: 'Redeem treasury bill token at maturity',
        params: [
          { name: 'tokenId', type: 'string', description: 'ID of the treasury bill token' }
        ]
      }
    ]
  },
  {
    id: 'contract3',
    name: 'Asset Tokenization Engine',
    description: 'Generic contract for tokenizing various types of financial assets',
    language: 'solidity',
    deployedAt: '2023-08-20T09:15:00Z',
    functions: [
      {
        name: 'tokenizeAsset',
        description: 'Convert a traditional asset into blockchain tokens',
        params: [
          { name: 'assetType', type: 'string', description: 'Type of asset (e.g., bond, invoice, etc.)' },
          { name: 'assetValue', type: 'number', description: 'Total value of the asset' },
          { name: 'tokenName', type: 'string', description: 'Name for the created tokens' },
          { name: 'tokenSymbol', type: 'string', description: 'Symbol for the created tokens' }
        ]
      },
      {
        name: 'fractionalize',
        description: 'Split a tokenized asset into multiple fractions',
        params: [
          { name: 'tokenId', type: 'string', description: 'ID of the token to fractionalize' },
          { name: 'fractions', type: 'number', description: 'Number of fractions to create' }
        ]
      }
    ]
  }
];

// Mock tokenized assets
let mockTokenizedAssets: TokenizedAsset[] = [
  {
    id: 'asset1',
    assetName: 'Commercial Paper Series A',
    assetType: 'commercialPaper',
    tokenType: 'fungible',
    amount: 500000,
    maturityDate: '2024-01-15T00:00:00Z',
    description: 'Short-term corporate debt for working capital',
    tokenAddress: '0x8a7b4c65d23f9fa123a876bce3c69c87df4310ea',
    createdAt: '2023-10-15T14:30:00Z',
    status: 'active'
  },
  {
    id: 'asset2',
    assetName: 'NYC Municipal Bond 2023',
    assetType: 'bond',
    tokenType: 'STO',
    amount: 1000000,
    maturityDate: '2028-06-30T00:00:00Z',
    description: 'Municipal bond for New York City infrastructure projects',
    tokenAddress: '0x3c8a721f5a72d652ced6e4f22df10187eaec8bf2',
    createdAt: '2023-08-22T10:15:00Z',
    status: 'active'
  }
];

// Simulate price updating
const startPriceUpdates = () => {
  setInterval(() => {
    mockInstruments.forEach(instrument => {
      // Random price movement between -0.5% and +0.5%
      const priceMovement = (Math.random() - 0.45) * instrument.price * 0.01;
      instrument.price = parseFloat((instrument.price + priceMovement).toFixed(2));
      instrument.change = parseFloat((instrument.change + (priceMovement / instrument.price) * 100).toFixed(2));
      
      // Update portfolio values if the user holds this instrument
      const portfolioAsset = mockPortfolio.instruments.find(asset => asset.id === instrument.id);
      if (portfolioAsset) {
        portfolioAsset.value = parseFloat((portfolioAsset.balance * instrument.price / 100).toFixed(2));
        portfolioAsset.profitLoss = parseFloat((portfolioAsset.value - portfolioAsset.costBasis).toFixed(2));
        
        // Recalculate totals
        mockPortfolio.totalValue = mockPortfolio.instruments.reduce((total, asset) => total + asset.value, 0);
        mockPortfolio.totalProfitLoss = mockPortfolio.instruments.reduce((total, asset) => total + asset.profitLoss, 0);
        mockPortfolio.percentChange = parseFloat((mockPortfolio.totalProfitLoss / mockPortfolio.totalCostBasis * 100).toFixed(2));
      }
    });
  }, 3000); // Update every 3 seconds
};

// Simulate market activity
const simulateMarketActivity = () => {
  startPriceUpdates();
};

// Start simulation when service is imported
simulateMarketActivity();

// Blockchain Service API
const BlockchainService = {
  // Get all commercial instruments
  getInstruments: async (): Promise<CommercialInstrument[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockInstruments];
  },
  
  // Get a specific instrument by ID
  getInstrument: async (id: number): Promise<CommercialInstrument | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const instrument = mockInstruments.find(inst => inst.id === id);
    return instrument || null;
  },
  
  // Get portfolio summary
  getPortfolio: async (): Promise<PortfolioSummary> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { ...mockPortfolio };
  },
  
  // Get transaction history
  getTransactions: async (limit: number = 10): Promise<Transaction[]> => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...mockTransactions].slice(0, limit);
  },
  
  // Execute a transaction (buy/sell)
  executeTransaction: async (
    type: 'buy' | 'sell', 
    instrumentId: number, 
    amount: number
  ): Promise<Transaction> => {
    // Simulate blockchain processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const instrument = mockInstruments.find(inst => inst.id === instrumentId);
    if (!instrument) {
      throw new Error(`Instrument with ID ${instrumentId} not found`);
    }
    
    // Calculate transaction details
    const price = instrument.price;
    const total = amount * price / 100;
    const fee = total * 0.001; // 0.1% fee
    
    // Create new transaction
    const transaction: Transaction = {
      id: uuidv4(),
      type,
      instrumentId,
      instrument: instrument.name,
      symbol: instrument.symbol,
      amount,
      price,
      total,
      fee,
      timestamp: new Date().toISOString(),
      status: 'pending',
      hash: `0x${Math.random().toString(16).substring(2, 50)}`
    };
    
    // Simulate transaction processing
    setTimeout(() => {
      transaction.status = Math.random() > 0.1 ? 'completed' : 'failed';
      
      // Update portfolio if transaction completed
      if (transaction.status === 'completed') {
        updatePortfolio(transaction);
      }
      
      // Add to transaction history
      mockTransactions.unshift(transaction);
    }, 3000);
    
    return transaction;
  },
  
  // Get market data for charting
  getMarketData: async (instrumentId: number, period: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Generate mock historical data based on current price
    const instrument = mockInstruments.find(inst => inst.id === instrumentId);
    if (!instrument) {
      throw new Error(`Instrument with ID ${instrumentId} not found`);
    }
    
    const dataPoints = period === '24h' ? 24 : 
                      period === '7d' ? 168 : 
                      period === '30d' ? 720 : 
                      period === '1y' ? 365 : 24;
    
    const currentPrice = instrument.price;
    const volatility = 0.02; // 2% volatility
    
    const marketData: Array<{timestamp: string; price: number; volume: number}> = [];
    let price = currentPrice;
    
    for (let i = dataPoints; i > 0; i--) {
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - i);
      
      // Random price movement
      const change = (Math.random() - 0.48) * price * volatility;
      price = Math.max(0.01, price + change);
      
      marketData.push({
        timestamp: timestamp.toISOString(),
        price: parseFloat(price.toFixed(2)),
        volume: Math.round(Math.random() * instrument.volume24h / dataPoints)
      });
    }
    
    return {
      id: instrument.id,
      name: instrument.name,
      symbol: instrument.symbol,
      period,
      data: marketData
    };
  },

  // --- Asset Press Feature APIs ---
  
  // Get tokenized assets
  getTokenizedAssets: async (): Promise<TokenizedAsset[]> => {
    await new Promise(resolve => setTimeout(resolve, 450));
    return [...mockTokenizedAssets];
  },
  
  // Press/tokenize a new asset
  pressAsset: async (assetData: AssetPressData): Promise<TokenizedAsset> => {
    // Simulate blockchain processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a new tokenized asset
    const newAsset: TokenizedAsset = {
      id: uuidv4(),
      assetName: assetData.assetName,
      assetType: assetData.assetType,
      tokenType: assetData.tokenType,
      amount: assetData.amount,
      maturityDate: assetData.maturityDate?.toISOString(),
      description: assetData.description || '',
      tokenAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Simulate token minting process
    setTimeout(() => {
      newAsset.status = 'active';
      // Add to tokenized assets list
      mockTokenizedAssets.push(newAsset);
    }, 4000);
    
    return newAsset;
  },
  
  // --- Py Portfolio Smart Wallet APIs ---
  
  // Get wallet details
  getWalletDetails: async (): Promise<{address: string, balance: number}> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      address: mockWalletAddress,
      balance: mockWalletBalance
    };
  },
  
  // Get token balances
  getTokenBalances: async (): Promise<TokenBalance[]> => {
    await new Promise(resolve => setTimeout(resolve, 350));
    return [...mockTokenBalances];
  },
  
  // Get smart contracts
  getSmartContracts: async (): Promise<SmartContract[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockSmartContracts];
  },
  
  // Execute a smart contract function
  executeSmartContract: async (
    contractId: string, 
    functionName: string, 
    params: any
  ): Promise<any> => {
    // Simulate blockchain processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const contract = mockSmartContracts.find(c => c.id === contractId);
    if (!contract) {
      throw new Error(`Contract with ID ${contractId} not found`);
    }
    
    const contractFunction = contract.functions.find(f => f.name === functionName);
    if (!contractFunction) {
      throw new Error(`Function ${functionName} not found in contract ${contract.name}`);
    }
    
    // Simulate function result based on the type of function
    let result = {};
    if (functionName.toLowerCase().includes('issue') || functionName.toLowerCase().includes('tokenize')) {
      // Creation functions
      result = {
        success: true,
        tokenId: uuidv4(),
        txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
        status: 'completed'
      };
    } else if (functionName.toLowerCase().includes('transfer')) {
      // Transfer functions
      result = {
        success: true,
        txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
        status: 'completed',
        transferredAt: new Date().toISOString()
      };
    } else {
      // Generic function response
      result = {
        success: true,
        txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
        status: 'completed',
        executedAt: new Date().toISOString()
      };
    }
    
    return result;
  },
  
  // Transfer funds from wallet
  transferFunds: async (amount: number, to: string): Promise<any> => {
    // Simulate blockchain processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    if (!to || to.trim() === '') {
      throw new Error('Recipient address is required');
    }
    
    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    // Simulate transaction
    const result = {
      success: true,
      amount,
      recipient: to,
      txHash: `0x${Math.random().toString(16).substring(2, 50)}`,
      status: 'completed',
      timestamp: new Date().toISOString()
    };
    
    // Update mock wallet balance
    mockWalletBalance -= amount;
    
    return result;
  }
};

// Helper to update portfolio after a transaction
const updatePortfolio = (transaction: Transaction) => {
  const { instrumentId, amount, price, type, total } = transaction;
  
  // Find if the user already has this instrument
  const existingAsset = mockPortfolio.instruments.find(asset => asset.id === instrumentId);
  
  if (type === 'buy') {
    if (existingAsset) {
      // Update existing asset
      const newBalance = existingAsset.balance + amount;
      const newCostBasis = existingAsset.costBasis + total;
      existingAsset.balance = newBalance;
      existingAsset.costBasis = newCostBasis;
      existingAsset.value = newBalance * price / 100;
      existingAsset.profitLoss = existingAsset.value - existingAsset.costBasis;
    } else {
      // Add new asset
      const instrument = mockInstruments.find(inst => inst.id === instrumentId);
      if (instrument) {
        mockPortfolio.instruments.push({
          id: instrumentId,
          name: instrument.name,
          symbol: instrument.symbol,
          balance: amount,
          value: amount * price / 100,
          costBasis: total,
          profitLoss: 0
        });
      }
    }
  } else if (type === 'sell') {
    if (existingAsset) {
      // Calculate proportion of cost basis being sold
      const proportionSold = amount / existingAsset.balance;
      const costBasisSold = existingAsset.costBasis * proportionSold;
      
      // Update existing asset
      existingAsset.balance -= amount;
      existingAsset.costBasis -= costBasisSold;
      existingAsset.value = existingAsset.balance * price / 100;
      existingAsset.profitLoss = existingAsset.value - existingAsset.costBasis;
      
      // Remove asset if balance is 0
      if (existingAsset.balance <= 0) {
        mockPortfolio.instruments = mockPortfolio.instruments.filter(asset => asset.id !== instrumentId);
      }
    }
  }
  
  // Recalculate portfolio totals
  mockPortfolio.totalValue = mockPortfolio.instruments.reduce((total, asset) => total + asset.value, 0);
  mockPortfolio.totalCostBasis = mockPortfolio.instruments.reduce((total, asset) => total + asset.costBasis, 0);
  mockPortfolio.totalProfitLoss = mockPortfolio.instruments.reduce((total, asset) => total + asset.profitLoss, 0);
  mockPortfolio.percentChange = mockPortfolio.totalCostBasis ? (mockPortfolio.totalProfitLoss / mockPortfolio.totalCostBasis * 100) : 0;
};

export default BlockchainService; 