import { defineConfig, devices } from "@playwright/test";

/* global process */ // TODO: is there a better way to avoid making ESLint angry?
export default defineConfig({
  // Where the tests live, relative to this file
  testDir: "./frontend/tests",

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // The HTML reporter gives nice, pretty reports
  reporter: [["html", { outputFolder: "playwright-report" }]],

  // No parallelism (slower, but can avoid errors with overlapping tests)
  workers: 1,

  // Settings that we'd rather set once, rather than in every test file
  use: {
    baseURL: "http://localhost:5173",
  },

  // Just test with chrome
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: [
    {
      name: "Frontend",
      command: "npm run dev",
      reuseExistingServer: !process.env.CI,
      url: "http://localhost:5173",
    },
  ],
});
