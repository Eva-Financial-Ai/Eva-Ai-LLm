import React, { useState, useEffect } from 'react';
import EVAAssistantWithCustomAgents from './EVAAssistantWithCustomAgents';

interface ScreenSize {
  name: string;
  width: number;
  height: number;
  deviceName?: string;
}

interface ResponsiveTestResult {
  deviceType: string;
  size: { width: number, height: number };
  status: 'pass' | 'warning' | 'fail';
  issues?: string[];
}

const ResponsiveTestingPanel: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<ScreenSize | null>(null);
  const [customWidth, setCustomWidth] = useState<number>(1280);
  const [customHeight, setCustomHeight] = useState<number>(800);
  const [showTester, setShowTester] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<ResponsiveTestResult[]>([]);
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);

  // Predefined screen sizes for testing
  const screenSizes: ScreenSize[] = [
    { name: 'Mobile Small (iPhone SE)', width: 375, height: 667, deviceName: 'iPhone SE' },
    { name: 'Mobile Medium (iPhone X)', width: 375, height: 812, deviceName: 'iPhone X' },
    { name: 'Mobile Large (iPhone 12 Pro Max)', width: 428, height: 926, deviceName: 'iPhone 12 Pro Max' },
    { name: 'Tablet (iPad)', width: 768, height: 1024, deviceName: 'iPad' },
    { name: 'Tablet Large (iPad Pro)', width: 1024, height: 1366, deviceName: 'iPad Pro' },
    { name: 'Laptop (13")', width: 1280, height: 800 },
    { name: 'Desktop (24")', width: 1920, height: 1080 },
    { name: 'Large Desktop (27")', width: 2560, height: 1440 },
  ];

  // Function to detect issues based on responsive design best practices
  const detectResponsiveIssues = (width: number, height: number): ResponsiveTestResult => {
    const issues: string[] = [];
    let status: 'pass' | 'warning' | 'fail' = 'pass';
    let deviceType = 'desktop';

    // Determine device type based on width
    if (width < 480) {
      deviceType = 'mobile-small';
    } else if (width < 768) {
      deviceType = 'mobile-large';
    } else if (width < 1024) {
      deviceType = 'tablet';
    } else if (width < 1280) {
      deviceType = 'laptop';
    }

    // Check for common responsive design issues
    if (width < 768) {
      // Mobile-specific checks
      if (document.querySelectorAll('.overflow-x-auto').length === 0) {
        issues.push('No horizontal scrolling containers found for small screens');
        status = 'warning';
      }

      const largeElements = Array.from(document.querySelectorAll('*')).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > width;
      });

      if (largeElements.length > 0) {
        issues.push(`Found ${largeElements.length} elements wider than the viewport`);
        status = 'fail';
      }
    }

    if (width < 1024) {
      // Check for touch targets that are too small
      const smallButtons = Array.from(document.querySelectorAll('button, a, [role="button"]')).filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width < 44 || rect.height < 44;
      });

      if (smallButtons.length > 0) {
        issues.push(`Found ${smallButtons.length} touch targets smaller than 44px`);
        status = 'warning';
      }
    }

    // If no issues found, add a default message
    if (issues.length === 0) {
      issues.push('No responsive design issues detected');
    }

    return {
      deviceType,
      size: { width, height },
      status,
      issues,
    };
  };

  const runResponsiveTests = () => {
    setIsRunningTests(true);
    const results: ResponsiveTestResult[] = [];

    // Run tests for various screen sizes
    screenSizes.forEach((size) => {
      const result = detectResponsiveIssues(size.width, size.height);
      results.push({
        ...result,
        deviceType: size.name,
      });
    });

    setTestResults(results);
    setIsRunningTests(false);
  };

  const handleToggleTester = () => {
    setShowTester(!showTester);
  };

  const handleTogglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const handleSizeSelect = (size: ScreenSize) => {
    setSelectedSize(size);
    setCustomWidth(size.width);
    setCustomHeight(size.height);
  };

  const handleCustomWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomWidth(parseInt(event.target.value));
  };

  const handleCustomHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomHeight(parseInt(event.target.value));
  };

  return (
    <>
      {/* Hide/Show Toggle Button - Always visible */}
      <button
        onClick={handleTogglePanel}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 z-50"
      >
        {isPanelVisible ? 'Hide Responsive Tester' : 'Show Responsive Tester'}
      </button>
      
      {isPanelVisible && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md w-full z-40">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Responsive Testing Panel</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleToggleTester}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                {showTester ? 'Hide Tester' : 'Show Tester'}
              </button>
              
              <button
                onClick={runResponsiveTests}
                className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md"
                disabled={isRunningTests}
              >
                {isRunningTests ? 'Running Tests...' : 'Run Tests'}
              </button>
            </div>
          </div>

          {showTester && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Screen Size Presets</label>
                  <select
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                    onChange={(e) => {
                      const selected = screenSizes.find((size) => size.name === e.target.value);
                      if (selected) handleSizeSelect(selected);
                    }}
                    value={selectedSize?.name || ''}
                  >
                    <option value="">Select a screen size</option>
                    {screenSizes.map((size) => (
                      <option key={size.name} value={size.name}>
                        {size.name} ({size.width}x{size.height})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Browser Size</label>
                  <div className="mt-1 p-2 border border-gray-300 rounded-md text-sm bg-gray-50">
                    {window.innerWidth}x{window.innerHeight}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Width (px)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={customWidth}
                    onChange={handleCustomWidthChange}
                    min={320}
                    max={3840}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height (px)</label>
                  <input
                    type="number"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={customHeight}
                    onChange={handleCustomHeightChange}
                    min={240}
                    max={2160}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Resize your browser to test responsive behavior</div>
                <div className="inline-flex bg-gray-200 px-3 py-1 rounded-md text-sm">
                  <span className="font-medium">Current:</span>
                  <span className="ml-1">
                    {window.innerWidth}x{window.innerHeight}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Test Results Section */}
          {testResults.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h3 className="text-md font-semibold mb-2">Test Results</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md text-sm ${
                      result.status === 'pass'
                        ? 'bg-green-100 text-green-800'
                        : result.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="font-medium">
                      {result.deviceType} ({result.size.width}x{result.size.height})
                    </div>
                    <ul className="mt-1 ml-4 list-disc text-xs">
                      {result.issues?.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ResponsiveTestingPanel; 