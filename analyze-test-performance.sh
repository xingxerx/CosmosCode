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
    .summary { margin-top: 20px; padding: 10px; background-color: #f5f5f5; }
    .test-list { margin-top: 20px; }
    .test-item { margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; }
    .test-name { font-weight: bold; }
    .test-time { color: #666; }
    .slow { background-color: #fff0f0; }
    .medium { background-color: #fffff0; }
    .fast { background-color: #f0fff0; }
    .chart-container { height: 400px; margin-top: 20px; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <h1>Test Performance Analysis</h1>
  <div id="summary" class="summary">Loading...</div>
  <div class="chart-container">
    <canvas id="timeChart"></canvas>
  </div>
  <div id="testList" class="test-list">Loading...</div>
  
  <script>
    // Load the test timing data
    const testData = $(cat reports/test-timing.json);
    
    // Extract test durations
    const testDurations = [];
    const testNames = [];
    const testColors = [];
    
    testData.testResults.forEach(suite => {
      suite.assertionResults.forEach(test => {
        const fullName = test.fullName || test.title;
        const duration = test.duration || 0;
        
        testDurations.push(duration);
        testNames.push(fullName);
        
        // Determine color based on duration
        if (duration > 100) {
          testColors.push('rgba(255, 99, 132, 0.8)'); // Red for slow tests
        } else if (duration > 50) {
          testColors.push('rgba(255, 205, 86, 0.8)'); // Yellow for medium tests
        } else {
          testColors.push('rgba(75, 192, 192, 0.8)'); // Green for fast tests
        }
      });
    });
    
    // Sort tests by duration (descending)
    const indices = Array.from(testDurations.keys());
    indices.sort((a, b) => testDurations[b] - testDurations[a]);
    
    const sortedDurations = indices.map(i => testDurations[i]);
    const sortedNames = indices.map(i => testNames[i]);
    const sortedColors = indices.map(i => testColors[i]);
    
    // Calculate statistics
    const totalTests = testDurations.length;
    const totalTime = testDurations.reduce((sum, duration) => sum + duration, 0);
    const avgTime = totalTime / totalTests;
    const maxTime = Math.max(...testDurations);
    const minTime = Math.min(...testDurations);
    
    // Count tests by speed category
    const slowTests = testDurations.filter(d => d > 100).length;
    const mediumTests = testDurations.filter(d => d > 50 && d <= 100).length;
    const fastTests = testDurations.filter(d => d <= 50).length;
    
    // Update summary
    document.getElementById('summary').innerHTML = \`
      <h2>Summary</h2>
      <p>Total Tests: \${totalTests}</p>
      <p>Total Execution Time: \${(totalTime / 1000).toFixed(2)} seconds</p>
      <p>Average Test Time: \${avgTime.toFixed(2)} ms</p>
      <p>Slowest Test: \${maxTime.toFixed(2)} ms</p>
      <p>Fastest Test: \${minTime.toFixed(2)} ms</p>
      <p>Slow Tests (>100ms): \${slowTests} (\${((slowTests / totalTests) * 100).toFixed(1)}%)</p>
      <p>Medium Tests (50-100ms): \${mediumTests} (\${((mediumTests / totalTests) * 100).toFixed(1)}%)</p>
      <p>Fast Tests (<50ms): \${fastTests} (\${((fastTests / totalTests) * 100).toFixed(1)}%)</p>
    \`;
    
    // Create chart
    const ctx = document.getElementById('timeChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedNames.slice(0, 20), // Show top 20 slowest tests
        datasets: [{
          label: 'Execution Time (ms)',
          data: sortedDurations.slice(0, 20),
          backgroundColor: sortedColors.slice(0, 20),
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          title: {
            display: true,
            text: 'Top 20 Slowest Tests'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Time (ms)'
            }
          }
        }
      }
    });
    
    // Generate test list
    let testListHtml = '<h2>All Tests (Sorted by Execution Time)</h2>';
    
    for (let i = 0; i < sortedNames.length; i++) {
      const duration = sortedDurations[i];
      const name = sortedNames[i];
      
      let speedClass = 'fast';
      if (duration > 100) {
        speedClass = 'slow';
      } else if (duration > 50) {
        speedClass = 'medium';
      }
      
      testListHtml += \`
        <div class="test-item \${speedClass}">
          <div class="test-name">\${name}</div>
          <div class="test-time">\${duration.toFixed(2)} ms</div>
        </div>
      \`;
    }
    
    document.getElementById('testList').innerHTML = testListHtml;
  </script>
</body>
</html>
EOL

echo -e "${GREEN}Performance analysis complete!${NC}"
echo -e "${YELLOW}Report generated at:${NC} ./reports/test-performance.html"
