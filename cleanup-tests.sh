#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "Checking for common issues in test files..."

# Find potentially empty test files (files with no actual tests)
EMPTY_FILES=$(grep -L "test\s*(" $(find . -name "*.test.js" -o -name "*.spec.js") 2>/dev/null || true)

# Skip files that have specific markers indicating they're not empty
TRULY_EMPTY_FILES=""
for file in $EMPTY_FILES; do
  # Check if file contains describe blocks or comments indicating it's not truly empty
  if ! grep -q "describe\s*(" "$file" && ! grep -q "@ts-nocheck" "$file" && ! grep -q "Integration Test Suite" "$file" && ! grep -q "E2E Test" "$file"; then
    TRULY_EMPTY_FILES="$TRULY_EMPTY_FILES$file\n"
  fi
done

# If there are truly empty files, ask if they should be removed
if [ ! -z "$TRULY_EMPTY_FILES" ]; then
  echo -e "Found potentially empty test files:"
  echo -e "$TRULY_EMPTY_FILES"
  
  read -p "Would you like to remove these empty test files? (y/n) " -n 1 -r
  echo
  
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Removing empty test files..."
    echo -e "$TRULY_EMPTY_FILES" | xargs rm -f
    echo "Empty test files removed."
  else
    echo "Keeping empty test files."
  fi
fi

# Fix common issues in test files
find . -name "*.test.js" -o -name "*.spec.js" | xargs sed -i 's/fit(/test(/g' 2>/dev/null || true
find . -name "*.test.js" -o -name "*.spec.js" | xargs sed -i 's/fdescribe(/describe(/g' 2>/dev/null || true

echo "Test cleanup complete!"
