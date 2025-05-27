// Import the simulation engine
const simulationEngine = require('./simulationEngine');

// Set test environment
process.env.NODE_ENV = 'test';

// Run tests with Jest format
describe('Simulation Engine', () => {
  test('Run simulation with parameters', () => {
    const result = simulationEngine.runCosmologicalSimulation({
      type: 'nbody',
      particles: 1000,
      iterations: 100
    });
    
    expect(result).toHaveProperty('results');
    expect(result.results.particles).toBe(1000);
  });

  test('Handle empty parameters', () => {
    const result = simulationEngine.runCosmologicalSimulation({});
    
    expect(result).toHaveProperty('results');
  });

  test('Different simulation types', () => {
    const result = simulationEngine.runCosmologicalSimulation({
      type: 'hydro',
      particles: 500
    });
    
    expect(result).toHaveProperty('results');
  });
});
