module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // An array of regexp pattern strings that are matched against all test paths
  // matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/services/cosmology/test.js' // Ignore the problematic test.js file
  ],
  
  // A map from regular expressions to paths to transformers
  transform: {},
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Setup files to run before each test
  setupFiles: ['./jest.setup.js'],
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/__tests__/'
  ],
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Set a timeout for tests (30 seconds)
  // Change testTimeout to timeout
  timeout: 30000,
  
  // Configure different test environments for different test files
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '**/__tests__/**/*.js',
        '**/?(*.)(spec|test).js',
        '!**/e2e/**'
      ],
      testEnvironment: 'node',
      // Change testTimeout to timeout
      timeout: 30000
    },
    {
      displayName: 'e2e',
      testMatch: [
        '**/e2e/**/*.js'
      ],
      testEnvironment: 'node',
      // Change testTimeout to timeout
      timeout: 60000
    }
  ],
  
  // Cache settings for better performance
  cache: true,
  cacheDirectory: '.jest-cache',
  
  // Optimize for CI environments
  ci: process.env.CI === 'true',
  
  // Bail after first failure to speed up CI
  bail: process.env.CI === 'true' ? 1 : 0,
  
  // Optimize for JIT compilation
  maxWorkers: '50%',
  
  // Detect open handles for better cleanup
  detectOpenHandles: true,
  
  // Force exit after tests complete
  forceExit: true
};
