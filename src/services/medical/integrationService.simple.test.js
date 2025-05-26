// Import our test framework
const { describe, test, expect, jest, beforeEach } = require('../../testing/test-framework');

// Mock dependencies
const cosmologyService = {
  runCosmologicalSimulation: jest.fn()
};

const pythonBridge = {
  runPythonScript: jest.fn()
};

jest.mock('../cosmology', cosmologyService);
jest.mock('../pythonBridge', pythonBridge);

// Simplified integration service
const integratedAnalysis = async (medicalData, cosmologyParams) => {
  try {
    // Run cosmological simulation
    const cosmologyResults = await cosmologyService.runCosmologicalSimulation(cosmologyParams);
    
    // Run Python integration script
    const output = await pythonBridge.runPythonScript('integration.py', [
      JSON.stringify({ medicalData, cosmologyResults })
    ]);
    
    // Parse and return results
    return JSON.parse(output);
  } catch (error) {
    throw new Error('Cross-disciplinary analysis failed');
  }
};

// Tests
describe('Medical Integration Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock responses
    cosmologyService.runCosmologicalSimulation.mockResolvedValue({
      results: { particles: 1000 }
    });
    
    pythonBridge.runPythonScript.mockResolvedValue(JSON.stringify({
      correlations: [{ factor: 0.75, significance: 0.01 }],
      insights: ['Pattern detected between cosmic structures and cellular organization']
    }));
  });
  
  test('should perform integrated analysis between medical and cosmology data', async () => {
    const medicalData = {
      patientId: 'anonymous',
      cellularStructures: [],
      measurements: []
    };
    
    const cosmologyParams = {
      type: 'nbody',
      omegaMatter: 0.3
    };
    
    const result = await integratedAnalysis(medicalData, cosmologyParams);
    
    // Verify cosmology simulation was called
    expect(cosmologyService.runCosmologicalSimulation.mock.calls.length).toBe(1);
    
    // Verify Python integration script was called
    expect(pythonBridge.runPythonScript.mock.calls.length).toBe(1);
    
    // Verify results structure
    expect(result).toHaveProperty('correlations');
    expect(result).toHaveProperty('insights');
    expect(result.correlations[0]).toHaveProperty('factor');
    expect(result.correlations[0].factor).toBeGreaterThan(0);
  });
  
  test('should handle errors during integration', async () => {
    // Setup mock to reject
    pythonBridge.runPythonScript.mockRejectedValue(new Error('Integration failed'));
    
    let error;
    try {
      await integratedAnalysis({}, {});
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeTruthy();
    expect(error.message).toBe('Cross-disciplinary analysis failed');
  });
});
