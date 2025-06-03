#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}Analyzing test dependencies...${NC}"

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
DEPS_FILE="$TEMP_DIR/deps.json"

# Find all test files
TEST_FILES=$(find . -name "*.test.js" -o -name "*.spec.js")

# Initialize the dependency file
echo "{" > $DEPS_FILE
FIRST=true

# Process each test file
for file in $TEST_FILES; do
  # Skip node_modules
  if [[ $file == *"node_modules"* ]]; then
    continue
  fi
  
  echo -e "${YELLOW}Analyzing ${file}...${NC}"
  
  # Extract imports/requires
  IMPORTS=$(grep -E "require\(|import " $file | sed -E 's/.*require\(["\x27](.*)["\x27]\).*/\1/g; s/.*import.*from ["\x27](.*)["\x27].*/\1/g' | grep -v "^\.\.\/\.\.\/" | sort | uniq)
  
  # Add to the dependency file
  if [ "$FIRST" = true ]; then
    FIRST=false
  else
    echo "," >> $DEPS_FILE
  fi
  
  echo "  \"$file\": [" >> $DEPS_FILE
  
  # Add each import
  FIRST_IMPORT=true
  for imp in $IMPORTS; do
    if [ "$FIRST_IMPORT" = true ]; then
      FIRST_IMPORT=false
    else
      echo "," >> $DEPS_FILE
    fi
    echo "    \"$imp\"" >> $DEPS_FILE
  done
  
  echo "  ]" >> $DEPS_FILE
done

# Close the JSON
echo "}" >> $DEPS_FILE

# Create a report directory
mkdir -p reports

# Generate a report
echo -e "${BLUE}Generating dependency report...${NC}"
cat > reports/test-dependencies.html << EOL
<!DOCTYPE html>
<html>
<head>
  <title>Test Dependencies Analysis</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    .file { margin-bottom: 20px; }
    .file-name { font-weight: bold; color: #0066cc; }
    .deps { margin-left: 20px; }
    .dep { color: #666; }
    .summary { margin-top: 30px; padding: 10px; background-color: #f5f5f5; }
  </style>
</head>
<body>
  <h1>Test Dependencies Analysis</h1>
  <div id="content">Loading...</div>
  
  <script>
    // Load the dependency data
    const deps = $(cat $DEPS_FILE);
    
    // Count dependencies
    const depCounts = {};
    let totalDeps = 0;
    
    for (const file in deps) {
      const fileDeps = deps[file];
      totalDeps += fileDeps.length;
      
      for (const dep of fileDeps) {
        depCounts[dep] = (depCounts[dep] || 0) + 1;
      }
    }
    
    // Sort dependencies by usage count
    const sortedDeps = Object.entries(depCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    // Generate HTML
    let html = '';
    
    // Top dependencies
    html += '<div class="summary">';
    html += '<h2>Most Used Dependencies</h2>';
    html += '<ol>';
    for (const [dep, count] of sortedDeps) {
      html += \`<li><span class="dep">\${dep}</span> - used in \${count} tests</li>\`;
    }
    html += '</ol>';
    
    // Summary stats
    html += \`<p>Total files: \${Object.keys(deps).length}</p>\`;
    html += \`<p>Total dependencies: \${totalDeps}</p>\`;
    html += \`<p>Average dependencies per file: \${(totalDeps / Object.keys(deps).length).toFixed(2)}</p>\`;
    html += '</div>';
    
    // File details
    for (const file in deps) {
      const fileDeps = deps[file];
      
      html += '<div class="file">';
      html += \`<div class="file-name">\${file}</div>\`;
      
      if (fileDeps.length > 0) {
        html += '<div class="deps">';
        for (const dep of fileDeps) {
          html += \`<div class="dep">\${dep}</div>\`;
        }
        html += '</div>';
      } else {
        html += '<div class="deps">No dependencies</div>';
      }
      
      html += '</div>';
    }
    
    document.getElementById('content').innerHTML = html;
  </script>
</body>
</html>
EOL

echo -e "${GREEN}Dependency analysis complete!${NC}"
echo -e "${YELLOW}Report generated at:${NC} ./reports/test-dependencies.html"

# Clean up
rm -rf $TEMP_DIR