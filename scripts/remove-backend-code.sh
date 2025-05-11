#!/bin/bash

# Script to remove the backend code after it has been migrated to its own repository

echo "Removing backend code from frontend repository..."

# Confirm before proceeding
read -p "This will permanently delete the supabase-db-layer directory. Are you sure? (y/n) " confirm
if [[ $confirm != "y" ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Check if backend directory exists
if [ -d "supabase-db-layer" ]; then
  # Remove the backend directory
  rm -rf supabase-db-layer
  echo "✅ Removed supabase-db-layer directory"
else
  echo "⚠️ supabase-db-layer directory not found"
fi

# Update documentation to reflect the change
if [ -f "README.md" ]; then
  echo "Updating README.md..."
  
  # Add note about backend repository
  echo -e "\n## Backend Repository\n\nThe backend code has been moved to a separate repository: https://github.com/your-organization/eva-platform-backend\n" >> README.md
  
  echo "✅ Updated README.md with backend repository information"
fi

echo "Done! Backend code has been removed from this repository."
echo "The backend is now maintained in the separate repository: https://github.com/your-organization/eva-platform-backend" 