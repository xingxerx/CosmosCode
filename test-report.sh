#!/bin/bash

# Set colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== CosmosCode Test Report ===${NC}\n"

# Run unit tests
echo -e "${YELLOW}Running Unit Tests...${NC}"
UNIT_OUTPUT=$(npx jest --config=jest.config.js --testPathIgnorePatterns="/node_modules/" "/e2e/" 2>&1)
UNIT_STATUS=$?

# Run E2E tests
echo -e "\n${YELLOW}Running E2E Tests...${NC}"
E2E_OUTPUT=$(./run-e2e-tests.sh 2>&1)
E2E_STATUS=$?

# Print unit test results
echo -e "\n${BLUE}=== Unit Test Results ===${NC}"
echo "$UNIT_OUTPUT" | grep -E "Test Suites:|Tests:|Time:|Ran all"

# Print E2E test results
echo -e "\n${BLUE}=== E2E Test Results ===${NC}"
echo "$E2E_OUTPUT" | grep -E "Test Suites:|Tests:|Time:|Ran all"

# Calculate overall status
if [ $UNIT_STATUS -eq 0 ] && [ $E2E_STATUS -eq 0 ]; then
  echo -e "\n${GREEN}All tests passed successfully!${NC}"
  exit 0
else
  echo -e "\n${RED}Some tests failed. Please check the output above.${NC}"
  exit 1
fi