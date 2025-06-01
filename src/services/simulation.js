/**
 * Generates a simulation with the given parameters
 * @param {Object} params - Simulation parameters
 * @returns {Object} - Generated simulation
 */
function generateSimulation(params = {}) {
  const {
    type = 'n-body',
    particles = 1000,
    timeSteps = 100,
    boxSize = 100
  } = params;
  
  return {
    id: `sim-${Date.now()}`,
    type,
    parameters: {
      particles,
      timeSteps,
      boxSize
    },
    status: 'completed',
    results: {
      energy: Math.random() * 0.5,
      momentum: Math.random() * 0.5,
      finalState: Array.from({ length: Math.min(10, particles) }, () => ({
        position: [Math.random() * boxSize, Math.random() * boxSize, Math.random() * boxSize],
        velocity: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5]
      }))
    }
  };
}

module.exports = {
  generateSimulation
};