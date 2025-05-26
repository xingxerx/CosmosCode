const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../utils/logger');
const config = require('../../config');

/**
 * Runs an N-body cosmological simulation
 * @param {Object} parameters - Simulation parameters
 * @returns {Promise<Object>} - Simulation results
 */
async function runNBodySimulation(parameters) {
  const {
    particleCount = 1000,
    timeSteps = 1000,
    boxSize = 100,
    omegaMatter = 0.3,
    omegaLambda = 0.7,
    hubbleConstant = 70,
    redshiftStart = 10,
    redshiftEnd = 0,
    outputFormat = 'hdf5'
  } = parameters;
  
  // Create parameter file
  const paramFile = path.join(os.tmpdir(), `nbody_params_${Date.now()}.json`);
  await fs.writeFile(paramFile, JSON.stringify({
    particle_count: particleCount,
    time_steps: timeSteps,
    box_size: boxSize,
    omega_matter: omegaMatter,
    omega_lambda: omegaLambda,
    hubble_constant: hubbleConstant,
    redshift_start: redshiftStart,
    redshift_end: redshiftEnd,
    output_format: outputFormat
  }));
  
  // Output directory
  const outputDir = path.join(config.simulation.outputDir, `sim_${Date.now()}`);
  await fs.mkdir(outputDir, { recursive: true });
  
  // Run simulation
  return new Promise((resolve, reject) => {
    const simulation = spawn('python3', [
      path.join(__dirname, '../../../python/nbody_simulation.py'),
      '--params', paramFile,
      '--output', outputDir
    ]);
    
    let stdoutData = '';
    let stderrData = '';
    
    simulation.stdout.on('data', (data) => {
      const output = data.toString();
      stdoutData += output;
      logger.debug(`Simulation output: ${output}`);
    });
    
    simulation.stderr.on('data', (data) => {
      const error = data.toString();
      stderrData += error;
      logger.error(`Simulation error: ${error}`);
    });
    
    simulation.on('close', async (code) => {
      if (code !== 0) {
        reject(new Error(`Simulation failed with code ${code}: ${stderrData}`));
        return;
      }
      
      try {
        // Read simulation metadata
        const metadataFile = path.join(outputDir, 'metadata.json');
        const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
        
        resolve({
          parameters,
          outputDir,
          metadata,
          snapshots: metadata.snapshots,
          runtime: metadata.runtime
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Runs a hydrodynamic cosmological simulation
 * @param {Object} parameters - Simulation parameters
 * @returns {Promise<Object>} - Simulation results
 */
async function runHydrodynamicSimulation(parameters) {
  // Implementation for hydrodynamic simulations
}

module.exports = {
  runNBodySimulation,
  runHydrodynamicSimulation
};