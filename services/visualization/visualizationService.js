const path = require('path');
const fs = require('fs').promises;
const { spawn } = require('child_process');
const os = require('os');
const logger = require('../../utils/logger');

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
    
    logger.info(`Generating ${type} visualization with ${colorMap} colormap`);
    
    // For now, generate a mock visualization
    const id = `viz-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const filename = `${id}.png`;
    const filePath = path.join(this.visualizationDir, filename);
    
    // In a real implementation, we would call a Python script to generate the visualization
    // For now, we'll just create a mock visualization metadata
    
    // Mock visualization generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock visualization file
    await this.createMockVisualizationFile(filePath, dimensions);
    
    return {
      id,
      type,
      colorMap,
      dimensions,
      simulationId: simulationData.id,
      filename,
      filePath,
      preview: `/visualizations/${filename}`,
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Create a mock visualization file
   * @param {string} filePath - Path to save the file
   * @param {Array} dimensions - Image dimensions [width, height]
   */
  async createMockVisualizationFile(filePath, dimensions) {
    // In a real implementation, this would be replaced with actual visualization generation
    // For now, we'll just create a simple HTML file with a message
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mock Visualization</title>
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
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Mock Visualization</h1>
          <p>This is a placeholder for a real visualization that would be generated from simulation data.</p>
          <p>Dimensions: ${dimensions[0]} × ${dimensions[1]}</p>
          <p>Generated at: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    \`;
    
    await fs.writeFile(filePath, htmlContent);
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
