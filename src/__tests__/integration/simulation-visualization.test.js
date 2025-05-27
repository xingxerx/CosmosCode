const request = require('supertest');
const app = require('../../app');

describe('Simulation to Visualization Integration', () => {
  let simulationId;
  
  // First create a simulation
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/simulations')
      .send({
        parameters: {
          type: 'n-body',
          complexity: 'low',
          particles: 100
        }
      });
    
    simulationId = response.body.id;
  });
  
  test('can create visualization from simulation', async () => {
    // Create a visualization based on the simulation
    const response = await request(app)
      .post('/api/visualizations')
      .send({
        simulationData: simulationId,
        type: 'particle-distribution',
        colorMap: 'viridis',
        dimensions: [800, 600]
      });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.simulationId).toBe(simulationId);
    expect(response.body.preview).toBeDefined();
  });
});