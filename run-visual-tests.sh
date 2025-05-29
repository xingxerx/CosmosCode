#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Set environment variables
export NODE_ENV=test

# Check if required packages are installed
if ! npm list jest-progress-bar-reporter > /dev/null 2>&1; then
  echo -e "${YELLOW}Installing jest-progress-bar-reporter...${NC}"
  npm install --save-dev jest-progress-bar-reporter
fi

echo -e "${BLUE}Running tests with visual progress...${NC}"
echo -e "${YELLOW}This will show real-time test progress with a visual indicator.${NC}"
echo

# Parse command line arguments
PATTERN=""
if [ "$#" -gt 0 ]; then
  PATTERN="$1"
fi

# Run tests with progress bar reporter
if [ -z "$PATTERN" ]; then
  npx jest --reporters=jest-progress-bar-reporter
else
  npx jest --reporters=jest-progress-bar-reporter "$PATTERN"
fi

# Store test result
TEST_RESULT=$?

# Print summary
if [ $TEST_RESULT -eq 0 ]; then
  echo -e "\n${GREEN}All tests passed successfully!${NC}"
else
  echo -e "\n${RED}Some tests failed. Please check the output above.${NC}"
fi

exit $TEST_RESULT