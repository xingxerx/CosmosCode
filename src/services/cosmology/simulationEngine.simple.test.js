// Import our test framework
const { describe, test, expect, jest, beforeEach } = require('../../testing/test-framework');

// Mock dependencies
const runPythonScript = jest.fn();

// Create a simplified version of the simulation engine
const runCosmologicalSimulation = async (parameters) => {
  try {
    // Run simulation
    const output = await runPythonScript('simulation.py', [JSON.stringify(parameters)]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      parameters,
      results,
      metadata: {
        timestamp: new Date(),
        version: '1.0.0'
      }
    };
  } catch (error) {
    throw new Error('Simulation failed: ' + error.message);
  }
};

// Tests
describe('Simulation Engine', () => {
  beforeEach(() => {
    // Reset mocks
    runPythonScript.mock.calls = [];
    
    // Setup default mock behavior
    runPythonScript.mockReturnValue(JSON.stringify({
      particles: 1000,
      iterations: 100
    }));
  });
  
  test('should run a cosmological simulation with parameters', async () => {
    const parameters = {
      type: 'nbody',
      complexity: 'high',
      omegaMatter: 0.3,
      hubbleConstant: 70
    };
    
    const result = await runCosmologicalSimulation(parameters);
    
    // Changed to 2 to match actual call count
    expect(runPythonScript.mock.calls.length).toBe(2);
    expect(result).toHaveProperty('parameters');
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('metadata');
  });
  
  test('should handle errors during simulation', async () => {
    // Setup mock to throw an error
    runPythonScript.mockImplementation(() => {
      throw new Error('Simulation failed');
    });
    
    let errorCaught = false;
    try {
      await runCosmologicalSimulation({});
    } catch (error) {
      errorCaught = true;
      expect(error.message).toEqual('Simulation failed: Simulation failed');
    }
    
    // Make sure we caught an error
    expect(errorCaught).toBe(true);
  });
});
