#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set environment variables
export NODE_ENV=test

# Check if minimal-app.js exists and is valid
if ! node -c minimal-app.js > /dev/null 2>&1; then
  echo -e "${RED}Error: minimal-app.js has syntax errors. Please fix them before running E2E tests.${NC}"
  node -c minimal-app.js
  exit 1
fi

# Ensure E2E tests are not skipped
echo -e "${BLUE}Ensuring E2E tests are not skipped...${NC}"
sed -i 's/describe\.skip/describe/g' e2e/simulation.test.js
sed -i 's/test\.skip/test/g' e2e/simulation.test.js

# Start the minimal app in the background
echo -e "${BLUE}Starting minimal app for E2E testing...${NC}"
node minimal-app.js &
APP_PID=$!

# Wait for the server to start
echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 2

# Run E2E tests
echo -e "${GREEN}Running E2E tests...${NC}"
npx jest --config=jest.config.js e2e/simulation.test.js

# Store test result
TEST_RESULT=$?

# Kill the app server
if ps -p $APP_PID > /dev/null; then
  echo -e "${BLUE}Stopping minimal app...${NC}"
  kill $APP_PID
fi

# Print summary
if [ $TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}E2E tests completed successfully!${NC}"
else
  echo -e "${RED}E2E tests failed. Please check the output above.${NC}"
fi

exit $TEST_RESULT
