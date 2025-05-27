const { runCosmologicalSimulation, runDistributedSimulation } = require('../../services/cosmology/simulationEngine');
const { generate3DVisualization, createInteractiveVisualization } = require('../../services/visualization/cosmologyVisualizer');
const { analyzeDarkMatterDistribution, findDarkMatterHalos } = require('../../services/cosmology/darkMatterAnalysis');
const logger = require('../../utils/logger');

/**
 * Creates and runs a new cosmological simulation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createSimulation(req, res) {
  try {
    const { parameters, generateVisualization } = req.body;
    
    if (!parameters) {
      return res.status(400).json({ error: 'Simulation parameters are required' });
    }
    
    // Run simulation
    const simulationResults = await runCosmologicalSimulation(parameters);
    
    // Generate visualization if requested
    let visualization = null;
    if (generateVisualization) {
      visualization = await generate3DVisualization(
        simulationResults.results,
        req.body.visualizationOptions || {}
      );
    }