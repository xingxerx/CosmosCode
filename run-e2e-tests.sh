#!/bin/bash

# Set environment variables
export NODE_ENV=test

# Check if minimal-app.js exists and is valid
if ! node -c minimal-app.js > /dev/null 2>&1; then
  echo "Error: minimal-app.js has syntax errors. Please fix them before running E2E tests."
  node -c minimal-app.js
  exit 1
fi

# Ensure E2E tests are not skipped
echo "Ensuring E2E tests are not skipped..."
sed -i 's/describe\.skip/describe/g' e2e/simulation.test.js
sed -i 's/test\.skip/test/g' e2e/simulation.test.js

# Start the minimal app in the background
echo "Starting minimal app for E2E testing..."
node minimal-app.js &
APP_PID=$!

# Wait for the server to start
echo "Waiting for server to start..."
sleep 2

# Run E2E tests
echo "Running E2E tests..."
npx jest --config=jest.config.js e2e/simulation.test.js

# Store test result
TEST_RESULT=$?

# Kill the app server
if ps -p $APP_PID > /dev/null; then
  echo "Stopping minimal app..."
  kill $APP_PID
fi

echo "E2E tests completed!"
exit $TEST_RESULT
