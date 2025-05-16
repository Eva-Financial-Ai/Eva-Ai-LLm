import React, { useState, useEffect } from 'react';
import demoModeService, { DemoModeConfig } from '../../api/demoModeService';

const DemoModeToggle: React.FC = () => {
  const [config, setConfig] = useState<DemoModeConfig>(demoModeService.getConfig());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Update local state when config changes
    const updatedConfig = demoModeService.getConfig();
    setConfig(updatedConfig);
  }, []);

  const toggleDemoMode = () => {
    demoModeService.setEnabled(!config.enabled);
    setConfig(demoModeService.getConfig());
  };

  const toggleLatency = () => {
    demoModeService.toggleFeature('simulateNetworkLatency');
    setConfig(demoModeService.getConfig());
  };

  const toggleAIFeatures = () => {
    demoModeService.toggleFeature('showAIFeatures');
    setConfig(demoModeService.getConfig());
  };

  const changeUserRole = (role: DemoModeConfig['currentUserRole']) => {
    demoModeService.setCurrentUserRole(role);
    setConfig(demoModeService.getConfig());
  };

  const resetDemo = () => {
    demoModeService.resetToDefaults();
    setConfig(demoModeService.getConfig());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Demo Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-4 py-2 rounded-lg shadow-lg ${
          config.enabled ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
          config.enabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
        }`}></span>
        {config.enabled ? 'Demo Mode' : 'Live Mode'}
      </button>

      {/* Demo Controls Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white p-4 rounded-lg shadow-xl border border-gray-200 w-64">
          <h3 className="text-lg font-semibold mb-3">Demo Mode Settings</h3>
          
          <div className="space-y-3">
            {/* Demo Mode Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Demo Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={toggleDemoMode}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {config.enabled && (
              <>
                {/* Network Latency Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Simulate Latency</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.simulateNetworkLatency}
                      onChange={toggleLatency}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* AI Features Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Features</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showAIFeatures}
                      onChange={toggleAIFeatures}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* User Role Selector */}
                <div className="mt-3">
                  <label className="block text-sm mb-1">User Role</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={config.currentUserRole}
                    onChange={(e) => changeUserRole(e.target.value as DemoModeConfig['currentUserRole'])}
                  >
                    <option value="lender_admin">Lender Admin</option>
                    <option value="borrower">Borrower</option>
                    <option value="broker">Broker</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetDemo}
                  className="w-full mt-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                >
                  Reset to Defaults
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoModeToggle; 