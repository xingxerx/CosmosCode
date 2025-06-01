// Simple test framework wrapper to make tests more consistent
// and to allow for easy mocking

// Don't require Jest directly - it's already available in the test environment
// Remove this line:
// const jest = require('jest');

// Re-export Jest globals
const jestGlobals = {
  describe: global.describe,
  test: global.test,
  expect: global.expect,
  beforeEach: global.beforeEach,
  afterEach: global.afterEach,
  beforeAll: global.beforeAll,
  afterAll: global.afterAll,
  // Create a mock function factory using the global jest
  fn: jest.fn
};

// Export the globals
module.exports = jestGlobals;
