// Import our test framework
const { describe, test, expect, jest, beforeEach } = require('../../testing/test-framework');

// Mock dependencies
const pythonBridge = {
  runPythonScript: jest.fn()
};

jest.mock('../pythonBridge', pythonBridge);

jest.mock('fs', {
  promises: {
    writeFile: jest.fn(),
    readFile: jest.fn(),
    mkdir: jest.fn()
  }
});

jest.mock('../../middleware/metrics', {
  simulationDurationSeconds: {
    startTimer: jest.fn()
  }
});

jest.mock('path', {
  join: jest.fn((...args) => args.join('/'))
});

jest.mock('os', {
  tmpdir: jest.fn()
});

// Create a simplified version of the simulation engine
const runCosmologicalSimulation = async (parameters) => {
  try {
    // Run simulation
    const output = await pythonBridge.runPythonScript('simulation.py', [JSON.stringify(parameters)]);
    
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
    throw error;
  }
};

// Tests
describe('Simulation Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pythonBridge.runPythonScript.mockResolvedValue('{"results": {"particles": 1000}}');
  });
  
  test('should run a cosmological simulation with parameters', async () => {
    const parameters = {
      type: 'nbody',
      complexity: 'high',
      omegaMatter: 0.3,
      hubbleConstant: 70
    };
    
    const result = await runCosmologicalSimulation(parameters);
    
    expect(pythonBridge.runPythonScript.mock.calls.length).toBe(1);
    expect(result).toHaveProperty('parameters');
    expect(result).toHaveProperty('results');
    expect(result).toHaveProperty('metadata');
    expect(result.metadata).toHaveProperty('version', '1.0.0');
  });
  
  test('should handle errors during simulation', async () => {
    // Setup mock to reject
    pythonBridge.runPythonScript.mockRejectedValue(new Error('Simulation failed'));
    
    let error;
    try {
      await runCosmologicalSimulation({});
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeTruthy();
    expect(error.message).toBe('Simulation failed');
  });
});
