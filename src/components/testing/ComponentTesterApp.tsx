import React, { useState, useEffect } from 'react';
import { ComponentTester, ComponentTestResult, ComponentMap } from './ComponentTester';
import { scanComponents } from './ComponentScanner';

interface ComponentTesterAppProps {
  componentDirs: string[];
  onComplete?: (results: ComponentTestResult[]) => void;
  options?: {
    excludeDirs?: string[];
    excludeFiles?: string[];
    recursive?: boolean;
  };
}

export const ComponentTesterApp: React.FC<ComponentTesterAppProps> = ({
  componentDirs,
  onComplete,
  options = {}
}) => {
  const [loading, setLoading] = useState(true);
  const [componentMap, setComponentMap] = useState<ComponentMap>({});
  const [scanErrors, setScanErrors] = useState<Array<{ file: string; error: string }>>([]);
  
  useEffect(() => {
    const loadComponents = async () => {
      setLoading(true);
      
      try {
        const { componentMap, errors } = await scanComponents({
          componentDirs,
          ...options
        });
        
        setComponentMap(componentMap);
        setScanErrors(errors);
      } catch (error) {
        console.error('Failed to scan components:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadComponents();
  }, [componentDirs, options]);
  
  if (loading) {
    return <div className="p-6 bg-white rounded-lg shadow-md">Scanning component directories...</div>;
  }
  
  return (
    <div className="component-tester-app p-6 bg-white rounded-lg shadow-md">
      {scanErrors.length > 0 && (
        <div className="scan-errors mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-800 mb-2">Scan Errors ({scanErrors.length})</h3>
          <ul className="space-y-2">
            {scanErrors.map((error, index) => (
              <li key={index} className="p-2 bg-white rounded border border-red-100">
                <div className="font-medium text-gray-800">{error.file}</div>
                <div className="text-red-600 text-sm">{error.error}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {Object.keys(componentMap).length === 0 ? (
        <div className="no-components p-4 bg-gray-50 rounded-lg text-center">
          No components found in the specified directories.
        </div>
      ) : (
        <ComponentTester
          componentMap={componentMap}
          onComplete={onComplete}
        />
      )}
    </div>
  );
}; 