const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const logger = require('../../utils/logger');
const os = require('os');

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
  
  logger.info(`Starting Jupyter notebook server on port ${port}`);
  
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure notebook directory exists
      await fs.mkdir(notebookDir, { recursive: true });
      
      // Prepare arguments
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
      
      // Set timeout
      setTimeout(() => {
        if (!serverInfo) {
          jupyter.kill();
          reject(new Error('Timeout waiting for Jupyter server to start'));
        }
      }, 30000);
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
  logger.info(`Executing notebook: ${notebookPath}`);
  
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

/**
 * Creates a new research notebook with template
 * @param {string} title - Notebook title
 * @param {string} template - Template name
 * @returns {Promise<string>} - Path to the created notebook
 */
async function createResearchNotebook(title, template = 'default') {
  logger.info(`Creating research notebook: ${title}`);
  
  try {
    // Sanitize title for filename
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${sanitizedTitle}_${timestamp}.ipynb`;
    
    // Get template path
    const templatePath = path.join(process.cwd(), 'notebooks', 'templates', `${template}.ipynb`);
    
    // Create notebooks directory if it doesn't exist
    const notebooksDir = path.join(process.cwd(), 'notebooks', 'research');
    await fs.mkdir(notebooksDir, { recursive: true });
    
    // Output path
    const outputPath = path.join(notebooksDir, filename);
    
    // Check if template exists
    try {
      await fs.access(templatePath);
    } catch (error) {
      throw new Error(`Template not found: ${template}`);
    }
    
    // Read template
    const templateContent = await fs.readFile(templatePath, 'utf8');
    const notebook = JSON.parse(templateContent);
    
    // Update notebook metadata
    notebook.metadata = notebook.metadata || {};
    notebook.metadata.title = title;
    notebook.metadata.created = new Date().toISOString();
    
    // Write notebook
    await fs.writeFile(outputPath, JSON.stringify(notebook, null, 2));
    
    return outputPath;
  } catch (error) {
    logger.error(`Failed to create notebook: ${error.message}`);
    throw new Error(`Failed to create research notebook: ${error.message}`);
  }
}

module.exports = {
  startNotebookServer,
  executeNotebook,
  createResearchNotebook
};
