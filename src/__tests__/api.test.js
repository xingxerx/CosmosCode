const request = require('supertest');
const app = require('../app'); // Assuming you have your Express app exported from app.js

describe('API Endpoints', () => {
  test('GET /api/health returns 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
  
  test('POST /api/simulations creates a new simulation', async () => {
    const response = await request(app)
      .post('/api/simulations')
      .send({
        parameters: {
          type: 'n-body',
          complexity: 'low',
          particles: 100
        }
      });
    
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