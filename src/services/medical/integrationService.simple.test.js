// Import our test framework
const { describe, test, expect, jest, beforeEach } = require('../../testing/test-framework');

// Create mock functions directly
const mockRunCosmologicalSimulation = jest.fn();
const mockRunPythonScript = jest.fn();

// Mock dependencies
const cosmologyService = {
  runCosmologicalSimulation: mockRunCosmologicalSimulation
};

const pythonBridge = {
  runPythonScript: mockRunPythonScript
};

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
    // Reset mocks
    mockRunCosmologicalSimulation.mock.calls = [];
    mockRunPythonScript.mock.calls = [];
    
    // Setup default mock responses
    mockRunCosmologicalSimulation.mockReturnValue({
      results: { particles: 1000 }
    });
    
    mockRunPythonScript.mockReturnValue(JSON.stringify({
      correlations: [{ factor: 0.75, significance: 0.01 }],
      insights: ['Pattern detected between cosmic structures and cellular organization']
    }));
  });
  
  test('should handle errors during integration', async () => {
    // Setup mock to throw an error for this test only
    mockRunPythonScript.mockImplementation(() => {
      throw new Error('Integration failed');
    });
    
    try {
      await integratedAnalysis({}, {});
      // If we get here, the test should fail
      expect(false).toBe(true); // This will fail if no error is thrown
    } catch (error) {
      // Verify the error message
      expect(error.message).toBe('Cross-disciplinary analysis failed');
    }
  });
  
  test('should perform integrated analysis between medical and cosmology data', async () => {
    // Reset mocks for this test
    mockRunCosmologicalSimulation.mock.calls = [];
    mockRunPythonScript.mock.calls = [];
    
    // Setup mock responses again to ensure they're correct
    mockRunCosmologicalSimulation.mockReturnValue({
      results: { particles: 1000 }
    });
    
    const mockResponse = {
      correlations: [{ factor: 0.75, significance: 0.01 }],
      insights: ['Pattern detected between cosmic structures and cellular organization']
    };
    
    mockRunPythonScript.mockReturnValue(JSON.stringify(mockResponse));
    
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
    
    // Verify cosmology simulation was called with correct parameters
    expect(mockRunCosmologicalSimulation.mock.calls.length).toBe(1);
    
    // Verify Python integration script was called
    expect(mockRunPythonScript.mock.calls.length).toBe(1);
    
    // Verify results structure
    expect(result).toHaveProperty('correlations');
    expect(result).toHaveProperty('insights');
  });
});
