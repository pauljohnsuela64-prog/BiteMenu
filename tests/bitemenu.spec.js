
"use strict";

/*
 * BITEMENU v1.3 — AUTOMATED BROWSER TESTS
 *
 * These tests use a real Chromium browser.
 *
 * Coverage:
 * - Existing cart tests
 * - Existing checkout tests
 * - Menu search and category filters
 * - Cart quantity and persistence
 * - Customer information validation
 * - Successful simulated checkout
 * - Checkout summary synchronization
 * - Demo order history deletion
 */

const { test, expect } = require("@playwright/test");


/* =========================================
   1. TEST SETUP
   ========================================= */

/**
 * Opens BiteMenu before each test.
 *
 * @param {object} fixtures - Playwright fixtures.
 * @returns {Promise<void>}
 *
 * Playwright gives each test a fresh browser
 * context, keeping storage isolated.
 */
test.beforeEach(async ({ page }) => {

    // Open the local website.
    await page.goto("/", {
        waitUntil: "domcontentloaded"
    });

    // Wait until JavaScript renders all eight foods.
    await expect(
        page.locator("#menu-grid .food-card")
    ).toHaveCount(8);
});


/* =========================================
   2. RUN EXISTING BROWSER SNIPPETS
   ========================================= */

/**
 * Executes an existing BiteMenu test script
 * and verifies all its reported results.
 *
 * @param {Page} page - Playwright browser page.
 * @param {string} path - Browser test file.
 * @param {string} resultKey - Window property name.
 * @param {number} expectedCount - Expected checks.
 * @returns {Promise<void>}
 */
async function runExistingTests(
    page,
    path,
    resultKey,
    expectedCount
) {

    // Run the existing script inside the webpage.
    await page.addScriptTag({ path });

    // Read the test results exposed on window.
    const results = await page.evaluate(
        function (key) {
            return window[key];
        },
        resultKey
    );

    // Confirm the script actually reported results.
    expect(Array.isArray(results)).toBe(true);

    // Detect missing or accidentally skipped checks.
    expect(results).toHaveLength(expectedCount);

    // Select all checks that did not pass.
    const failures = results.filter(function (result) {
        return result.status !== "PASS";
    });

    // Any failure makes this Playwright test fail.
    expect(
        failures,
        JSON.stringify(failures, null, 2)
    ).toEqual([]);
}


/* =========================================
   3. REUSABLE CUSTOMER FORM HELPER
   ========================================= */

/**
 * Enters fictional data into the checkout form.
 *
 * @param {Page} page - Playwright browser page.
 * @returns {Promise<void>}
 *
 * Reusing this helper avoids repeating the
 * same form-filling code in multiple tests.
 */
async function fillDemoCustomer(page) {

    await page.locator("#checkout-name")
        .fill("Test Customer");

    await page.locator("#checkout-phone")
        .fill("09123456789");

    await page.locator("#checkout-address")
        .fill("123 Sample Street, Quezon City");
}


/**
 * Adds one burger and completes a demo checkout.
 *
 * @param {Page} page - Playwright browser page.
 * @returns {Promise<void>}
 *
 * Used by tests that need a completed demo order.
 */
async function completeDemoCheckout(page) {

    // Add a food item to the cart.
    await page.getByRole("button", {
        name: "Add Classic Cheeseburger to cart"
    }).click();

    // Open the checkout form.
    await page.locator("#place-order").click();

    // Fill in fictional customer information.
    await fillDemoCustomer(page);

    // Confirm the simulated order.
    await page.locator(
        '#checkout-form button[type="submit"]'
    ).click();

    await expect(
        page.locator("#checkout-confirmation")
    ).toBeVisible();
}


/* =========================================
   TEST 1 — EXISTING CART ASSERTIONS
   ========================================= */

test("all 17 existing cart checks pass", async ({ page }) => {

    await runExistingTests(
        page,
        "test/cart-tests.js",
        "__bitemenuCartTestResults",
        17
    );
});


/* =========================================
   TEST 2 — EXISTING CHECKOUT ASSERTIONS
   ========================================= */

test("all 16 existing checkout checks pass", async ({ page }) => {

    await runExistingTests(
        page,
        "test/checkout-tests.js",
        "__bitemenuCheckoutTestResults",
        16
    );
});


/* =========================================
   TEST 3 — MENU SEARCH AND FILTERS
   ========================================= */

test("search and category filtering work", async ({ page }) => {

    // Search for coffee.
    await page.locator("#menu-search").fill("coffee");

    // Only the iced coffee card should remain.
    await expect(
        page.locator("#menu-grid .food-card")
    ).toHaveCount(1);

    // Select Burgers while searching for coffee.
    await page.locator(
        '.filter-btn[data-category="Burgers"]'
    ).click();

    // No food matches both conditions.
    await expect(
        page.locator("#menu-grid .food-card")
    ).toHaveCount(0);

    // Clear the search and category selections.
    await page.locator("#clear-filters").click();

    // All eight foods should return.
    await expect(
        page.locator("#menu-grid .food-card")
    ).toHaveCount(8);
});


/* =========================================
   TEST 4 — CART PERSISTENCE
   ========================================= */

test("cart totals survive a page refresh", async ({ page }) => {

    // Add one cheeseburger.
    await page.getByRole("button", {
        name: "Add Classic Cheeseburger to cart"
    }).click();

    await expect(
        page.locator("#cart-total")
    ).toHaveText("₱149.00");

    // Increase the quantity from one to two.
    await page.locator(
        '#cart-items button[data-action="increase"]'
    ).first().click();

    await expect(
        page.locator("#cart-total")
    ).toHaveText("₱298.00");

    // Reload to test browser storage.
    await page.reload({
        waitUntil: "domcontentloaded"
    });

    // The quantity and total should be restored.
    await expect(
        page.locator("#cart-count")
    ).toHaveText("2 items");

    await expect(
        page.locator("#cart-total")
    ).toHaveText("₱298.00");
});


/* =========================================
   TEST 5 — FORM VALIDATION
   ========================================= */

test("checkout rejects invalid customer details", async ({ page }) => {

    await page.getByRole("button", {
        name: "Add Classic Cheeseburger to cart"
    }).click();

    await page.locator("#place-order").click();

    // Submit without entering information.
    await page.locator(
        '#checkout-form button[type="submit"]'
    ).click();

    await expect(
        page.locator("#checkout-error")
    ).toContainText(
        "Enter a name between 2 and 80 characters."
    );

    // Enter valid information except for the phone.
    await fillDemoCustomer(page);

    await page.locator("#checkout-phone")
        .fill("12345");

    await page.locator(
        '#checkout-form button[type="submit"]'
    ).click();

    await expect(
        page.locator("#checkout-error")
    ).toContainText(
        "Enter a valid Philippine mobile number."
    );

    // No order should have been recorded.
    await expect(
        page.locator("#history-list .history-item")
    ).toHaveCount(0);
});


/* =========================================
   TEST 6 — SUCCESSFUL CHECKOUT
   ========================================= */

test("demo checkout saves history without personal details", async ({ page }) => {

    await completeDemoCheckout(page);

    // A confirmed order should appear in history.
    await expect(
        page.locator("#history-list .history-item")
    ).toHaveCount(1);

    // The shopping cart should now be empty.
    await expect(
        page.locator("#cart-count")
    ).toHaveText("0 items");

    // Check that no personal details were stored.
    const savedHistory = await page.evaluate(function () {
        return localStorage.getItem(
            "bitemenu-demo-orders-v1"
        );
    });

    expect(savedHistory).toBeTruthy();
    expect(savedHistory).not.toContain("Test Customer");
    expect(savedHistory).not.toContain("09123456789");
    expect(savedHistory).not.toContain("123 Sample Street");

    // Reload the website.
    await page.reload({
        waitUntil: "domcontentloaded"
    });

    // Order history should still be available.
    await expect(
        page.locator("#history-list .history-item")
    ).toHaveCount(1);
});


/* =========================================
   TEST 7 — CHECKOUT SUMMARY SYNC
   ========================================= */

test("checkout total updates when cart quantities change", async ({ page }) => {

    await page.getByRole("button", {
        name: "Add Classic Cheeseburger to cart"
    }).click();

    await page.locator("#place-order").click();

    // Check the initial checkout summary.
    await expect(
        page.locator("#checkout-summary")
    ).toContainText("₱149.00");

    // Change quantity while checkout stays open.
    await page.locator(
        '#cart-items button[data-action="increase"]'
    ).first().click();

    // Both cart and checkout must show the new total.
    await expect(
        page.locator("#cart-total")
    ).toHaveText("₱298.00");

    await expect(
        page.locator("#checkout-summary")
    ).toContainText("₱298.00");
});


/* =========================================
   TEST 8 — CLEAR DEMO ORDER HISTORY
   ========================================= */

test("customers can clear saved demo order history", async ({ page }) => {

    // Create a simulated completed order.
    await completeDemoCheckout(page);

    await expect(
        page.locator("#history-list .history-item")
    ).toHaveCount(1);

    // Accept the browser's confirmation dialog.
    page.once("dialog", function (dialog) {
        return dialog.accept();
    });

    await page.locator("#clear-order-history").click();

    // The history should now be empty.
    await expect(
        page.locator("#history-list .history-item")
    ).toHaveCount(0);

    await expect(
        page.locator("#history-list")
    ).toContainText("No demo orders yet.");

    // Check that clearing survives a refresh.
    await page.reload({
        waitUntil: "domcontentloaded"
    });

    await expect(
        page.locator("#history-list .history-item")
    ).toHaveCount(0);
});
