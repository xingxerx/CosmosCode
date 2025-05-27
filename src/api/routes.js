const express = require('express');
const cosmologyController = require('../controllers/cosmologyController');
const medicalController = require('../controllers/medicalController');
const researchController = require('../controllers/researchController');

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

// Research routes
router.post('/research/notebook/start', researchController.startNotebook);
router.post('/research/notebook/run', researchController.runNotebook);
router.post('/research/notebook/create', researchController.createNotebook);
router.post('/research/cross-disciplinary', researchController.runCrossDisciplinaryAnalysis);

module.exports = router;
