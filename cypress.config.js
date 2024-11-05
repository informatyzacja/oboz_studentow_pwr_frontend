const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 390, // width of iPhone 16
    viewportHeight: 844, // height of iPhone 16
    baseUrl: "http://localhost:8100",
  },
});
