
"use strict";

const { defineConfig, devices } = require("@playwright/test");

/**
 * Configures the BiteMenu automated test environment.
 *
 * This is a configuration object, not a function
 * we call ourselves. Playwright reads it whenever
 * we execute npm test.
 */
module.exports = defineConfig({

    // Only collect automated Playwright tests here.
    // Our older browser snippets remain in test/.
    testDir: "./tests",

    // Run independent tests in parallel locally.
    fullyParallel: true,

    // Prevent accidentally committing test.only().
    forbidOnly: Boolean(process.env.CI),

    // Retry failed tests once in GitHub Actions.
    retries: process.env.CI ? 1 : 0,

    // Use fewer resources on GitHub Actions.
    workers: process.env.CI ? 1 : undefined,

    // Display results in the terminal and HTML report.
    reporter: [
        ["list"],
        ["html", { open: "never" }]
    ],

    // Shared settings for every browser test.
    use: {
        baseURL: "http://127.0.0.1:4173",

        // Save a screenshot if a test fails.
        screenshot: "only-on-failure",

        // Save a trace to help investigate failures.
        trace: "retain-on-failure"
    },

    // Use Chrome's open-source Chromium engine.
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] }
        }
    ],

    // Playwright starts our local site automatically.
    webServer: {
        command:
            "npx http-server . -a 127.0.0.1 -p 4173 -c-1",

        url: "http://127.0.0.1:4173",

        // Reuse the server locally if already running.
        // CI should always start its own clean server.
        reuseExistingServer: !process.env.CI,

        timeout: 60_000
    }
});
