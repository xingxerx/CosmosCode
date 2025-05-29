#!/bin/bash
# Non-interactive version for CI/CD pipelines
find . -name "*.test.js" -o -name "*.spec.js" | xargs sed -i 's/describe\.skip/describe/g; s/test\.skip/test/g; s/it\.skip/it/g'
find . -name "*.test.js" -o -name "*.spec.js" | xargs sed -i 's/console\.log(.*);/\/\/ console.log removed/g'
echo "Test files cleaned up successfully!"
