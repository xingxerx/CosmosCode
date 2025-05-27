const request = require('supertest');
const express = require('express');
const routes = require('../api/routes');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api', routes);

describe('API Endpoints', () => {
  test('GET /api/health returns 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
  
  test('POST /api/simulations creates a new simulation', async () => {
    const response = await request(app)
      .post('/api/simulations')
      .send({ type: 'n-body', particles: 1000 });
    
    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.type).toBe('n-body');
  });
  
  test('GET /api/simulations returns a list of simulations', async () => {
    const response = await request(app).get('/api/simulations');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
