import React, { createContext, useState, useContext, useEffect } from 'react';
import BlockchainWidget from './BlockchainWidget';

// Types for our blockchain context
interface BlockchainContextType {
  isWidgetVisible: boolean;
  showWidget: () => void;
  hideWidget: () => void;
  toggleWidget: () => void;
}

// Create the context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  isWidgetVisible: false,
  showWidget: () => {},
  hideWidget: () => {},
  toggleWidget: () => {},
});

// Custom hook to use the blockchain context
export const useBlockchain = () => useContext(BlockchainContext);

interface BlockchainProviderProps {
  children: React.ReactNode;
}

// Create the main provider component
export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  // Methods to control widget visibility
  const showWidget = () => setIsWidgetVisible(true);
  const hideWidget = () => setIsWidgetVisible(false);
  const toggleWidget = () => setIsWidgetVisible(prev => !prev);

  // Register keyboard shortcut (Alt+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'c') {
        toggleWidget();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Define the context value
  const contextValue: BlockchainContextType = {
    isWidgetVisible,
    showWidget,
    hideWidget,
    toggleWidget,
  };

  return (
    <BlockchainContext.Provider value={contextValue}>
      {children}
      <BlockchainWidget initialVisible={isWidgetVisible} />
    </BlockchainContext.Provider>
  );
};

export default BlockchainProvider;
