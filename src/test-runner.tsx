import React from 'react';
import { createRoot } from 'react-dom/client';
import { ComponentTesterApp } from './components/testing/ComponentTesterApp';

const containerElement = document.getElementById('root');
if (!containerElement) throw new Error('Failed to find the root element');
const root = createRoot(containerElement);

root.render(
  <React.StrictMode>
    <ComponentTesterApp
      componentDirs={['./src/components', './src/pages']}
      options={{
        excludeDirs: ['__tests__', 'node_modules', 'coverage', 'dist'],
        excludeFiles: [
          'index.ts',
          'index.tsx',
          'types.ts',
          'types.tsx',
          '*.test.tsx',
          '*.spec.tsx',
        ],
        recursive: true,
      }}
      onComplete={results => {
        console.log('Component testing complete!');
        console.log(JSON.stringify(results, null, 2));

        // Count results by status
        const counts: {
          success?: number;
          warning?: number;
          error?: number;
          [key: string]: number | undefined;
        } = results.reduce(
          (acc, result) => {
            const status = result.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          {} as { [key: string]: number }
        );

        console.log(`Summary: ${results.length} components tested`);
        console.log(`Success: ${counts.success || 0}`);
        console.log(`Warnings: ${counts.warning || 0}`);
        console.log(`Errors: ${counts.error || 0}`);

        // Save results to file
        try {
          const fs = require('fs');
          fs.writeFileSync('./component-test-results.json', JSON.stringify(results, null, 2));
          console.log('Results saved to component-test-results.json');
        } catch (e) {
          console.error('Failed to save results:', e);
        }
      }}
    />
  </React.StrictMode>
);
