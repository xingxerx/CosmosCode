const request = require('supertest');
const express = require('express');
const routes = require('./routes');
const cosmologyController = require('../controllers/cosmologyController');
const medicalController = require('../controllers/medicalController');

// Mock controllers
jest.mock('../controllers/cosmologyController', () => ({
  listSimulations: jest.fn((req, res) => res.json({ simulations: [] })),
  createSimulation: jest.fn((req, res) => res.status(201).json({ id: 'new-sim' })),
  getSimulation: jest.fn((req, res) => res.json({ id: req.params.id })),
  deleteSimulation: jest.fn((req, res) => res.status(204).end())
}));

jest.mock('../controllers/medicalController', () => ({
  listDatasets: jest.fn((req, res) => res.json({ datasets: [] })),
  runAnalysis: jest.fn((req, res) => res.json({ results: {} }))
}));

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Cosmology Routes', () => {
    test('GET /api/simulations should return list of simulations', async () => {
      const response = await request(app).get('/api/simulations');
      
      expect(response.status).toBe(200);
      expect(cosmologyController.listSimulations).toHaveBeenCalled();
      expect(response.body).toHaveProperty('simulations');
    });
    
    test('POST /api/simulations should create a new simulation', async () => {
      const simulationData = {
        type: 'nbody',
        parameters: { omegaMatter: 0.3 }
      };
      
      const response = await request(app)
        .post('/api/simulations')
        .send(simulationData);
      
      expect(response.status).toBe(201);
      expect(cosmologyController.createSimulation).toHaveBeenCalled();
      expect(response.body).toHaveProperty('id', 'new-sim');
    });
    
    test('GET /api/simulations/:id should return a specific simulation', async () => {
      const response = await request(app).get('/api/simulations/sim-123');
      
      expect(response.status).toBe(200);
      expect(cosmologyController.getSimulation).toHaveBeenCalled();
      expect(response.body).toHaveProperty('id', 'sim-123');
    });
    
    test('DELETE /api/simulations/:id should delete a simulation', async () => {
      const response = await request(app).delete('/api/simulations/sim-123');
      
      expect(response.status).toBe(204);
      expect(cosmologyController.deleteSimulation).toHaveBeenCalled();
    });
  });
  
  describe('Medical Routes', () => {
    test('GET /api/medical/datasets should return list of datasets', async () => {
      const response = await request(app).get('/api/medical/datasets');
      
      expect(response.status).toBe(200);
      expect(medicalController.listDatasets).toHaveBeenCalled();
      expect(response.body).toHaveProperty('datasets');
    });
    
    test('POST /api/medical/analysis should run analysis', async () => {
      const analysisData = {
        datasetId: 'dataset-123',
        parameters: { /* analysis params */ }
      };
      
      const response = await request(app)
        .post('/api/medical/analysis')
        .send(analysisData);
      
      expect(response.status).toBe(200);
      expect(medicalController.runAnalysis).toHaveBeenCalled();
      expect(response.body).toHaveProperty('results');
    });
  });
});