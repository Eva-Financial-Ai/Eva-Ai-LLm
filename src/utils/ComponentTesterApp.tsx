import React, { useState, useEffect } from 'react';
import { ComponentTester, ComponentTestResult } from './ComponentTester';
import { scanComponents } from './ComponentScanner';
import { ComponentMap } from './ComponentTester';

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
    return <div>Scanning component directories...</div>;
  }
  
  return (
    <div className="component-tester-app">
      {scanErrors.length > 0 && (
        <div className="scan-errors">
          <h3>Scan Errors ({scanErrors.length})</h3>
          <ul>
            {scanErrors.map((error, index) => (
              <li key={index}>
                <div className="file">{error.file}</div>
                <div className="error">{error.error}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {Object.keys(componentMap).length === 0 ? (
        <div className="no-components">
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