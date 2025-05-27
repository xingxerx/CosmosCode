const request = require('supertest');
const express = require('express');
const routes = require('./routes');

// Mock controllers
jest.mock('../controllers/simulationController', () => ({
  runSimulation: jest.fn((req, res) => res.json({ simulation: {} })),
  getSimulationResults: jest.fn((req, res) => res.json({ results: {} }))
}));

// Create a mock for medicalController if it doesn't exist
jest.mock('../controllers/medicalController', () => ({
  listDatasets: jest.fn((req, res) => res.json({ datasets: [] })),
  runAnalysis: jest.fn((req, res) => res.json({ results: {} }))
}), { virtual: true });

// Create a test app
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Routes', () => {
  test('GET /api/simulations/:id should return simulation results', async () => {
    const response = await request(app).get('/api/simulations/123');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('results');
  });

  test('POST /api/simulations should run a new simulation', async () => {
    const response = await request(app).post('/api/simulations').send({
      type: 'nbody',
      particles: 1000
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('simulation');
  });
});
