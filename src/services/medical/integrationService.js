const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const logger = require('../../utils/logger');
const cosmologyService = require('../cosmology/simulationEngine');
const { runPythonScript } = require('../python-bridge');

/**
 * Performs integrated analysis between medical and cosmological data
 * @param {Object} medicalData - Patient medical data
 * @param {Object} cosmologyParams - Parameters for cosmological simulation
 * @returns {Object} - Integrated analysis results
 */
async function integratedAnalysis(medicalData, cosmologyParams) {
  logger.info('Starting integrated cosmology-medical analysis');
  
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
