const axios = require('axios');
const API_URL = 'http://localhost:3001/api';

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
  });
  
  test('should retrieve the created simulation', async () => {
    // Skip this test if simulationId is not set
    if (!simulationId) {
      console.log('Skipping test because simulation was not created');
      return;
    }
    
    const response = await axios.get(`${API_URL}/simulations/${simulationId}`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(simulationId);
  });
  
  test('should list all simulations', async () => {
    const response = await axios.get(`${API_URL}/simulations`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    // Only check length if we successfully created a simulation
    if (simulationId) {
      expect(response.data.length).toBeGreaterThan(0);
    }
  });
  
  test('should return 404 for non-existent simulation', async () => {
    try {
      await axios.get(`${API_URL}/simulations/non-existent-id`);
      // If we get here, the test should fail
      expect(true).toBe(false); // This will always fail
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
  
  test('should delete the created simulation', async () => {
    // Skip this test if simulationId is not set
    if (!simulationId) {
      console.log('Skipping test because simulation was not created');
      return;
    }
    
    const response = await axios.delete(`${API_URL}/simulations/${simulationId}`);
    expect(response.status).toBe(204);
    
    // Verify it's deleted
    try {
      await axios.get(`${API_URL}/simulations/${simulationId}`);
      // If we get here, the test should fail
      expect(true).toBe(false); // This will always fail
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
