import { createDefaultEsmPreset, type JestConfigWithTsJest } from "ts-jest";

const preset = createDefaultEsmPreset();
const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["index.js"],
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov"],
  ...preset,
};

export default config;
