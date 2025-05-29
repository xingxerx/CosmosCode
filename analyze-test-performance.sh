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

echo -e "${BLUE}Analyzing test performance...${NC}"

# Create reports directory
mkdir -p reports

# Run tests with timing data
echo -e "${YELLOW}Running tests to collect timing data...${NC}"
npx jest --json --outputFile=reports/test-timing.json > /dev/null

# Check if the timing data was generated
if [ ! -f "reports/test-timing.json" ]; then
  echo -e "${RED}Failed to generate timing data.${NC}"
  exit 1
fi

# Generate a performance report
echo -e "${BLUE}Generating performance report...${NC}"
cat > reports/test-performance.html << EOL
<!DOCTYPE html>
<html>
<head>
  <title>Test Performance Analysis</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    .summary { margin-top: 20px; padding: 10px;