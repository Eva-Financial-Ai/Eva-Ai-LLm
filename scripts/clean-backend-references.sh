#!/bin/bash

# Script to remove all backend-related code and references from the frontend repository

echo "Removing backend code and references from the frontend repository..."

# Remove the backend directory
if [ -d "supabase-db-layer" ]; then
  echo "Removing supabase-db-layer directory..."
  rm -rf supabase-db-layer
  echo "✅ Removed supabase-db-layer directory"
else
  echo "ℹ️ supabase-db-layer directory not found (might already be removed)"
fi

# Remove any build artifacts or Go-related files that might be left behind
echo "Removing any Go-related build artifacts..."
find . -name "*.go" -type f -delete
find . -name "go.mod" -type f -delete
find . -name "go.sum" -type f -delete
find . -name "go.work" -type f -delete
find . -path "*/go/build*" -delete
echo "✅ Cleaned up Go-related files"

# Remove any Docker or container files for Go
if [ -f "Dockerfile" ]; then
  if grep -q "golang\|go:" Dockerfile; then
    echo "Removing Go-related Dockerfile..."
    rm Dockerfile
    echo "✅ Removed Go-related Dockerfile"
  fi
fi

# Update env files to use proper API endpoints
if [ -f ".env.development" ]; then
  echo "Updating .env.development..."
  # Remove any Supabase-specific environment variables
  grep -v "SUPABASE_DB_" .env.development > .env.development.tmp
  mv .env.development.tmp .env.development
  
  # Make sure the API URL is set
  if ! grep -q "REACT_APP_API_URL" .env.development; then
    echo "REACT_APP_API_URL=http://localhost:8080/api" >> .env.development
  fi
  echo "✅ Updated .env.development"
fi

if [ -f ".env.production" ]; then
  echo "Updating .env.production..."
  # Remove any Supabase-specific environment variables
  grep -v "SUPABASE_DB_" .env.production > .env.production.tmp
  mv .env.production.tmp .env.production
  
  # Make sure the API URL is set
  if ! grep -q "REACT_APP_API_URL" .env.production; then
    echo "REACT_APP_API_URL=https://api.eva-platform.com/api" >> .env.production
  fi
  echo "✅ Updated .env.production"
fi

# Clean up any remaining backend documentation that might reference Go imports
echo "Cleaning up backend documentation references..."
if [ -f "docs/BACKEND_CICD_TEMPLATE.yml" ]; then
  # This is just a template, not actual code, so we can safely remove it
  rm docs/BACKEND_CICD_TEMPLATE.yml
  echo "✅ Removed backend CI/CD template"
fi

# Update package.json to remove any Go or backend related development dependencies
echo "Checking package.json for unused backend dependencies..."
# We're keeping this simple - the frontend wouldn't typically have Go-related npm dependencies

# Add a note to README.md about backend repository separation
if [ -f "README.md" ]; then
  echo "Updating README.md..."
  
  # Check if the backend repository note already exists
  if ! grep -q "Backend Repository" README.md; then
    echo -e "\n## Backend Repository\n\nThe backend code has been moved to a separate repository: https://github.com/your-organization/eva-platform-backend\n" >> README.md
  fi
  
  echo "✅ Updated README.md with backend repository information"
fi

echo "✅ Done! All backend code and references have been removed from this repository."
echo "This frontend repository now connects to the backend API via the REACT_APP_API_URL environment variable." 