const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const cosmologyService = require('../cosmology');
const { runPythonScript } = require('../pythonBridge');
const logger = require('../../utils/logger');

/**
 * Performs integrated analysis between medical and cosmological data
 * @param {Object} medicalData - Medical data to analyze
 * @param {Object} cosmologyParams - Parameters for cosmological simulation
 * @returns {Promise<Object>} - Integrated analysis results
 */
async function integratedAnalysis(medicalData, cosmologyParams) {
  if (!medicalData) {
    throw new Error('Medical data is required');
  }
  
  try {
    // Run cosmological simulation
    const cosmologyResults = await cosmologyService.runCosmologicalSimulation(cosmologyParams);
    
    // Prepare data for integration
    const integrationData = {
      medicalData,
      cosmologyResults
    };
    
    // Run Python integration script
    const inputFile = path.join(os.tmpdir(), `integration_${Date.now()}.json`);
    await fs.writeFile(inputFile, JSON.stringify(integrationData));
    
    const scriptPath = path.join(__dirname, '../../../python/cross_domain_integration.py');
    const output = await runPythonScript(scriptPath, [inputFile]);
    
    // Parse and return results
    return JSON.parse(output);
  } catch (error) {
    logger.error(`Integration analysis failed: ${error.message}`);
    throw new Error('Cross-disciplinary analysis failed');
  }
}

module.exports = {
  integratedAnalysis
};
