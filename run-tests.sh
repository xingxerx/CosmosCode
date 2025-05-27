#!/bin/bash

# Set environment variables
export NODE_ENV=test

# Clean up problematic test files
./cleanup-tests.sh

# Check if we should skip E2E tests
if [ "$1" != "--with-e2e" ]; then
  echo "Skipping E2E tests (use --with-e2e to include them)"
  node skip-e2e-tests.js
fi

# Run Jest with proper configuration
npx jest --config=jest.config.js --testPathIgnorePatterns="/node_modules/" "/src/services/cosmology/test.js"
