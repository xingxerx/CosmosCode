#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if a test file is provided
if [ "$#" -lt 1 ]; then
  echo -e "${RED}Error: No test file specified${NC}"
  echo -e "Usage: ./debug-test.sh <test-file-path> [test-name-pattern]"
  echo -e "Example: ./debug-test.sh src/services/cosmology/simulationEngine.test.js"
  exit 1
fi

TEST_FILE=$1
TEST_NAME_PATTERN=""

if [ "$#" -gt 1 ]; then
  TEST_NAME_PATTERN=$2
fi

# Check if the test file exists
if [ ! -f "$TEST_FILE" ]; then
  echo -e "${RED}Error: Test file not found: $TEST_FILE${NC}"
  exit 1
fi

echo -e "${BLUE}Debugging test file: ${YELLOW}$TEST_FILE${NC}"
if [ -n "$TEST_NAME_PATTERN" ]; then
  echo -e "${BLUE}Test name pattern: ${YELLOW}$TEST_NAME_PATTERN${NC}"
fi

# Set environment variables
export NODE_ENV=test

# Create a temporary debug config
DEBUG_CONFIG=$(mktemp)
cat > $DEBUG_CONFIG << EOL
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Jest Test",
      "program": "\${workspaceFolder}/node_modules/.bin/jest",
      "args": [
        "--runInBand",
        "--no-cache",
        "--detectOpenHandles",
        "$TEST_FILE"
EOL

if [ -n "$TEST_NAME_PATTERN" ]; then
  echo "        ,\"--testNamePattern=$TEST_NAME_PATTERN\"" >> $DEBUG_CONFIG
fi

cat >> $DEBUG_CONFIG << EOL
      ],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true
    }
  ]
}
EOL

echo -e "${YELLOW}Created temporary debug configuration${NC}"

# Run the test with Node.js inspector
echo -e "${BLUE}Starting debugger...${NC}"
echo -e "${CYAN}You can now attach a debugger to port 9229${NC}"
echo -e "${CYAN}If using VS Code, press F5 with the following launch.json:${NC}"
echo
cat $DEBUG_CONFIG
echo

# Run the test with the debugger
if [ -n "$TEST_NAME_PATTERN" ]; then
  node --inspect-brk node_modules/.bin/jest --runInBand --no-cache --detectOpenHandles "$TEST_FILE" -t "$TEST_NAME_PATTERN"
else
  node --inspect-brk node_modules/.bin/jest --runInBand --no-cache --detectOpenHandles "$TEST_FILE"
fi

# Clean up
rm $DEBUG_CONFIG