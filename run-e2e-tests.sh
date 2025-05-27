#!/bin/bash

# Set environment variables
export NODE_ENV=test

# Start the minimal app in the background
node minimal-app.js &
APP_PID=$!

# Wait for the server to start
sleep 2

# Run E2E tests
npx jest --config=jest.config.js e2e/simulation.test.js

# Kill the app server
kill $APP_PID

echo "E2E tests completed!"