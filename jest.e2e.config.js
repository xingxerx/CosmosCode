const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  testMatch: ['**/e2e/**/*.test.js'],
  testTimeout: 60000, // Longer timeout for E2E tests
  setupFilesAfterEnv: ['<rootDir>/jest.e2e.setup.js']
};