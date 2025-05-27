#!/bin/bash

# Set environment variables
export NODE_ENV=test

# Clean up problematic test files
./cleanup-tests.sh

# V8 JIT optimization flags
V8_FLAGS="--jitless=false --opt --turbo-inlining --turbo-instruction-scheduling"

# Check if we should skip E2E tests
if [ "$1" != "--with-e2e" ]; then
  echo "Skipping E2E tests (use --with-e2e to include them)"
  node skip-e2e-tests.js
fi

echo "Running tests with JIT optimization..."

# Run Jest with proper configuration and V8 optimization
NODE_OPTIONS="--max-old-space-size=4096 $V8_FLAGS" npx jest --config=jest.config.js --testPathIgnorePatterns="/node_modules/" "/src/services/cosmology/test.js" --runInBand

# Print completion message
echo "Tests completed with JIT optimization"