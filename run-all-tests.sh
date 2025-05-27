#!/bin/bash

# Set environment variables
export NODE_ENV=test

# Clean up problematic test files
./cleanup-tests.sh

# Run unit tests
echo "Running unit tests..."
npx jest --config=jest.config.js

# Run integration tests
echo "Running integration tests..."
npx jest --config=jest.config.js --testMatch="**/__tests__/integration/**/*.js"

# Run network tests
echo "Running network tests..."
NODE_ENV=test node src/network/network-tests.js

echo "All tests completed!"