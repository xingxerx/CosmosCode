// Import the module to test
const { runCosmologicalSimulation } = require('./simulationEngine');

// Set test environment
process.env.NODE_ENV = 'test';

// Mock dependencies
jest.mock('../pythonBridge', () => ({
  runPythonScript: jest.fn().mockResolvedValue(JSON.stringify({
    particles: 1000,
    energy: 0.5,
    clusters: 3,
    momentum: 0.1
  }))
}));

describe('Cosmology Module', () => {
  test('should run a simulation with parameters', async () => {
    const parameters = {
      type: 'nbody',
      particles: 1000,
      iterations: 100
    };
    
    const result = await runCosmologicalSimulation(parameters);
    
    expect(result).toHaveProperty('parameters');
    expect(result).toHaveProperty('results');
    expect(result.results).toHaveProperty('particles');
    expect(result.results).toHaveProperty('energy');
  });
  
  test('should handle empty parameters', async () => {
    const result = await runCosmologicalSimulation({});
    
    expect(result).toHaveProperty('parameters');
    expect(result).toHaveProperty('results');
  });
});