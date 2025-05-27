const axios = require('axios');
const { spawn } = require('child_process');
const waitOn = require('wait-on');
const { fail } = require('assert');

// Configuration for E2E tests
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
let serverProcess;

// Start the server for testing
beforeAll(async () => {
  // Only start the server if not using an external one
  if (!process.env.API_URL) {
    serverProcess = spawn('node', ['src/index.js'], {
      env: { ...process.env, NODE_ENV: 'test', PORT: '3000' },
      stdio: 'pipe'
    });
    
    // Wait for server to be available
    await waitOn({ resources: ['http-get://localhost:3000/api/health'] });
  }
}, 30000);

// Shut down the server after tests
afterAll(() => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

describe.skip('Simulation E2E Tests', () => {
  let simulationId;
  
  test('should create a new simulation', async () => {
    const response = await axios.post(`${API_URL}/simulations`, {
      type: 'nbody',
      parameters: {
        omegaMatter: 0.3,
        hubbleConstant: 70,
        boxSize: 100,
        particleCount: 100 // Small count for faster tests
      }
    });
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    simulationId = response.data.id;
  }, 30000); // Longer timeout for simulation
  
  test('should retrieve the created simulation', async () => {
    // Skip if previous test failed
    if (!simulationId) {
      return;
    }
    
    const response = await axios.get(`${API_URL}/simulations/${simulationId}`);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', simulationId);
    expect(response.data).toHaveProperty('parameters');
    expect(response.data).toHaveProperty('status');
  });
  
  test('should list all simulations including the created one', async () => {
    const response = await axios.get(`${API_URL}/simulations`);
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('simulations');
    expect(Array.isArray(response.data.simulations)).toBe(true);
    
    if (simulationId) {
      const found = response.data.simulations.some(sim => sim.id === simulationId);
      expect(found).toBe(true);
    }
  });
  
  test('should delete the created simulation', async () => {
    // Skip if previous test failed
    if (!simulationId) {
      return;
    }
    
    const response = await axios.delete(`${API_URL}/simulations/${simulationId}`);
    expect(response.status).toBe(204);
    
    // Verify it's gone
    try {
      await axios.get(`${API_URL}/simulations/${simulationId}`);
      fail('Should have thrown 404');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
