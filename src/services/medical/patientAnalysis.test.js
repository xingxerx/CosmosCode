const { analyzePatientData, generateInsights } = require('./patientAnalysis');
const { performStatisticalAnalysis } = require('../analysis/statisticalAnalysis');
const { runPythonScript } = require('../pythonBridge');

// Mock dependencies
jest.mock('../analysis/statisticalAnalysis', () => ({
  performStatisticalAnalysis: jest.fn(() => 
    Promise.resolve({
      correlations: [
        { variable1: 'bloodPressure', variable2: 'heartRate', value: 0.72 },
        { variable1: 'cholesterol', variable2: 'weight', value: 0.45 }
      ]
    })
  )
}));

jest.mock('../pythonBridge', () => ({
  runPythonScript: jest.fn(() => 
    Promise.resolve(JSON.stringify({
      patterns: [
        { description: 'Increasing trend in glucose levels', confidence: 0.85 }
      ]
    }))
  )
}));

describe('Patient Analysis Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should analyze patient data and return insights', async () => {
    const patientData = {
      id: 'patient-123',
      demographics: { age: 45, gender: 'F' },
      measurements: { bloodPressure: 120, heartRate: 72 },
      biomarkers: { cholesterol: 180, glucose: 95 },
      timeSeries: { glucose: [90, 92, 95, 98, 100] }
    };
    
    const options = {
      timeSeriesAnalysis: true,
      correlationThreshold: 0.5
    };
    
    const result = await analyzePatientData(patientData, options);
    
    // Verify statistical analysis was called
    expect(performStatisticalAnalysis).toHaveBeenCalled();
    
    // Verify Python script was called for time series
    expect(runPythonScript).toHaveBeenCalled();
    
    // Verify results structure
    expect(result).toHaveProperty('patientId', 'patient-123');
    expect(result).toHaveProperty('statisticalResults');
    expect(result).toHaveProperty('advancedResults');
    expect(result).toHaveProperty('insights');
    expect(result.insights.length).toBeGreaterThan(0);
  });
  
  test('should generate insights from analysis results', () => {
    const statisticalResults = {
      correlations: [
        { variable1: 'bloodPressure', variable2: 'heartRate', value: 0.72 },
        { variable1: 'cholesterol', variable2: 'weight', value: 0.45 }
      ]
    };
    
    const advancedResults = {
      patterns: [
        { description: 'Increasing trend in glucose levels', confidence: 0.85 }
      ]
    };
    
    const insights = generateInsights(statisticalResults, advancedResults, 0.5);
    
    // Should include the strong correlation
    expect(insights).toContain('Strong correlation (0.72) between bloodPressure and heartRate');
    
    // Should not include the weak correlation
    expect(insights).not.toContain('Strong correlation (0.45) between cholesterol and weight');
    
    // Should include the pattern
    expect(insights).toContain('Detected pattern: Increasing trend in glucose levels (confidence: 0.85)');
  });
});
