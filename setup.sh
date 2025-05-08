#!/bin/bash

echo "🔧 Fixing React dependency issues..."

# Stop any running processes
echo "Stopping any running processes..."
killall node 2>/dev/null

# Clean npm cache thoroughly
echo "Cleaning npm cache thoroughly..."
npm cache clean --force
rm -rf ~/.npm

# Remove node_modules and build directories
echo "Removing node_modules and build directories..."
rm -rf node_modules build

# Remove all package locks
echo "Removing package locks..."
rm -f package-lock.json yarn.lock

# Install correct versions of critical dependencies
echo "Installing React and critical dependencies first..."
npm install --save react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1

# Install babel and webpack dependencies explicitly
echo "Installing babel and webpack dependencies..."
npm install --save-dev babel-loader@8.2.5 @babel/core@7.18.6 @babel/preset-env@7.18.6 @babel/preset-react@7.18.6 webpack@5.73.0 webpack-cli@4.10.0 webpack-dev-server@4.9.3 @pmmmwh/react-refresh-webpack-plugin@0.5.7

# Install remaining dependencies
echo "Installing remaining project dependencies..."
npm install

# Clear any browser caches in Chrome/Safari (macOS)
echo "Please clear your browser cache before testing..."

echo "✅ Setup complete! Starting the application..."
echo "Please use 'RiskMap EVA 1.0' button in the interface to see the credit bureau reports"
echo "Then select 'Character' tab, switch to 'Business Owner' view, and expand 'Personal Credit Scores'"

# Start in development mode with specific options
npm start 