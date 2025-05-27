const { runPythonScript } = require('../pythonBridge');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../utils/logger');
const os = require('os');

/**
 * Analyzes dark matter distribution in cosmological simulations
 * @param {Object} simulationData - Simulation data containing particle positions
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeDarkMatterDistribution(simulationData, options = {}) {
  logger.info('Starting dark matter distribution analysis');
  
  try {
    const {
      resolution = 256,
      smoothingLength = 2.0,
      densityThreshold = 0.1,
      algorithm = 'adaptive',
      outputFormat = 'hdf5'
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `dm_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(simulationData));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `dm_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      resolution,
      smoothing_length: smoothingLength,
      density_threshold: densityThreshold,
      algorithm,
      output_format: outputFormat
    }));
    
    // Output directory
    const outputDir = path.join(os.tmpdir(), `dm_analysis_${Date.now()}`);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Run analysis script
    const scriptPath = path.join(__dirname, '../../../python/dark_matter_analysis.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile,
      '--output', outputDir
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      densityField: results.density_field_path ? path.join(outputDir, results.density_field_path) : null,
      halos: results.halos,
      statistics: results.statistics,
      filaments: results.filaments,
      voids: results.voids,
      metadata: {
        resolution,
        algorithm,
        particleCount: simulationData.particles.length,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    logger.error(`Dark matter analysis failed: ${error.message}`);
    throw new Error('Dark matter distribution analysis failed');
  }
}

/**
 * Identifies dark matter halos in simulation data
 * @param {Object} simulationData - Simulation data
 * @param {Object} options - Halo finding options
 * @returns {Promise<Array>} - Array of identified halos
 */
async function findDarkMatterHalos(simulationData, options = {}) {
  logger.info('Starting dark matter halo identification');
  
  try {
    const {
      algorithm = 'friends-of-friends',
      linkingLength = 0.2,
      minParticles = 20,
      unbinding = true
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `halo_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(simulationData));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `halo_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      algorithm,
      linking_length: linkingLength,
      min_particles: minParticles,
      unbinding
    }));
    
    // Run halo finder script
    const scriptPath = path.join(__dirname, '../../../python/halo_finder.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile
    ]);
    
    // Parse results
    const halos = JSON.parse(output);
    
    return halos.map(halo => ({
      id: halo.id,
      position: halo.position,
      velocity: halo.velocity,
      mass: halo.mass,
      radius: halo.radius,
      particleCount: halo.particle_count,
      subhalos: halo.subhalos || []
    }));
  } catch (error) {
    logger.error(`Halo finding failed: ${error.message}`);
    throw new Error('Dark matter halo identification failed');
  }
}

module.exports = {
  analyzeDarkMatterDistribution,
  findDarkMatterHalos
};