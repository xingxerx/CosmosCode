#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set environment variables
export NODE_ENV=test

# Parse command line arguments
COVERAGE=false
WATCH=false
VERBOSE=false
PATTERN=""

for arg in "$@"; do
  case $arg in
    --coverage)
      COVERAGE=true
      ;;
    --watch)
      WATCH=true
      ;;
    --verbose)
      VERBOSE=true
      ;;
    --pattern=*)
      PATTERN="${arg#*=}"
      ;;
  esac
done

# Clean up problematic test files
./cleanup-tests-ci.sh

# Build the Jest command
JEST_CMD="node --expose-gc --max-old-space-size=4096 node_modules/.bin/jest"

if [ "$COVERAGE" = true ]; then
  JEST_CMD="$JEST_CMD --coverage"
fi

if [ "$WATCH" = true ]; then
  JEST_CMD="$JEST_CMD --watch"
fi

if [ "$VERBOSE" = true ]; then
  JEST_CMD="$JEST_CMD --verbose"
else
  JEST_CMD="$JEST_CMD --silent"
fi

if [ -n "$PATTERN" ]; then
  JEST_CMD="$JEST_CMD $PATTERN"
fi

# Add JIT optimization flags
JEST_CMD="$JEST_CMD --runInBand"

echo -e "${BLUE}Running tests with JIT optimization...${NC}"
echo -e "${YELLOW}Command: $JEST_CMD${NC}"
echo

# Run the tests
eval $JEST_CMD

# Store test result
TEST_RESULT=$?

# Print summary
if [ $TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}All tests passed successfully!${NC}"
else
  echo -e "${RED}Some tests failed. Please check the output above.${NC}"
fi

exit $TEST_RESULT
