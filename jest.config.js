module.exports = {
  testMatch: ['**/test/**/*.test.js'],
  transform: {},
  testEnvironment: 'node',
  collectCoverageFrom: [
    'test/**/*.js',
    '!test/**/*.test.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}; 