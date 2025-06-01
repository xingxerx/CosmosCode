const { runPythonScript } = require('../pythonBridge');
const path = require('path');
const fs = require('fs').promises;
const os = require('os');
const logger = require('../../utils/logger');

/**
 * Generates medical visualization charts
 * @param {Object} data - Medical data to visualize
 * @param {Object} options - Visualization options
 * @returns {Promise<Object>} - Generated chart information
 */
async function generateMedicalCharts(data, options = {}) {
  logger.info('Generating medical visualization charts');
  
  try {
    const {
      chartTypes = ['line', 'scatter', 'heatmap'],
      outputFormat = 'png',
      width = 800,
      height = 600,
      theme = 'light',
      includeStatistics = true
    } = options;
    
    // Create data file
    const dataFile = path.join(os.tmpdir(), `chart_data_${Date.now()}.json`);
    await fs.writeFile(dataFile, JSON.stringify(data));
    
    // Create options file
    const optionsFile = path.join(os.tmpdir(), `chart_options_${Date.now()}.json`);
    await fs.writeFile(optionsFile, JSON.stringify({
      chart_types: chartTypes,
      output_format: outputFormat,
      width,
      height,
      theme,
      include_statistics: includeStatistics
    }));
    
    // Output directory
    const outputDir = path.join(os.tmpdir(), `charts_${Date.now()}`);
    await fs.mkdir(outputDir, { recursive: true });
    
    // Run visualization script
    const scriptPath = path.join(__dirname, '../../../python/medical_visualization.py');
    const output = await runPythonScript(scriptPath, [
      '--data', dataFile,
      '--options', optionsFile,
      '--output', outputDir
    ]);
    
    // Parse results
    const results = JSON.parse(output);
    
    return {
      charts: results.charts.map(chart => ({
        type: chart.type,
        title: chart.title,
        filePath: path.join(outputDir, chart.filename),
        statistics: chart.statistics
      })),
      summary: results.summary,
      outputDir
    };
  } catch (error) {
    logger.error(`Chart generation failed: ${error.message}`);
    throw new Error('Medical chart generation failed');
  }
}

/**
 * Creates an interactive dashboard with multiple charts
 * @param {Array} charts - Array of chart configurations
 * @param {Object} options - Dashboard options
 * @returns {Promise<Object>} - Dashboard information
 */
async function createMedicalDashboard(charts, options = {}) {
  // Implementation for dashboard creation
  // ...
  
  return {
    dashboardUrl: 'https://example.com/dashboard/123',
    charts: []
  };
}

module.exports = {
  generateMedicalCharts,
  createMedicalDashboard
};
