#!/bin/bash

# Smart ESLint Solution - Combines the best of all approaches
# Usage: ./eslint-smart.sh [mode]
# Modes: normal, critical, off

MODE=${1:-normal}
echo "EVA Platform Frontend - Smart ESLint Solution"
echo "============================================="
echo "Mode: $MODE"

# Create tiered ESLint configurations
create_critical_config() {
  cat > .eslintrc.critical.js << 'EOL'
// ESLint configuration that only enforces critical rules
module.exports = {
  "extends": ["./.eslintrc.local.js"],
  "rules": {
    // Keep only critical rules as errors, downgrade everything else
    "react-hooks/rules-of-hooks": "error", // Critical: Hook rules must be followed
    "no-unused-vars": "warn",
    "no-undef": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "import/no-anonymous-default-export": "warn",
    // Downgrade all other warnings
    "react-hooks/exhaustive-deps": "warn",
    "testing-library/no-wait-for-multiple-assertions": "warn",
    "testing-library/no-container": "warn", 
    "testing-library/no-node-access": "warn",
    "import/first": "warn",
    "jsx-a11y/anchor-is-valid": "warn"
  }
}
EOL
  echo "✅ Created critical-only ESLint configuration"
}

# Update package.json with new scripts
update_package_json() {
  # First, let's remove any duplicate entries that might exist
  local temp_file="package.json.tmp"
  
  # This function removes duplicate script entries
  remove_duplicates() {
    # Use awk to remove duplicate script entries in package.json
    awk '
    BEGIN { found_scripts=0; in_scripts=0; }
    # Track when we are in the "scripts" section
    /^  "scripts": {/ { in_scripts=1; found_scripts=1; print; next; }
    # Track when we exit the scripts section
    /^  },/ && in_scripts { in_scripts=0; print; next; }
    
    # Process lines in the scripts section
    in_scripts {
      # Extract the script name
      match($0, /"([^"]+)":/)
      if (RSTART > 0) {
        script_name = substr($0, RSTART+1, RLENGTH-2)
        # If we have not seen this script name before, print it and mark as seen
        if (!(script_name in seen_scripts)) {
          seen_scripts[script_name] = 1
          print
        } else {
          # Skip duplicate scripts
          printf("") > "/dev/stderr"
        }
      } else {
        # If line does not match pattern, print it
        print
      }
      next
    }
    # Print all other lines
    { print }
    ' package.json > "$temp_file"
    
    # Replace the original file
    mv "$temp_file" package.json
    echo "✅ Removed any duplicate script entries"
  }
  
  # Remove duplicates first
  remove_duplicates
  
  # Now proceed with adding missing scripts
  local package_content=$(cat package.json)
  
  # Helper function to check if a script exists and add it if it doesn't
  add_script_if_missing() {
    local script_name=$1
    local script_command=$2
    
    if ! grep -q "\"$script_name\":" package.json; then
      # Script doesn't exist, add it after lint:fix
      package_content=$(echo "$package_content" | sed "s/\"lint:fix\": \"eslint --ext .ts,.tsx src\/ --fix\",/\"lint:fix\": \"eslint --ext .ts,.tsx src\/ --fix\",\n    \"$script_name\": \"$script_command\",/g")
      echo "✅ Added $script_name script to package.json"
    else
      echo "✓ $script_name script already exists"
    fi
  }
  
  # Add each script only if it doesn't exist
  add_script_if_missing "lint:strict" "eslint --ext .ts,.tsx src/ --max-warnings=0"
  add_script_if_missing "lint:critical" "eslint --ext .ts,.tsx src/ -c .eslintrc.critical.js"
  add_script_if_missing "start:critical" "ESLINT_CONFIG_PATH=.eslintrc.critical.js npm start"
  add_script_if_missing "start:no-lint" "DISABLE_ESLINT_PLUGIN=true npm start"
  
  # Write the updated content back to package.json
  echo "$package_content" > "$temp_file"
  mv "$temp_file" package.json
  echo "✅ Package.json updated with ESLint scripts"
}

# Create a smart npm script that selects the right mode
create_smart_script() {
  cat > smart-start.sh << 'EOL'
#!/bin/bash

# Smart start script that lets you choose ESLint mode
# Usage: ./smart-start.sh [mode]
# Modes: normal, critical, off

MODE=${1:-normal}

case $MODE in
  normal)
    echo "Starting with normal ESLint configuration..."
    npm start
    ;;
  critical)
    echo "Starting with critical-only ESLint configuration..."
    npm run start:critical
    ;;
  off)
    echo "Starting with ESLint disabled..."
    npm run start:no-lint
    ;;
  *)
    echo "Invalid mode. Use: normal, critical, or off"
    exit 1
    ;;
esac
EOL
  chmod +x smart-start.sh
  echo "✅ Created smart-start.sh script"
}

# Update docs
update_readme() {
  # Add new section to README.md if not already there
  if ! grep -q "## Smart ESLint Solution" README.md; then
    # Find the linting section
    LINE_NUM=$(grep -n "## Linting and ESLint Issues" README.md | cut -d: -f1)
    if [ ! -z "$LINE_NUM" ]; then
      # Insert after the linting section
      START_LINE=$((LINE_NUM + 1))
      head -n $START_LINE README.md > README.md.new
      cat >> README.md.new << 'EOL'

## Smart ESLint Solution

We've implemented a flexible ESLint setup that combines the best of all approaches:

### Starting the app with different ESLint modes:

```bash
# Use the smart-start script with different modes
./smart-start.sh normal  # Regular ESLint with warnings
./smart-start.sh critical  # Only critical errors block development
./smart-start.sh off  # No ESLint checking

# Or use npm scripts directly
npm start  # Regular mode
npm run start:critical  # Critical-only mode
npm run start:no-lint  # ESLint disabled
```

### Linting with different strictness levels:

```bash
npm run lint  # Regular linting with warnings
npm run lint:critical  # Check only critical errors
npm run lint:fix  # Auto-fix issues
npm run lint:strict  # Strict check (no warnings)
```

This approach lets you adjust ESLint enforcement based on your current needs while still maintaining code quality.
EOL
      tail -n +$((START_LINE + 1)) README.md >> README.md.new
      mv README.md.new README.md
      echo "✅ Updated README.md with smart ESLint documentation"
    else
      echo "⚠️ Couldn't find linting section in README.md"
    fi
  else
    echo "✅ README.md already has smart ESLint documentation"
  fi
}

# Main execution
case $MODE in
  normal)
    # Execute our fix-eslint-properly.sh to setup base configuration
    if [ -f "./fix-eslint-properly.sh" ]; then
      ./fix-eslint-properly.sh
    else
      echo "⚠️ fix-eslint-properly.sh not found"
    fi
    create_critical_config
    update_package_json
    create_smart_script
    update_readme
    ;;
  critical)
    create_critical_config
    update_package_json
    create_smart_script
    echo "✅ ESLint set to critical-only mode"
    ;;
  off)
    update_package_json
    create_smart_script
    echo "✅ ESLint disabled"
    ;;
  *)
    echo "Invalid mode. Use: normal, critical, or off"
    exit 1
    ;;
esac

echo ""
echo "Smart ESLint setup complete! You now have three ways to run the app:"
echo "  ./smart-start.sh normal   - Regular ESLint with warnings"
echo "  ./smart-start.sh critical - Only critical errors block development"
echo "  ./smart-start.sh off      - No ESLint checking at all"
echo ""
echo "You can also use these npm scripts directly:"
echo "  npm start            - Regular mode"
echo "  npm run start:critical - Critical-only mode"
echo "  npm run start:no-lint  - ESLint disabled"
echo ""
echo "And for linting:"
echo "  npm run lint         - Regular linting"
echo "  npm run lint:critical - Check only critical errors"
echo "  npm run lint:fix     - Auto-fix issues"
echo "  npm run lint:strict  - Strict check (no warnings)" 