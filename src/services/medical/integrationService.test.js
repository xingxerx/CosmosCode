const { integratedAnalysis } = require('./integrationService');
const cosmologyService = require('../cosmology');
const { runPythonScript } = require('../pythonBridge');
const fs = require('fs').promises;

// Mock dependencies
jest.mock('../cosmology', () => ({
  runCosmologicalSimulation: jest.fn(() => 
    Promise.resolve({
      results: { particles: 1000 }
    })
  )
}));

jest.mock('../pythonBridge', () => ({
  runPythonScript: jest.fn(() => 
    Promise.resolve(JSON.stringify({
      correlations: [{ factor: 0.75, significance: 0.01 }],
      insights: ['Pattern detected between cosmic structures and cellular organization']
    }))
  )
}));

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('{"test": "data"}'),
    mkdir: jest.fn().mockResolvedValue(undefined)
  }
}));

// Mock logger to avoid errors
jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
}), { virtual: true });

describe('Medical Integration Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    // Mock an error in the cosmology simulation
    cosmologyService.runCosmologicalSimulation.mockImplementationOnce(() => 
      Promise.reject(new Error('Simulation failed'))
    );
    
    // Expect the function to throw an error
    await expect(integratedAnalysis({}, {}))
      .rejects
      .toThrow('Cross-disciplinary analysis failed');
  });
});
