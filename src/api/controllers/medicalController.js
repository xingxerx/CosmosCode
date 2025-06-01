const { analyzePatientData } = require('../../services/medical/patientAnalysis');
const { generateMedicalCharts } = require('../../services/visualization/medicalCharts');
const { integratedAnalysis } = require('../../services/medical/integrationService');
const logger = require('../../utils/logger');

/**
 * Lists available medical datasets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listDatasets(req, res) {
  try {
    // Implementation to list datasets
    const datasets = [
      { id: 'dataset-1', name: 'Patient Records 2023', count: 1250 },
      { id: 'dataset-2', name: 'Clinical Trial Results', count: 500 },
      { id: 'dataset-3', name: 'Genomic Sequences', count: 750 }
    ];
    
    res.json({ datasets });
  } catch (error) {
    logger.error(`Failed to list datasets: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve datasets' });
  }
}

/**
 * Runs analysis on medical data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function runAnalysis(req, res) {
  try {
    const { datasetId, patientId, options } = req.body;
    
    // Validate request
    if (!datasetId && !patientId) {
      return res.status(400).json({ error: 'Either datasetId or patientId is required' });
    }
    
    // Get patient data (in a real app, this would come from a database)
    const patientData = {
      id: patientId || 'anonymous',
      demographics: req.body.demographics || {},
      measurements: req.body.measurements || {},
      biomarkers: req.body.biomarkers || {},
      timeSeries: req.body.timeSeries || {}
    };
    
    // Run analysis
    const analysisResults = await analyzePatientData(patientData, options);
    
    // Generate visualizations if requested
    let visualizations = null;
    if (options?.generateVisualizations) {
      visualizations = await generateMedicalCharts(analysisResults, options.visualizationOptions);
    }
    
    // Return results
    res.json({
      results: analysisResults,
      visualizations
    });
  } catch (error) {
    logger.error(`Analysis failed: ${error.message}`);
    res.status(500).json({ error: 'Analysis failed' });
  }
}

/**
 * Runs integrated analysis with cosmology data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function runIntegratedAnalysis(req, res) {
  try {
    const { medicalData, cosmologyParams } = req.body;
    
    // Validate request
    if (!medicalData || !cosmologyParams) {
      return res.status(400).json({ error: 'Both medicalData and cosmologyParams are required' });
    }
    
    // Run integrated analysis
    const results = await integratedAnalysis(medicalData, cosmologyParams);
    
    // Return results
    res.json({ results });
  } catch (error) {
    logger.error(`Integrated analysis failed: ${error.message}`);
    res.status(500).json({ error: 'Integrated analysis failed' });
  }
}

module.exports = {
  listDatasets,
  runAnalysis,
  runIntegratedAnalysis
};