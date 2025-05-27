const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Create directories if they don't exist
const dirs = [
  'services',
  'services/cosmology',
  'services/visualization',
  'utils',
  'public',
  'public/visualizations'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create logger if it doesn't exist
if (!fs.existsSync('utils/logger.js')) {
  fs.writeFileSync('utils/logger.js', `
module.exports = {
  info: (msg) => console.log(\`[INFO] \${msg}\`),
  error: (msg) => console.error(\`[ERROR] \${msg}\`),
  debug: (msg) => console.log(\`[DEBUG] \${msg}\`),
  warn: (msg) => console.warn(\`[WARN] \${msg}\`)
};
  `);
}

// Import services (will be created if they don't exist)
let simulationEngine;
let visualizationService;

// Create simulation engine if it doesn't exist
if (!fs.existsSync('services/cosmology/simulationEngine.js')) {
  fs.writeFileSync('services/cosmology/simulationEngine.js', `
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

/**
 * Simulation engine for cosmological simulations
 */
class SimulationEngine {
  constructor() {
    // Available simulation types
    this.simulationTypes = [
      'n-body',
      'dark-matter',
      'galaxy-formation',
      'cosmic-expansion',
      'structure-formation',
      'cmb-fluctuations'
    ];
    
    // Complexity levels
    this.complexityLevels = [
      'low',
      'medium',
      'high',
      'ultra'
    ];
  }
  
  /**
   * Run a cosmological simulation
   * @param {Object} parameters - Simulation parameters
   * @returns {Object} - Simulation results
   */
  runCosmologicalSimulation(parameters = {}) {
    const {
      type = 'n-body',
      complexity = 'medium',
      particles = 1000,
      iterations = 100,
      hubbleConstant = 70,
      omegaMatter = 0.3,
      omegaDarkEnergy = 0.7,
      redshift = 0
    } = parameters;
    
    console.log(\`Running \${type} simulation with \${complexity} complexity\`);
    
    // Generate mock simulation results based on parameters
    const results = this.generateMockResults(type, complexity, parameters);
    
    return {
      id: \`sim-\${Date.now()}-\${Math.floor(Math.random() * 1000)}\`,
      type,
      complexity,
      parameters,
      results,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Generate mock simulation results
   * @param {string} type - Simulation type
   * @param {string} complexity - Complexity level
   * @param {Object} parameters - Simulation parameters
   * @returns {Object} - Mock results
   */
  generateMockResults(type, complexity, parameters) {
    // Base particle count based on complexity
    const complexityMultiplier = {
      'low': 1,
      'medium': 5,
      'high': 20,
      'ultra': 100
    }[complexity] || 1;
    
    const particleCount = parameters.particles || 1000;
    const actualParticles = particleCount * complexityMultiplier;
    
    // Generate different results based on simulation type
    switch (type) {
      case 'n-body':
        return this.generateNBodyResults(actualParticles, parameters);
      case 'dark-matter':
        return this.generateDarkMatterResults(actualParticles, parameters);
      case 'galaxy-formation':
        return this.generateGalaxyFormationResults(actualParticles, parameters);
      case 'cosmic-expansion':
        return this.generateCosmicExpansionResults(parameters);
      case 'structure-formation':
        return this.generateStructureFormationResults(actualParticles, parameters);
      case 'cmb-fluctuations':
        return this.generateCMBResults(parameters);
      default:
        return this.generateNBodyResults(actualParticles, parameters);
    }
  }
  
  /**
   * Generate N-Body simulation results
   */
  generateNBodyResults(particles, parameters) {
    const iterations = parameters.iterations || 100;
    const computationTime = (particles * iterations) / 1000000;
    
    return {
      particles,
      iterations,
      computationTime,
      energy: Math.random() * 0.5,
      momentum: Math.random() * 0.9,
      particleDistribution: 'gaussian'
    };
  }
  
  /**
   * Generate Dark Matter simulation results
   */
  generateDarkMatterResults(particles, parameters) {
    const iterations = parameters.iterations || 100;
    const computationTime = (particles * iterations) / 800000;
    const haloCount = Math.floor(particles / 10000) + 5;
    
    return {
      particles,
      iterations,
      computationTime,
      darkMatterDensity: Math.random() * 0.3 + 0.1,
      darkEnergyDensity: Math.random() * 0.2 + 0.6,
      haloCount,
      largestHaloMass: 1e12 * (Math.random() + 0.5)
    };
  }
  
  /**
   * Generate Galaxy Formation simulation results
   */
  generateGalaxyFormationResults(particles, parameters) {
    const iterations = parameters.iterations || 100;
    const computationTime = (particles * iterations) / 500000;
    const galaxyCount = Math.floor(particles / 50000) + 3;
    
    return {
      particles,
      iterations,
      computationTime,
      galaxyCount,
      starFormationRate: Math.random() * 5 + 1,
      averageGalaxyMass: 1e11 * (Math.random() + 0.5),
      galaxyTypes: {
        spiral: Math.floor(galaxyCount * 0.6),
        elliptical: Math.floor(galaxyCount * 0.3),
        irregular: Math.floor(galaxyCount * 0.1) + 1
      }
    };
  }
  
  /**
   * Generate Cosmic Expansion simulation results
   */
  generateCosmicExpansionResults(parameters) {
    const hubbleConstant = parameters.hubbleConstant || 70;
    const omegaMatter = parameters.omegaMatter || 0.3;
    const omegaDarkEnergy = parameters.omegaDarkEnergy || 0.7;
    
    return {
      particles: 1000000,
      iterations: 1000,
      computationTime: 5.2,
      expansionRate: hubbleConstant + (Math.random() * 5 - 2.5),
      universeAge: 13.8 + (Math.random() * 0.4 - 0.2),
      criticalDensity: 8.5e-27 + (Math.random() * 1e-27),
      omegaTotal: omegaMatter + omegaDarkEnergy + (Math.random() * 0.02 - 0.01)
    };
  }
  
  /**
   * Generate Structure Formation simulation results
   */
  generateStructureFormationResults(particles, parameters) {
    const iterations = parameters.iterations || 100;
    const computationTime = (particles * iterations) / 400000;
    const structureCount = Math.floor(particles / 40000) + 10;
    
    return {
      particles,
      iterations,
      computationTime,
      structureCount,
      largestStructureMass: 1e14 * (Math.random() + 0.5),
      correlationLength: Math.random() * 50 + 100,
      powerSpectrumSlope: -1.8 + (Math.random() * 0.4 - 0.2)
    };
  }
  
  /**
   * Generate CMB Fluctuations simulation results
   */
  generateCMBResults(parameters) {
    return {
      particles: 2000000,
      iterations: 500,
      computationTime: 8.7,
      temperature: 2.725 + (Math.random() * 0.001 - 0.0005),
      fluctuationAmplitude: 1e-5 * (Math.random() + 0.8),
      spectralIndex: 0.96 + (Math.random() * 0.02 - 0.01),
      acousticPeaks: [
        220 + (Math.random() * 10 - 5),
        540 + (Math.random() * 20 - 10),
        800 + (Math.random() * 30 - 15)
      ]
    };
  }
  
  /**
   * Get available simulation types
   * @returns {Array} - List of available simulation types
   */
  getSimulationTypes() {
    return this.simulationTypes;
  }
  
  /**
   * Get available complexity levels
   * @returns {Array} - List of available complexity levels
   */
  getComplexityLevels() {
    return this.complexityLevels;
  }
}

module.exports = new SimulationEngine();
  `);
}

// Create visualization service if it doesn't exist
if (!fs.existsSync('services/visualization/visualizationService.js')) {
  fs.writeFileSync('services/visualization/visualizationService.js', `
const path = require('path');
const fs = require('fs').promises;
const os = require('os');

/**
 * Visualization service for generating visualizations from simulation data
 */
class VisualizationService {
  constructor() {
    // Available visualization types
    this.visualizationTypes = [
      'particle-distribution',
      'density-map',
      'galaxy-formation',
      'velocity-field',
      'dark-matter-halo',
      'temperature-map'
    ];
    
    // Available color maps
    this.colorMaps = [
      'viridis',
      'plasma',
      'inferno',
      'magma',
      'cividis',
      'twilight',
      'turbo'
    ];
    
    // Create visualization directory if it doesn't exist
    this.visualizationDir = path.join(process.cwd(), 'public', 'visualizations');
    this.ensureDirectoryExists(this.visualizationDir);
  }
  
  /**
   * Generate a visualization from simulation data
   * @param {Object} options - Visualization options
   * @returns {Object} - Visualization metadata
   */
  async generateVisualization(options = {}) {
    const {
      simulationData,
      type = 'particle-distribution',
      colorMap = 'viridis',
      dimensions = [800, 600],
      interactive = false
    } = options;
    
    console.log(\`Generating \${type} visualization with \${colorMap} colormap\`);
    
    // For now, generate a mock visualization
    const id = \`viz-\${Date.now()}-\${Math.floor(Math.random() * 1000)}\`;
    const filename = \`\${id}.html\`;
    const filePath = path.join(this.visualizationDir, filename);
    
    // In a real implementation, we would call a Python script to generate the visualization
    // For now, we'll just create a mock visualization metadata
    
    // Mock visualization generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock visualization file
    await this.createMockVisualizationFile(filePath, dimensions, type, simulationData);
    
    return {
      id,
      type,
      colorMap,
      dimensions,
      simulationId: simulationData.id,
      filename,
      filePath,
      preview: \`/visualizations/\${filename}\`,
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Create a mock visualization file
   * @param {string} filePath - Path to save the file
   * @param {Array} dimensions - Image dimensions [width, height]
   * @param {string} type - Visualization type
   * @param {Object} simulationData - Simulation data
   */
  async createMockVisualizationFile(filePath, dimensions, type, simulationData) {
    // In a real implementation, this would be replaced with actual visualization generation
    // For now, we'll just create a simple HTML file with a message
    
    const htmlContent = \`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CosmosCode Visualization</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
          }
          .container {
            text-align: center;
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 80%;
          }
          h1 {
            color: #2c3e50;
          }
          .visualization {
            width: \${dimensions[0]}px;
            height: \${dimensions[1]}px;
            background: linear-gradient(45deg, #3498db, #9b59b6);
            margin: 20px auto;
            border-radius: 4px;
            position: relative;
            overflow: hidden;
          }
          .visualization::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="white" /></svg>');
            background-size: 10% 10%;
            opacity: 0.7;
          }
          .info {
            margin-top: 20px;
            text-align: left;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
          }
          .info h3 {
            margin-top: 0;
          }
          .info p {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>\${this.formatVisualizationType(type)} Visualization</h1>
          <div class="visualization"></div>
          <div class="info">
            <h3>Visualization Details</h3>
            <p><strong>Type:</strong> \${this.formatVisualizationType(type)}</p>
            <p><strong>Dimensions:</strong> \${dimensions[0]} × \${dimensions[1]}</p>
            <p><strong>Generated:</strong> \${new Date().toLocaleString()}</p>
            <p><strong>Simulation ID:</strong> \${simulationData.id}</p>
            <p><strong>Simulation Type:</strong> \${this.formatSimulationType(simulationData.parameters.type)}</p>
            <p><strong>Particles:</strong> \${simulationData.results.particles.toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    \`;
    
    await fs.writeFile(filePath, htmlContent);
  }
  
  /**
   * Format visualization type for display
   * @param {string} type - Visualization type
   * @returns {string} - Formatted type
   */
  formatVisualizationType(type) {
    const types = {
      'particle-distribution': 'Particle Distribution',
      'density-map': 'Density Map',
      'galaxy-formation': 'Galaxy Formation',
      'velocity-field': 'Velocity Field',
      'dark-matter-halo': 'Dark Matter Halo',
      'temperature-map': 'Temperature Map'
    };
    
    return types[type] || type;
  }
  
  /**
   * Format simulation type for display
   * @param {string} type - Simulation type
   * @returns {string} - Formatted type
   */
  formatSimulationType(type) {
    const types = {
      'n-body': 'N-Body',
      'dark-matter': 'Dark Matter Distribution',
      'galaxy-formation': 'Galaxy Formation',
      'cosmic-expansion': 'Cosmic Expansion',
      'structure-formation': 'Structure Formation',
      'cmb-fluctuations': 'CMB Fluctuations'
    };
    
    return types[type] || type;
  }
  
  /**
   * Ensure a directory exists
   * @param {string} directory - Directory path
   */
  async ensureDirectoryExists(directory) {
    try {
      await fs.mkdir(directory, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
  
  /**
   * Get available visualization types
   * @returns {Array} - List of available visualization types
   */
  getVisualizationTypes() {
    return this.visualizationTypes;
  }
  
  /**
   * Get available color maps
   * @returns {Array} - List of available color maps
   */
  getColorMaps() {
    return this.colorMaps;
  }
}

module.exports = new VisualizationService();
  `);
}

// Import services
const cosmologySimulationEngine = require('./services/cosmology/simulationEngine');
const visualizationRenderer = require('./services/visualization/visualizationService');
const logger = require('./utils/logger');

// In-memory storage for simulations and visualizations
const simulations = [];
const visualizations = [];

// Basic routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simulation endpoints
app.get('/api/simulations', (req, res) => {
  res.json(simulations);
});

app.get('/api/simulations/:id', (req, res) => {
  const simulation = simulations.find(sim => sim.id === req.params.id);
  
  if (!simulation) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  
  res.json(simulation);
});

app.post('/api/simulations', (req, res) => {
  logger.info('Received simulation request');
  
  const { parameters } = req.body;
  
  // Run simulation
  try {
    const result = cosmologySimulationEngine.runCosmologicalSimulation(parameters);
    simulations.push(result);
    
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Simulation error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Simulation failed',
      error: error.message
    });
  }
});

// Visualization endpoints
app.get('/api/visualizations', (req, res) => {
  res.json(visualizations);
});

app.get('/api/visualizations/:id', (req, res) => {
  const visualization = visualizations.find(viz => viz.id === req.params.id);
  
  if (!visualization) {
    return res.status(404).json({ error: 'Visualization not found' });
  }
  
  res.json(visualization);
});

app.get('/api/visualizations/:id/preview', (req, res) => {
  const visualization = visualizations.find(viz => viz.id === req.params.id);
  
  if (!visualization) {
    return res.status(404).json({ error: 'Visualization not found' });
  }
  
  res.redirect(visualization.preview);
});

app.get('/api/visualizations/:id/download', (req, res) => {
  const visualization = visualizations.find(viz => viz.id === req.params.id);
  
  if (!visualization) {
    return res.status(404).json({ error: 'Visualization not found' });
  }
  
  res.download(visualization.filePath);
});

app.post('/api/visualizations', async (req, res) => {
  logger.info('Received visualization request');
  
  const { simulationData, type, colorMap, dimensions } = req.body;
  
  // Find the simulation if only ID was provided
  let simulation = simulationData;
  if (typeof simulationData === 'string') {
    simulation = simulations.find(sim => sim.id === simulationData);
    if (!simulation) {
      return res.status(404).json({ error: 'Simulation not found' });
    }
  }
  
  // Generate visualization
  try {
    const result = await visualizationService.generateVisualization({
      simulationData: simulation,
      type,
      colorMap,
      dimensions
    });
    
    visualizations.push(result);
    
    res.status(201).json(result);
  } catch (error) {
    logger.error(`Visualization error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Visualization generation failed',
      error: error.message
    });
  }
});

// Research notebook endpoints
app.get('/api/research/notebooks', (req, res) => {
  // Mock notebooks
  const notebooks = [
    {
      id: 'nb-001',
      name: 'Cosmological Constants Analysis',
      lastModified: new Date(Date.now() - 3600000).toISOString(),
      status: 'completed'
    },
    {
      id: 'nb-002',
      name: 'Dark Matter Distribution Study',
      lastModified: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    },
    {
      id: 'nb-003',
      name: 'Galaxy Formation Models',
      lastModified: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed'
    }
  ];
  
  res.json(notebooks);
});

app.post('/api/research/notebook/start', (req, res) => {
  logger.info('Received notebook start request');
  
  // Mock response
  res.json({
    success: true,
    server: {
      url: 'http://localhost:8888/?token=mock-token-12345',
      port: 8888,
      token: 'mock-token-12345'
    }
  });
});

app.get('/api/research/notebook/:id', (req, res) => {
  // Mock notebook viewer
  const notebookId = req.params.id;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Notebook Viewer</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .notebook {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        h1 {
          color: #2c3e50;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .cell {
          margin-bottom: 20px;
          border: 1px solid #eee;
          border-radius: 4px;
        }
        .code {
          background-color: #f7f7f7;
          padding: 10px;
          font-family: monospace;
          border-radius: 4px 4px 0 0;
        }
        .output {
          padding: 10px;
          border-top: 1px solid #eee;
        }
        .text-cell {
          padding: 10px;
        }
      </style>
    </head>
    <body>
      <div class="notebook">
        <h1>Notebook: ${notebookId}</h1>
        
        <div class="text-cell">
          <h2>Introduction</h2>
          <p>This is a mock Jupyter notebook for demonstration purposes. In a real implementation, this would be an actual rendered Jupyter notebook.</p>
        </div>
        
        <div class="cell">
          <div class="code">import numpy as np<br>import matplotlib.pyplot as plt<br>from scipy.integrate import odeint</div>
        </div>
        
        <div class="text-cell">
          <h3>Cosmological Parameters</h3>
          <p>We'll define some standard cosmological parameters for our simulation.</p>
        </div>
        
        <div class="cell">
          <div class="code"># Define cosmological parameters<br>H0 = 70  # Hubble constant in km/s/Mpc<br>Om = 0.3  # Matter density<br>Ol = 0.7  # Dark energy density</div>
        </div>
        
        <div class="text-cell">
          <h3>Simulation Setup</h3>
          <p>Now we'll set up our simulation parameters.</p>
        </div>
        
        <div class="cell">
          <div class="code"># Simulation parameters<br>z_start = 10  # Starting redshift<br>z_end = 0    # Ending redshift<br>N_steps = 1000  # Number of steps</div>
        </div>
        
        <div class="text-cell">
          <h3>Results</h3>
          <p>Here are the results of our simulation.</p>
        </div>
        
        <div class="cell">
          <div class="code">plt.figure(figsize=(10, 6))<br>plt.plot(z_values, scale_factors)<br>plt.xlabel('Redshift')<br>plt.ylabel('Scale Factor')<br>plt.title('Universe Expansion')<br>plt.grid(True)<br>plt.show()</div>
          <div class="output">[Mock visualization of universe expansion]</div>
        </div>
        
        <div class="text-cell">
          <h3>Conclusion</h3>
          <p>Our simulation shows the expected expansion of the universe based on the standard cosmological model.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.send(html);
});

app.get('/api/research/notebook/:id/download', (req, res) => {
  const notebookId = req.params.id;
  
  // Create a mock notebook file
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const notebookPath = path.join(tempDir, `${notebookId}.ipynb`);
  
  // Create a simple mock Jupyter notebook JSON structure
  const notebookContent = {
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: ["# Mock Jupyter Notebook\n", "This is a mock notebook for demonstration purposes."]
      },
      {
        cell_type: "code",
        execution_count: 1,
        metadata: {},
        outputs: [],
        source: ["import numpy as np\n", "import matplotlib.pyplot as plt"]
      },
      {
        cell_type: "markdown",
        metadata: {},
        source: ["## Simulation Parameters"]
      },
      {
        cell_type: "code",
        execution_count: 2,
        metadata: {},
        outputs: [],
        source: ["# Define parameters\n", "H0 = 70  # Hubble constant\n", "Om = 0.3  # Matter density\n", "Ol = 0.7  # Dark energy density"]
      }
    ],
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3"
      },
      language_info: {
        codemirror_mode: {
          name: "ipython",
          version: 3
        },
        file_extension: ".py",
        mimetype: "text/x-python",
        name: "python",
        nbconvert_exporter: "python",
        pygments_lexer: "ipython3",
        version: "3.8.10"
      }
    },
    nbformat: 4,
    nbformat_minor: 5
  };
  
  fs.writeFileSync(notebookPath, JSON.stringify(notebookContent, null, 2));
  
  res.download(notebookPath, `${notebookId}.ipynb`, (err) => {
    if (err) {
      logger.error(`Error downloading notebook: ${err.message}`);
    }
    
    // Clean up the temporary file
    fs.unlinkSync(notebookPath);
  });
});

// Create index.html if it doesn't exist
if (!fs.existsSync('public/index.html')) {
  fs.writeFileSync('public/index.html', `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CosmosCode</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background-color: #2c3e50;
            color: white;
            padding: 20px 0;
            text-align: center;
        }
        
        h1 {
            margin: 0;
            font-size: 2.5em;
        }
        
        .subtitle {
            font-style: italic;
            margin-top: 10px;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }
        
        .nav-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        
        .nav-button:hover {
            background-color: #2980b9;
        }
        
        .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        
        h2 {
            color: #2c3e50;
            margin-top: 0;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        select, input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        button {
            background-color: #2ecc71;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        
        button:hover {
            background-color: #27ae60;
        }
        
        .loading {
            text-align: center;
            margin: 20px 0;
            display: none;
        }
        
        .results {
            display: none;
        }
        
        .result-item {
            margin-bottom: 10px;
        }
        
        .result-label {
            font-weight: bold;
        }
        
        .action-buttons {
            margin-top: 20px;
            display: flex;
            gap: 10px;
        }
        
        .action-button {
            padding: 8px 16px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .action-button:hover {
            background-color: #2980b9;
        }
        
        .action-button.secondary {
            background-color: #95a5a6;
        }
        
        .action-button.secondary:hover {
            background-color: #7f8c8d;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>CosmosCode</h1>
            <div class="subtitle">Cosmology and Medicine Codebase</div>
        </div>
    </header>
    
    <div class="container">
        <div class="nav">
            <div></div>
            <a href="/dashboard" class="nav-button">Dashboard</a>
        </div>
        
        <div class="card">
            <h2>Run Cosmological Simulation</h2>
            <form id="simulation-form">
                <div class="form-group">
                    <label for="simulation-type">Simulation Type:</label>
                    <select id="simulation-type" name="type">
                        <option value="n-body">N-Body Simulation</option>
                        <option value="dark-matter">Dark Matter Distribution</option>
                        <option value="galaxy-formation">Galaxy Formation</option>
                        <option value="cosmic-expansion">Cosmic Expansion</option>
                        <option value="structure-formation">Structure Formation</option>
                        <option value="cmb-fluctuations">CMB Fluctuations</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="complexity">Complexity:</label>
                    <select id="complexity" name="complexity">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                        <option value="ultra">Ultra</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="particles">Particle Count:</label>
                    <input type="number" id="particles" name="particles" value="1000" min="100" max="1000000">
                </div>
                
                <div class="form-group">
                    <label for="iterations">Iterations:</label>
                    <input type="number" id="iterations" name="iterations" value="100" min="10" max="10000">
                </div>
                
                <div class="form-group">
                    <label for="hubble-constant">Hubble Constant (km/s/Mpc):</label>
                    <input type="number" id="hubble-constant" name="hubbleConstant" value="70" min="50" max="90" step="0.1">
                </div>
                
                <div class="form-group">
                    <label for="omega-matter">Omega Matter:</label>
                    <input type="number" id="omega-matter" name="omegaMatter" value="0.3" min="0" max="1" step="0.01">
                </div>
                
                <div class="form-group">
                    <label for="omega-dark-energy">Omega Dark Energy:</label>
                    <input type="number" id="omega-dark-energy" name="omegaDarkEnergy" value="0.7" min="0" max="1" step="0.01">
                </div>
                
                <button type="submit">Run Simulation</button>
            </form>
            
            <div id="loading" class="loading">
                <p>Running simulation... Please wait.</p>
            </div>
            
            <div id="results" class="results">
                <h3>Simulation Results</h3>
                <div id="results-content"></div>
                
                <div class="action-buttons">
                    <button id="visualize-button" class="action-button">Visualize</button>
                    <button id="new-simulation-button" class="action-button secondary">New Simulation</button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // DOM elements
        const simulationForm = document.getElementById('simulation-form');
        const loadingElement = document.getElementById('loading');
        const resultsElement = document.getElementById('results');
        const resultsContentElement = document.getElementById('results-content');
        const visualizeButton = document.getElementById('visualize-button');
        const newSimulationButton = document.getElementById('new-simulation-button');
        
        // Current simulation data
        let currentSimulation = null;
        
        // Handle form submission
        simulationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading indicator
            loadingElement.style.display = 'block';
            resultsElement.style.display = 'none';
            
            // Get form data
            const formData = new FormData(simulationForm);
            const parameters = {};
            
            for (const [key, value] of formData.entries()) {
                // Convert numeric values
                if (!isNaN(value) && value !== '') {
                    parameters[key] = Number(value);
                } else {
                    parameters[key] = value;
                }
            }
            
            // Send simulation request
            fetch('/api/simulations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ parameters })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Request failed');
                }
                return response.json();
            })
            .then(data => {
                currentSimulation = data;
                displayResults(data);
            })
            .catch(error => {
                console.error('Error running simulation:', error);
                alert('An error occurred while running the simulation. Please try again.');
            })
            .finally(() => {
                loadingElement.style.display = 'none';
            });
        });
        
        // Display simulation results
        function displayResults(simulation) {
            resultsContentElement.innerHTML = '';
            
            // Create result items
            const resultItems = [
                { label: 'Simulation ID', value: simulation.id },
                { label: 'Status', value: simulation.status },
                { label: 'Type', value: formatSimulationType(simulation.type) },
                { label: 'Complexity', value: simulation.complexity.charAt(0).toUpperCase() + simulation.complexity.slice(1) },
                { label: 'Particles', value: simulation.results.particles.toLocaleString() },
                { label: 'Iterations', value: simulation.results.iterations.toLocaleString() },
                { label: 'Computation Time', value: simulation.results.computationTime ? \`\${simulation.results.computationTime.toFixed(2)} seconds\` : 'N/A' }
            ];
            
            // Add type-specific results
            switch (simulation.type) {
                case 'n-body':
                    resultItems.push(
                        { label: 'Energy', value: simulation.results.energy.toFixed(4) },
                        { label: 'Momentum', value: simulation.results.momentum.toFixed(4) },
                        { label: 'Particle Distribution', value: simulation.results.particleDistribution }
                    );
                    break;
                case 'dark-matter':
                    resultItems.push(
                        { label: 'Dark Matter Density', value: simulation.results.darkMatterDensity.toFixed(4) },
                        { label: 'Dark Energy Density', value: simulation.results.darkEnergyDensity.toFixed(4) },
                        { label: 'Halo Count', value: simulation.results.haloCount },
                        { label: 'Largest Halo Mass', value: \`\${(simulation.results.largestHaloMass / 1e12).toFixed(2)} × 10¹² M☉\` }
                    );
                    break;
                case 'galaxy-formation':
                    resultItems.push(
                        { label: 'Galaxy Count', value: simulation.results.galaxyCount },
                        { label: 'Star Formation Rate', value: \`\${simulation.results.starFormationRate.toFixed(2)} M☉/year\` },
                        { label: 'Average Galaxy Mass', value: \`\${(simulation.results.averageGalaxyMass / 1e11).toFixed(2)} × 10¹¹ M☉\` },
                        { label: 'Galaxy Types', value: \`Spiral: \${simulation.results.galaxyTypes.spiral}, Elliptical: \${simulation.results.galaxyTypes.elliptical}, Irregular: \${simulation.results.galaxyTypes.irregular}\` }
                    );
                    break;
                case 'cosmic-expansion':
                    resultItems.push(
                        { label: 'Expansion Rate', value: \`\${simulation.results.expansionRate.toFixed(2)} km/s/Mpc\` },
                        { label: 'Universe Age', value: \`\${simulation.results.universeAge.toFixed(2)} billion years\` },
                        { label: 'Critical Density', value: \`\${simulation.results.criticalDensity.toExponential(2)} kg/m³\` },
                        { label: 'Omega Total', value: simulation.results.omegaTotal.toFixed(4) }
                    );
                    break;
                case 'structure-formation':
                    resultItems.push(
                        { label: 'Structure Count', value: simulation.results.structureCount },
                        { label: 'Largest Structure Mass', value: \`\${(simulation.results.largestStructureMass / 1e14).toFixed(2)} × 10¹⁴ M☉\` },
                        { label: 'Correlation Length', value: \`\${simulation.results.correlationLength.toFixed(2)} Mpc\` },
                        { label: 'Power Spectrum Slope', value: simulation.results.powerSpectrumSlope.toFixed(4) }
                    );
                    break;
                case 'cmb-fluctuations':
                    resultItems.push(
                        { label: 'Temperature', value: \`\${simulation.results.temperature.toFixed(4)} K\` },
                        { label: 'Fluctuation Amplitude', value: simulation.results.fluctuationAmplitude.toExponential(2) },
                        { label: 'Spectral Index', value: simulation.results.spectralIndex.toFixed(4) },
                        { label: 'Acoustic Peaks', value: simulation.results.acousticPeaks.map(p => p.toFixed(1)).join(', ') }
                    );
                    break;
            }
            
            // Create result elements
            resultItems.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                const resultLabel = document.createElement('span');
                resultLabel.className = 'result-label';
                resultLabel.textContent = \`\${item.label}: \`;
                
                const resultValue = document.createElement('span');
                resultValue.textContent = item.value;
                
                resultItem.appendChild(resultLabel);
                resultItem.appendChild(resultValue);
                
                resultsContentElement.appendChild(resultItem);
            });
            
            // Show results
            resultsElement.style.display = 'block';
        }
        
        // Format simulation type for display
        function formatSimulationType(type) {
            const types = {
                'n-body': 'N-Body Simulation',
                'dark-matter': 'Dark Matter Distribution',
                'galaxy-formation': 'Galaxy Formation',
                'cosmic-expansion': 'Cosmic Expansion',
                'structure-formation': 'Structure Formation',
                'cmb-fluctuations': 'CMB Fluctuations'
            };
            
            return types[type] || type;
        }
        
        // Handle visualization button click
        visualizeButton.addEventListener('click', async () => {
            if (currentSimulation) {
                try {
                    const response = await fetch('/api/visualizations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            simulationData: currentSimulation,
                            type: 'particle-distribution',
                            colorMap: 'viridis',
                            dimensions: [800, 600]
                        })
                    });
                    
                    if (!response.ok) {
                        throw new Error(\`HTTP error! status: \${response.status}\`);
                    }
                    
                    const data = await response.json();
                    window.open(data.preview, '_blank');
                } catch (error) {
                    console.error('Error generating visualization:', error);
                    alert('An error occurred while generating the visualization. Please try again.');
                }
            } else {
                alert('Please run a simulation first.');
            }
        });
        
        // Handle new simulation button click
        newSimulationButton.addEventListener('click', () => {
            simulationForm.reset();
            resultsElement.style.display = 'none';
        });
    </script>
</body>
</html>
  `);
}

// Create dashboard.html if it doesn't exist
if (!fs.existsSync('public/dashboard.html')) {
  fs.writeFileSync('public/dashboard.html', `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CosmosCode Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background-color: #2c3e50;
            color: white;
            padding: 20px 0;
            text-align: center;
        }
        
        h1 {
            margin: 0;
            font-size: 2.5em;
        }
        
        .subtitle {
            font-style: italic;
            margin-top: 10px;
        }
        
        .nav {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }
        
        .nav-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s;
        }
        
        .nav-button:hover {
            background-color: #2980b9;
        }
        
        .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 20px;
        }
        
        h2 {
            color: #2c3e50;
            margin-top: 0;
        }
        
        .tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
        }
        
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .tab:hover {
            background-color: #f5f5f5;
        }
        
        .tab.active {
            border-bottom: 3px solid #3498db;
            font-weight: bold;
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
        }
        
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        
        tr:hover {
            background-color: #f9f9f9;
        }
        
        .action-button {
            padding: 6px 12px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
        }
        
        .action-button:hover {
            background-color: #2980b9;
        }
        
        .action-button.secondary {
            background-color: #95a5a6;
        }
        
        .action-button.secondary:hover {
            background-color: #7f8c8d;
        }
        
        .loading {
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>CosmosCode Dashboard</h1>
            <div class="subtitle">Cosmology and Medicine Codebase</div>
        </div>
    </header>
    
    <div class="container">
        <div class="nav">
            <a href="/" class="nav-button">Home</a>
            <a href="/api/research/notebook/start" class="nav-button" target="_blank">Launch Notebook</a>
        </div>
        
        <div class="card">
            <div class="tabs">
                <div class="tab active" data-tab="simulations">Simulations</div>
                <div class="tab" data-tab="visualizations">Visualizations</div>
                <div class="tab" data-tab="notebooks">Notebooks</div>
            </div>
            
            <div id="simulations" class="tab-content active">
                <h2>Recent Simulations</h2>
                <div id="simulations-loading" class="loading">Loading simulations...</div>
                <table id="simulations-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Complexity</th>
                            <th>Particles</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="simulations-body">
                        <!-- Simulation rows will be added here -->
                    </tbody>
                </table>
            </div>
            
            <div id="visualizations" class="tab-content">
                <h2>Recent Visualizations</h2>
                <div id="visualizations-loading" class="loading">Loading visualizations...</div>
                <table id="visualizations-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Simulation ID</th>
                            <th>Dimensions</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="visualizations-body">
                        <!-- Visualization rows will be added here -->
                    </tbody>
                </table>
            </div>
            
            <div id="notebooks" class="tab-content">
                <h2>Research Notebooks</h2>
                <div id="notebooks-loading" class="loading">Loading notebooks...</div>
                <table id="notebooks-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Last Modified</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="notebooks-body">
                        <!-- Notebook rows will be added here -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <script>
        // DOM elements
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        const simulationsBody = document.getElementById('simulations-body');
        const simulationsLoading = document.getElementById('simulations-loading');
        
        const visualizationsBody = document.getElementById('visualizations-body');
        const visualizationsLoading = document.getElementById('visualizations-loading');
        
        const notebooksBody = document.getElementById('notebooks-body');
        const notebooksLoading = document.getElementById('notebooks-loading');
        
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                // Load data for the active tab if not already loaded
                if (tabId === 'simulations' && simulationsBody.children.length === 0) {
                    loadSimulations();
                } else if (tabId === 'visualizations' && visualizationsBody.children.length === 0) {
                    loadVisualizations();
                } else if (tabId === 'notebooks' && notebooksBody.children.length === 0) {
                    loadNotebooks();
                }
            });
        });
        
        // Format date for display
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString();
        }
        
        // Format simulation type for display
        function formatSimulationType(type) {
            const types = {
                'n-body': 'N-Body Simulation',
                'dark-matter': 'Dark Matter Distribution',
                'galaxy-formation': 'Galaxy Formation',
                'cosmic-expansion': 'Cosmic Expansion',
                'structure-formation': 'Structure Formation',
                'cmb-fluctuations': 'CMB Fluctuations'
            };
            
            return types[type] || type;
        }
        
        // Format visualization type for display
        function formatVisualizationType(type) {
            const types = {
                'particle-distribution': 'Particle Distribution',
                'density-map': 'Density Map',
                'galaxy-formation': 'Galaxy Formation',
                'velocity-field': 'Velocity Field',
                'dark-matter-halo': 'Dark Matter Halo',
                'temperature-map': 'Temperature Map'
            };
            
            return types[type] || type;
        }
        
        // Load simulations
        async function loadSimulations() {
            simulationsLoading.style.display = 'block';
            
            try {
                const response = await fetch('/api/simulations');
                
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                
                const simulations = await response.json();
                
                simulationsBody.innerHTML = '';
                
                if (simulations.length === 0) {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.colSpan = 7;
                    cell.textContent = 'No simulations found. Run a simulation from the home page.';
                    cell.style.textAlign = 'center';
                    row.appendChild(cell);
                    simulationsBody.appendChild(row);
                } else {
                    simulations.forEach(simulation => {
                        const row = document.createElement('tr');
                        
                        // ID
                        const idCell = document.createElement('td');
                        idCell.textContent = simulation.id;
                        row.appendChild(idCell);
                        
                        // Type
                        const typeCell = document.createElement('td');
                        typeCell.textContent = formatSimulationType(simulation.type);
                        row.appendChild(typeCell);
                        
                        // Complexity
                        const complexityCell = document.createElement('td');
                        complexityCell.textContent = simulation.complexity.charAt(0).toUpperCase() + simulation.complexity.slice(1);
                        row.appendChild(complexityCell);
                        
                        // Particles
                        const particlesCell = document.createElement('td');
                        particlesCell.textContent = simulation.results.particles.toLocaleString();
                        row.appendChild(particlesCell);
                        
                        // Status
                        const statusCell = document.createElement('td');
                        statusCell.textContent = simulation.status.charAt(0).toUpperCase() + simulation.status.slice(1);
                        row.appendChild(statusCell);
                        
                        // Created
                        const createdCell = document.createElement('td');
                        createdCell.textContent = formatDate(simulation.createdAt);
                        row.appendChild(createdCell);
                        
                        // Actions
                        const actionsCell = document.createElement('td');
                        
                        const viewButton = document.createElement('a');
                        viewButton.href = \`/api/simulations/\${simulation.id}\`;
                        viewButton.className = 'action-button';
                        viewButton.textContent = 'View';
                        viewButton.target = '_blank';
                        actionsCell.appendChild(viewButton);
                        
                        const visualizeButton = document.createElement('a');
                        visualizeButton.href = \`/api/visualizations?simulationId=\${simulation.id}\`;
                        visualizeButton.className = 'action-button secondary';
                        visualizeButton.textContent = 'Visualize';
                        visualizeButton.target = '_blank';
                        actionsCell.appendChild(visualizeButton);
                        
                        row.appendChild(actionsCell);
                        simulationsBody.appendChild(row);
                    });
                }
            } catch (error) {
                console.error('Error loading simulations:', error);
                simulationsBody.innerHTML = '<tr><td colspan="7">Failed to load simulations. Please try again later.</td></tr>';
            } finally {
                simulationsLoading.style.display = 'none';
            }
        }
        
        // Load visualizations
        async function loadVisualizations() {
            visualizationsLoading.style.display = 'block';
            
            try {
                const response = await fetch('/api/visualizations');
                
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                
                const visualizations = await response.json();
                
                visualizationsBody.innerHTML = '';
                
                if (visualizations.length === 0) {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.colSpan = 6;
                    cell.textContent = 'No visualizations found. Generate a visualization from the home page.';
                    cell.style.textAlign = 'center';
                    row.appendChild(cell);
                    visualizationsBody.appendChild(row);
                } else {
                    visualizations.forEach(visualization => {
                        const row = document.createElement('tr');
                        
                        // ID
                        const idCell = document.createElement('td');
                        idCell.textContent = visualization.id;
                        row.appendChild(idCell);
                        
                        // Type
                        const typeCell = document.createElement('td');
                        typeCell.textContent = formatVisualizationType(visualization.type);
                        row.appendChild(typeCell);
                        
                        // Simulation ID
                        const simulationIdCell = document.createElement('td');
                        simulationIdCell.textContent = visualization.simulationId;
                        row.appendChild(simulationIdCell);
                        
                        // Dimensions
                        const dimensionsCell = document.createElement('td');
                        dimensionsCell.textContent = \`\${visualization.dimensions[0]} × \${visualization.dimensions[1]}\`;
                        row.appendChild(dimensionsCell);
                        
                        // Created
                        const createdCell = document.createElement('td');
                        createdCell.textContent = formatDate(visualization.createdAt);
                        row.appendChild(createdCell);
                        
                        // Actions
                        const actionsCell = document.createElement('td');
                        
                        const viewButton = document.createElement('a');
                        viewButton.href = visualization.preview;
                        viewButton.className = 'action-button';
                        viewButton.textContent = 'View';
                        viewButton.target = '_blank';
                        actionsCell.appendChild(viewButton);
                        
                        const downloadButton = document.createElement('a');
                        downloadButton.href = visualization.filePath;
                        downloadButton.className = 'action-button secondary';
                        downloadButton.textContent = 'Download';
                        downloadButton.download = visualization.filename;
                        actionsCell.appendChild(downloadButton);
                        
                        row.appendChild(actionsCell);
                        visualizationsBody.appendChild(row);
                    });
                }
            } catch (error) {
                console.error('Error loading visualizations:', error);
                visualizationsBody.innerHTML = '<tr><td colspan="6">Failed to load visualizations. Please try again later.</td></tr>';
            } finally {
                visualizationsLoading.style.display = 'none';
            }
        }
        
        // Load notebooks
        async function loadNotebooks() {
            notebooksLoading.style.display = 'block';
            
            try {
                const response = await fetch('/api/research/notebooks');
                
                if (!response.ok) {
                    throw new Error(\`HTTP error! status: \${response.status}\`);
                }
                
                const notebooks = await response.json();
                
                notebooksBody.innerHTML = '';
                
                if (notebooks.length === 0) {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.colSpan = 5;
                    cell.textContent = 'No notebooks found. Start a new notebook from the home page.';
                    cell.style.textAlign = 'center';
                    row.appendChild(cell);
                    notebooksBody.appendChild(row);
                } else {
                    notebooks.forEach(notebook => {
                        const row = document.createElement('tr');
                        
                        // ID
                        const idCell = document.createElement('td');
                        idCell.textContent = notebook.id;
                        row.appendChild(idCell);
                        
                        // Name
                        const nameCell = document.createElement('td');
                        nameCell.textContent = notebook.name;
                        row.appendChild(nameCell);
                        
                        // Last Modified
                        const lastModifiedCell = document.createElement('td');
                        lastModifiedCell.textContent = formatDate(notebook.lastModified);
                        row.appendChild(lastModifiedCell);
                        
                        // Status
                        const statusCell = document.createElement('td');
                        statusCell.textContent = notebook.status.charAt(0).toUpperCase() + notebook.status.slice(1);
                        row.appendChild(statusCell);
                        
                        // Actions
                        const actionsCell = document.createElement('td');
                        
                        const viewButton = document.createElement('a');
                        viewButton.href = \`/api/research/notebook/\${notebook.id}\`;
                        viewButton.className = 'action-button';
                        viewButton.textContent = 'View';
                        viewButton.target = '_blank';
                        actionsCell.appendChild(viewButton);
                        
                        const downloadButton = document.createElement('a');
                        downloadButton.href = \`/api/research/notebook/\${notebook.id}/download\`;
                        downloadButton.className = 'action-button secondary';
                        downloadButton.textContent = 'Download';
                        downloadButton.download = \`\${notebook.id}.ipynb\`;
                        actionsCell.appendChild(downloadButton);
                        
                        row.appendChild(actionsCell);
                        notebooksBody.appendChild(row);
                    });
                }
            } catch (error) {
                console.error('Error loading notebooks:', error);
                notebooksBody.innerHTML = '<tr><td colspan="5">Failed to load notebooks. Please try again later.</td></tr>';
            } finally {
                notebooksLoading.style.display = 'none';
            }
        }
    </script>
</body>
</html>
  `);
}

// Start server
app.listen(port, () => {
  console.log(`CosmosCode server running at http://localhost:${port}`);
});
