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
ACTION="status"  # Default action
PATTERN=""

for arg in "$@"; do
  case $arg in
    --update)
      ACTION="update"
      ;;
    --delete)
      ACTION="delete"
      ;;
    --pattern=*)
      PATTERN="${arg#*=}"
      ;;
  esac
done

# Function to count snapshots
count_snapshots() {
  find . -name "*.snap" | wc -l
}

# Get initial snapshot count
INITIAL_COUNT=$(count_snapshots)

echo -e "${BLUE}Snapshot Management Tool${NC}"
echo -e "${YELLOW}Found ${INITIAL_COUNT} snapshot files${NC}"
echo

# Perform the requested action
case $ACTION in
  update)
    echo -e "${BLUE}Updating snapshots...${NC}"
    if [ -n "$PATTERN" ]; then
      npx jest --updateSnapshot "$PATTERN"
    else
      npx jest --updateSnapshot
    fi
    
    # Count updated snapshots
    NEW_COUNT=$(count_snapshots)
    DIFF=$((NEW_COUNT - INITIAL_COUNT))
    
    if [ $DIFF -gt 0 ]; then
      echo -e "${GREEN}Created $DIFF new snapshot(s)${NC}"
    elif [ $DIFF -lt 0 ]; then
      echo -e "${YELLOW}Removed $((-DIFF)) snapshot(s)${NC}"
    else
      echo -e "${CYAN}Updated snapshots without changing the count${NC}"
    fi
    ;;
    
  delete)
    echo -e "${RED}Deleting snapshots...${NC}"
    if [ -n "$PATTERN" ]; then
      find . -name "*.snap" -path "*$PATTERN*" -exec rm {} \;
    else
      read -p "Are you sure you want to delete ALL snapshots? (y/n) " -n 1 -r
      echo
      if [[ $REPLY =~ ^[Yy]$ ]]; then
        find . -name "*.snap" -exec rm {} \;
      else
        echo -e "${YELLOW}Operation cancelled${NC}"
        exit 0
      fi
    fi
    
    # Count remaining snapshots
    NEW_COUNT=$(count_snapshots)
    DELETED=$((INITIAL_COUNT - NEW_COUNT))
    
    echo -e "${RED}Deleted $DELETED snapshot(s)${NC}"
    ;;
    
  *)
    # Show snapshot status
    echo -e "${BLUE}Checking snapshot status...${NC}"
    
    # Find outdated snapshots
    if [ -n "$PATTERN" ]; then
      npx jest --testPathPattern="$PATTERN" -u
    else
      npx jest --testPathPattern="__tests__" -u
    fi
    
    echo -e "\n${YELLOW}Snapshot commands:${NC}"
    echo -e "  ${CYAN}./manage-snapshots.sh --update${NC} - Update all snapshots"
    echo -e "  ${CYAN}./manage-snapshots.sh --update --pattern=component-name${NC} - Update specific snapshots"
    echo -e "  ${CYAN}./manage-snapshots.sh --delete${NC} - Delete all snapshots"
    echo -e "  ${CYAN}./manage-snapshots.sh --delete --pattern=component-name${NC} - Delete specific snapshots"
    ;;
esac