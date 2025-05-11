module.exports = {
  testMatch: ['**/test/**/*.test.js'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@heroicons|@headlessui)/)',
  ],
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