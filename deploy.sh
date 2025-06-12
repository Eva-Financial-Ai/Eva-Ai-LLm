#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Source nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Clean everything
echo "🧹 Cleaning build artifacts..."
rm -rf build
rm -rf node_modules
rm -rf .cache

# Install dependencies with Node 18.18.0
echo "📦 Installing dependencies..."
nvm use 18.18.0
npm install

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy build --project-name evafi-ai-llm --branch LLM-V1 --commit-dirty=true

echo "✅ Deployment complete!"
echo "⚠️ IMPORTANT: Please follow these steps to ensure the new version is served:"
echo "1. Go to Cloudflare Dashboard → Pages → evafi-ai-llm"
echo "2. Go to 'Caching' → 'Purge Cache' → Purge Everything"
echo "3. In your browser:"
echo "   - Open DevTools → Application tab"
echo "   - Go to Service Workers → Unregister any existing workers"
echo "   - Go to Clear Storage → Clear site data"
echo "4. Reload the page" 