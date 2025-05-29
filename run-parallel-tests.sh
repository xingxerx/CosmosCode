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

# Parse command line arguments
WORKERS=$(nproc)  # Default to number of CPU cores
VERBOSE=false
COVERAGE=false

for arg in "$@"; do
  case $arg in
    --workers=*)
      WORKERS="${arg#*=}"
      ;;
    --verbose)
      VERBOSE=true
      ;;
    --coverage)
      COVERAGE=true
      ;;
  esac
done

echo -e "${BLUE}Running tests in parallel with ${YELLOW}${WORKERS}${BLUE} workers...${NC}"

# Build the Jest command
JEST_CMD="npx jest --maxWorkers=${WORKERS}"

if [ "$VERBOSE" = true ]; then
  JEST_CMD="$JEST_CMD --verbose"
fi

if [ "$COVERAGE" = true ]; then
  JEST_CMD="$JEST_CMD --coverage"
fi

# Record start time
START_TIME=$(date +%s.%N)

# Run the tests
eval $JEST_CMD

# Store test result
TEST_RESULT=$?

# Record end time and calculate duration
END_TIME=$(date +%s.%N)
DURATION=$(echo "$END_TIME - $START_TIME" | bc)

# Print summary
echo -e "\n${BLUE}=== Test Execution Summary ===${NC}"
echo -e "Workers: ${YELLOW}${WORKERS}${NC}"
echo -e "Execution Time: ${YELLOW}${DURATION}${NC} seconds"

if [ $TEST_RESULT -eq 0 ]; then
  echo -e "${GREEN}All tests passed successfully!${NC}"
else
  echo -e "${RED}Some tests failed. Please check the output above.${NC}"
fi

# Provide recommendations for optimal worker count
OPTIMAL_WORKERS=$(nproc)
if [ $WORKERS -gt $OPTIMAL_WORKERS ]; then
  echo -e "\n${YELLOW}Recommendation: Using more workers than CPU cores (${OPTIMAL_WORKERS}) may not improve performance.${NC}"
  echo -e "${YELLOW}Try running with --workers=${OPTIMAL_WORKERS} for optimal results.${NC}"
elif [ $WORKERS -lt $OPTIMAL_WORKERS ]; then
  echo -e "\n${YELLOW}Recommendation: You're using fewer workers than available CPU cores (${OPTIMAL_WORKERS}).${NC}"
  echo -e "${YELLOW}Try running with --workers=${OPTIMAL_WORKERS} for potentially faster results.${NC}"
fi

exit $TEST_RESULT