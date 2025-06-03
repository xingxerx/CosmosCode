module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  
  // An array of regexp pattern strings that are matched against all test paths
  // Tests are skipped if they match any of these patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/services/cosmology/test.js',
    '/src/network/cpp-addon/test.js'  // Exclude this file from tests
  ],
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
    '/__tests__/'
  ],
  
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover'
  ],
  
  // Projects to run in parallel
  projects: [
    {
      displayName: 'unit',
      testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
        '!**/e2e/**'
      ],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/src/services/cosmology/test.js',
        '/src/network/cpp-addon/test.js'
      ]
    },
    {
      displayName: 'e2e',
      testMatch: [
        '**/e2e/**/?(*.)+(spec|test).[jt]s?(x)'
      ]
    }
  ]
};
