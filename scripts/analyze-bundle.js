#!/usr/bin/env node

/**
 * Bundle Analyzer Script
 * This script builds the app with bundle analysis and opens the stats in a browser.
 * 
 * Usage:
 *   node scripts/analyze-bundle.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure required dependencies are installed
try {
  require('webpack-bundle-analyzer');
} catch (e) {
  console.log('Installing webpack-bundle-analyzer...');
  execSync('npm install --save-dev webpack-bundle-analyzer', { stdio: 'inherit' });
}

// Create a temporary webpack config for bundle analysis
const tempConfigPath = path.resolve(__dirname, '../webpack.analyze.js');
const configContent = `
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const cracoConfig = require('./craco.config');

module.exports = {
  ...cracoConfig,
  webpack: {
    ...cracoConfig.webpack,
    plugins: [
      ...(cracoConfig.webpack?.plugins || []),
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: 'localhost',
        analyzerPort: 8888,
        reportFilename: 'report.html',
        defaultSizes: 'gzip',
        openAnalyzer: true,
        generateStatsFile: true,
        statsFilename: 'stats.json',
      }),
    ],
  },
};
`;

// Write the temporary config file
fs.writeFileSync(tempConfigPath, configContent);

// Build the app with bundle analysis
console.log('Building app with bundle analysis...');
try {
  execSync('GENERATE_SOURCEMAP=true CRACO_CONFIG=webpack.analyze.js npm run build:craco', { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });
} catch (e) {
  console.error('Build failed:', e.message);
} finally {
  // Clean up temporary config file
  fs.unlinkSync(tempConfigPath);
}

// Output helpful information
console.log('\nBundle analysis complete!');
console.log('Review the analysis to identify large dependencies that could be optimized.');
console.log('Recommendations:');
console.log('1. Look for duplicate dependencies');
console.log('2. Consider code splitting for large libraries');
console.log('3. Use dynamic imports for components not needed immediately');
console.log('4. Remove unused dependencies and code'); 