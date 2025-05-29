#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Set environment variables
export NODE_ENV=test

# Parse command line arguments
RUN_UNIT=true
RUN_INTEGRATION=true
RUN_E2E=false
RUN_NETWORK=false
VERBOSE=false

for arg in "$@"; do
  case $arg in
    --with-e2e)
      RUN_E2E=true
      ;;
    --with-network)
      RUN_NETWORK=true
      ;;
    --unit-only)
      RUN_INTEGRATION=false
      RUN_E2E=false
      RUN_NETWORK=false
      ;;
    --integration-only)
      RUN_UNIT=false
      RUN_E2E=false
      RUN_NETWORK=false
      ;;
    --e2e-only)
      RUN_UNIT=false
      RUN_INTEGRATION=false
      RUN_E2E=true
      RUN_NETWORK=false
      ;;
    --network-only)
      RUN_UNIT=false
      RUN_INTEGRATION=false
      RUN_E2E=false
      RUN_NETWORK=true
      ;;
    --verbose)
      VERBOSE=true
      ;;
    --help)
      echo "Usage: ./run-all-tests.sh [options]"
      echo "Options:"
      echo "  --with-e2e        Include E2E tests"
      echo "  --with-network    Include network tests"
      echo "  --unit-only       Run only unit tests"
      echo "  --integration-only Run only integration tests"
      echo "  --e2e-only        Run only E2E tests"
      echo "  --network-only    Run only network tests"
      echo "  --verbose         Show detailed test output"
      echo "  --help            Show this help message"
      exit 0
      ;;
  esac
done

# Ensure test directories exist
mkdir -p __tests__/integration
mkdir -p e2e
mkdir -p src/network

# Clean up problematic test files
./cleanup-tests.sh

# Initialize test results
UNIT_RESULT=0
INTEGRATION_RESULT=0
E2E_RESULT=0
NETWORK_RESULT=0

# Run unit tests
if [ "$RUN_UNIT" = true ]; then
  echo -e "${BLUE}=== Running Unit Tests ===${NC}"
  if [ "$VERBOSE" = true ]; then
    npx jest --config=jest.config.js --testPathIgnorePatterns="/node_modules/" "/e2e/" "/integration/" "/src/services/cosmology/test.js"
  else
    npx jest --config=jest.config.js --testPathIgnorePatterns="/node_modules/" "/e2e/" "/integration/" "/src/services/cosmology/test.js" --silent
  fi
  UNIT_RESULT=$?
  
  if [ $UNIT_RESULT -eq 0 ]; then
    echo -e "${GREEN}Unit tests passed${NC}"
  else
    echo -e "${RED}Unit tests failed${NC}"
  fi
  echo
fi

# Run integration tests
if [ "$RUN_INTEGRATION" = true ]; then
  echo -e "${BLUE}=== Running Integration Tests ===${NC}"
  
  # Check if integration tests exist
  if [ ! "$(find __tests__/integration -name "*.js" | wc -l)" -gt 0 ]; then
    echo -e "${YELLOW}No integration tests found. Skipping...${NC}"
    INTEGRATION_RESULT=0
  else
    if [ "$VERBOSE" = true ]; then
      npx jest --config=jest.config.js --testMatch="**/__tests__/integration/**/*.js"
    else
      npx jest --config=jest.config.js --testMatch="**/__tests__/integration/**/*.js" --silent
    fi
    INTEGRATION_RESULT=$?
  fi
  
  if [ $INTEGRATION_RESULT -eq 0 ]; then
    echo -e "${GREEN}Integration tests passed${NC}"
  else
    echo -e "${RED}Integration tests failed${NC}"
  fi
  echo
fi

# Run E2E tests
if [ "$RUN_E2E" = true ]; then
  echo -e "${BLUE}=== Running E2E Tests ===${NC}"
  ./run-e2e-tests.sh
  E2E_RESULT=$?
  echo
fi

# Run network tests
if [ "$RUN_NETWORK" = true ]; then
  echo -e "${BLUE}=== Running Network Tests ===${NC}"
  NODE_ENV=test node src/network/network-tests.js
  NETWORK_RESULT=$?
  
  if [ $NETWORK_RESULT -eq 0 ]; then
    echo -e "${GREEN}Network tests passed${NC}"
  else
    echo -e "${RED}Network tests failed${NC}"
  fi
  echo
fi

# Calculate overall result
OVERALL_RESULT=0

if [ "$RUN_UNIT" = true ] && [ $UNIT_RESULT -ne 0 ]; then
  OVERALL_RESULT=1
fi

if [ "$RUN_INTEGRATION" = true ] && [ $INTEGRATION_RESULT -ne 0 ]; then
  OVERALL_RESULT=1
fi

if [ "$RUN_E2E" = true ] && [ $E2E_RESULT -ne 0 ]; then
  OVERALL_RESULT=1
fi

if [ "$RUN_NETWORK" = true ] && [ $NETWORK_RESULT -ne 0 ]; then
  OVERALL_RESULT=1
fi

# Print overall result
echo -e "${BLUE}=== Test Summary ===${NC}"
if [ "$RUN_UNIT" = true ]; then
  if [ $UNIT_RESULT -eq 0 ]; then
    echo -e "Unit Tests: ${GREEN}PASSED${NC}"
  else
    echo -e "Unit Tests: ${RED}FAILED${NC}"
  fi
fi

if [ "$RUN_INTEGRATION" = true ]; then
  if [ $INTEGRATION_RESULT -eq 0 ]; then
    echo -e "Integration Tests: ${GREEN}PASSED${NC}"
  else
    echo -e "Integration Tests: ${RED}FAILED${NC}"
  fi
fi

if [ "$RUN_E2E" = true ]; then
  if [ $E2E_RESULT -eq 0 ]; then
    echo -e "E2E Tests: ${GREEN}PASSED${NC}"
  else
    echo -e "E2E Tests: ${RED}FAILED${NC}"
  fi
fi

if [ "$RUN_NETWORK" = true ]; then
  if [ $NETWORK_RESULT -eq 0 ]; then
    echo -e "Network Tests: ${GREEN}PASSED${NC}"
  else
    echo -e "Network Tests: ${RED}FAILED${NC}"
  fi
fi

echo
if [ $OVERALL_RESULT -eq 0 ]; then
  echo -e "${GREEN}All tests passed successfully!${NC}"
else
  echo -e "${RED}Some tests failed. Please check the output above.${NC}"
fi

exit $OVERALL_RESULT
