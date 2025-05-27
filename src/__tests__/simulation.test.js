const { generateSimulation } = require('../services/simulation');

describe('Simulation Service', () => {
  test('generates a valid simulation with default parameters', () => {
    const simulation = generateSimulation({
      type: 'n-body',
      complexity: 'medium'
    });
    
    expect(simulation).toBeDefined();
    expect(simulation.id).toBeDefined();
    expect(simulation.type).toBe('n-body');
    expect(simulation.status).toBe('completed');
    expect(simulation.results).toBeDefined();
  });
  
  test('handles different simulation types', () => {
    const types = ['n-body', 'dark-matter', 'galaxy-formation', 'cosmic-expansion'];
    
    types.forEach(type => {
      const simulation = generateSimulation({ type });
      expect(simulation.type).toBe(type);
      expect(simulation.results).toBeDefined();
    });
  });
  
  test('respects complexity settings', () => {
    const lowComplexity = generateSimulation({ complexity: 'low' });
    const highComplexity = generateSimulation({ complexity: 'high' });
    
    // Higher complexity should have more particles
    expect(highComplexity.results.particles).toBeGreaterThan(lowComplexity.results.particles);
  });
});