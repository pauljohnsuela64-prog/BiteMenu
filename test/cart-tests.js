
"use strict";

/*
 * BITEMENU — AUTOMATED CART TESTS
 *
 * These tests check calculations, food lookup,
 * cart persistence, and saved-data validation.
 *
 * The original cart and browser storage are
 * restored when testing finishes.
 */

(function runCartTests() {

    const STORAGE_KEY = "bitemenu-cart-v1";

    // Keep a backup of the current in-memory cart.
    const originalCart = new Map(cart);

    // Store the results of individual tests.
    const results = [];

    // Keep the original browser storage unchanged.
    let originalStorage = null;
    let storageAvailable = false;

    try {
        originalStorage = localStorage.getItem(STORAGE_KEY);
        storageAvailable = true;
    } catch (error) {
        console.warn("Storage unavailable:", error);
    }

    /**
     * Compares an observed result against
     * the expected result.
     *
     * @param {string} name - Test description.
     * @param {*} actual - Actual result.
     * @param {*} expected - Expected result.
     * @returns {void}
     */
    function check(name, actual, expected) {

        const passed = Object.is(actual, expected);

        results.push({
            test: name,
            status: passed ? "PASS" : "FAIL",
            expected: expected,
            actual: actual
        });
    }

    /**
     * Resets only the in-memory cart.
     *
     * @returns {void}
     */
    function resetTestCart() {
        cart.clear();
    }

    try {

        // TEST 1: An empty cart contains zero items.
        resetTestCart();

        check(
            "Empty cart item count",
            calculateItemCount(),
            0
        );

        // TEST 2: An empty cart costs zero pesos.
        check(
            "Empty cart total",
            calculateCartTotal(),
            0
        );

        // TEST 3: Food ID lookup works.
        check(
            "Find cheeseburger",
            findFoodById(1)?.name,
            "Classic Cheeseburger"
        );

        // TEST 4: Unknown food IDs are rejected.
        check(
            "Unknown food ID",
            findFoodById(999),
            undefined
        );

        // TEST 5: Two burgers have the right quantity.
        cart.set(1, 2);

        check(
            "Two burger quantity",
            calculateItemCount(),
            2
        );

        // TEST 6: Two burgers cost 298 pesos.
        check(
            "Two burger total",
            calculateCartTotal(),
            298
        );

        // TEST 7: Add three iced coffees.
        cart.set(5, 3);

        check(
            "Mixed cart quantity",
            calculateItemCount(),
            5
        );

        // TEST 8: 298 + 297 = 595 pesos.
        check(
            "Mixed cart total",
            calculateCartTotal(),
            595
        );

        // TEST 9: Peso formatting is correct.
        check(
            "Currency formatting",
            formatPrice(149),
            "₱149.00"
        );

        // TEST 10: Empty cart after removing items.
        resetTestCart();

        check(
            "Cart reset",
            calculateItemCount(),
            0
        );

        // Storage tests require browser storage access.
        if (storageAvailable) {

            // TEST 11: Save and restore a valid cart.
            cart.set(1, 2);
            cart.set(5, 3);

            const saved = saveCart();

            resetTestCart();

            const loaded = loadCart();

            check(
                "Save cart",
                saved,
                true
            );

            check(
                "Restore cart",
                loaded,
                true
            );

            check(
                "Restored quantity",
                calculateItemCount(),
                5
            );

            check(
                "Restored total",
                calculateCartTotal(),
                595
            );

            // TEST 12: Invalid quantities must be ignored.
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    version: 1,
                    items: [
                        [1, -5],
                        [5, 1000],
                        [3, 2],
                        [999, 1]
                    ]
                })
            );

            resetTestCart();

            loadCart();

            check(
                "Reject invalid quantities and IDs",
                calculateItemCount(),
                2
            );

            check(
                "Preserve valid pizza",
                calculateCartTotal(),
                698
            );

            // TEST 13: Corrupted JSON must not crash.
            localStorage.setItem(
                STORAGE_KEY,
                "not valid json"
            );

            resetTestCart();

            check(
                "Reject corrupted JSON",
                loadCart(),
                false
            );
        }

    } catch (error) {

        results.push({
            test: "Unexpected test error",
            status: "FAIL",
            expected: "No exception",
            actual: String(error)
        });

    } finally {

        // Restore the original shopping cart.
        cart.clear();

        for (const [id, quantity] of originalCart) {
            cart.set(id, quantity);
        }

        // Restore the exact original storage value.
        if (storageAvailable) {
            try {
                if (originalStorage === null) {
                    localStorage.removeItem(STORAGE_KEY);
                } else {
                    localStorage.setItem(
                        STORAGE_KEY,
                        originalStorage
                    );
                }
            } catch (error) {
                console.error(
                    "Could not restore test storage:",
                    error
                );
            }
        }

        // Refresh the visible cart after testing.
        renderCart();
    }

    // Show the completed results in DevTools.
    console.table(results);

    const failed = results.filter(function (result) {
        return result.status === "FAIL";
    });

    if (failed.length === 0) {
        console.log("BiteMenu: All executed tests passed!");
    } else {
        console.error(
            `BiteMenu: ${failed.length} tests failed.`
        );
    }

})();
