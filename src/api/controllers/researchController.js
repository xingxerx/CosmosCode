const { startNotebookServer, executeNotebook, createResearchNotebook } = require('../../services/research/notebookService');
const { applyCosmologyPatternsToMedical } = require('../../services/crossDisciplinary/cosmologyMedicalBridge');
const logger = require('../../utils/logger');
const path = require('path');

/**
 * Starts a Jupyter notebook server
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function startNotebook(req, res) {
  try {
    const options = req.body.options || {};
    
    // Start notebook server
    const serverInfo = await startNotebookServer(options);
    
    // Return server information (without the process object)
    const { process, ...info } = serverInfo;
    res.json({ success: true, server: info });
  } catch (error) {
    logger.error(`Failed to start notebook server: ${error.message}`);
    res.status(500).json({ error: 'Failed to start notebook server' });
  }
}

/**
 * Executes a Jupyter notebook with parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function runNotebook(req, res) {
  try {
    const { notebookPath, parameters } = req.body;
    
    if (!notebookPath) {
      return res.status(400).json({ error: 'Notebook path is required' });
    }
    
    // Execute notebook
    const result = await executeNotebook(notebookPath, parameters || {});
    
    // Return results
    res.json({ success: true, result });
  } catch (error) {
    logger.error(`Failed to execute notebook: ${error.message}`);
    res.status(500).json({ error: 'Failed to execute notebook' });
  }
}

/**
 * Creates a new research notebook
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createNotebook(req, res) {
  try {
    const { title, template } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Notebook title is required' });
    }
    
    // Create notebook
    const notebookPath = await createResearchNotebook(title, template);
    
    // Return path
    res.json({ success: true, notebookPath });
  } catch (error) {
    logger.error(`Failed to create notebook: ${error.message}`);
    res.status(500).json({ error: 'Failed to create notebook' });
  }
}

/**
 * Runs a cross-disciplinary analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function runCrossDisciplinaryAnalysis(req, res) {
  try {
    const { medicalData, cosmologyPatterns } = req.body;
    
    if (!medicalData || !cosmologyPatterns) {
      return res.status(400).json({ error: 'Both medical data and cosmology patterns are required' });
    }
    
    // Run analysis
    const results = await applyCosmologyPatternsToMedical(medicalData, cosmologyPatterns);
    
    // Return results
    res.json({ success: true, results });
  } catch (error) {
    logger.error(`Cross-disciplinary analysis failed: ${error.message}`);
    res.status(500).json({ error: 'Cross-disciplinary analysis failed' });
  }
}

module.exports = {
  startNotebook,
  runNotebook,
  createNotebook,
  runCrossDisciplinaryAnalysis
};