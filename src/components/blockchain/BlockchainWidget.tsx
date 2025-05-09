import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import AssetPressFeature, { AssetPressData } from './AssetPressFeature';
import PortfolioNavigator from './PortfolioNavigator';
import { TokenBalance, SmartContract } from './MyPortfolioTypes';
import BlockchainService from '../../services/blockchainService';

// Widget states
type WidgetState = 'minimized' | 'expanded' | 'full';

interface BlockchainWidgetProps {
  initialVisible?: boolean;
}

const BlockchainWidget: React.FC<BlockchainWidgetProps> = ({ initialVisible = false }) => {
  // State management
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [widgetState, setWidgetState] = useState<WidgetState>('minimized');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const [showAssetPress, setShowAssetPress] = useState(false);
  const [showSmartWallet, setShowSmartWallet] = useState(false);

  // Animation springs
  const fadeAnimation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 280, friction: 60 },
  });

  // Size animation based on widget state
  const sizeAnimation = useSpring({
    width: widgetState === 'minimized' ? 60 : widgetState === 'expanded' ? 380 : '100%',
    height: widgetState === 'minimized' ? 60 : widgetState === 'expanded' ? 500 : '100%',
    borderRadius: widgetState === 'full' ? 0 : 12,
    config: { tension: 280, friction: 60 },
  });

  // Mock data for instruments
  const commercialInstruments = [
    { id: 1, name: 'Commercial Paper', symbol: 'CP', price: 98.75, change: +0.25 },
    { id: 2, name: 'Treasury Bills', symbol: 'TB', price: 995.5, change: -0.1 },
    { id: 3, name: 'Corporate Bonds', symbol: 'CB', price: 102.25, change: +1.15 },
    { id: 4, name: 'Municipal Bonds', symbol: 'MB', price: 105.5, change: +0.45 },
    { id: 5, name: 'Certificate of Deposit', symbol: 'CD', price: 100.0, change: 0.0 },
  ];

  // Portfolio mock data
  const portfolio = {
    totalValue: 156750.25,
    percentChange: 2.35,
    instruments: [
      { id: 1, name: 'Commercial Paper', symbol: 'CP', balance: 50000, value: 49375.0 },
      { id: 3, name: 'Corporate Bonds', symbol: 'CB', balance: 1000, value: 102250.0 },
      { id: 4, name: 'Municipal Bonds', symbol: 'MB', balance: 50, value: 5275.25 },
    ],
  };

  // Recent transactions mock data
  const recentTransactions = [
    {
      id: 't1',
      type: 'buy',
      instrument: 'Commercial Paper',
      symbol: 'CP',
      amount: 10000,
      price: 98.5,
      date: '2023-10-25T14:30:00',
    },
    {
      id: 't2',
      type: 'sell',
      instrument: 'Treasury Bills',
      symbol: 'TB',
      amount: 5000,
      price: 995.75,
      date: '2023-10-24T09:15:00',
    },
    {
      id: 't3',
      type: 'buy',
      instrument: 'Corporate Bonds',
      symbol: 'CB',
      amount: 200,
      price: 101.1,
      date: '2023-10-22T11:45:00',
    },
  ];

  // Toggle widget visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Keyboard shortcut for toggling visibility (Alt+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'c') {
        toggleVisibility();
      }
      // Escape key minimizes or hides the widget
      if (e.key === 'Escape') {
        if (widgetState === 'full') {
          setWidgetState('expanded');
        } else if (widgetState === 'expanded') {
          setWidgetState('minimized');
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, widgetState]);

  // Dragging functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current || widgetState === 'full') return;

      const dx = e.clientX - dragRef.current.x;
      const dy = e.clientY - dragRef.current.y;

      setPosition(prev => ({
        x: Math.max(0, Math.min(window.innerWidth - 60, prev.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 60, prev.y + dy)),
      }));

      dragRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, widgetState]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (widgetState !== 'full') {
      setIsDragging(true);
      dragRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  // Min/max/close handlers
  const handleMinimize = () => {
    setWidgetState('minimized');
  };

  const handleExpand = () => {
    setWidgetState('expanded');
  };

  const handleFullscreen = () => {
    setWidgetState('full');
    setPosition({ x: 0, y: 0 }); // Reset position when going fullscreen
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Price change indicator
  const PriceChange = ({ change }: { change: number }) => {
    const isPositive = change > 0;
    const isZero = change === 0;

    return (
      <span
        className={`flex items-center ${isPositive ? 'text-green-500' : isZero ? 'text-gray-500' : 'text-red-500'}`}
      >
        {isPositive ? (
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : isZero ? (
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        ) : (
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  // Button handlers for expanded view
  const handleOpenAssetPress = () => {
    setWidgetState('full');
    setShowAssetPress(true);
    setShowSmartWallet(false);
  };

  const handleOpenSmartWallet = () => {
    setWidgetState('full');
    setShowAssetPress(false);
    setShowSmartWallet(true);
  };

  // Minimized View
  const MinimizedView = () => (
    <div
      className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center cursor-pointer transition-all hover:bg-indigo-700"
      onClick={handleExpand}
    >
      <svg
        className="w-8 h-8 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );

  // Expanded Dashboard View
  const DashboardView = () => (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-3 bg-gray-800 text-white flex items-center justify-between cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h2 className="text-lg font-bold">Commercial Instruments</h2>
        <div className="flex space-x-2">
          <button onClick={handleMinimize} className="p-1 hover:bg-gray-700 rounded">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
            </svg>
          </button>
          <button onClick={handleFullscreen} className="p-1 hover:bg-gray-700 rounded">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          </button>
          <button onClick={handleClose} className="p-1 hover:bg-gray-700 rounded">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="bg-indigo-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-75">Portfolio Value</p>
            <p className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Change (24h)</p>
            <p
              className={`text-lg font-bold ${portfolio.percentChange >= 0 ? 'text-green-300' : 'text-red-300'}`}
            >
              {portfolio.percentChange >= 0 ? '+' : ''}
              {portfolio.percentChange}%
            </p>
          </div>
        </div>
      </div>

      {/* Price Ticker */}
      <div className="bg-gray-100 py-2 px-4 overflow-x-auto">
        <div className="flex space-x-4">
          {commercialInstruments.map(instrument => (
            <div key={instrument.id} className="flex-shrink-0">
              <p className="text-xs font-medium">{instrument.symbol}</p>
              <div className="flex items-center space-x-1">
                <p className="text-sm">{formatCurrency(instrument.price)}</p>
                <PriceChange change={instrument.change} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
              Buy
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
              Sell
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
              Transfer
            </button>
            <button
              onClick={handleOpenAssetPress}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Asset Press
            </button>
            <button
              onClick={handleOpenSmartWallet}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Smart Wallet
            </button>
          </div>
        </div>

        {/* Portfolio Assets */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Your Portfolio</h3>
          <div className="space-y-2">
            {portfolio.instruments.map(asset => (
              <div
                key={asset.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium">{asset.name}</p>
                  <p className="text-xs text-gray-500">
                    {asset.balance} {asset.symbol}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(asset.value)}</p>
                  <p className="text-xs text-gray-500">
                    {((asset.value / portfolio.totalValue) * 100).toFixed(1)}% of portfolio
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Transactions</h3>
          <div className="space-y-2">
            {recentTransactions.map(tx => (
              <div
                key={tx.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <div className="flex items-center">
                  <div
                    className={`rounded-full w-8 h-8 flex items-center justify-center mr-2 ${tx.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {tx.type === 'buy' ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.amount} {tx.symbol}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency((tx.price * tx.amount) / 100)}
                  </p>
                  <p className="text-xs text-gray-500">${tx.price.toFixed(2)} per unit</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Full Application View
  const FullAppView = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [walletBalance, setWalletBalance] = useState(0);
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);

    // Fetch wallet data
    useEffect(() => {
      const fetchWalletData = async () => {
        try {
          const { address, balance } = await BlockchainService.getWalletDetails();
          setWalletAddress(address);
          setWalletBalance(balance);

          const tokens = await BlockchainService.getTokenBalances();
          setTokenBalances(tokens);

          const contracts = await BlockchainService.getSmartContracts();
          setSmartContracts(contracts);
        } catch (error) {
          console.error('Error fetching wallet data:', error);
        }
      };

      fetchWalletData();
    }, []);

    // Handle asset press
    const handleAssetPress = useCallback(async (assetData: AssetPressData) => {
      try {
        await BlockchainService.pressAsset(assetData);
        // Success notification could be added here
        return Promise.resolve();
      } catch (error) {
        console.error('Error pressing asset:', error);
        return Promise.reject(error);
      }
    }, []);

    // Handle contract execution
    const handleExecuteContract = useCallback(
      async (contractId: string, functionName: string, params: any) => {
        try {
          await BlockchainService.executeSmartContract(contractId, functionName, params);
          // Success notification could be added here
          return Promise.resolve();
        } catch (error) {
          console.error('Error executing contract:', error);
          return Promise.reject(error);
        }
      },
      []
    );

    // Handle fund transfer
    const handleTransferFunds = useCallback(async (amount: number, to: string) => {
      try {
        await BlockchainService.transferFunds(amount, to);
        // Update wallet balance after transfer
        const { balance } = await BlockchainService.getWalletDetails();
        setWalletBalance(balance);
        return Promise.resolve();
      } catch (error) {
        console.error('Error transferring funds:', error);
        return Promise.reject(error);
      }
    }, []);

    return (
      <div className="w-full h-full flex flex-col bg-white">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-800 text-white flex items-center justify-between">
          <div className="flex items-center">
            <svg
              className="w-8 h-8 mr-2 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-xl font-bold">Commercial Instrument Platform</h1>
          </div>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${showAssetPress ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => {
                setShowAssetPress(!showAssetPress);
                setShowSmartWallet(false);
              }}
            >
              Asset Press
            </button>
            <button
              className={`px-4 py-2 rounded-md ${showSmartWallet ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-gray-700 hover:bg-gray-600'}`}
              onClick={() => {
                setShowSmartWallet(!showSmartWallet);
                setShowAssetPress(false);
              }}
            >
              Py Smart Wallet
            </button>
            <button
              onClick={() => setWidgetState('expanded')}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
            >
              Exit Fullscreen
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {showAssetPress ? (
            <div className="max-w-2xl mx-auto">
              <AssetPressFeature onAssetPress={handleAssetPress} />
            </div>
          ) : showSmartWallet ? (
            <div className="max-w-3xl mx-auto">
              <PortfolioNavigator
                walletBalance={walletBalance}
                walletAddress={walletAddress}
                tokenBalances={tokenBalances}
                smartContracts={smartContracts}
                onExecuteContract={handleExecuteContract}
                onTransferFunds={handleTransferFunds}
              />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Portfolio Summary</h2>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Total Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">24h Change</p>
                    <p
                      className={`text-lg font-medium ${portfolio.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {portfolio.percentChange >= 0 ? '+' : ''}
                      {portfolio.percentChange}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Asset Allocation</p>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      {portfolio.instruments.map((instrument, index) => {
                        const percentage = (instrument.value / portfolio.totalValue) * 100;
                        return (
                          <div
                            key={instrument.id}
                            className={`h-full float-left ${
                              index % 3 === 0
                                ? 'bg-indigo-500'
                                : index % 3 === 1
                                  ? 'bg-blue-500'
                                  : 'bg-purple-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        );
                      })}
                    </div>
                    <div className="mt-2 space-y-1">
                      {portfolio.instruments.map((instrument, index) => (
                        <div key={instrument.id} className="flex items-center text-xs">
                          <div
                            className={`w-3 h-3 mr-1 rounded-sm ${
                              index % 3 === 0
                                ? 'bg-indigo-500'
                                : index % 3 === 1
                                  ? 'bg-blue-500'
                                  : 'bg-purple-500'
                            }`}
                          ></div>
                          <span>
                            {instrument.name}:{' '}
                            {((instrument.value / portfolio.totalValue) * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Trade</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instrument
                    </label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      {commercialInstruments.map(instrument => (
                        <option key={instrument.id} value={instrument.symbol}>
                          {instrument.name} ({instrument.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter amount"
                      min="0"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Buy
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                      Sell
                    </button>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800">Market Overview</h2>
                    <select className="p-2 border border-gray-300 rounded-md text-sm">
                      <option>24 Hours</option>
                      <option>7 Days</option>
                      <option>30 Days</option>
                      <option>1 Year</option>
                    </select>
                  </div>

                  {/* Placeholder for chart */}
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Price chart would appear here</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Commercial Instruments</h2>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left text-gray-500 font-medium text-sm">
                            Name
                          </th>
                          <th className="px-4 py-2 text-right text-gray-500 font-medium text-sm">
                            Price
                          </th>
                          <th className="px-4 py-2 text-right text-gray-500 font-medium text-sm">
                            24h Change
                          </th>
                          <th className="px-4 py-2 text-right text-gray-500 font-medium text-sm">
                            Market Cap
                          </th>
                          <th className="px-4 py-2 text-right text-gray-500 font-medium text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {commercialInstruments.map(instrument => (
                          <tr key={instrument.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <div className="rounded-full w-8 h-8 bg-gray-200 flex items-center justify-center mr-2 text-sm font-bold">
                                  {instrument.symbol.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-medium">{instrument.name}</p>
                                  <p className="text-xs text-gray-500">{instrument.symbol}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-medium">
                              {formatCurrency(instrument.price)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <PriceChange change={instrument.change} />
                            </td>
                            <td className="px-4 py-3 text-right text-gray-500">
                              {formatCurrency(instrument.price * 1000000)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end space-x-1">
                                <button className="p-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                  </svg>
                                </button>
                                <button className="p-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 8h16M4 16h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h2>

                  <div className="space-y-3">
                    {recentTransactions.map(tx => (
                      <div
                        key={tx.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center">
                          <div
                            className={`rounded-full w-10 h-10 flex items-center justify-center mr-3 ${tx.type === 'buy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                          >
                            {tx.type === 'buy' ? (
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M20 12H4"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {tx.type === 'buy' ? 'Bought' : 'Sold'} {tx.amount} {tx.symbol}
                            </p>
                            <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency((tx.price * tx.amount) / 100)}
                          </p>
                          <p className="text-sm text-gray-500">${tx.price.toFixed(2)} per unit</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-indigo-600 shadow-lg flex items-center justify-center text-white hover:bg-indigo-700 focus:outline-none z-50"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <animated.div
      ref={widgetRef}
      style={{
        ...fadeAnimation,
        ...sizeAnimation,
        position: widgetState === 'full' ? 'fixed' : 'fixed',
        top: widgetState === 'full' ? 0 : position.y,
        left: widgetState === 'full' ? 0 : position.x,
        zIndex: 9999,
        overflow: 'hidden',
      }}
      className={`bg-white shadow-2xl ${widgetState !== 'full' ? 'shadow-lg' : ''}`}
    >
      {widgetState === 'minimized' && <MinimizedView />}
      {widgetState === 'expanded' && <DashboardView />}
      {widgetState === 'full' && <FullAppView />}
    </animated.div>
  );
};

export default BlockchainWidget;
