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

echo -e "${BLUE}Running mutation tests...${NC}"
echo -e "${YELLOW}This will verify the quality of your tests by making small changes to your code.${NC}"
echo -e "${YELLOW}Good tests should fail when the code is mutated.${NC}"
echo

# Check if stryker is installed
if ! npm list @stryker-mutator/core > /dev/null 2>&1; then
  echo -e "${YELLOW}Installing Stryker mutation testing framework...${NC}"
  npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner
fi

# Parse command line arguments
TARGET=""
CONCURRENCY=4

for arg in "$@"; do
  case $arg in
    --target=*)
      TARGET="${arg#*=}"
      ;;
    --concurrency=*)
      CONCURRENCY="${arg#*=}"
      ;;
  esac
done

# Create Stryker configuration if it doesn't exist
if [ ! -f "stryker.conf.js" ]; then
  echo -e "${YELLOW}Creating Stryker configuration...${NC}"
  cat > stryker.conf.js << EOL
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  coverageAnalysis: 'perTest',
  jest: {
    projectType: 'custom',
    configFile: 'jest.config.js',
    enableFindRelatedTests: true
  },
  mutate: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/network/**/*.js'
  ],
  thresholds: {
    high: 80,
    low: 60,
    break: 50
  }
};
EOL
fi

# Run mutation tests
if [ -n "$TARGET" ]; then
  echo -e "${BLUE}Running mutation tests on ${YELLOW}${TARGET}${NC}"
  npx stryker run --mutate "${TARGET}" --concurrency ${CONCURRENCY}
else
  echo -e "${BLUE}Running mutation tests on all files${NC}"
  npx stryker run --concurrency ${CONCURRENCY}
fi

# Check if the report was generated
if [ -d "reports/mutation" ]; then
  echo -e "${GREEN}Mutation testing complete!${NC}"
  echo -e "${YELLOW}Report available at:${NC} ./reports/mutation/index.html"
else
  echo -e "${RED}Failed to generate mutation report.${NC}"
  exit 1
fi