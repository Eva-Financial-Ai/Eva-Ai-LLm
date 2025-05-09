const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');
const COMPONENT_DIRS = [
  path.join(ROOT_DIR, 'src/components'),
  path.join(ROOT_DIR, 'src/pages')
];
const EXCLUDE_DIRS = [
  '__tests__', 
  'node_modules', 
  'coverage',
  'dist'
];
const EXCLUDE_FILES = [
  'index.ts', 
  'index.tsx', 
  'types.ts', 
  'types.tsx',
  '*.test.tsx',
  '*.spec.tsx'
];

console.log('Starting component test runner...');
console.log(`Root directory: ${ROOT_DIR}`);
console.log(`Scanning directories: ${COMPONENT_DIRS.map(dir => path.relative(ROOT_DIR, dir)).join(', ')}`);

// Launch the component tester
try {
  console.log('Creating test environment...');
  
  // Create a temporary test file
  const testFile = path.join(ROOT_DIR, 'src/test-runner.tsx');
  
  fs.writeFileSync(testFile, `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ComponentTesterApp } from './components/testing/ComponentTesterApp';

const containerElement = document.getElementById('root');
if (!containerElement) throw new Error('Failed to find the root element');
const root = createRoot(containerElement);

root.render(
  <React.StrictMode>
    <ComponentTesterApp
      componentDirs={[
        './src/components',
        './src/pages'
      ]}
      options={{
        excludeDirs: ${JSON.stringify(EXCLUDE_DIRS)},
        excludeFiles: ${JSON.stringify(EXCLUDE_FILES)},
        recursive: true
      }}
      onComplete={(results) => {
        console.log('Component testing complete!');
        console.log(JSON.stringify(results, null, 2));
        
        // Count results by status
        const counts = results.reduce((acc, result) => {
          acc[result.status] = (acc[result.status] || 0) + 1;
          return acc;
        }, {});
        
        console.log(\`Summary: \${results.length} components tested\`);
        console.log(\`Success: \${counts.success || 0}\`);
        console.log(\`Warnings: \${counts.warning || 0}\`);
        console.log(\`Errors: \${counts.error || 0}\`);
        
        // Save results to file
        try {
          const fs = require('fs');
          fs.writeFileSync(
            './component-test-results.json', 
            JSON.stringify(results, null, 2)
          );
          console.log('Results saved to component-test-results.json');
        } catch (e) {
          console.error('Failed to save results:', e);
        }
      }}
    />
  </React.StrictMode>
);
  `);

  console.log('Executing test runner...');
  execSync('npx craco start --test-components', { 
    cwd: ROOT_DIR,
    stdio: 'inherit'
  });
  
  console.log('Component testing complete!');
} catch (error) {
  console.error('Error running component tests:', error);
  process.exit(1);
} 