#!/bin/bash

# Set colors
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== CosmosCode Test Benchmark ===${NC}"
echo

# Number of runs for more accurate benchmarking
RUNS=3

# Run standard tests multiple times and calculate average
echo -e "${BLUE}Running standard tests (${RUNS} runs)...${NC}"
STANDARD_TOTAL=0
for i in $(seq 1 $RUNS); do
  echo -e "  Run $i of $RUNS..."
  START_TIME=$(date +%s.%N)
  ./run-tests.sh > /dev/null 2>&1
  END_TIME=$(date +%s.%N)
  RUNTIME=$(echo "$END_TIME - $START_TIME" | bc)
  # Ensure runtime is positive
  if (( $(echo "$RUNTIME < 0" | bc -l) )); then
    echo -e "  Warning: Negative runtime detected, using absolute value"
    RUNTIME=$(echo "scale=9; sqrt($RUNTIME * $RUNTIME)" | bc)
  fi
  STANDARD_TOTAL=$(echo "$STANDARD_TOTAL + $RUNTIME" | bc)
  echo -e "  Runtime: $RUNTIME seconds"
  # Wait a moment between runs
  sleep 1
done
STANDARD_RUNTIME=$(echo "scale=4; $STANDARD_TOTAL / $RUNS" | bc)
echo -e "${GREEN}Average standard test runtime:${NC} $STANDARD_RUNTIME seconds"

echo

# Run JIT-optimized tests multiple times and calculate average
echo -e "${BLUE}Running JIT-optimized tests (${RUNS} runs)...${NC}"
JIT_TOTAL=0
for i in $(seq 1 $RUNS); do
  echo -e "  Run $i of $RUNS..."
  START_TIME=$(date +%s.%N)
  ./run-tests-jit.sh > /dev/null 2>&1
  END_TIME=$(date +%s.%N)
  RUNTIME=$(echo "$END_TIME - $START_TIME" | bc)
  # Ensure runtime is positive
  if (( $(echo "$RUNTIME < 0" | bc -l) )); then
    echo -e "  Warning: Negative runtime detected, using absolute value"
    RUNTIME=$(echo "scale=9; sqrt($RUNTIME * $RUNTIME)" | bc)
  fi
  JIT_TOTAL=$(echo "$JIT_TOTAL + $RUNTIME" | bc)
  echo -e "  Runtime: $RUNTIME seconds"
  # Wait a moment between runs
  sleep 1
done
JIT_RUNTIME=$(echo "scale=4; $JIT_TOTAL / $RUNS" | bc)
echo -e "${GREEN}Average JIT-optimized test runtime:${NC} $JIT_RUNTIME seconds"

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
