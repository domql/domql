const path = require('path')
const { lstatSync, readdirSync } = require('fs')
const basePath = path.resolve(__dirname, 'packages')
const packages = readdirSync(basePath).filter(name => {
  return lstatSync(path.join(basePath, name)).isDirectory()
})

module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'packages'],
  roots: ['<rootDir>/packages'],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['lcov', 'text', 'clover'],
  collectCoverageFrom: [
    'packages/**/src/**/*.js',
    'packages/**/lib/**/*.js',
    'packages/**/*.js',
    '!packages/**/dist/**',
    '!packages/**/node_modules/**',
    '!packages/**/*.test.js',
    '!packages/**/*.spec.js',
    '!packages/**/*.config.js'
  ],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.json' }]
  },
  moduleNameMapper: {
    ...packages.reduce(
      (acc, name) => ({
        ...acc,
        [`@domql/${name}(.*)$`]: `<rootDir>/packages/${name}/$1`
      }),
      {}
    )
  }
}
