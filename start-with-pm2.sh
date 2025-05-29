#!/bin/bash

# Install PM2 if not already installed
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2..."
  npm install -g pm2
fi

# Start the application with PM2
echo "Starting CosmosCode with PM2..."
pm2 start ecosystem.config.js