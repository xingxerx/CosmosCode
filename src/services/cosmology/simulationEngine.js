const { runPythonScript } = require('../pythonBridge');
const { simulationDurationSeconds } = require('../../middleware/metrics');
const path = require('path');
const fs = require('fs').promises;

/**
 * Runs a cosmological simulation with specified parameters
 * @param {Object} parameters - Simulation parameters
 * @returns {Promise<Object>} - Simulation results
 */
async function runCosmologicalSimulation(parameters) {
  const timer = simulationDurationSeconds.startTimer({
    type: parameters.type || 'standard',
    complexity: parameters.complexity || 'medium'
  });
  
  try {
    // Prepare input data
    const inputFile = path.join(os.tmpdir(), `sim_input_${Date.now()}.json`);
    await fs.writeFile(inputFile, JSON.stringify(parameters));
    
    // Run simulation
    const scriptPath = path.join(__dirname, '../../../python/cosmology_simulation.py');
    const output = await runPythonScript(scriptPath, [inputFile, '--format=binary']);
    
    // Parse results
    const results = await parseSimulationOutput(output);
    
    return {
      parameters,
      results,
      metadata: {
        timestamp: new Date(),
        version: '1.0.0'
      }
    };
  } finally {
    timer();
  }
}

module.exports = { runCosmologicalSimulation };