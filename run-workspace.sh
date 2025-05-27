#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if Python dependencies are installed
if [ ! -f "python_deps_installed" ]; then
  echo "Installing Python dependencies..."
  pip install -r requirements.txt
  touch python_deps_installed
fi

# Start the application
echo "Starting CosmosCode application..."
node src/index.js