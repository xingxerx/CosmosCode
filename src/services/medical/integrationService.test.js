const { integratedAnalysis } = require('./integrationService');
const cosmologyService = require('../cosmology');
const { runPythonScript } = require('../pythonBridge');

// Mock dependencies
jest.mock('../cosmology', () => ({
  runCosmologicalSimulation: jest.fn()
}));

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

describe('Medical Integration Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock responses
    cosmologyService.runCosmologicalSimulation.mockResolvedValue({
      results: { particles: 1000 }
    });
    
    runPythonScript.mockResolvedValue(JSON.stringify({
      correlations: [{ factor: 0.75, significance: 0.01 }],
      insights: ['Pattern detected between cosmic structures and cellular organization']
    }));
  });
  
  test('should perform integrated analysis between medical and cosmology data', async () => {
    const medicalData = {
      patientId: 'anonymous',
      cellularStructures: [/* mock data */],
      measurements: [/* mock data */]
    };
    
    const cosmologyParams = {
      type: 'nbody',
      omegaMatter: 0.3
    };
    
    const result = await integratedAnalysis(medicalData, cosmologyParams);
    
    // Verify cosmology simulation was called
    expect(cosmologyService.runCosmologicalSimulation).toHaveBeenCalledWith(cosmologyParams);
    
    // Verify Python integration script was called
    expect(runPythonScript).toHaveBeenCalled();
    
    // Verify results structure
    expect(result).toHaveProperty('correlations');
    expect(result).toHaveProperty('insights');
    expect(result.correlations[0]).toHaveProperty('factor');
    expect(result.correlations[0].factor).toBeGreaterThan(0);
  });
  
  test('should handle errors during integration', async () => {
    runPythonScript.mockRejectedValue(new Error('Integration failed'));
    
    await expect(integratedAnalysis({}, {}))
      .rejects
      .toThrow('Cross-disciplinary analysis failed');
  });
});