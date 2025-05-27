// Simple test framework wrapper to make tests more consistent
// and to allow for easy mocking

// Re-export Jest globals
const jestGlobals = {
  describe: global.describe,
  test: global.test,
  expect: global.expect,
  beforeEach: global.beforeEach,
  afterEach: global.afterEach,
  beforeAll: global.beforeAll,
  afterAll: global.afterAll,
  // Create a mock function factory that doesn't conflict with global jest
  fn: () => jest.fn()
};

// Export the globals
module.exports = jestGlobals;
