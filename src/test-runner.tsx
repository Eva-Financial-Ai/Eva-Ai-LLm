import React from 'react';
import { createRoot } from 'react-dom/client';
import { ComponentTesterApp } from './components/testing';

const containerElement = document.getElementById('root');
if (!containerElement) throw new Error('Failed to find the root element');
const root = createRoot(containerElement);

// Configuration for component testing
const COMPONENT_DIRS = [
  './components/accounting',
  './components/blockchain',
  './components/common',
  './components/communications',
  './components/credit',
  './components/dashboard',
  './components/deal',
  './components/document',
  './components/layout',
  './components/risk',
  './components/routing',
  './components/security',
  './components/tax',
];

const EXCLUDE_DIRS = ['__tests__', 'node_modules', 'coverage', 'dist'];

const EXCLUDE_FILES = [
  'index.ts',
  'index.tsx',
  'types.ts',
  'types.tsx',
  '*.test.tsx',
  '*.spec.tsx',
];

root.render(
  <React.StrictMode>
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">EVA Platform Component Tester</h1>
      <p className="mb-6">
        Testing all components in the codebase to ensure they render correctly.
      </p>

      <ComponentTesterApp
        componentDirs={COMPONENT_DIRS}
        options={{
          excludeDirs: EXCLUDE_DIRS,
          excludeFiles: EXCLUDE_FILES,
          recursive: true,
        }}
        onComplete={results => {
          console.log('Component testing complete!');
          console.log('Results:', results);

          // Count results by status
          const counts = results.reduce(
            (acc, result) => {
              acc[result.status] = (acc[result.status] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );

          console.log(`Summary: ${results.length} components tested`);
          console.log(`Success: ${counts.success || 0}`);
          console.log(`Warnings: ${counts.warning || 0}`);
          console.log(`Errors: ${counts.error || 0}`);

          // Save results to localstorage for potential retrieval later
          try {
            localStorage.setItem(
              'component-test-results',
              JSON.stringify({ timestamp: new Date().toISOString(), results })
            );
          } catch (e) {
            console.error('Failed to save results to localStorage:', e);
          }
        }}
      />
    </div>
  </React.StrictMode>
);
