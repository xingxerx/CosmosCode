const { runPythonScript } = require('../pythonBridge');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../utils/logger');
const os = require('os');

/**
 * Generates 3D visualizations of cosmological simulations
 * @param {Object} simulationData - Simulation data
 * @param {Object} options - Visualization options
 * @returns {Promise<Object>} - Visualization results
 */
async function generate3DVisualization(simulationData, options = {}) {
  logger.info('Generating 3D cosmology visualization');
  
  try {
    const {
      renderType = 'volume',
      colorMap = 'viridis',
      resolution = [1920, 1080],
      backgroundColor = [0, 0, 0],
      particleSize = 1.0,
      cameraPosition = [0, 0, 100],
      outputFormat = 'png'
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `viz_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(simulationData));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `viz_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      render_type: renderType,
      color_map: colorMap,
      resolution,
      background_color: backgroundColor,
      particle_size: particleSize,
      camera_position: cameraPosition,
      output_format: outputFormat
    }));
    
    // Output directory
    const outputDir = path.join(os.tmpdir(), `viz_output_${Date.now()}`);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Run visualization script
    const scriptPath = path.join(__dirname, '../../../python/cosmology_visualizer.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile,
      '--output', outputDir
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      mainImage: path.join(outputDir, results.main_image),
      additionalViews: results.additional_views.map(view => path.join(outputDir, view)),
      metadata: results.metadata,
      webglScene: results.webgl_scene ? path.join(outputDir, results.webgl_scene) : null
    };
  } catch (error) {
    logger.error(`Visualization generation failed: ${error.message}`);
    throw new Error('Cosmology visualization failed');
  }
}

/**
 * Creates an interactive visualization for web browsers
 * @param {Object} simulationData - Simulation data
 * @param {Object} options - Interactive visualization options
 * @returns {Promise<Object>} - Interactive visualization results
 */
async function createInteractiveVisualization(simulationData, options = {}) {
  logger.info('Creating interactive cosmology visualization');
  
  try {
    const {
      framework = 'threejs',
      includeTimeline = true,
      includeControls = true,
      includeStats = true,
      includeFilters = true,
      responsive = true,
      maxParticles = 100000,
      optimizationLevel = 'medium'
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `interactive_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(simulationData));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `interactive_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      framework,
      include_timeline: includeTimeline,
      include_controls: includeControls,
      include_stats: includeStats,
      include_filters: includeFilters,
      responsive,
      max_particles: maxParticles,
      optimization_level: optimizationLevel
    }));
    
    // Output directory
    const outputDir = path.join(os.tmpdir(), `interactive_viz_${Date.now()}`);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Run interactive visualization script
    const scriptPath = path.join(__dirname, '../../../python/interactive_visualizer.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile,
      '--output', outputDir
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      htmlFile: path.join(outputDir, results.html_file),
      jsFiles: results.js_files.map(file => path.join(outputDir, file)),
      cssFiles: results.css_files.map(file => path.join(outputDir, file)),
      dataFiles: results.data_files.map(file => path.join(outputDir, file)),
      config: results.config,
      metadata: results.metadata
    };
  } catch (error) {
    logger.error(`Interactive visualization creation failed: ${error.message}`);
    throw new Error('Interactive cosmology visualization failed');
  }
}

/**
 * Generates a time-evolution visualization of simulation data
 * @param {Array} timeSeriesData - Array of simulation data at different time points
 * @param {Object} options - Time evolution visualization options
 * @returns {Promise<Object>} - Time evolution visualization results
 */
async function generateTimeEvolutionVisualization(timeSeriesData, options = {}) {
  logger.info('Generating time evolution visualization');
  
  try {
    const {
      format = 'mp4',
      fps = 30,
      duration = 10,
      interpolation = 'linear',
      colorMap = 'plasma',
      resolution = [1920, 1080],
      includeTimestamp = true,
      includeScale = true
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `timeseries_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(timeSeriesData));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `timeseries_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      format,
      fps,
      duration,
      interpolation,
      color_map: colorMap,
      resolution,
      include_timestamp: includeTimestamp,
      include_scale: includeScale
    }));
    
    // Output directory
    const outputDir = path.join(os.tmpdir(), `timeseries_viz_${Date.now()}`);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Run time evolution script
    const scriptPath = path.join(__dirname, '../../../python/time_evolution_visualizer.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile,
      '--output', outputDir
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      videoFile: path.join(outputDir, results.video_file),
      frameFiles: results.frame_files ? results.frame_files.map(file => path.join(outputDir, file)) : [],
      metadata: results.metadata,
      duration: results.duration,
      frameCount: results.frame_count
    };
  } catch (error) {
    logger.error(`Time evolution visualization failed: ${error.message}`);
    throw new Error('Time evolution visualization failed');
  }
}

/**
 * Creates a comparative visualization of multiple datasets
 * @param {Array} datasets - Array of datasets to compare
 * @param {Object} options - Comparison visualization options
 * @returns {Promise<Object>} - Comparison visualization results
 */
async function createComparisonVisualization(datasets, options = {}) {
  logger.info('Creating comparison visualization');
  
  try {
    const {
      layout = 'grid',
      highlightDifferences = true,
      normalizeData = true,
      includeStatistics = true,
      colorMaps = ['viridis', 'plasma', 'inferno', 'magma'],
      outputFormat = 'png'
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `comparison_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(datasets));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `comparison_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      layout,
      highlight_differences: highlightDifferences,
      normalize_data: normalizeData,
      include_statistics: includeStatistics,
      color_maps: colorMaps,
      output_format: outputFormat
    }));
    
    // Output directory
    const outputDir = path.join(os.tmpdir(), `comparison_viz_${Date.now()}`);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Run comparison visualization script
    const scriptPath = path.join(__dirname, '../../../python/comparison_visualizer.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile,
      '--output', outputDir
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      mainImage: path.join(outputDir, results.main_image),
      individualImages: results.individual_images.map(img => path.join(outputDir, img)),
      differenceImages: results.difference_images.map(img => path.join(outputDir, img)),
      statistics: results.statistics,
      metadata: results.metadata
    };
  } catch (error) {
    logger.error(`Comparison visualization failed: ${error.message}`);
    throw new Error('Comparison visualization failed');
  }
}

module.exports = {
  generate3DVisualization,
  createInteractiveVisualization,
  generateTimeEvolutionVisualization,
  createComparisonVisualization
};
