#!/bin/bash

echo "🔧 Quick Fix for React Dependencies on Mac"

# Stop running React processes
echo "Stopping any running React processes..."
killall node 2>/dev/null || true

# Clean up system
echo "Cleaning up previous builds and caches..."
rm -rf node_modules build .cache
npm cache clean --force

# Install specific compatible versions
echo "Installing compatible package versions..."
npm install --save react@18.2.0 react-dom@18.2.0 react-scripts@5.0.1
npm install --save-dev babel-loader@8.2.5 @babel/core@7.18.6 @babel/preset-env@7.18.6

# Force update package.json script
echo "Updating package.json start script..."
sed -i '' 's/"start": "react-scripts start"/"start": "FAST_REFRESH=false CHOKIDAR_USEPOLLING=true react-scripts start"/' package.json

# Final npm install to ensure all dependencies are in place
echo "Installing all dependencies..."
npm install

echo "✅ Quick fix complete!"
echo "To start the app with fixed configuration, run:"
echo "npm start"
echo ""
echo "Then navigate to the RiskMap EVA 1.0 view using the button in the interface."

# Make script executable
chmod +x quick-fix-mac.sh 