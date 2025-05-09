const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Get command line arguments
const args = process.argv.slice(2);
let componentDirs = [];
let excludeDirs = ['__tests__', 'node_modules', 'coverage', 'dist'];
let excludeFiles = ['index.ts', 'index.tsx', 'types.ts', 'types.tsx', '*.test.tsx', '*.spec.tsx'];

// Process command line arguments
if (args.length === 0) {
  console.log('No component directories specified. Testing all components.');
  componentDirs = [
    './src/components/accounting',
    './src/components/blockchain',
    './src/components/common',
    './src/components/communications',
    './src/components/credit',
    './src/components/dashboard',
    './src/components/deal',
    './src/components/document',
    './src/components/layout',
    './src/components/risk',
    './src/components/routing',
    './src/components/security',
    './src/components/tax'
  ];
} else {
  // Process arguments
  args.forEach(arg => {
    if (arg.startsWith('--exclude-dir=')) {
      const dir = arg.replace('--exclude-dir=', '');
      excludeDirs.push(dir);
    } else if (arg.startsWith('--exclude-file=')) {
      const file = arg.replace('--exclude-file=', '');
      excludeFiles.push(file);
    } else {
      // Assume it's a directory to include
      const dir = path.resolve(__dirname, '..', arg);
      if (fs.existsSync(dir)) {
        componentDirs.push(arg);
      } else {
        console.warn(`Warning: Directory ${arg} does not exist and will be skipped.`);
      }
    }
  });
}

// Configuration
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('Starting component test runner...');
console.log(`Root directory: ${ROOT_DIR}`);
console.log(`Scanning directories: ${componentDirs.join(', ')}`);
console.log(`Excluding directories: ${excludeDirs.join(', ')}`);
console.log(`Excluding files: ${excludeFiles.join(', ')}`);

// Launch the component tester
try {
  console.log('Creating test environment...');
  
  // Create a temporary test file
  const testFile = path.join(ROOT_DIR, 'src/test-runner.tsx');
  
  fs.writeFileSync(testFile, `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ComponentTesterApp } from './components/testing';

const containerElement = document.getElementById('root');
if (!containerElement) throw new Error('Failed to find the root element');
const root = createRoot(containerElement);

root.render(
  <React.StrictMode>
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">EVA Platform Component Tester</h1>
      <p className="mb-6">Testing selected components in the codebase.</p>
      
      <ComponentTesterApp
        componentDirs={${JSON.stringify(componentDirs)}}
        options={{
          excludeDirs: ${JSON.stringify(excludeDirs)},
          excludeFiles: ${JSON.stringify(excludeFiles)},
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
    </div>
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