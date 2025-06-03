#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Set environment variables
export NODE_ENV=test

echo -e "${BLUE}Running test performance benchmark...${NC}"
echo -e "${YELLOW}This will compare standard and JIT-optimized test execution times.${NC}"
echo

# Function to run tests and measure time
run_benchmark() {
  local mode=$1
  local cmd=$2
  
  echo -e "${BLUE}Running $mode tests...${NC}"
  
  # Run tests 3 times and take the average
  local total_time=0
  local runs=3
  
  for i in $(seq 1 $runs); do
    echo -e "${YELLOW}Run $i of $runs...${NC}"
    start_time=$(date +%s.%N)
    eval $cmd > /dev/null 2>&1
    end_time=$(date +%s.%N)
    
    # Calculate execution time
    execution_time=$(echo "$end_time - $start_time" | bc)
    total_time=$(echo "$total_time + $execution_time" | bc)
    
    echo -e "${GREEN}Completed in ${execution_time} seconds${NC}"
  done
  
  # Calculate average time
  average_time=$(echo "scale=3; $total_time / $runs" | bc)
  echo -e "${GREEN}Average execution time: ${average_time} seconds${NC}"
  echo
  
  # Return the average time
  echo $average_time
}

# Run standard tests
standard_time=$(run_benchmark "standard" "npx jest")

# Run JIT-optimized tests
jit_time=$(run_benchmark "JIT-optimized" "node --expose-gc --max-old-space-size=4096 node_modules/.bin/jest")

# Calculate improvement
improvement=$(echo "scale=2; (($standard_time - $jit_time) / $standard_time) * 100" | bc)

echo -e "${BLUE}=== Benchmark Results ===${NC}"
echo -e "Standard execution time: ${YELLOW}${standard_time}${NC} seconds"
echo -e "JIT-optimized execution time: ${YELLOW}${jit_time}${NC} seconds"
echo -e "Performance improvement: ${GREEN}${improvement}%${NC}"

# Provide recommendations
echo
echo -e "${BLUE}=== Recommendations ===${NC}"
if (( $(echo "$improvement > 10" | bc -l) )); then
  echo -e "${GREEN}✓ JIT optimization provides significant performance benefits.${NC}"
  echo -e "${GREEN}✓ Consider using run-tests-jit.sh for CI/CD pipelines.${NC}"
else
  echo -e "${YELLOW}⚠ JIT optimization provides minimal benefits in this environment.${NC}"
  echo -e "${YELLOW}⚠ Standard test execution may be sufficient.${NC}"
fi
