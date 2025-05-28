#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set environment variables
export NODE_ENV=test

echo -e "${BLUE}Generating test summary...${NC}"

# Count test files
UNIT_TESTS=$(find . -name "*.test.js" -o -name "*.spec.js" | grep -v "integration" | grep -v "e2e" | wc -l)
INTEGRATION_TESTS=$(find . -name "*.test.js" -o -name "*.spec.js" | grep "integration" | wc -l)
E2E_TESTS=$(find ./e2e -name "*.test.js" -o -name "*.spec.js" | wc -l)
TOTAL_TESTS=$((UNIT_TESTS + INTEGRATION_TESTS + E2E_TESTS))

# Run Jest with json reporter to get detailed stats
npx jest --json --outputFile=test-report.json > /dev/null 2>&1

# Parse the JSON report
if [ -f "test-report.json" ]; then
  PASSED_TESTS=$(cat test-report.json | jq '.numPassedTests')
  FAILED_TESTS=$(cat test-report.json | jq '.numFailedTests')
  TOTAL_TEST_CASES=$(cat test-report.json | jq '.numTotalTests')
  TEST_SUITES=$(cat test-report.json | jq '.numTotalTestSuites')
  TEST_TIME=$(cat test-report.json | jq '.testResults[].endTime - .testResults[].startTime' | jq -s 'add/1000')
  
  # Print summary
  echo -e "${BLUE}=== Test Summary ===${NC}"
  echo -e "Test Files: ${YELLOW}$TOTAL_TESTS${NC} (Unit: $UNIT_TESTS, Integration: $INTEGRATION_TESTS, E2E: $E2E_TESTS)"
  echo -e "Test Suites: ${YELLOW}$TEST_SUITES${NC}"
  echo -e "Test Cases: ${YELLOW}$TOTAL_TEST_CASES${NC} (Passed: ${GREEN}$PASSED_TESTS${NC}, Failed: ${RED}$FAILED_TESTS${NC})"
  echo -e "Execution Time: ${YELLOW}${TEST_TIME}s${NC}"
  
  # Calculate pass rate
  PASS_RATE=$(echo "scale=2; ($PASSED_TESTS / $TOTAL_TEST_CASES) * 100" | bc)
  echo -e "Pass Rate: ${GREEN}${PASS_RATE}%${NC}"
  
  # Clean up
  rm test-report.json
else
  echo -e "${RED}Failed to generate test report.${NC}"
  exit 1
fi
