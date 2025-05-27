#!/bin/bash

# Set colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== CosmosCode Test Benchmark ===${NC}"
echo

# Run standard tests and measure time
echo -e "${BLUE}Running standard tests...${NC}"
START_TIME=$(date +%s.%N)
./run-tests.sh > /dev/null 2>&1
END_TIME=$(date +%s.%N)
STANDARD_RUNTIME=$(echo "$END_TIME - $START_TIME" | bc)
echo -e "${GREEN}Standard test runtime:${NC} $STANDARD_RUNTIME seconds"

# Wait a moment to let system cool down
sleep 2

# Run JIT-optimized tests and measure time
echo -e "${BLUE}Running JIT-optimized tests...${NC}"
START_TIME=$(date +%s.%N)
./run-tests-jit.sh > /dev/null 2>&1
END_TIME=$(date +%s.%N)
JIT_RUNTIME=$(echo "$END_TIME - $START_TIME" | bc)
echo -e "${GREEN}JIT-optimized test runtime:${NC} $JIT_RUNTIME seconds"

# Calculate improvement
IMPROVEMENT=$(echo "scale=2; (($STANDARD_RUNTIME - $JIT_RUNTIME) / $STANDARD_RUNTIME) * 100" | bc)
echo
echo -e "${YELLOW}Performance improvement:${NC} $IMPROVEMENT%"

# Recommendation
if (( $(echo "$IMPROVEMENT > 5" | bc -l) )); then
  echo -e "${GREEN}Recommendation:${NC} Use JIT-optimized tests for CI/CD pipelines"
else
  echo -e "${YELLOW}Recommendation:${NC} Standard tests are sufficient (JIT optimization gain is minimal)"
fi