
"use strict";

/*
 * BITEMENU — RESTAURANT MENU
 * Phase 4: Dynamic Food Cards
 *
 * This file stores menu data and creates
 * HTML cards using JavaScript.
 */


/* =========================================
   1. FOOD DATA
   ========================================= */

/*
 * An array stores multiple food objects.
 *
 * Each object contains:
 * id          = Unique food identifier
 * name        = Food name
 * category    = Type of food
 * price       = Price in Philippine pesos
 * description = Short food description
 * emoji       = Temporary food illustration
 */

const menuItems = [
    {
        id: 1,
        name: "Classic Cheeseburger",
        category: "Burgers",
        price: 149,
        description: "Juicy beef patty with cheese and fresh vegetables.",
        emoji: "🍔"
    },
    {
        id: 2,
        name: "Double Beef Burger",
        category: "Burgers",
        price: 229,
        description: "Two beef patties with melted cheese and special sauce.",
        emoji: "🍔"
    },
    {
        id: 3,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 349,
        description: "Classic pizza with pepperoni and mozzarella cheese.",
        emoji: "🍕"
    },
    {
        id: 4,
        name: "Hawaiian Pizza",
        category: "Pizza",
        price: 329,
        description: "Delicious pizza topped with ham and pineapple.",
        emoji: "🍕"
    },
    {
        id: 5,
        name: "Iced Coffee",
        category: "Drinks",
        price: 99,
        description: "Refreshing chilled coffee served over ice.",
        emoji: "☕"
    },
    {
        id: 6,
        name: "Fresh Lemonade",
        category: "Drinks",
        price: 79,
        description: "Freshly squeezed lemonade with a citrus kick.",
        emoji: "🍋"
    },
    {
        id: 7,
        name: "Chocolate Cake",
        category: "Desserts",
        price: 139,
        description: "Rich chocolate cake with creamy frosting.",
        emoji: "🍰"
    },
    {
        id: 8,
        name: "Vanilla Ice Cream",
        category: "Desserts",
        price: 89,
        description: "Creamy vanilla ice cream served chilled.",
        emoji: "🍨"
    }
];


/* =========================================
   2. FORMAT PRICE
   ========================================= */

/**
 * Converts a number into Philippine peso format.
 *
 * @param {number} price - The food price.
 * @returns {string} Formatted currency text.
 *
 * Example:
 * formatPrice(149) returns "₱149.00"
 */
function formatPrice(price) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(price);
}


/* =========================================
   3. CREATE FOOD CARD
   ========================================= */

/**
 * Creates one HTML food card from a food object.
 *
 * @param {object} item - Food item information.
 * @returns {HTMLElement} The completed food card.
 *
 * document.createElement() creates HTML elements.
 * textContent sets their text safely.
 * append() places child elements inside parents.
 */
function createFoodCard(item) {

    // Create the main card.
    const card = document.createElement("article");
    card.className = "food-card";

    // Create the illustration area.
    const image = document.createElement("div");
    image.className = "food-image";

    const emoji = document.createElement("span");
    emoji.textContent = item.emoji;
    emoji.setAttribute("aria-hidden", "true");

    image.append(emoji);

    // Create the card information container.
    const content = document.createElement("div");
    content.className = "food-content";

    // Display the food category.
    const category = document.createElement("span");
    category.className = "food-category";
    category.textContent = item.category;

    // Display the food name.
    const title = document.createElement("h3");
    title.textContent = item.name;

    // Display the food description.
    const description = document.createElement("p");
    description.className = "food-description";
    description.textContent = item.description;

    // Create the price label.
    const price = document.createElement("strong");
    price.className = "food-price";
    price.textContent = formatPrice(item.price);

    // Insert information inside the content area.
    
    // Create an Add to Cart button for this food item.
    const addButton = document.createElement("button");

    // Apply the CSS class for styling.
    addButton.className = "add-to-cart-btn";

    // Store the food ID so JavaScript knows what to add.
    addButton.dataset.id = String(item.id);

    // Identify the button's action.
    addButton.dataset.action = "add";

    addButton.type = "button";
    addButton.textContent = "Add to Cart";

    // Give the button a descriptive accessible name.
    addButton.setAttribute(
        "aria-label",
        `Add ${item.name} to cart`
    );

    // Add all elements to the food card.
    content.append(
        category,
        title,
        description,
        price,
        addButton
    );


    // Combine the illustration and content.
    card.append(image, content);

    // Return the finished HTML card.
    return card;
}


/* =========================================
   4. RENDER THE FOOD MENU
   ========================================= */

/**
 * Displays food items inside the menu grid.
 *
 * @param {Array<object>} items - Foods to display.
 * @returns {void} Nothing is returned.
 *
 * This function clears the current grid and
 * generates fresh cards from the supplied items.
 */

/**
 * Displays food items inside the menu grid.
 *
 * @param {Array<object>} items - Food items to display.
 * @returns {void} This function returns nothing.
 *
 * If no items match, an empty-state message
 * appears instead of a blank grid.
 */
function renderMenu(items) {
    const menuGrid = document.getElementById("menu-grid");

    // Stop if the expected HTML container is missing.
    if (!menuGrid) {
        console.error("BiteMenu: Menu grid was not found.");
        return;
    }

    // Remove previously displayed food cards.
    menuGrid.replaceChildren();

    // Show a message when no food matches the filters.
    if (items.length === 0) {
        const message = document.createElement("p");

        message.className = "menu-empty";
        message.textContent =
            "No matching food found. Try another search or category.";

        menuGrid.append(message);
        return;
    }

    // Prepare the new food cards.
    const fragment = document.createDocumentFragment();

    // Create a card for each item.
    items.forEach(function (item) {
        const card = createFoodCard(item);
        fragment.append(card);
    });

    // Insert the completed cards into the page.
    menuGrid.append(fragment);
}



/* =========================================
   5. INITIALIZE THE APPLICATION
   ========================================= */

// Display all food items when the page loads.

/* =========================================
   PHASE 5 — SEARCH AND CATEGORY FILTERING
   ========================================= */

/*
 * Application state:
 *
 * activeCategory stores the selected filter.
 * searchTerm stores what the visitor typed.
 */
let activeCategory = "All";
let searchTerm = "";


/**
 * Filters the complete menu using the current
 * search text and selected category.
 *
 * @returns {void} Updates the displayed cards.
 *
 * Both conditions must match:
 * 1. The selected category
 * 2. The current search text
 */
function applyFilters() {

    // Create a new array of matching food items.
    const filteredItems = menuItems.filter(function (item) {

        // Check if this item belongs to the category.
        const matchesCategory =
            activeCategory === "All" ||
            item.category === activeCategory;

        // Make searching case-insensitive.
        const search = searchTerm.trim().toLowerCase();

        // Search by food name or description.
        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search);

        // Keep only items matching both conditions.
        return matchesCategory && matchesSearch;
    });

    // Show the filtered cards.
    renderMenu(filteredItems);

    // Update the number of matching items.
    updateResultsCount(filteredItems.length);
}


/**
 * Updates the number of matching menu items.
 *
 * @param {number} count - Number of matching foods.
 * @returns {void} Updates the result counter.
 */
function updateResultsCount(count) {

    const counter = document.getElementById("results-count");

    // Stop if the result counter does not exist.
    if (!counter) {
        return;
    }

    // Use singular or plural text as appropriate.
    const itemLabel = count === 1 ? "item" : "items";

    counter.textContent = `${count} food ${itemLabel} found`;
}


/**
 * Handles typing inside the food search box.
 *
 * @param {Event} event - The browser input event.
 * @returns {void} Updates searchTerm and menu cards.
 */
function handleSearchInput(event) {

    // Read the text currently entered by the visitor.
    searchTerm = event.target.value;

    // Refresh the visible food cards.
    applyFilters();
}


/**
 * Handles clicking a category filter button.
 *
 * @param {MouseEvent} event - The click event.
 * @returns {void} Changes the active category.
 */
function handleCategoryClick(event) {

    // Identify the clicked button.
    const clickedButton = event.currentTarget;

    // Read its data-category HTML attribute.
    activeCategory = clickedButton.dataset.category;

    // Find every category button.
    const buttons = document.querySelectorAll(".filter-btn");

    // Update visual and accessibility states.
    buttons.forEach(function (button) {

        const isActive =
            button.dataset.category === activeCategory;

        // Apply the active CSS class to the selection.
        button.classList.toggle("active", isActive);

        // Tell assistive technology if selected.
        button.setAttribute("aria-pressed", String(isActive));
    });

    // Display matching food items.
    applyFilters();
}


/**
 * Clears the search input and category selection.
 *
 * @returns {void} Restores the complete food menu.
 */
function clearFilters() {

    const searchInput = document.getElementById("menu-search");

    // Restore the default filter state.
    searchTerm = "";
    activeCategory = "All";

    // Clear the visible search field.
    if (searchInput) {
        searchInput.value = "";
    }

    // Reset every category button.
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(function (button) {
        const isActive = button.dataset.category === "All";

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    // Show the complete menu again.
    applyFilters();
}


/**
 * Initializes the restaurant menu controls.
 *
 * @returns {void} Registers browser event listeners
 * and displays all food items.
 *
 * This function runs once when the script loads.
 */
function initializeMenu() {

    // Find the search input and reset button.
    const searchInput = document.getElementById("menu-search");
    const clearButton = document.getElementById("clear-filters");

    // Find all category filter buttons.
    const categoryButtons = document.querySelectorAll(".filter-btn");

    // Listen for changes as visitors type.
    if (searchInput) {
        searchInput.addEventListener("input", handleSearchInput);
    }

    // Register a click listener for every category.
    categoryButtons.forEach(function (button) {
        button.addEventListener("click", handleCategoryClick);
    });

    // Register the reset button event.
    if (clearButton) {
        clearButton.addEventListener("click", clearFilters);
    }

    // Display the original menu on page load.
    applyFilters();
}


// Start the BiteMenu application.
initializeMenu();


/* =========================================
   PHASE 6 — SHOPPING CART
   ========================================= */

/*
 * The cart is a Map:
 *
 * Key   = Unique food item ID
 * Value = Quantity ordered
 *
 * Example:
 * 1 => 2 means two Classic Cheeseburgers.
 *
 * The cart exists in memory for now.
 * We will save it in localStorage in Phase 7.
 */
const cart = new Map();

// Maximum quantity allowed for one food item.
const MAX_QUANTITY = 99;


/**
 * Finds a food item using its unique ID.
 *
 * @param {number} id - Food item ID.
 * @returns {object|undefined} The matching food item,
 * or undefined if no item exists.
 */
function findFoodById(id) {
    return menuItems.find(function (item) {
        return item.id === id;
    });
}


/**
 * Adds one unit of a food item to the cart.
 *
 * @param {number} id - Food item ID.
 * @returns {void}
 *
 * If the item already exists, its quantity
 * increases by one instead of adding a duplicate row.
 */
function addToCart(id) {
    const food = findFoodById(id);

    // Reject unknown food IDs.
    if (!food) {
        return;
    }

    // Read the current quantity, defaulting to zero.
    const currentQuantity = cart.get(id) || 0;

    // Prevent excessive quantities.
    if (currentQuantity >= MAX_QUANTITY) {
        showCartMessage("Maximum quantity reached.");
        return;
    }

    // Save the updated quantity.
    cart.set(id, currentQuantity + 1);

    // Refresh the shopping cart interface.
    renderCart();

    // Tell the visitor what happened.
    showCartMessage(`${food.name} added to your cart!`);
}


/**
 * Changes the quantity of a cart item.
 *
 * @param {number} id - Food item ID.
 * @param {number} change - Usually +1 or -1.
 * @returns {void}
 *
 * A quantity of zero removes the item.
 */
function changeQuantity(id, change) {
    const currentQuantity = cart.get(id);

    // Stop if the item is not in the cart.
    if (!currentQuantity) {
        return;
    }

    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
        cart.delete(id);
    } else if (newQuantity <= MAX_QUANTITY) {
        cart.set(id, newQuantity);
    } else {
        return;
    }

    // Update the visible cart after the change.
    renderCart();
}


/**
 * Removes one product completely from the cart.
 *
 * @param {number} id - Food item ID.
 * @returns {void}
 */
function removeFromCart(id) {
    cart.delete(id);

    renderCart();
    showCartMessage("Item removed from your cart.");
}


/**
 * Calculates the total quantity of all cart items.
 *
 * @returns {number} Total number of units.
 *
 * Example:
 * 2 burgers + 3 drinks = 5 items.
 */
function calculateItemCount() {
    let count = 0;

    for (const quantity of cart.values()) {
        count += quantity;
    }

    return count;
}


/**
 * Calculates the total price of the cart.
 *
 * @returns {number} Total price in pesos.
 *
 * Formula:
 * Total = Sum of (food price × quantity).
 */
function calculateCartTotal() {
    let total = 0;

    for (const [id, quantity] of cart) {
        const food = findFoodById(id);

        if (food) {
            total += food.price * quantity;
        }
    }

    return total;
}


/**
 * Displays a status message below the cart heading.
 *
 * @param {string} message - Message to display.
 * @returns {void}
 */
function showCartMessage(message) {
    const element = document.getElementById("cart-message");

    if (element) {
        element.textContent = message;
    }
}


/**
 * Creates a shopping cart action button.
 *
 * @param {string} text - Visible button text.
 * @param {string} action - increase, decrease, or remove.
 * @param {number} id - Food item ID.
 * @param {boolean} disabled - Whether clicking is disabled.
 * @returns {HTMLButtonElement} The new button.
 */
function createCartButton(text, action, id, disabled = false) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "quantity-btn";
    button.textContent = text;

    // Store the action and item identifier.
    button.dataset.action = action;
    button.dataset.id = String(id);

    button.disabled = disabled;

    // Provide more descriptive names for screen readers.
    const food = findFoodById(id);
    const name = food ? food.name : "item";

    const labels = {
        increase: `Increase ${name} quantity`,
        decrease: `Decrease ${name} quantity`,
        remove: `Remove ${name} from cart`
    };

    button.setAttribute("aria-label", labels[action]);

    return button;
}


/**
 * Creates one row in the shopping cart.
 *
 * @param {object} food - The food information.
 * @param {number} quantity - Amount ordered.
 * @returns {HTMLElement} The completed cart row.
 */
function createCartRow(food, quantity) {
    const row = document.createElement("div");
    row.className = "cart-item";

    // Container for the product name and subtotal.
    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("strong");
    name.textContent = food.name;

    const subtotal = document.createElement("span");
    subtotal.textContent = formatPrice(food.price * quantity);

    details.append(name, subtotal);

    // Container for quantity buttons and number.
    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const decrease = createCartButton(
        "−", "decrease", food.id
    );

    const amount = document.createElement("span");
    amount.className = "quantity-value";
    amount.textContent = String(quantity);

    const increase = createCartButton(
        "+",
        "increase",
        food.id,
        quantity >= MAX_QUANTITY
    );

    const remove = createCartButton(
        "Remove", "remove", food.id
    );

    remove.classList.add("remove-btn");

    controls.append(decrease, amount, increase, remove);

    // Combine the row's information and controls.
    row.append(details, controls);

    return row;
}


/**
 * Updates the entire cart interface.
 *
 * @returns {void}
 *
 * Rebuilds the cart rows, recalculates totals,
 * and enables or disables relevant buttons.
 */
function renderCart() {
    const container = document.getElementById("cart-items");
    const countElement = document.getElementById("cart-count");
    const totalElement = document.getElementById("cart-total");

    const clearButton = document.getElementById("clear-cart");
    const orderButton = document.getElementById("place-order");

    if (!container || !countElement || !totalElement ||
        !clearButton || !orderButton) {
        console.error("BiteMenu: Cart elements are missing.");
        return;
    }

    // Remove previously displayed cart rows.
    container.replaceChildren();

    const count = calculateItemCount();
    const total = calculateCartTotal();

    // Update the visible item count and price.
    countElement.textContent =
        `${count} ${count === 1 ? "item" : "items"}`;

    totalElement.textContent = formatPrice(total);

    // Disable controls when nothing has been ordered.
    clearButton.disabled = count === 0;
    orderButton.disabled = count === 0;

    // Show an empty-cart message if needed.
    if (count === 0) {
        const empty = document.createElement("p");

        empty.className = "cart-empty";
        empty.textContent =
            "Your cart is empty. Add something delicious!";

        container.append(empty);
        return;
    }

    // Build the cart rows in memory first.
    const fragment = document.createDocumentFragment();

    for (const [id, quantity] of cart) {
        const food = findFoodById(id);

        if (food) {
            const row = createCartRow(food, quantity);
            fragment.append(row);
        }
    }

    container.append(fragment);
}


/**
 * Removes every item from the shopping cart.
 *
 * @returns {void}
 */
function clearCart() {
    cart.clear();

    renderCart();
    showCartMessage("Your cart has been cleared.");
}


/**
 * Displays a simulated order summary.
 *
 * @returns {void}
 *
 * This is not a real checkout.
 * No order is submitted and no payment is collected.
 */
function reviewOrder() {
    if (cart.size === 0) {
        return;
    }

    const lines = ["BITEMENU — ORDER SUMMARY", ""];

    for (const [id, quantity] of cart) {
        const food = findFoodById(id);

        if (food) {
            const subtotal = food.price * quantity;

            lines.push(
                `${quantity} × ${food.name} — ${formatPrice(subtotal)}`
            );
        }
    }

    lines.push("");
    lines.push(`Total: ${formatPrice(calculateCartTotal())}`);
    lines.push("");
    lines.push("Demo only — no order has been placed.");

    window.alert(lines.join("\n"));
}


/**
 * Handles Add to Cart button clicks in the menu.
 *
 * @param {MouseEvent} event - Browser click event.
 * @returns {void}
 *
 * Uses event delegation, so we only need
 * one listener for all dynamically created cards.
 */
function handleMenuCartClick(event) {
    const button = event.target.closest(
        'button[data-action="add"]'
    );

    if (!button || !event.currentTarget.contains(button)) {
        return;
    }

    const id = Number(button.dataset.id);

    addToCart(id);
}


/**
 * Handles clicks on cart quantity and remove buttons.
 *
 * @param {MouseEvent} event - Browser click event.
 * @returns {void}
 *
 * Reads the action from the clicked button.
 */
function handleCartAction(event) {
    const button = event.target.closest(
        "button[data-action]"
    );

    if (!button || !event.currentTarget.contains(button)) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "increase") {
        changeQuantity(id, 1);
    } else if (action === "decrease") {
        changeQuantity(id, -1);
    } else if (action === "remove") {
        removeFromCart(id);
    }
}


/**
 * Initializes shopping cart event listeners.
 *
 * @returns {void}
 *
 * Runs once when the webpage loads.
 */
function initializeCart() {
    const menuGrid = document.getElementById("menu-grid");
    const cartItems = document.getElementById("cart-items");

    const clearButton = document.getElementById("clear-cart");
    const orderButton = document.getElementById("place-order");

    // Attach one click listener to the food grid.
    if (menuGrid) {
        menuGrid.addEventListener("click", handleMenuCartClick);
    }

    // Attach one click listener to all cart rows.
    if (cartItems) {
        cartItems.addEventListener("click", handleCartAction);
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearCart);
    }

    if (orderButton) {
        orderButton.addEventListener("click", reviewOrder);
    }

    // Draw the initial empty cart.
    renderCart();
}


// Start the shopping cart feature.
initializeCart();


