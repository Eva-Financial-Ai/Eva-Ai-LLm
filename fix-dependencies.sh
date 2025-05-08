#!/bin/bash

echo "🔧 Fixing React dependency issues..."

# Stop any running processes
echo "Stopping any running processes..."
killall node 2>/dev/null || true

# Clean npm cache thoroughly
echo "Cleaning npm cache thoroughly..."
npm cache clean --force
rm -rf ~/.npm || true

# Remove node_modules and build directories
echo "Removing node_modules and build directories..."
rm -rf node_modules build

# Clear previous browser builds
echo "Clearing browser build cache..."
rm -rf .cache

# Remove all package locks
echo "Removing package locks..."
rm -f package-lock.json

# Fix specific dependency issues
echo "Installing correct versions of problematic dependencies..."

# First, install React and React DOM with specific versions
npm install --save react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1

# Install CRACO for overriding React Scripts webpack config
npm install --save-dev @craco/craco@7.0.0

# Install correct versions of Babel and webpack dependencies
npm install --save-dev babel-loader@8.2.5 @babel/core@7.18.6 @babel/preset-env@7.18.6 @babel/preset-react@7.18.6
npm install --save-dev webpack@5.73.0 webpack-dev-server@4.9.3 @pmmmwh/react-refresh-webpack-plugin@0.5.7 react-refresh@0.14.0

# Install remaining dependencies
echo "Installing remaining project dependencies..."
npm install

# Make CRACO executable if running scripts directly
chmod +x node_modules/.bin/craco

echo "✅ Dependency fixes complete!"
echo "To run the application using standard React scripts with fixes:"
echo "npm run start"
echo ""
echo "Or to run with CRACO for advanced webpack fixes:"
echo "npm run start:craco"
echo ""
echo "Then select the 'RiskMap EVA 1.0' button, 'Character' tab, 'Business Owner' view, and expand 'Personal Credit Scores'"

# Make script executable
chmod +x fix-dependencies.sh 