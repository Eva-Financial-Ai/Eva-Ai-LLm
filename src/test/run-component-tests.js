#!/usr/bin/env node

// Simple script to run the component tests
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting component test runner...');

// Create a simple HTML file for the tests to run in
const tempHtmlPath = path.join(__dirname, 'test-runner.html');
fs.writeFileSync(
  tempHtmlPath,
  `
<!DOCTYPE html>
<html>
<head>
  <title>Component Test Runner</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .result-item { padding: 8px; margin: 4px 0; border-radius: 4px; display: flex; align-items: center; }
    .result-item.success { background-color: #e6f4ea; color: #137333; }
    .result-item.error { background-color: #fce8e6; color: #c5221f; }
    .result-item.warning { background-color: #fef7e0; color: #b06000; }
    .component-name { font-weight: bold; margin-right: 8px; }
    .component-status { margin-right: 8px; }
    .render-time { color: #666; font-size: 0.9em; margin-right: 8px; }
    .error-message { color: #c5221f; font-family: monospace; margin-top: 4px; }
    h2, h3 { color: #202124; }
    .progress { margin: 16px 0; padding: 12px; background-color: #f1f3f4; border-radius: 4px; }
    .scan-errors { margin: 16px 0; padding: 12px; background-color: #fce8e6; border-radius: 4px; }
    .file { font-weight: bold; }
    .error { font-family: monospace; margin-top: 4px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Redirect console.log to also append to the page for visibility
    const originalConsoleLog = console.log;
    console.log = function() {
      // Call the original console.log
      originalConsoleLog.apply(console, arguments);
      
      // Create a log element
      const logElement = document.createElement('div');
      logElement.className = 'log-output';
      logElement.textContent = Array.from(arguments).join(' ');
      
      // Append it to the document
      document.body.appendChild(logElement);
    };
  </script>
  <script src="../test/component-test-bundle.js"></script>
</body>
</html>
`
);

// Build the test bundle
console.log('Building test bundle...');
try {
  execSync('npx webpack --config webpack.test.config.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to build test bundle:', error);
  process.exit(1);
}

// Run the tests using a headless browser
console.log('Running tests in headless browser...');
try {
  // Using a simple browser for testing - you can replace this with Puppeteer or similar
  execSync('npx http-server -o ./test-runner.html -c-1', { stdio: 'inherit', cwd: path.join(__dirname) });
} catch (error) {
  console.error('Failed to run tests:', error);
  process.exit(1);
}

console.log('Test run complete!'); 