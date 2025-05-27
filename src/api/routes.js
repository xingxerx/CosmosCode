const express = require('express');
const router = express.Router();

// Import controllers
let simulationController;
let medicalController;

try {
  simulationController = require('../controllers/simulationController');
} catch (error) {
  // Create mock controller if the real one doesn't exist
  simulationController = {
    runSimulation: (req, res) => res.status(201).json({ 
      id: 'sim-' + Date.now(),
      type: req.body.type || 'n-body'
    }),
    getSimulationResults: (req, res) => res.json({ 
      id: req.params.id,
      results: { particles: 1000 }
    }),
    listSimulations: (req, res) => res.json([
      { id: 'sim-1', type: 'n-body' },
      { id: 'sim-2', type: 'dark-matter' }
    ])
  };
}

try {
  medicalController = require('../controllers/medicalController');
} catch (error) {
  // Create mock controller if the real one doesn't exist
  medicalController = {
    listDatasets: (req, res) => res.json({ datasets: [] }),
    runAnalysis: (req, res) => res.json({ results: {} })
  };
}

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Simulation routes
router.post('/simulations', simulationController.runSimulation);
router.get('/simulations/:id', simulationController.getSimulationResults);
router.get('/simulations', simulationController.listSimulations);

// Medical routes
router.get('/medical/datasets', medicalController.listDatasets);
router.post('/medical/analysis', medicalController.runAnalysis);

// Visualization routes
router.post('/visualizations', (req, res) => {
  // Mock visualization creation
  if (!req.body.simulationId) {
    return res.status(400).json({ error: 'Simulation ID is required' });
  }
  
  res.status(201).json({
    id: 'viz-' + Date.now(),
    simulationId: req.body.simulationId,
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  });
});

module.exports = router;
