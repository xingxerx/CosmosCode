const { runCosmologicalSimulation } = require('./simulationEngine');
const { runPythonScript } = require('../pythonBridge');

// Mock dependencies
jest.mock('../pythonBridge', () => ({
  runPythonScript: jest.fn()
}));

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('{"test": "data"}'),
    mkdir: jest.fn().mockResolvedValue(undefined)
  }
}));

describe('Simulation Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    runPythonScript.mockResolvedValue('{"results": {"particles": 1000}}');
  });
  
  test('should run a cosmological simulation with parameters', async () => {
    const parameters = {
      type: 'nbody',
      complexity: 'high',
      omegaMatter: 0.3,
      hubbleConstant: 70
    };
    
    const result = await runCosmologicalSimulation(parameters);
    
    expect(runPythonScript).toHaveBeenCalled();
    expect(result).toHaveProperty('parameters', parameters);
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('metadata');
    expect(result.metadata).toHaveProperty('timestamp');
    expect(result.metadata).toHaveProperty('version', '1.0.0');
  });
  
  test('should handle errors during simulation', async () => {
    runPythonScript.mockRejectedValue(new Error('Simulation failed'));
    
    await expect(runCosmologicalSimulation({}))
      .rejects
      .toThrow('Simulation failed');
  });
});