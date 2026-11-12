
"use strict";

/*
 * BITEMENU v1.2 — CHECKOUT TESTS
 *
 * Tests customer validation, order snapshots,
 * generated references, and saved-record safety.
 *
 * No real orders are created.
 * The original shopping cart is restored.
 */

(function runCheckoutTests() {

    // Back up the customer's existing cart.
    const originalCart = new Map(cart);

    const results = [];

    /**
     * Records whether a test passed.
     *
     * @param {string} name - Test description.
     * @param {*} actual - Observed value.
     * @param {*} expected - Expected value.
     * @returns {void}
     */
    function check(name, actual, expected) {

        results.push({
            test: name,
            status: Object.is(actual, expected)
                ? "PASS"
                : "FAIL",
            expected: expected,
            actual: actual
        });
    }

    // Fictional customer information.
    const validCustomer = {
        name: "Test Customer",
        phone: "09123456789",
        address: "123 Sample Street, Quezon City"
    };

    try {

        // Valid customer information.
        check(
            "Valid customer information",
            validateCustomer(validCustomer),
            ""
        );

        // International Philippine mobile format.
        check(
            "Valid +63 mobile number",
            validateCustomer({
                ...validCustomer,
                phone: "+639123456789"
            }),
            ""
        );

        // Reject an incomplete name.
        check(
            "Reject short name",
            validateCustomer({
                ...validCustomer,
                name: "A"
            }),
            "Enter a name between 2 and 80 characters."
        );

        // Reject an invalid mobile number.
        check(
            "Reject invalid phone",
            validateCustomer({
                ...validCustomer,
                phone: "12345"
            }),
            "Enter a valid Philippine mobile number."
        );

        // Reject an address that is too short.
        check(
            "Reject short address",
            validateCustomer({
                ...validCustomer,
                address: "Home"
            }),
            "Enter an address between 10 and 200 characters."
        );

        // Test empty order behavior.
        cart.clear();

        check(
            "Empty cart cannot create order",
            createOrderSnapshot(),
            null
        );

        // Add fictional test quantities.
        cart.set(1, 2);
        cart.set(5, 3);

        const order = createOrderSnapshot();

        check(
            "Order snapshot created",
            order !== null,
            true
        );

        check(
            "Order contains two product types",
            order.items.length,
            2
        );

        check(
            "Order total is correct",
            order.total,
            595
        );

        check(
            "Order reference prefix",
            order.id.startsWith("BM-"),
            true
        );

        check(
            "Valid snapshot passes validation",
            isStoredOrderValid(order),
            true
        );

        // A tampered total must be rejected.
        check(
            "Reject incorrect saved total",
            isStoredOrderValid({
                ...order,
                total: order.total + 10
            }),
            false
        );

        check(
            "Reject missing order items",
            isStoredOrderValid({
                ...order,
                items: []
            }),
            false
        );

        // Confirm personal details are not saved.
        check(
            "No phone stored in order",
            Object.hasOwn(order, "phone"),
            false
        );

        check(
            "No address stored in order",
            Object.hasOwn(order, "address"),
            false
        );

        check(
            "No customer name stored",
            Object.hasOwn(order, "name"),
            false
        );

    } catch (error) {

        results.push({
            test: "Unexpected exception",
            status: "FAIL",
            expected: "No exception",
            actual: String(error)
        });

    } finally {

        // Restore the customer's original cart.
        cart.clear();

        for (const [id, quantity] of originalCart) {
            cart.set(id, quantity);
        }

        renderCart();
    }

    
// Expose checkout results to our CI browser tests.
window.__bitemenuCheckoutTestResults = results;

// Show test results in DevTools Console.
console.table(results);


    const failed = results.filter(function (result) {
        return result.status === "FAIL";
    });

    if (failed.length === 0) {
        console.log(
            "BiteMenu: All checkout tests passed!"
        );
    } else {
        console.error(
            `BiteMenu: ${failed.length} checkout tests failed.`
        );
    }

})();
