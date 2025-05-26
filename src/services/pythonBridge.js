const { spawn } = require('child_process');
const path = require('path');

/**
 * Executes a Python script and returns the result
 * @param {string} scriptPath - Path to the Python script
 * @param {Array} args - Arguments to pass to the script
 * @returns {Promise<string>} - Output from the script
 */
function runPythonScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [scriptPath, ...args]);
    
    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`Python process exited with code ${code}`);
      } else {
        resolve(output);
      }
    });
  });
}

module.exports = { runPythonScript };