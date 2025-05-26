// Simple test framework with mocking capabilities
const fs = require('fs');
const path = require('path');

// Test utilities
const describe = (name, fn) => {
  console.log(`\n${name}`);
  fn();
};

const test = (name, fn) => {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${error.message}`);
    process.exitCode = 1;
  }
};

const expect = (actual) => ({
  toBe(expected) {
    if (actual !== expected) {
      throw new Error(`Expected ${expected} but got ${actual}`);
    }
  },
  toEqual(expected) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    }
  },
  toHaveProperty(prop, value) {
    if (!(prop in actual)) {
      throw new Error(`Expected object to have property ${prop}`);
    }
    if (value !== undefined && actual[prop] !== value) {
      throw new Error(`Expected property ${prop} to be ${value} but got ${actual[prop]}`);
    }
  },
  toBeTruthy() {
    if (!actual) {
      throw new Error(`Expected ${actual} to be truthy`);
    }
  },
  toBeFalsy() {
    if (actual) {
      throw new Error(`Expected ${actual} to be falsy`);
    }
  },
  toBeGreaterThan(expected) {
    if (!(actual > expected)) {
      throw new Error(`Expected ${actual} to be greater than ${expected}`);
    }
  }
});

// Mocking system
const mocks = {};

const createMockFn = () => {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args);
    return mockFn._mockReturnValue;
  };
  
  mockFn.mock = {
    calls: [],
    instances: [],
    results: []
  };
  
  mockFn._mockReturnValue = undefined;
  
  mockFn.mockReturnValue = (value) => {
    mockFn._mockReturnValue = value;
    return mockFn;
  };
  
  mockFn.mockReturnThis = () => {
    mockFn._mockReturnValue = mockFn;
    return mockFn;
  };
  
  mockFn.mockResolvedValue = (value) => {
    mockFn._mockReturnValue = Promise.resolve(value);
    return mockFn;
  };
  
  mockFn.mockRejectedValue = (error) => {
    mockFn._mockReturnValue = Promise.reject(error);
    return mockFn;
  };
  
  return mockFn;
};

const jest = {
  fn: () => createMockFn(),
  
  mock: (modulePath, mockExports = {}) => {
    mocks[modulePath] = mockExports;
  },
  
  clearAllMocks: () => {
    Object.keys(mocks).forEach(key => {
      const mock = mocks[key];
      if (typeof mock === 'object') {
        Object.keys(mock).forEach(fnKey => {
          if (mock[fnKey] && mock[fnKey].mock) {
            mock[fnKey].mock.calls = [];
            mock[fnKey].mock.instances = [];
            mock[fnKey].mock.results = [];
          }
        });
      }
    });
  }
};

// Custom require function that uses mocks
const originalRequire = require;
global.require = function(modulePath) {
  if (mocks[modulePath]) {
    return mocks[modulePath];
  }
  
  try {
    return originalRequire(modulePath);
  } catch (error) {
    // If module not found, return a mock object
    if (error.code === 'MODULE_NOT_FOUND') {
      console.warn(`Module not found: ${modulePath}, using empty mock`);
      return {};
    }
    throw error;
  }
};

module.exports = {
  describe,
  test,
  expect,
  jest,
  beforeEach: (fn) => fn(),
  afterEach: (fn) => fn()
};
