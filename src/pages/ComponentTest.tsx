import React, { useState } from 'react';
import { ComponentTesterApp } from '../components/testing/ComponentTesterApp';
import { ComponentTestResult } from '../components/testing/ComponentTester';

const ComponentTest: React.FC = () => {
  const [results, setResults] = useState<ComponentTestResult[]>([]);
  const [testComplete, setTestComplete] = useState(false);

  const handleTestComplete = (testResults: ComponentTestResult[]) => {
    setResults(testResults);
    setTestComplete(true);
    console.log('Component testing complete:', testResults);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Component Testing Dashboard</h1>

      <div className="mb-8">
        <ComponentTesterApp
          componentDirs={['./src/components/risk', './src/pages']}
          options={{
            excludeDirs: ['__tests__', 'node_modules'],
            excludeFiles: ['index.ts', 'types.ts'],
            recursive: true,
          }}
          onComplete={handleTestComplete}
        />
      </div>

      {testComplete && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Testing Results Summary</h2>

          <div className="mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {results.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-green-800">Passing Components</div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {results.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-red-800">Failed Components</div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {results.filter(r => r.status === 'warning').length}
                </div>
                <div className="text-sm text-yellow-800">Warning Components</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Risk Assessment Module Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Based on the component test results, here are the identified issues and fixes:
            </p>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">RiskMapEvaReport Component</h4>
              <p className="text-sm text-blue-700">
                The loading state persists indefinitely because useTransactionStore() is not
                providing transaction data correctly. Make sure the RiskMapEvaReport component has
                access to either a transactionId prop or a valid transaction in the store.
              </p>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-2">Recommended Fixes</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-800">
                    Add mock transaction data to the TransactionStore for testing/development
                    purposes
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-800">
                    Modify RiskMapEvaReport to provide fallback content when no transaction is
                    available
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-800">
                    Add error handling to prevent infinite loading when API calls fail
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentTest;
