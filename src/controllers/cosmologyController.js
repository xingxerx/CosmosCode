const simulationEngine = require('../services/cosmology/simulationEngine');

// In-memory storage for simulations
const simulations = [];

/**
 * List all simulations
 */
function listSimulations(req, res) {
  res.json({ simulations });
}

/**
 * Create a new simulation
 */
function createSimulation(req, res) {
  const simulation = simulationEngine.runCosmologicalSimulation(req.body);
  simulations.push(simulation);
  res.status(201).json(simulation);
}

/**
 * Get a specific simulation by ID
 */
function getSimulation(req, res) {
  const simulation = simulations.find(s => s.id === req.params.id);
  if (!simulation) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  res.json(simulation);
}

/**
 * Delete a simulation by ID
 */
function deleteSimulation(req, res) {
  const index = simulations.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Simulation not found' });
  }
  simulations.splice(index, 1);
  res.status(204).send();
}

module.exports = {
  listSimulations,
  createSimulation,
  getSimulation,
  deleteSimulation
};