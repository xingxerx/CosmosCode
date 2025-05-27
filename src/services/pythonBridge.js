const { spawn } = require('child_process');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Runs a Python script and returns its output
 * @param {string} scriptPath - Path to the Python script
 * @param {Array} args - Command line arguments for the script
 * @param {Object} options - Additional options
 * @returns {Promise<string>} - Script output
 */
function runPythonScript(scriptPath, args = [], options = {}) {
  const {
    timeout = 300000, // 5 minutes default timeout
    pythonPath = config.python?.path || 'python3',
    env = process.env,
    cwd = process.cwd()
  } = options;
  
  logger.debug(`Running Python script: ${scriptPath} with args: ${args.join(' ')}`);
  
  return new Promise((resolve, reject) => {
    // Spawn Python process
    const pythonProcess = spawn(pythonPath, [scriptPath, ...args], {
      env: { ...env },
      cwd
    });
    
    let stdoutData = '';
    let stderrData = '';
    
    // Collect stdout data
    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });
    
    // Collect stderr data
    pythonProcess.stderr.on('data', (data) => {
      const errorText = data.toString();
      stderrData += errorText;
      logger.debug(`Python stderr: ${errorText}`);
    });
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        logger.error(`Python script failed with code ${code}: ${stderrData}`);
        reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
      } else {
        logger.debug(`Python script completed successfully`);
        resolve(stdoutData);
      }
    });
    
    // Handle process errors
    pythonProcess.on('error', (error) => {
      logger.error(`Failed to start Python process: ${error.message}`);
      reject(error);
    });
    
    // Set timeout
    if (timeout) {
      setTimeout(() => {
        pythonProcess.kill();
        logger.error(`Python script timed out after ${timeout}ms`);
        reject(new Error(`Python script execution timed out after ${timeout}ms`));
      }, timeout);
    }
  });
}

/**
 * Executes Python code directly and returns the result
 * @param {string} code - Python code to execute
 * @param {Object} options - Execution options
 * @returns {Promise<string>} - Execution result
 */
async function executePythonCode(code, options = {}) {
  const {
    timeout = 30000, // 30 seconds default timeout
    pythonPath = config.python?.path || 'python3',
    env = process.env
  } = options;
  
  logger.debug(`Executing Python code: ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}`);
  
  // Create a temporary file with the code
  const os = require('os');
  const path = require('path');
  const fs = require('fs').promises;
  
  const tempFile = path.join(os.tmpdir(), `python_code_${Date.now()}.py`);
  
  try {
    // Write code to temporary file
    await fs.writeFile(tempFile, code);
    
    // Execute the file
    const result = await runPythonScript(tempFile, [], {
      timeout,
      pythonPath,
      env
    });
    
    return result;
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(tempFile);
    } catch (error) {
      logger.warn(`Failed to delete temporary Python file: ${error.message}`);
    }
  }
}

module.exports = {
  runPythonScript,
  executePythonCode
};
