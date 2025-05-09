import React from 'react';
import { createRoot } from 'react-dom/client';
import { ComponentTesterApp } from '../utils/ComponentTesterApp';
import { ComponentTestResult } from '../utils/ComponentTester';

// Main entry point for the component tester
const runComponentTests = () => {
  const containerElement = document.getElementById('root');
  if (!containerElement) throw new Error('Failed to find the root element');
  const root = createRoot(containerElement);

  // Define directories to test
  const componentDirs = ['./src/components', './src/pages', './src/features'];

  // Define options for component scanning
  const options = {
    excludeDirs: ['__tests__', 'node_modules'],
    excludeFiles: ['index.ts', 'types.ts'],
    recursive: true,
  };

  // Render the component tester app
  root.render(
    <React.StrictMode>
      <ComponentTesterApp
        componentDirs={componentDirs}
        options={options}
        onComplete={handleTestingComplete}
      />
    </React.StrictMode>
  );
};

// Handler for when testing completes
const handleTestingComplete = (results: ComponentTestResult[]) => {
  console.log('Component testing complete!', results);

  // Calculate statistics
  const totalComponents = results.length;
  const successfulComponents = results.filter(r => r.status === 'success').length;
  const failedComponents = results.filter(r => r.status === 'error').length;
  const warningComponents = results.filter(r => r.status === 'warning').length;

  // Log summary
  console.log(`
===== Component Test Summary =====
Total Components Tested: ${totalComponents}
✅ Successful: ${successfulComponents}
❌ Failed: ${failedComponents}
⚠️ Warnings: ${warningComponents}
=================================
  `);

  // Display failed components
  if (failedComponents > 0) {
    console.log('Failed Components:');
    results
      .filter(r => r.status === 'error')
      .forEach(result => {
        console.log(`- ${result.name} (${result.path}): ${result.message}`);
      });
  }
};

// Export the runner function
export default runComponentTests;
