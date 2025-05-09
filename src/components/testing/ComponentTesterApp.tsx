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
  options = {},
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
          ...options,
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
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Component Tester</h2>
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Scanning component directories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="component-tester-app p-4 bg-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">EVA Component Tester</h1>

      {scanErrors.length > 0 && (
        <div className="scan-errors mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">
            Scan Errors ({scanErrors.length})
          </h3>
          <ul className="mt-2 text-sm text-yellow-700">
            {scanErrors.map((error, index) => (
              <li key={index} className="mb-1">
                <div className="font-medium">{error.file}</div>
                <div className="text-xs">{error.error}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Object.keys(componentMap).length === 0 ? (
        <div className="no-components p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No components found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No components found in the specified directories.
          </p>
        </div>
      ) : (
        <ComponentTester componentMap={componentMap} onComplete={onComplete} />
      )}
    </div>
  );
};
