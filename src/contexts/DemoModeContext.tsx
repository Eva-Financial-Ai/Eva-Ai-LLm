import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import demoModeService, { DemoModeConfig } from '../api/demoModeService';

// Context type
interface DemoModeContextType {
  isEnabled: boolean;
  config: DemoModeConfig;
  toggleDemoMode: () => void;
  toggleFeature: (feature: keyof Omit<DemoModeConfig, 'enabled' | 'currentUserRole'>) => void;
  setUserRole: (role: DemoModeConfig['currentUserRole']) => void;
  resetConfig: () => void;
}

// Create the context
const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

// Provider props
interface DemoModeProviderProps {
  children: ReactNode;
}

// Provider component
export const DemoModeProvider: React.FC<DemoModeProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<DemoModeConfig>(demoModeService.getConfig());

  useEffect(() => {
    // Initialize config from service
    setConfig(demoModeService.getConfig());
  }, []);

  const toggleDemoMode = () => {
    demoModeService.setEnabled(!config.enabled);
    setConfig(demoModeService.getConfig());
  };

  const toggleFeature = (feature: keyof Omit<DemoModeConfig, 'enabled' | 'currentUserRole'>) => {
    demoModeService.toggleFeature(feature);
    setConfig(demoModeService.getConfig());
  };

  const setUserRole = (role: DemoModeConfig['currentUserRole']) => {
    demoModeService.setCurrentUserRole(role);
    setConfig(demoModeService.getConfig());
  };

  const resetConfig = () => {
    demoModeService.resetToDefaults();
    setConfig(demoModeService.getConfig());
  };

  const value = {
    isEnabled: config.enabled,
    config,
    toggleDemoMode,
    toggleFeature,
    setUserRole,
    resetConfig
  };

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>;
};

// Custom hook to use the demo mode context
export const useDemoMode = (): DemoModeContextType => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoModeProvider');
  }
  return context;
};

export default DemoModeContext; 