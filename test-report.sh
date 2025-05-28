#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set environment variables
export NODE_ENV=test

echo -e "${BLUE}Generating comprehensive test report...${NC}"

# Create reports directory
mkdir -p reports

# Run tests with various reporters
echo -e "${YELLOW}Running tests with detailed reporting...${NC}"
npx jest --json --outputFile=reports/test-results.json --reporters=default --reporters=jest-junit --testLocationInResults > /dev/null 2>&1

# Generate HTML report
echo -e "${YELLOW}Generating HTML report...${NC}"
npx jest-html-reporter --json reports/test-results.json --outputPath reports/test-report.html

# Generate coverage report
echo -e "${YELLOW}Generating coverage report...${NC}"
npx jest --coverage --coverageReporters=text-summary --coverageReporters=lcov --coverageReporters=html --coverageDirectory=reports/coverage > /dev/null 2>&1

# Generate test summary
echo -e "${YELLOW}Generating test summary...${NC}"
cat reports/test-results.json | jq '{
  "testSuites": .numTotalTestSuites,
  "tests": .numTotalTests,
  "passed": .numPassedTests,
  "failed": .numFailedTests,
  "skipped": .numPendingTests,
  "executionTime": .testResults[].endTime - .testResults[].startTime | add/1000,
  "passRate": (.numPassedTests / .numTotalTests * 100 | floor) + "%"
}' > reports/summary.json

# Display summary
echo -e "\n${BLUE}=== Test Report Summary ===${NC}"
cat reports/summary.json | jq -r '"Test Suites: \(.testSuites)\nTests: \(.tests)\nPassed: \(.passed)\nFailed: \(.failed)\nSkipped: \(.skipped)\nExecution Time: \(.executionTime)s\nPass Rate: \(.passRate)"'

echo -e "\n${GREEN}Reports generated successfully!${NC}"
echo -e "${YELLOW}HTML Report:${NC} ./reports/test-report.html"
echo -e "${YELLOW}Coverage Report:${NC} ./reports/coverage/lcov-report/index.html"
echo -e "${YELLOW}JSON Results:${NC} ./reports/test-results.json"
echo -e "${YELLOW}Summary:${NC} ./reports/summary.json"
