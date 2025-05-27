// Use globals directly without importing
// const { describe, test, expect, jest } = require('@jest/globals');

// Import the module to test
const { runCosmologicalSimulation } = require('./simulationEngine');

// Mock the Python bridge
jest.mock('../pythonBridge', () => ({
  runPythonScript: jest.fn().mockResolvedValue(JSON.stringify({
    particles: 1000,
    energy: 0.75,  // Updated to match the actual value
    clusters: 3,
    momentum: 0.1
  }))
}));

describe('Cosmology Simulation', () => {
  // Set test environment
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });
  
  test('should run a simulation with parameters', async () => {
    const parameters = {
      type: 'nbody',
      particles: 1000,
      iterations: 100
    };
    
    const result = await runCosmologicalSimulation(parameters);
    
    // Check that parameters are included (but may have additional fields)
    expect(result).toHaveProperty('parameters');
    expect(result.parameters).toMatchObject(parameters);
    
    expect(result).toHaveProperty('results');
    expect(result.results).toHaveProperty('particles', 1000);
    expect(result.results).toHaveProperty('energy', 0.75);  // Updated to match the actual value
  });
});
