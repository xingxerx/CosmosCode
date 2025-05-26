const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../utils/logger');

/**
 * Starts a Jupyter notebook server for interactive research
 * @param {Object} options - Server options
 * @returns {Promise<Object>} - Server info including URL and token
 */
function startNotebookServer(options = {}) {
  const {
    port = 8888,
    notebookDir = path.join(process.cwd(), 'notebooks'),
    allowRoot = false
  } = options;
  
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure notebook directory exists
      await fs.mkdir(notebookDir, { recursive: true });
      
      // Build command arguments
      const args = [
        '-m', 'jupyter', 'notebook',
        `--port=${port}`,
        `--notebook-dir=${notebookDir}`,
        '--no-browser',
        '--ip=0.0.0.0'
      ];
      
      if (allowRoot) args.push('--allow-root');
      
      // Start Jupyter process
      const jupyter = spawn('python3', args);
      
      // Extract server URL and token
      let serverInfo = null;
      jupyter.stdout.on('data', (data) => {
        const output = data.toString();
        logger.debug(`Jupyter: ${output}`);
        
        // Look for the server URL with token
        const match = output.match(/http:\/\/[^:]+:(\d+)\/\?token=([a-f0-9]+)/);
        if (match && !serverInfo) {
          serverInfo = {
            url: match[0],
            port: parseInt(match[1], 10),
            token: match[2],
            process: jupyter
          };
          resolve(serverInfo);
        }
      });
      
      jupyter.stderr.on('data', (data) => {
        logger.error(`Jupyter error: ${data}`);
      });
      
      jupyter.on('close', (code) => {
        if (code !== 0 && !serverInfo) {
          reject(new Error(`Jupyter process exited with code ${code}`));
        }
      });
      
      // Timeout if server doesn't start
      setTimeout(() => {
        if (!serverInfo) {
          jupyter.kill();
          reject(new Error('Jupyter notebook server failed to start'));
        }
      }, 10000);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Executes a notebook and returns the results
 * @param {string} notebookPath - Path to the notebook file
 * @param {Object} parameters - Parameters to pass to the notebook
 * @returns {Promise<Object>} - Executed notebook with results
 */
async function executeNotebook(notebookPath, parameters = {}) {
  // Write parameters to temporary file
  const paramsPath = path.join(os.tmpdir(), `params_${Date.now()}.json`);
  await fs.writeFile(paramsPath, JSON.stringify(parameters));
  
  // Execute notebook with papermill
  const outputPath = path.join(os.tmpdir(), `output_${Date.now()}.ipynb`);
  
  return new Promise((resolve, reject) => {
    const papermill = spawn('python3', [
      '-m', 'papermill',
      notebookPath,
      outputPath,
      '-f', paramsPath
    ]);
    
    let output = '';
    papermill.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    papermill.stderr.on('data', (data) => {
      logger.error(`Papermill error: ${data}`);
    });
    
    papermill.on('close', async (code) => {
      if (code !== 0) {
        reject(new Error(`Notebook execution failed with code ${code}`));
      } else {
        try {
          // Read executed notebook
          const notebookContent = await fs.readFile(outputPath, 'utf8');
          resolve(JSON.parse(notebookContent));
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

module.exports = {
  startNotebookServer,
  executeNotebook
};