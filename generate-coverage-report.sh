#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set environment variables
export NODE_ENV=test

echo -e "${BLUE}Generating test coverage report...${NC}"

# Run Jest with coverage
npx jest --coverage --coverageReporters=text-summary --coverageReporters=lcov --coverageReporters=html

# Check if coverage directory exists
if [ -d "coverage" ]; then
  echo -e "${GREEN}Coverage report generated successfully!${NC}"
  echo -e "${YELLOW}HTML report available at:${NC} ./coverage/lcov-report/index.html"
  
  # Display coverage summary
  echo -e "\n${BLUE}Coverage Summary:${NC}"
  cat coverage/coverage-summary.json | jq '.total | {lines, statements, functions, branches}'
else
  echo -e "${RED}Failed to generate coverage report.${NC}"
  exit 1
fi