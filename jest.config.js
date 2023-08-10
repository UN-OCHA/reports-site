const E2E_MODE = process.env.npm_lifecycle_event === 'e2e';

const config = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['js', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': '@vue/vue3-jest',
  },
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
  ],
};

// E2E requires a special preset
config.preset = (E2E_MODE) ? 'jest-puppeteer' : '';

// We output coverage on unit-tests, not E2E
config.collectCoverage = !E2E_MODE;

module.exports = config;
