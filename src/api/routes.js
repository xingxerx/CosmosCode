const express = require('express');
const cosmologyController = require('../controllers/cosmologyController');
const medicalController = require('../controllers/medicalController');

const router = express.Router();

// Cosmology routes
router.get('/simulations', cosmologyController.listSimulations);
router.post('/simulations', cosmologyController.createSimulation);
router.get('/simulations/:id', cosmologyController.getSimulation);
router.delete('/simulations/:id', cosmologyController.deleteSimulation);

// Medical data routes
router.get('/medical/datasets', medicalController.listDatasets);
router.post('/medical/analysis', medicalController.runAnalysis);
router.post('/medical/integrated-analysis', medicalController.runIntegratedAnalysis);

module.exports = router;
