const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Simple test runner');
console.log('==================');

// Find test files
const testFiles = findTestFiles('./src', '.simple.test.js');
console.log(`Found ${testFiles.length} test files`);

// Run each test file with Node
let passed = 0;
let failed = 0;

testFiles.forEach(file => {
  try {
    console.log(`Running ${file}...`);
    execSync(`node ${file}`, { stdio: 'inherit' });
    console.log(`✅ ${file} passed`);
    passed++;
  } catch (error) {
    console.error(`❌ ${file} failed`);
    failed++;
  }
});

console.log('==================');
console.log(`Results: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

// Helper function to find test files
function findTestFiles(dir, pattern = '.test.js') {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findTestFiles(filePath, pattern));
    } else if (file.endsWith(pattern)) {
      results.push(filePath);
    }
  }
  
  return results;
}
