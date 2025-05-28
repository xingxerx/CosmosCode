#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check for common issues in test files
echo -e "${BLUE}Checking for common issues in test files...${NC}"

# Find test files with .skip that should be enabled
SKIPPED_TESTS=$(grep -r "describe\.skip\|test\.skip\|it\.skip" --include="*.test.js" --include="*.spec.js" .)
if [ -n "$SKIPPED_TESTS" ]; then
  echo -e "${YELLOW}Found skipped tests:${NC}"
  echo "$SKIPPED_TESTS"
  
  # Ask if we should enable them
  read -p "Would you like to enable these skipped tests? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Enabling skipped tests...${NC}"
    find . -name "*.test.js" -o -name "*.spec.js" | xargs sed -i 's/describe\.skip/describe/g; s/test\.skip/test/g; s/it\.skip/it/g'
    echo -e "${GREEN}Skipped tests enabled.${NC}"
  fi
fi

# Find test files with long timeouts
LONG_TIMEOUTS=$(grep -r "jest\.setTimeout" --include="*.test.js" --include="*.spec.js" . | grep -E "[0-9]{5,}")
if [ -n "$LONG_TIMEOUTS" ]; then
  echo -e "${YELLOW}Found tests with long timeouts:${NC}"
  echo "$LONG_TIMEOUTS"
  echo -e "${YELLOW}Consider optimizing these tests for better performance.${NC}"
fi

# Find test files with console.log statements
CONSOLE_LOGS=$(grep -r "console\.log" --include="*.test.js" --include="*.spec.js" .)
if [ -n "$CONSOLE_LOGS" ]; then
  echo -e "${YELLOW}Found console.log statements in tests:${NC}"
  echo "$CONSOLE_LOGS"
  
  # Ask if we should remove them
  read -p "Would you like to remove these console.log statements? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Removing console.log statements...${NC}"
    find . -name "*.test.js" -o -name "*.spec.js" | xargs sed -i 's/console\.log(.*);/\/\/ console.log removed/g'
    echo -e "${GREEN}Console.log statements removed.${NC}"
  fi
fi

# Check for empty test files
EMPTY_TESTS=$(find . -name "*.test.js" -o -name "*.spec.js" -size -100c)
if [ -n "$EMPTY_TESTS" ]; then
  echo -e "${YELLOW}Found potentially empty test files:${NC}"
  echo "$EMPTY_TESTS"
  
  # Ask if we should remove them
  read -p "Would you like to remove these empty test files? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Removing empty test files...${NC}"
    rm $EMPTY_TESTS
    echo -e "${GREEN}Empty test files removed.${NC}"
  fi
fi

# Create a non-interactive version for CI/CD
cat > cleanup-tests-ci.sh << 'EOL'
#!/bin/bash
# Non-interactive version for CI/CD pipelines
find . -name "*.test.js" -o -name "*.spec.js" | xargs sed -i 's/describe\.skip/describe/g; s/test\.skip/test/g; s/it\.skip/it/g'
find . -name "*.test.js" -o -name "*.spec.js" | xargs sed -i 's/console\.log(.*);/\/\/ console.log removed/g'
echo "Test files cleaned up successfully!"
EOL

chmod +x cleanup-tests-ci.sh

echo -e "${GREEN}Test cleanup complete!${NC}"
