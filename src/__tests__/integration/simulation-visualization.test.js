const request = require('supertest');
const express = require('express');
const routes = require('../../api/routes');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('Simulation to Visualization Integration', () => {
  test('can create visualization from simulation', async () => {
    // First create a simulation
    const simResponse = await request(app)
      .post('/api/simulations')
      .send({
        type: 'n-body',
        particles: 1000,
        iterations: 100
      });
    
    expect(simResponse.statusCode).toBe(201);
    const simulationId = simResponse.body.id;
    
    // Then create a visualization from the simulation
    const response = await request(app)
      .post('/api/visualizations')
      .send({
        simulationId,
        type: '3d'
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.simulationId).toBe(simulationId);
    expect(response.body.preview).toBeDefined();
  });
});
