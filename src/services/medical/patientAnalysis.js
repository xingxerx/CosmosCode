const { runPythonScript } = require('../pythonBridge');
const { performStatisticalAnalysis } = require('../analysis/statisticalAnalysis');
const logger = require('../../utils/logger');
const path = require('path');
const fs = require('fs').promises;

/**
 * Analyzes patient data for medical insights
 * @param {Object} patientData - Patient medical data
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzePatientData(patientData, options = {}) {
  logger.info('Starting patient data analysis');
  
  try {
    // Extract analysis parameters
    const {
      includeGenetics = false,
      includeBiomarkers = true,
      timeSeriesAnalysis = false,
      correlationThreshold = 0.5
    } = options;
    
    // Prepare data for analysis
    const analysisData = {
      patientId: patientData.id,
      measurements: patientData.measurements,
      demographics: patientData.demographics,
      genetics: includeGenetics ? patientData.genetics : null,
      biomarkers: includeBiomarkers ? patientData.biomarkers : null
    };
    
    // Perform statistical analysis
    const statisticalResults = await performStatisticalAnalysis(analysisData, {
      tests: ['correlation', 'regression'],
      significance: 0.05
    });
    
    // Run specialized Python analysis if needed
    let advancedResults = {};
    if (timeSeriesAnalysis && patientData.timeSeries) {
      const scriptPath = path.join(__dirname, '../../../python/patient_time_series.py');
      const output = await runPythonScript(scriptPath, [
        JSON.stringify(patientData.timeSeries)
      ]);
      advancedResults = JSON.parse(output);
    }
    
    // Combine results
    return {
      patientId: patientData.id,
      statisticalResults,
      advancedResults,
      insights: generateInsights(statisticalResults, advancedResults, correlationThreshold)
    };
  } catch (error) {
    logger.error(`Patient analysis failed: ${error.message}`);
    throw new Error('Patient data analysis failed');
  }
}

/**
 * Generates medical insights from analysis results
 * @param {Object} statisticalResults - Statistical analysis results
 * @param {Object} advancedResults - Advanced analysis results
 * @param {number} correlationThreshold - Minimum correlation to include
 * @returns {Array<string>} - List of insights
 */
function generateInsights(statisticalResults, advancedResults, correlationThreshold) {
  const insights = [];
  
  // Extract insights from statistical results
  if (statisticalResults.correlations) {
    statisticalResults.correlations
      .filter(corr => Math.abs(corr.value) >= correlationThreshold)
      .forEach(corr => {
        insights.push(`Strong correlation (${corr.value.toFixed(2)}) between ${corr.variable1} and ${corr.variable2}`);
      });
  }
  
  // Extract insights from advanced results
  if (advancedResults.patterns) {
    advancedResults.patterns.forEach(pattern => {
      insights.push(`Detected pattern: ${pattern.description} (confidence: ${pattern.confidence.toFixed(2)})`);
    });
  }
  
  return insights;
}

module.exports = {
  analyzePatientData,
  generateInsights
};