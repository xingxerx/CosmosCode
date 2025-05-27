const request = require('supertest');
const express = require('express');

// Mock controllers
jest.mock('../controllers/simulationController', () => ({
  runSimulation: jest.fn((req, res) => res.json({ simulation: {} })),
  getSimulationResults: jest.fn((req, res) => res.json({ results: {} })),
  listSimulations: jest.fn((req, res) => res.json([]))
}), { virtual: true });

jest.mock('../controllers/medicalController', () => ({
  listDatasets: jest.fn((req, res) => res.json({ datasets: [] })),
  runAnalysis: jest.fn((req, res) => res.json({ results: {} }))
}), { virtual: true });

// Import routes after mocking
const routes = require('./routes');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Routes', () => {
  test('GET /api/health returns 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
  
  test('POST /api/simulations creates a new simulation', async () => {
    const response = await request(app)
      .post('/api/simulations')
      .send({ type: 'n-body', particles: 1000 });
    
    expect(response.statusCode).toBe(200);
  });
});
