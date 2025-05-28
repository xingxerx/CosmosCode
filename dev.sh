#!/bin/bash

# Install nodemon if not already installed
if ! command -v nodemon &> /dev/null; then
  echo "Installing nodemon..."
  npm install -g nodemon
fi

# Start the application with nodemon
echo "Starting CosmosCode in development mode..."
nodemon src/index.js