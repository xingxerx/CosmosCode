/**
 * Simple visualization service
 */

// Generate a random color in hex format
function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

/**
 * Generate a mock visualization
 * @param {Object} options - Visualization options
 * @returns {Object} - Visualization result
 */
function generateVisualization(options) {
  const {
    type = '3D',
    dimensions = [1280, 720],
    colorMap = 'viridis',
    backgroundColor = [0, 0, 0]
  } = options;
  
  // Generate a mock image URL
  const imageUrl = `https://example.com/mock-visualization-${Date.now()}.png`;
  
  // Generate different visualization metadata based on type
  let metadata = {};
  
  switch (type) {
    case '3D':
      metadata = {
        renderType: '3D',
        cameraPosition: [100, 100, 100],
        lookAt: [0, 0, 0],
        fieldOfView: 45,
        particleSize: 2,
        particleColor: randomColor()
      };
      break;
    case '2D':
      metadata = {
        renderType: '2D',
        projectionAxis: 'z',
        zoomLevel: 1.5,
        pointSize: 3,
        gridLines: true
      };
      break;
    case 'heatmap':
      metadata = {
        renderType: 'heatmap',
        densityScale: 'logarithmic',
        contourLines: true,
        contourCount: 10,
        smoothingFactor: 0.8
      };
      break;
    default:
      metadata = {
        renderType: '3D',
        cameraPosition: [100, 100, 100],
        lookAt: [0, 0, 0],
        fieldOfView: 45
      };
  }
  
  return {
    imageUrl,
    type,
    dimensions,
    colorMap,
    backgroundColor,
    metadata,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  generateVisualization
};