import { DEMO_MODE } from './mockBackendService';

// Local storage key for demo mode state
const DEMO_MODE_STORAGE_KEY = 'eva_demo_mode_enabled';

// Interface for demo mode configuration
export interface DemoModeConfig {
  enabled: boolean;
  simulateNetworkLatency: boolean;
  showAIFeatures: boolean;
  currentUserRole: 'lender_admin' | 'borrower' | 'broker' | 'vendor';
}

// Default configuration
const defaultConfig: DemoModeConfig = {
  enabled: DEMO_MODE,
  simulateNetworkLatency: true,
  showAIFeatures: true,
  currentUserRole: 'lender_admin'
};

// Load config from localStorage or use defaults
const loadConfig = (): DemoModeConfig => {
  try {
    const storedConfig = localStorage.getItem(DEMO_MODE_STORAGE_KEY);
    if (storedConfig) {
      return { ...defaultConfig, ...JSON.parse(storedConfig) };
    }
  } catch (err) {
    console.error('Error loading demo mode config:', err);
  }
  return defaultConfig;
};

// Save config to localStorage
const saveConfig = (config: DemoModeConfig): void => {
  try {
    localStorage.setItem(DEMO_MODE_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving demo mode config:', err);
  }
};

// Current configuration
let config = loadConfig();

// DemoModeService class
class DemoModeService {
  /**
   * Check if demo mode is enabled
   */
  isEnabled(): boolean {
    return config.enabled;
  }

  /**
   * Enable or disable demo mode
   */
  setEnabled(enabled: boolean): void {
    config.enabled = enabled;
    saveConfig(config);
    
    // Reload the page to apply changes
    window.location.reload();
  }

  /**
   * Get current demo mode configuration
   */
  getConfig(): DemoModeConfig {
    return { ...config };
  }

  /**
   * Update demo mode configuration
   */
  updateConfig(newConfig: Partial<DemoModeConfig>): void {
    config = { ...config, ...newConfig };
    saveConfig(config);
  }

  /**
   * Toggle a specific feature of demo mode
   */
  toggleFeature(feature: keyof Omit<DemoModeConfig, 'enabled' | 'currentUserRole'>): void {
    if (feature in config && typeof config[feature] === 'boolean') {
      config[feature] = !config[feature];
      saveConfig(config);
    }
  }

  /**
   * Change the current user role in demo mode
   */
  setCurrentUserRole(role: DemoModeConfig['currentUserRole']): void {
    config.currentUserRole = role;
    saveConfig(config);
    
    // Reload the page to apply changes
    window.location.reload();
  }

  /**
   * Reset demo mode to default configuration
   */
  resetToDefaults(): void {
    config = { ...defaultConfig };
    saveConfig(config);
  }

  /**
   * Clear all demo mode data (config and any stored mock data)
   */
  clearAllData(): void {
    localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
    localStorage.removeItem('eva_mock_transactions');
    localStorage.removeItem('eva_auth_token');
    config = { ...defaultConfig };
  }
}

export default new DemoModeService(); 