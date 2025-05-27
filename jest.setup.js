// Set up environment variables for testing
process.env.NODE_ENV = 'test';

// Mock console.error to avoid cluttering test output
const originalConsoleError = console.error;
console.error = (...args) => {
  if (process.env.DEBUG) {
    originalConsoleError(...args);
  }
};

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
console.log = (...args) => {
  if (process.env.DEBUG) {
    originalConsoleLog(...args);
  }
};

// Add any global test setup here
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

// Add global jest definitions
global.jest = jest;
global.expect = expect;
