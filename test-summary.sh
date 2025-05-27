#!/bin/bash

# Set colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== CosmosCode Test Summary ===${NC}"
echo

# Run the tests
./run-tests.sh > test-output.log 2>&1
TEST_EXIT_CODE=$?

# Parse the results
TOTAL_TESTS=$(grep -o '[0-9]* total' test-output.log | awk '{print $1}' | tail -1)
PASSED_TESTS=$(grep -o '[0-9]* passed' test-output.log | awk '{print $1}' | tail -1)
FAILED_TESTS=$(grep -o '[0-9]* failed' test-output.log | awk '{print $1}' | tail -1)
SKIPPED_TESTS=$(grep -o '[0-9]* skipped' test-output.log | awk '{print $1}' | tail -1)

# If any values are empty, set them to 0
TOTAL_TESTS=${TOTAL_TESTS:-0}
PASSED_TESTS=${PASSED_TESTS:-0}
FAILED_TESTS=${FAILED_TESTS:-0}
SKIPPED_TESTS=${SKIPPED_TESTS:-0}

# Calculate pass percentage
if [ $TOTAL_TESTS -gt 0 ]; then
  PASS_PERCENTAGE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
else
  PASS_PERCENTAGE=0
fi

# Display results
echo -e "${GREEN}Passed:${NC}  $PASSED_TESTS tests"
if [ $FAILED_TESTS -gt 0 ]; then
  echo -e "${RED}Failed:${NC}  $FAILED_TESTS tests"
else
  echo -e "${GREEN}Failed:${NC}  $FAILED_TESTS tests"
fi
echo -e "${YELLOW}Skipped:${NC} $SKIPPED_TESTS tests"
echo -e "${YELLOW}Total:${NC}   $TOTAL_TESTS tests"
echo

# Display pass percentage with color
if [ $PASS_PERCENTAGE -eq 100 ]; then
  echo -e "${GREEN}Pass Rate: $PASS_PERCENTAGE%${NC}"
elif [ $PASS_PERCENTAGE -ge 80 ]; then
  echo -e "${YELLOW}Pass Rate: $PASS_PERCENTAGE%${NC}"
else
  echo -e "${RED}Pass Rate: $PASS_PERCENTAGE%${NC}"
fi

echo

# Show failed tests if any
if [ $FAILED_TESTS -gt 0 ]; then
  echo -e "${RED}Failed Tests:${NC}"
  grep -A 3 "FAIL " test-output.log | grep -v "PASS " | grep -v "\-\-" | grep -v "^$"
  echo
fi

# Exit with the same code as the test run
exit $TEST_EXIT_CODE