const { runCosmologicalSimulation } = require('../services/cosmology/simulationEngine');

describe('Simulation Service', () => {
  test('generates a valid simulation with default parameters', async () => {
    const result = await runCosmologicalSimulation({});
    
    expect(result).toHaveProperty('parameters');
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('metadata');
    expect(result.metadata).toHaveProperty('version', '1.0.0');
  });
  
  test('handles different simulation types', async () => {
    const nbodyResult = await runCosmologicalSimulation({ type: 'nbody' });
    const darkMatterResult = await runCosmologicalSimulation({ type: 'dark-matter' });
    const expansionResult = await runCosmologicalSimulation({ type: 'expansion' });
    
    expect(nbodyResult.results).toHaveProperty('energy');
    expect(darkMatterResult.results).toHaveProperty('darkMatterDensity');
    expect(expansionResult.results).toHaveProperty('hubbleConstant');
  });
  
  test('respects complexity settings', async () => {
    const lowComplexity = await runCosmologicalSimulation({ 
      complexity: 'low',
      particles: 1000
    });
    
    const highComplexity = await runCosmologicalSimulation({
      complexity: 'high',
      particles: 1000
    });
    
    // Higher complexity should have more particles
    expect(highComplexity.results.particles).toBeGreaterThan(lowComplexity.results.particles);
  });
});
