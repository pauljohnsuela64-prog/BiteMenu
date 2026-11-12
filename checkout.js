
"use strict";

/* =========================================
   BITEMENU v1.2 — CHECKOUT SYSTEM

   This file handles:
   1. Customer information validation
   2. Checkout order summaries
   3. Demo order confirmation
   4. Browser-based order history

   No real orders or payments are processed.
   ========================================= */

// Separate storage key for completed demo orders.
const ORDER_HISTORY_KEY = "bitemenu-demo-orders-v1";

// Save only the 10 most recent demo orders.
const MAX_SAVED_ORDERS = 10;

// Array that holds order history in memory.
let orderHistory = [];


/* =========================================
   1. VALIDATE CUSTOMER INFORMATION
   ========================================= */

/**
 * Checks customer information before checkout.
 *
 * @param {object} details - Customer form values.
 * @returns {string} Error message, or an empty
 * string when all information is valid.
 *
 * For this Philippine demo, mobile numbers
 * must use 09XXXXXXXXX or +639XXXXXXXXX.
 */
function validateCustomer(details) {

    // Remove unnecessary surrounding spaces.
    const name = details.name.trim();

    // Allow common phone formatting characters.
    const phone = details.phone.replace(/[\s()-]/g, "");

    const address = details.address.trim();

    // Validate customer name.
    if (name.length < 2 || name.length > 80) {
        return "Enter a name between 2 and 80 characters.";
    }

    // Validate a Philippine mobile number.
    const phonePattern = /^(09\d{9}|\+639\d{9})$/;

    if (!phonePattern.test(phone)) {
        return "Enter a valid Philippine mobile number.";
    }

    // Require a meaningful demo delivery address.
    if (address.length < 10 || address.length > 200) {
        return "Enter an address between 10 and 200 characters.";
    }

    // Empty string means validation succeeded.
    return "";
}


/* =========================================
   2. GENERATE DEMO ORDER NUMBER
   ========================================= */

/**
 * Generates a reference for a simulated order.
 *
 * @returns {string} Demo order reference.
 *
 * Uses the current time and a random suffix.
 * This is suitable for a learning project,
 * not for real-world transaction IDs.
 */
function createOrderNumber() {

    const timestamp = Date.now()
        .toString(36)
        .toUpperCase();

    const randomPart = Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase();

    return `BM-${timestamp}-${randomPart}`;
}


/* =========================================
   3. CREATE A SNAPSHOT OF THE ORDER
   ========================================= */

/**
 * Copies the cart into a demo order record.
 *
 * @returns {object|null} Order information,
 * or null when the cart is empty.
 *
 * We save only food names, quantities, prices,
 * totals, timestamps, and the reference number.
 *
 * Customer names, phones, and addresses are
 * intentionally excluded.
 */
function createOrderSnapshot() {

    const items = [];

    // Read the current cart Map.
    for (const [id, quantity] of cart) {

        const food = findFoodById(id);

        // Ignore invalid product information.
        if (
            !food ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > MAX_QUANTITY
        ) {
            continue;
        }

        items.push({
            name: food.name,
            quantity: quantity,
            unitPrice: food.price
        });
    }

    if (items.length === 0) {
        return null;
    }

    // Calculate the order total from its items.
    const total = items.reduce(function (sum, item) {
        return sum + item.quantity * item.unitPrice;
    }, 0);

    return {
        id: createOrderNumber(),
        createdAt: new Date().toISOString(),
        items: items,
        total: total
    };
}


/* =========================================
   4. VALIDATE SAVED HISTORY RECORDS
   ========================================= */

/**
 * Checks whether a saved order has the
 * expected data structure.
 *
 * @param {object} order - Saved order.
 * @returns {boolean} True for valid records.
 *
 * Browser storage can be modified or damaged.
 * We must verify saved data before displaying it.
 */
function isStoredOrderValid(order) {

    if (!order || typeof order !== "object") {
        return false;
    }

    if (
        typeof order.id !== "string" ||
        !/^BM-[A-Z0-9-]+$/.test(order.id)
    ) {
        return false;
    }

    if (
        typeof order.createdAt !== "string" ||
        Number.isNaN(Date.parse(order.createdAt))
    ) {
        return false;
    }

    if (
        !Array.isArray(order.items) ||
        order.items.length === 0 ||
        order.items.length > menuItems.length
    ) {
        return false;
    }

    if (
        !Number.isFinite(order.total) ||
        order.total < 0
    ) {
        return false;
    }

    let calculatedTotal = 0;

    for (const item of order.items) {

        if (
            !item ||
            typeof item.name !== "string" ||
            item.name.length === 0 ||
            item.name.length > 80 ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1 ||
            item.quantity > MAX_QUANTITY ||
            !Number.isFinite(item.unitPrice) ||
            item.unitPrice < 0 ||
            item.unitPrice > 100000
        ) {
            return false;
        }

        calculatedTotal +=
            item.quantity * item.unitPrice;
    }

    // Reject records with incorrect totals.
    return Math.abs(calculatedTotal - order.total) < 0.01;
}


/* =========================================
   5. LOAD PREVIOUS DEMO ORDERS
   ========================================= */

/**
 * Reads demo order history from localStorage.
 *
 * @returns {Array} Valid saved orders.
 *
 * Invalid records are ignored, and we keep
 * only fields needed for order history.
 */
function loadOrderHistory() {

    try {

        const saved = localStorage.getItem(
            ORDER_HISTORY_KEY
        );

        if (!saved) {
            return [];
        }

        const data = JSON.parse(saved);

        if (!Array.isArray(data)) {
            return [];
        }

        return data
            .filter(isStoredOrderValid)
            .slice(0, MAX_SAVED_ORDERS)
            .map(function (order) {

                // Keep an allowlist of fields.
                return {
                    id: order.id,
                    createdAt: order.createdAt,
                    total: order.total,
                    items: order.items.map(function (item) {
                        return {
                            name: item.name,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice
                        };
                    })
                };
            });

    } catch (error) {

        console.warn(
            "BiteMenu: Could not load order history.",
            error
        );

        return [];
    }
}


/* =========================================
   6. SAVE DEMO ORDER HISTORY
   ========================================= */

/**
 * Saves the latest orders to localStorage.
 *
 * @returns {boolean} Whether saving succeeded.
 *
 * Personal customer information is not
 * included in these order records.
 */
function saveOrderHistory() {

    try {

        localStorage.setItem(
            ORDER_HISTORY_KEY,
            JSON.stringify(orderHistory)
        );

        return true;

    } catch (error) {

        console.warn(
            "BiteMenu: Could not save order history.",
            error
        );

        return false;
    }
}


/* =========================================
   7. DISPLAY CHECKOUT ERRORS
   ========================================= */

/**
 * Shows or hides checkout error messages.
 *
 * @param {string} message - Error to display.
 * @returns {void}
 */
function showCheckoutError(message) {

    const errorElement = document.getElementById(
        "checkout-error"
    );

    errorElement.textContent = message;

    // Hide the message when it is empty.
    errorElement.hidden = message === "";
}


/* =========================================
   8. RENDER CHECKOUT SUMMARY
   ========================================= */

/**
 * Displays the current cart inside checkout.
 *
 * @returns {void}
 *
 * Uses textContent instead of inserting
 * customer-controlled HTML.
 */
function renderCheckoutSummary() {

    const container = document.getElementById(
        "checkout-summary"
    );

    // Remove any previous summary.
    container.replaceChildren();

    const list = document.createElement("ul");
    list.className = "checkout-summary-list";

    for (const [id, quantity] of cart) {

        const food = findFoodById(id);

        if (!food) {
            continue;
        }

        const item = document.createElement("li");

        item.textContent =
            `${quantity} × ${food.name} — ` +
            formatPrice(food.price * quantity);

        list.append(item);
    }

    const total = document.createElement("strong");
    total.className = "checkout-summary-total";

    total.textContent =
        `Total: ${formatPrice(calculateCartTotal())}`;

    container.append(list, total);
}


/* =========================================
   9. DISPLAY PREVIOUS ORDERS
   ========================================= */

/**
 * Rebuilds the demo order history display.
 *
 * @returns {void}
 *
 * Shows order references, dates, item counts,
 * and totals without customer information.
 */
function renderOrderHistory() {

    const container = document.getElementById(
        "history-list"
    );

    const clearButton = document.getElementById(
        "clear-order-history"
    );

    container.replaceChildren();

    clearButton.disabled = orderHistory.length === 0;

    if (orderHistory.length === 0) {

        const empty = document.createElement("p");
        empty.className = "history-empty";
        empty.textContent = "No demo orders yet.";

        container.append(empty);
        return;
    }

    const list = document.createElement("ol");
    list.className = "history-list";

    for (const order of orderHistory) {

        const entry = document.createElement("li");
        entry.className = "history-item";

        const reference = document.createElement("strong");
        reference.textContent = order.id;

        const date = document.createElement("span");

        date.textContent = new Date(
            order.createdAt
        ).toLocaleString("en-PH");

        const count = order.items.reduce(
            function (sum, item) {
                return sum + item.quantity;
            },
            0
        );

        const details = document.createElement("p");

        details.textContent =
            `${count} item(s) · ` +
            formatPrice(order.total);

        entry.append(reference, date, details);

        list.append(entry);
    }

    container.append(list);
}


/* =========================================
   10. OPEN CHECKOUT
   ========================================= */

/**
 * Shows the checkout form when the cart
 * contains at least one item.
 *
 * @returns {void}
 */
function openCheckout() {

    if (cart.size === 0) {
        return;
    }

    const panel = document.getElementById(
        "checkout-panel"
    );

    const confirmation = document.getElementById(
        "checkout-confirmation"
    );

    // Close any earlier confirmation.
    confirmation.hidden = true;

    // Refresh the order summary.
    renderCheckoutSummary();

    showCheckoutError("");

    panel.hidden = false;

    // Move keyboard focus to the first field.
    document.getElementById("checkout-name").focus();
}


/* =========================================
   11. CANCEL CHECKOUT
   ========================================= */

/**
 * Hides checkout and clears entered
 * customer details without changing the cart.
 *
 * @returns {void}
 */
function cancelCheckout() {

    document.getElementById(
        "checkout-panel"
    ).hidden = true;

    document.getElementById(
        "checkout-form"
    ).reset();

    showCheckoutError("");

    document.getElementById("place-order").focus();
}


/* =========================================
   12. CONFIRM DEMO CHECKOUT
   ========================================= */

/**
 * Handles checkout form submission.
 *
 * @param {SubmitEvent} event - Form event.
 * @returns {void}
 *
 * Workflow:
 * 1. Prevent browser page reload
 * 2. Validate customer information
 * 3. Create a simulated order
 * 4. Save non-personal order history
 * 5. Empty the shopping cart
 * 6. Display confirmation
 */
function submitCheckout(event) {

    event.preventDefault();

    if (cart.size === 0) {
        showCheckoutError("Your cart is empty.");
        return;
    }

    // Read customer details only for validation.
    const details = {
        name: document.getElementById(
            "checkout-name"
        ).value,

        phone: document.getElementById(
            "checkout-phone"
        ).value,

        address: document.getElementById(
            "checkout-address"
        ).value
    };

    const validationError = validateCustomer(details);

    if (validationError) {

        showCheckoutError(validationError);
        return;
    }

    // Build a record that excludes personal data.
    const order = createOrderSnapshot();

    if (!order) {

        showCheckoutError("No valid items to order.");
        return;
    }

    // New orders appear first in history.
    orderHistory.unshift(order);

    // Retain only the latest 10 orders.
    orderHistory = orderHistory.slice(
        0,
        MAX_SAVED_ORDERS
    );

    const historySaved = saveOrderHistory();

    // Clear the cart after demo confirmation.
    cart.clear();

    const cartSaved = saveCart();

    // Update both parts of the interface.
    renderCart();
    renderOrderHistory();

    // Clear customer details from the form.
    event.currentTarget.reset();

    document.getElementById(
        "checkout-panel"
    ).hidden = true;

    const confirmation = document.getElementById(
        "checkout-confirmation"
    );

    const message = document.getElementById(
        "confirmation-message"
    );

    const storageWarning =
        historySaved && cartSaved
            ? "Demo history saved in this browser."
            : "Browser storage could not save all changes.";

    message.textContent =
        `Reference: ${order.id}. ` +
        `Total: ${formatPrice(order.total)}. ` +
        `${storageWarning} ` +
        "No real order was placed.";

    confirmation.hidden = false;

    document.getElementById(
        "confirmation-heading"
    ).focus();
}


/* =========================================
   13. CONTINUE BROWSING
   ========================================= */

/**
 * Closes the confirmation and returns
 * keyboard focus to the food menu.
 *
 * @returns {void}
 */
function continueShopping() {

    document.getElementById(
        "checkout-confirmation"
    ).hidden = true;

    document.getElementById(
        "menu-search"
    ).focus();
}


/* =========================================
   14. CLEAR SAVED ORDER HISTORY
   ========================================= */

/**
 * Deletes previous demo order records
 * after the user confirms the action.
 *
 * @returns {void}
 */
function clearOrderHistory() {

    if (orderHistory.length === 0) {
        return;
    }

    const confirmed = window.confirm(
        "Clear all saved demo order history?"
    );

    if (!confirmed) {
        return;
    }

    orderHistory = [];

    const saved = saveOrderHistory();

    renderOrderHistory();

    if (!saved) {
        window.alert(
            "Unable to update browser storage."
        );
    }
}


/* =========================================
   15. INITIALIZE CHECKOUT
   ========================================= */

/**
 * Connects form and button events, restores
 * saved history, and displays previous orders.
 *
 * @returns {void}
 *
 * Runs once after the page loads.
 */
function initializeCheckout() {

    const form = document.getElementById(
        "checkout-form"
    );

    const cancelButton = document.getElementById(
        "cancel-checkout"
    );

    const continueButton = document.getElementById(
        "continue-shopping"
    );

    const clearButton = document.getElementById(
        "clear-order-history"
    );

    // Warn developers if HTML elements are missing.
    if (
        !form ||
        !cancelButton ||
        !continueButton ||
        !clearButton
    ) {
        console.error(
            "BiteMenu: Checkout elements are missing."
        );
        return;
    }

    // Submit the simulated order.
    form.addEventListener(
        "submit",
        submitCheckout
    );

    // Let the customer cancel safely.
    cancelButton.addEventListener(
        "click",
        cancelCheckout
    );

    // Return to the menu after confirmation.
    continueButton.addEventListener(
        "click",
        continueShopping
    );

    // Clear previous demo orders when requested.
    clearButton.addEventListener(
        "click",
        clearOrderHistory
    );

    // Restore saved demo orders and display them.
    orderHistory = loadOrderHistory();

    renderOrderHistory();
}


/* =========================================
   START CHECKOUT FEATURES
   ========================================= */

// Both JavaScript files use defer.
// The HTML exists when this function runs.
initializeCheckout();
