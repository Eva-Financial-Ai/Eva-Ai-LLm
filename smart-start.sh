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
