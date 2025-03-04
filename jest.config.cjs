const { createDefaultEsmPreset } = require("ts-jest");

const config = createDefaultEsmPreset({

})

module.exports = {
  ...config,
  testMatch: ["**/__tests__/**/*.test.ts"],
}