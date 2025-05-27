// Simple test framework with mocking capabilities
const describe = (name, fn) => {
  console.log(`\n${name}`);
  fn();
};

const test = (name, fn) => {
  try {
    const result = fn();
    
    // Handle async tests
    if (result instanceof Promise) {
      result
        .then(() => {
          console.log(`  ✓ ${name}`);
        })
        .catch(error => {
          console.error(`  ✗ ${name}`);
          console.error(`    ${error.message}`);
          process.exitCode = 1;
        });
    } else {
      console.log(`  ✓ ${name}`);
    }
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
  }
});

// Simple mock function implementation
const createMockFn = () => {
  const fn = function(...args) {
    fn.mock.calls.push(args);
    
    if (fn._implementation) {
      return fn._implementation(...args);
    }
    
    return fn._returnValue;
  };
  
  fn.mock = { calls: [] };
  fn._returnValue = undefined;
  fn._implementation = null;
  
  fn.mockReturnValue = function(value) {
    this._returnValue = value;
    return this;
  };
  
  fn.mockImplementation = function(implementation) {
    this._implementation = implementation;
    return this;
  };
  
  return fn;
};

// Jest-like API
const jest = {
  fn: () => createMockFn(),
  clearAllMocks: () => {
    // Implementation to clear mocks
  }
};

// Helper for setup
const beforeEach = (fn) => fn();

module.exports = {
  describe,
  test,
  expect,
  jest,
  beforeEach
};
