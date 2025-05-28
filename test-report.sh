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

# Extract test counts for summary
UNIT_TESTS_PASSED=$(echo "$UNIT_OUTPUT" | grep "Tests:" | tail -1 | grep -o '[0-9]* passed' | awk '{print $1}')
UNIT_TESTS_FAILED=$(echo "$UNIT_OUTPUT" | grep "Tests:" | tail -1 | grep -o '[0-9]* failed' | awk '{print $1}')
UNIT_TESTS_TOTAL=$(echo "$UNIT_OUTPUT" | grep "Tests:" | tail -1 | grep -o '[0-9]* total' | awk '{print $1}')

E2E_TESTS_PASSED=$(echo "$E2E_OUTPUT" | grep "Tests:" | tail -1 | grep -o '[0-9]* passed' | awk '{print $1}')
E2E_TESTS_FAILED=$(echo "$E2E_OUTPUT" | grep "Tests:" | tail -1 | grep -o '[0-9]* failed' | awk '{print $1}')
E2E_TESTS_TOTAL=$(echo "$E2E_OUTPUT" | grep "Tests:" | tail -1 | grep -o '[0-9]* total' | awk '{print $1}')

# Default to 0 if not found
UNIT_TESTS_PASSED=${UNIT_TESTS_PASSED:-0}
UNIT_TESTS_FAILED=${UNIT_TESTS_FAILED:-0}
UNIT_TESTS_TOTAL=${UNIT_TESTS_TOTAL:-0}

E2E_TESTS_PASSED=${E2E_TESTS_PASSED:-0}
E2E_TESTS_FAILED=${E2E_TESTS_FAILED:-0}
E2E_TESTS_TOTAL=${E2E_TESTS_TOTAL:-0}

# Calculate totals
TOTAL_TESTS=$((UNIT_TESTS_TOTAL + E2E_TESTS_TOTAL))
TOTAL_PASSED=$((UNIT_TESTS_PASSED + E2E_TESTS_PASSED))
TOTAL_FAILED=$((UNIT_TESTS_FAILED + E2E_TESTS_FAILED))

# Print summary
echo -e "\n${BLUE}=== Test Summary ===${NC}"
echo -e "Unit Tests: ${GREEN}$UNIT_TESTS_PASSED passed${NC}, ${RED}$UNIT_TESTS_FAILED failed${NC}, $UNIT_TESTS_TOTAL total"
echo -e "E2E Tests:  ${GREEN}$E2E_TESTS_PASSED passed${NC}, ${RED}$E2E_TESTS_FAILED failed${NC}, $E2E_TESTS_TOTAL total"
echo -e "Total:      ${GREEN}$TOTAL_PASSED passed${NC}, ${RED}$TOTAL_FAILED failed${NC}, $TOTAL_TESTS total"

# Calculate pass rate
if [ "$TOTAL_TESTS" -gt 0 ]; then
  PASS_RATE=$(echo "scale=2; ($TOTAL_PASSED * 100) / $TOTAL_TESTS" | bc)
  echo -e "\nPass Rate: ${PASS_RATE}%"
fi

# Calculate overall status
if [ $UNIT_STATUS -eq 0 ] && [ $E2E_STATUS -eq 0 ]; then
  echo -e "\n${GREEN}All tests passed successfully!${NC}"
  exit 0
else
  echo -e "\n${RED}Some tests failed. Please check the output above.${NC}"
  exit 1
fi
