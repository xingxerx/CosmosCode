module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)(spec|test).js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],
  coverageDirectory: 'coverage',
  verbose: process.env.VERBOSE === 'true',
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)(spec|test).js',
        '!**/__tests__/integration/**',
        '!**/e2e/**'
      ]
    },
    {
      displayName: 'integration',
      testMatch: [
        '**/__tests__/integration/**/*.js'
      ]
    },
    {
      displayName: 'e2e',
      testMatch: [
        '**/e2e/**/*.js'
      ]
    }
  ]
};
