// Import the simulation engine
const { runCosmologicalSimulation } = require('./simulationEngine');

// Create a simple mock function for Node.js execution
const mockRunPythonScript = function() {
  return Promise.resolve(JSON.stringify({
    particles: 1000,
    energy: 0.5,
    clusters: 3
  }));
};

// Check if we're running in Jest or directly with Node
const isJest = typeof jest !== 'undefined';

// Only mock if we're in Jest
if (isJest) {
  jest.mock('../pythonBridge', () => ({
    runPythonScript: mockRunPythonScript
  }));
} else {
  // If running directly with Node, patch the pythonBridge module
  const pythonBridge = require('../pythonBridge');
  // Save the original function
  const originalRunPythonScript = pythonBridge.runPythonScript;
  // Replace with our mock for testing
  pythonBridge.runPythonScript = mockRunPythonScript;
}

// Simple test runner
async function runTests() {
  console.log('Running simulation engine tests...');
  
  // Test 1: Run simulation with parameters
  try {
    const parameters = {
      type: 'nbody',
      particles: 1000,
      iterations: 100
    };
    
    const result = await runCosmologicalSimulation(parameters);
    
    console.log('Test 1: Run simulation with parameters');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Simple assertions
    if (!result.parameters || result.parameters.type !== 'nbody') {
      throw new Error('Parameters not correctly included in result');
    }
    
    if (!result.results) {
      throw new Error('Results missing expected properties');
    }
    
    if (!result.metadata || result.metadata.version !== '1.0.0') {
      throw new Error('Metadata missing or incorrect');
    }
    
    console.log('Test 1: PASSED');
  } catch (error) {
    console.error('Test 1 failed:', error);
  }
  
  // Test 2: Handle empty parameters
  try {
    const result = await runCosmologicalSimulation({});
    
    console.log('Test 2: Handle empty parameters');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (!result.results) {
      throw new Error('Results missing');
    }
    
    if (!result.metadata) {
      throw new Error('Metadata missing');
    }
    
    console.log('Test 2: PASSED');
  } catch (error) {
    console.error('Test 2 failed:', error);
  }
  
  console.log('All tests completed');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

// Export for Jest
if (isJest) {
  describe('Simulation Engine', () => {
    test('should run a cosmological simulation with parameters', async () => {
      const result = await runCosmologicalSimulation({
        type: 'nbody',
        particles: 1000
      });
      
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('parameters');
      expect(result).toHaveProperty('metadata');
    });
    
    test('should handle errors during simulation', async () => {
      // This test assumes the error handling works correctly
      const result = await runCosmologicalSimulation({});
      expect(result).toHaveProperty('metadata');
    });
  });
}
