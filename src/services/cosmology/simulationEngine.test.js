// Import the simulation engine
const simulationEngine = require('./simulationEngine');

// Set test environment
process.env.NODE_ENV = 'test';

// Run tests
console.log('Running simulation engine tests...');

// Test 1: Run simulation with parameters
console.log('Test 1: Run simulation with parameters');
const result1 = simulationEngine.runSimulation({
  type: 'nbody',
  particles: 1000,
  iterations: 100
});
console.log('Result:', result1);
console.log('Test 1:', result1.results.particles === 1000 ? 'PASSED' : 'FAILED');

// Test 2: Handle empty parameters
console.log('Test 2: Handle empty parameters');
const result2 = simulationEngine.runSimulation({});
console.log('Result:', result2);
console.log('Test 2:', result2.results ? 'PASSED' : 'FAILED');

// Test 3: Different simulation types
console.log('Test 3: Different simulation types');
const result3 = simulationEngine.runSimulation({
  type: 'hydro',
  particles: 500
});
console.log('Result:', result3);
console.log('Test 3:', result3.results ? 'PASSED' : 'FAILED');

console.log('All tests completed');
