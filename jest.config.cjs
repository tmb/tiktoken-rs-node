module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["index.js"],
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov"],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules'],
};
