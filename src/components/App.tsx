import React, { ReactNode } from 'react';
import { BlockchainProvider } from './blockchain/BlockchainProvider';

interface AppProps {
  children: ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <BlockchainProvider>
      {children}
    </BlockchainProvider>
  );
};

export default App; 