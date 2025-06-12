#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting clean build and deploy process..."

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "❌ nvm is not installed. Please install nvm first:"
    echo "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Source nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Clean everything
echo "🧹 Cleaning build and cache..."
rm -rf build
rm -rf node_modules
rm -rf .cache
rm -rf .env*
rm -rf .wrangler

# Install dependencies with Node 18.18.0
echo "📦 Installing dependencies with Node 18.18.0..."
nvm install 18.18.0
nvm use 18.18.0
npm install

# Verify Node version
NODE_VERSION=$(node -v)
if [ "$NODE_VERSION" != "v18.18.0" ]; then
    echo "❌ Node version mismatch. Expected v18.18.0, got $NODE_VERSION"
    exit 1
fi

# Create production env file
echo "📝 Creating production environment file..."
cat > .env.production << EOL
REACT_APP_RAG_API_URL=https://llm-worker-unique-987654.evafiai.workers.dev/api/rag-query
EOL

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Switch to Node 20 for deployment
echo "🔄 Switching to Node 20 for deployment..."
nvm install 20
nvm use 20

# Deploy
echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy build --project-name evafi-ai-llm --branch LLM-V1 --commit-dirty=true

echo "✅ Deployment complete! Please check the Network tab in your browser's DevTools to verify that all chat requests go to /api/rag-query" 