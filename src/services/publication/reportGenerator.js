const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../utils/logger');
const config = require('../../config');

/**
 * Generates scientific reports from simulation results
 * @param {Object} simulationResult - Simulation result data
 * @param {Object} options - Report options
 * @returns {Promise<Object>} - Generated report info
 */
async function generateScientificReport(simulationResult, options = {}) {
  const {
    format = 'pdf',
    template = 'default',
    includeCode = true,
    includeFigures = true,
    bibliography = null,
    title = 'Cosmological Simulation Report',
    authors = []
  } = options;
  
  // Create report directory
  const reportId = `report_${Date.now()}`;
  const reportDir = path.join(config.reports.outputDir, reportId);
  await fs.mkdir(reportDir, { recursive: true });
  
  // Create report data file
  const dataFile = path.join(reportDir, 'data.json');
  await fs.writeFile(dataFile, JSON.stringify(simulationResult));
  
  // Create report configuration
  const reportConfig = {
    title,
    authors,
    format,
    template,
    includeCode,
    includeFigures,
    bibliography,
    date: new Date().toISOString()
  };
  
  const configFile = path.join(reportDir, 'config.json');
  await fs.writeFile(configFile, JSON.stringify(reportConfig));
  
  // Generate report
  return new Promise((resolve, reject) => {
    const reportScript = path.join(__dirname, '../../../python/generate_report.py');
    const report = spawn('python3', [
      reportScript,
      '--data', dataFile,
      '--config', configFile,
      '--output', reportDir
    ]);
    
    let stdoutData = '';
    let stderrData = '';
    
    report.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    report.stderr.on('data', (data) => {
      stderrData += data.toString();
      logger.error(`Report generation error: ${data}`);
    });
    
    report.on('close', async (code) => {
      if (code !== 0) {
        reject(new Error(`Report generation failed: ${stderrData}`));
        return;
      }
      
      try {
        // Get report metadata
        const metadataFile = path.join(reportDir, 'metadata.json');
        const metadata = JSON.parse(await fs.readFile(metadataFile, 'utf8'));
        
        resolve({
          reportId,
          reportDir,
          files: metadata.files,
          mainFile: metadata.mainFile,
          generatedAt: new Date()
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}

/**
 * Prepares a submission package for a scientific journal
 * @param {string} reportId - ID of the generated report
 * @param {Object} journalInfo - Journal submission information
 * @returns {Promise<Object>} - Submission package info
 */
async function prepareJournalSubmission(reportId, journalInfo) {
  // Implementation
}

module.exports = {
  generateScientificReport,
  prepareJournalSubmission
};