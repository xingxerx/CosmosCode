#!/bin/bash

# Set environment variables
export NODE_ENV=test

# Clean up problematic test files
./cleanup-tests.sh

# Run Jest with proper configuration
npx jest --config=jest.config.js "$@"
