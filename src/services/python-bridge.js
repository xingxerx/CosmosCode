/**
 * Bridge to Python simulation code
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

/**
 * Run a Python simulation
 * @param {Object} params - Simulation parameters
 * @returns {Promise<Object>} Simulation results
 */
async function runPythonSimulation(params = {}) {
  const {
    type = 'n-body',
    particles = 1000,
    timeSteps = 100,
    boxSize = 10.0
  } = params;
  
  return new Promise((resolve, reject) => {
    // Create a temporary input file
    const inputFile = path.join(__dirname, '../../temp', `sim-input-${Date.now()}.json`);
    const outputFile = path.join(__dirname, '../../temp', `sim-output-${Date.now()}.json`);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, '../../temp'))) {
      fs.mkdirSync(path.join(__dirname, '../../temp'), { recursive: true });
    }
    
    // Write parameters to input file
    fs.writeFileSync(inputFile, JSON.stringify({
      type,
      particles,
      timeSteps,
      boxSize
    }));
    
    // Path to Python script
    const scriptPath = path.join(__dirname, '../../python_src/run_simulation.py');
    
    // Spawn Python process
    const pythonProcess = spawn('python', [
      scriptPath,
      '--input', inputFile,
      '--output', outputFile
    ]);
    
    let stdoutData = '';
    let stderrData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      // Clean up input file
      try {
        fs.unlinkSync(inputFile);
      } catch (err) {
        logger.warn(`Failed to delete input file: ${err.message}`);
      }
      
      if (code !== 0) {
        logger.error(`Python process exited with code ${code}`);
        logger.error(`STDERR: ${stderrData}`);
        return reject(new Error(`Python simulation failed with code ${code}: ${stderrData}`));
      }
      
      try {
        // Read results from output file
        const results = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
        
        // Clean up output file
        fs.unlinkSync(outputFile);
        
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  });
}

module.exports = {
  runPythonSimulation
};