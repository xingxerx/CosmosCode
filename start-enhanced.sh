#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Install express if not already installed
if ! npm list express &> /dev/null; then
    echo "Installing express..."
    npm install express --no-proxy
fi

# Create necessary directories
mkdir -p services/cosmology
mkdir -p services/visualization
mkdir -p public

# Start the enhanced application
echo "Starting enhanced CosmosCode application..."
node minimal-app.js