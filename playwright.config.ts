import { defineConfig, devices } from "@playwright/test"

// Playwright config — shadcn-htmx.
//
// Tests live in tests/* and share a single Chromium project against the
// dev server already running on http://localhost:3010. We don't manage
// the dev server lifecycle here; the contributor runs `bun dev` in one
// terminal and `bun test:e2e` in another. Keeping the server external
// matches how the docs are normally developed (hot-reload while testing).

export default defineConfig({
  testDir: "./tests",
  // Slow tests usually mean something hung — fail fast.
  timeout: 15_000,
  // Run tests in files in parallel.
  fullyParallel: true,
  // Single-shot retry just for the rare animation flake.
  retries: 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://localhost:3010",
    // Keep traces around for the first retry so we can inspect failures.
    trace: "retain-on-failure",
    // Animations off makes geometry tests deterministic.
    actionTimeout: 5_000,
    navigationTimeout: 8_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
