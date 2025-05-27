#!/bin/bash

# Set environment variables
export NODE_ENV=test

# Run Jest with proper configuration
npx jest --config=jest.config.js "$@"