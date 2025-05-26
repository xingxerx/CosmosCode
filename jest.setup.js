// Set up environment variables for testing
process.env.NODE_ENV = 'test';

// Add global test utilities or mocks here
global.testUtils = {
  createMockSimulation: () => ({
    id: 'test-sim-123',
    parameters: { omegaMatter: 0.3, hubbleConstant: 70 },
    results: { /* mock results */ }
  }),
  createMockMedicalData: () => ({
    id: 'test-med-123',
    patientId: 'anonymous',
    data: { /* mock data */ }
  })
};

// Mock external services
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    writeFile: jest.fn().mockResolvedValue(undefined),
    readFile: jest.fn().mockResolvedValue('{"test": "data"}'),
    mkdir: jest.fn().mockResolvedValue(undefined)
  }
}));

// Add custom matchers if needed
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      };
    }
  }
});