const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testMatch: ['**/e2e/**/*.test.js'],
  // Change testTimeout to timeout
  timeout: 60000 // Longer timeout for E2E tests
};
