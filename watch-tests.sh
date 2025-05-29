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
WATCH_MODE="all"  # Default to watching all tests
PATTERN=""

for arg in "$@"; do
  case $arg in
    --unit)
      WATCH_MODE="unit"
      ;;
    --integration)
      WATCH_MODE="integration"
      ;;
    --e2e)
      WATCH_MODE="e2e"
      ;;
    --pattern=*)
      PATTERN="${arg#*=}"
      ;;
  esac
done

echo -e "${BLUE}Starting test watcher in ${YELLOW}${WATCH_MODE}${BLUE} mode...${NC}"
echo -e "${CYAN}Press 'q' to quit, 'p' to filter by filename pattern${NC}"
echo

# Build the Jest command based on watch mode
case $WATCH_MODE in
  unit)
    echo -e "${YELLOW}Watching unit tests only...${NC}"
    JEST_CMD="npx jest --watch --testPathIgnorePatterns=/node_modules/ /e2e/ /integration/"
    ;;
  integration)
    echo -e "${YELLOW}Watching integration tests only...${NC}"
    JEST_CMD="npx jest --watch --testMatch=\"**/__tests__/integration/**/*.js\""
    ;;
  e2e)
    echo -e "${YELLOW}Watching E2E tests only...${NC}"
    JEST_CMD="npx jest --watch --testMatch=\"**/e2e/**/*.js\""
    ;;
  *)
    echo -e "${YELLOW}Watching all tests...${NC}"
    JEST_CMD="npx jest --watch"
    ;;
esac

# Add pattern if specified
if [ -n "$PATTERN" ]; then
  JEST_CMD="$JEST_CMD $PATTERN"
fi

# Run the watcher
eval $JEST_CMD