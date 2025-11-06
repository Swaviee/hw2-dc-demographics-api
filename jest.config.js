// Jest Configuration
module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Collect coverage from these files
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**'
  ],

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js'
  ],

  // Setup timeout for async operations
  testTimeout: 30000,

  // Verbose output
  verbose: true
};
