// Import Jest directly instead of using our wrapper
const { describe, test, expect, jest } = require('@jest/globals');

// Mock Express
const mockRequest = () => ({
  params: {},
  query: {},
  body: {}
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Simple controller function for testing
function getSimulation(req, res) {
  const id = req.params.id;
  
  if (!id) {
    return res.status(400).json({ error: 'Missing simulation ID' });
  }
  
  // Return mock data
  return res.status(200).json({
    id,
    type: 'nbody',
    particles: 1000,
    results: {}
  });
}

describe('API Routes', () => {
  test('should return 400 when simulation ID is missing', () => {
    const req = mockRequest();
    const res = mockResponse();
    
    getSimulation(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }));
  });
  
  test('should return simulation data when ID is provided', () => {
    const req = mockRequest();
    req.params.id = '123';
    const res = mockResponse();
    
    getSimulation(req, res);
    
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      id: '123',
      type: 'nbody'
    }));
  });
});
