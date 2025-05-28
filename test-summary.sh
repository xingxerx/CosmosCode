#!/bin/bash

# Set colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== CosmosCode Test Summary ===${NC}\n"

# Run tests and capture output
TEST_OUTPUT=$(./run-tests.sh 2>&1)

# Extract test counts using grep and awk for more reliable parsing
TESTS_LINE=$(echo "$TEST_OUTPUT" | grep "Tests:" | tail -1)
SUITES_LINE=$(echo "$TEST_OUTPUT" | grep "Test Suites:" | tail -1)

# Parse test counts
TESTS_PASSED=$(echo "$TESTS_LINE" | grep -o '[0-9]* passed' | awk '{print $1}')
TESTS_FAILED=$(echo "$TESTS_LINE" | grep -o '[0-9]* failed' | awk '{print $1}')
TESTS_SKIPPED=$(echo "$TESTS_LINE" | grep -o '[0-9]* skipped' | awk '{print $1}')
TESTS_TOTAL=$(echo "$TESTS_LINE" | grep -o '[0-9]* total' | awk '{print $1}')

# Parse suite counts
SUITES_PASSED=$(echo "$SUITES_LINE" | grep -o '[0-9]* passed' | awk '{print $1}')
SUITES_FAILED=$(echo "$SUITES_LINE" | grep -o '[0-9]* failed' | awk '{print $1}')
SUITES_SKIPPED=$(echo "$SUITES_LINE" | grep -o '[0-9]* skipped' | awk '{print $1}')
SUITES_TOTAL=$(echo "$SUITES_LINE" | grep -o '[0-9]* total' | awk '{print $1}')

# Default to 0 if not found
TESTS_PASSED=${TESTS_PASSED:-0}
TESTS_FAILED=${TESTS_FAILED:-0}
TESTS_SKIPPED=${TESTS_SKIPPED:-0}
TESTS_TOTAL=${TESTS_TOTAL:-0}

SUITES_PASSED=${SUITES_PASSED:-0}
SUITES_FAILED=${SUITES_FAILED:-0}
SUITES_SKIPPED=${SUITES_SKIPPED:-0}
SUITES_TOTAL=${SUITES_TOTAL:-0}

# Print summary
echo -e "${GREEN}Test Suites Passed:${NC}  $SUITES_PASSED of $SUITES_TOTAL"
echo -e "${RED}Test Suites Failed:${NC}  $SUITES_FAILED of $SUITES_TOTAL"
echo -e "${YELLOW}Test Suites Skipped:${NC} $SUITES_SKIPPED of $SUITES_TOTAL"
echo
echo -e "${GREEN}Tests Passed:${NC}  $TESTS_PASSED of $TESTS_TOTAL"
echo -e "${RED}Tests Failed:${NC}  $TESTS_FAILED of $TESTS_TOTAL"
echo -e "${YELLOW}Tests Skipped:${NC} $TESTS_SKIPPED of $TESTS_TOTAL"
echo

# Calculate pass rate
if [ "$TESTS_TOTAL" -gt 0 ]; then
  PASS_RATE=$(echo "scale=2; ($TESTS_PASSED * 100) / $TESTS_TOTAL" | bc)
  echo -e "Pass Rate: ${PASS_RATE}%"
  echo
fi

# Print recommendations
if [ "$TESTS_FAILED" -gt 0 ]; then
  echo -e "${RED}Action needed: Fix failing tests${NC}"
elif [ "$TESTS_SKIPPED" -gt 0 ]; then
  echo -e "${YELLOW}Note: Some tests were skipped${NC}"
else
  echo -e "${GREEN}All tests passed successfully!${NC}"
fi
