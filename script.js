
"use strict";

/* =========================================
   BITEMENU — COMPLETE JAVASCRIPT
   Version 1.0
   Phase 7: Shopping Cart Persistence
   ========================================= */


/* =========================================
   1. RESTAURANT FOOD DATA
   ========================================= */

/*
 * menuItems is an array containing food objects.
 *
 * Each food object has:
 * id          - Unique food identifier
 * name        - Name of the food
 * category    - Food category
 * price       - Price in Philippine pesos
 * description - Food description
 * emoji       - Food illustration
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



/*
 * BITEMENU v1.1 — FOOD PHOTOGRAPHY
 *
 * Each food ID is associated with an image.
 * The IDs match the items in menuItems.
 *
 * Images are loaded only when needed.
 */
const foodImages = {
    1: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    2: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    3: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    4: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    5: "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
    6: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87",
    7: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    8: "https://images.unsplash.com/photo-1563805042-7684c019e1cb"
};


/* =========================================
   2. APPLICATION STATE
   ========================================= */

/*
 * These variables keep track of the menu
 * and the customer's current cart.
 */

// Currently selected food category.
let activeCategory = "All";

// Current search text.
let searchTerm = "";

// Shopping cart stored as food ID => quantity.
const cart = new Map();

// Maximum quantity of one food item.
const MAX_QUANTITY = 99;

// Unique name used to save cart data.
const CART_STORAGE_KEY = "bitemenu-cart-v1";


/* =========================================
   3. HELPER FUNCTIONS
   ========================================= */

/**
 * Converts a number into Philippine peso format.
 *
 * @param {number} price - Amount to format.
 * @returns {string} Formatted peso amount.
 *
 * Example:
 * formatPrice(149) -> "₱149.00"
 */
function formatPrice(price) {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(price);
}


/**
 * Finds one food item using its unique ID.
 *
 * @param {number} id - Food identifier.
 * @returns {object|undefined} Matching food item.
 */
function findFoodById(id) {
    return menuItems.find(function (item) {
        return item.id === id;
    });
}


/* =========================================
   4. CREATE FOOD CARDS
   ========================================= */

/**
 * Creates a food card using JavaScript.
 *
 * @param {object} item - Food information.
 * @returns {HTMLElement} Completed food card.
 *
 * The function creates HTML elements,
 * fills them with food information, and
 * returns the card.
 */

/**
 * Creates a restaurant food card with photography.
 *
 * @param {object} item - Menu item information.
 * @returns {HTMLElement} Completed food card.
 *
 * Creates the image, category, title, description,
 * price and Add to Cart button.
 *
 * If a photograph cannot load, the food emoji
 * is displayed instead.
 */
function createFoodCard(item) {

    // Create the main card container.
    const card = document.createElement("article");
    card.className = "food-card";

    // Create the image area.
    const imageContainer = document.createElement("div");
    imageContainer.className = "food-image";

    // Create a real HTML image element.
    const image = document.createElement("img");

    // Read the image URL using the food item's ID.
    const imageUrl = foodImages[item.id];

    image.src = `${imageUrl}?auto=format&fit=crop&w=800&q=80`;
    image.alt = item.name;

    // Improve image-loading performance.
    image.loading = "lazy";
    image.decoding = "async";

    // Create a fallback if the photograph fails.
    const fallback = document.createElement("span");
    fallback.textContent = item.emoji;
    fallback.className = "food-fallback";
    fallback.setAttribute("aria-hidden", "true");
    fallback.hidden = true;

    // Handle unavailable images without breaking cards.
    image.addEventListener("error", function () {
        image.hidden = true;
        fallback.hidden = false;
        imageContainer.classList.add("image-failed");
    });

    imageContainer.append(image, fallback);

    // Create the food information section.
    const content = document.createElement("div");
    content.className = "food-content";

    // Create category label.
    const category = document.createElement("span");
    category.className = "food-category";
    category.textContent = item.category;

    // Create food name.
    const title = document.createElement("h3");
    title.textContent = item.name;

    // Create description.
    const description = document.createElement("p");
    description.className = "food-description";
    description.textContent = item.description;

    // Create price.
    const price = document.createElement("strong");
    price.className = "food-price";
    price.textContent = formatPrice(item.price);

    // Create Add to Cart button.
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-to-cart-btn";
    addButton.textContent = "Add to Cart";

    // Keep compatibility with the existing cart logic.
    addButton.dataset.id = String(item.id);
    addButton.dataset.action = "add";

    addButton.setAttribute(
        "aria-label",
        `Add ${item.name} to cart`
    );

    // Insert all card information.
    content.append(
        category,
        title,
        description,
        price,
        addButton
    );

    card.append(imageContainer, content);

    return card;
}


/* =========================================
   5. DISPLAY THE FOOD MENU
   ========================================= */

/**
 * Displays food items inside the menu grid.
 *
 * @param {Array<object>} items - Foods to display.
 * @returns {void}
 *
 * Existing cards are removed before
 * new cards are displayed.
 */
function renderMenu(items) {

    const menuGrid = document.getElementById("menu-grid");

    if (!menuGrid) {
        console.error("BiteMenu: Menu grid not found.");
        return;
    }

    // Clear previous food cards.
    menuGrid.replaceChildren();

    // Display a message when nothing matches.
    if (items.length === 0) {

        const message = document.createElement("p");
        message.className = "menu-empty";

        message.textContent =
            "No matching food found. Try another search or category.";

        menuGrid.append(message);
        return;
    }

    // Prepare the food cards.
    const fragment = document.createDocumentFragment();

    items.forEach(function (item) {
        fragment.append(createFoodCard(item));
    });

    // Display the completed cards.
    menuGrid.append(fragment);
}


/* =========================================
   6. SEARCH AND CATEGORY FILTERS
   ========================================= */

/**
 * Filters foods using the current category
 * and search text.
 *
 * @returns {void}
 *
 * Both the category and search must match
 * before a food card is displayed.
 */
function applyFilters() {

    const filteredItems = menuItems.filter(function (item) {

        // Check selected category.
        const matchesCategory =
            activeCategory === "All" ||
            item.category === activeCategory;

        // Normalize search text.
        const search = searchTerm.trim().toLowerCase();

        // Search names and descriptions.
        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.description.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    renderMenu(filteredItems);
    updateResultsCount(filteredItems.length);
}


/**
 * Updates the text showing how many
 * food items match the current filters.
 *
 * @param {number} count - Number of results.
 * @returns {void}
 */
function updateResultsCount(count) {

    const counter = document.getElementById("results-count");

    if (!counter) {
        return;
    }

    const label = count === 1 ? "item" : "items";

    counter.textContent = `${count} food ${label} found`;
}


/**
 * Runs whenever the visitor types in search.
 *
 * @param {Event} event - Browser input event.
 * @returns {void}
 */
function handleSearchInput(event) {

    searchTerm = event.target.value;

    applyFilters();
}


/**
 * Runs whenever a category button is clicked.
 *
 * @param {MouseEvent} event - Browser click event.
 * @returns {void}
 */
function handleCategoryClick(event) {

    const clickedButton = event.currentTarget;

    activeCategory = clickedButton.dataset.category;

    const buttons = document.querySelectorAll(".filter-btn");

    // Update the selected button appearance.
    buttons.forEach(function (button) {

        const isActive =
            button.dataset.category === activeCategory;

        button.classList.toggle("active", isActive);

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });

    applyFilters();
}


/**
 * Resets search and category filters.
 *
 * @returns {void}
 */
function clearFilters() {

    searchTerm = "";
    activeCategory = "All";

    const searchInput = document.getElementById("menu-search");

    if (searchInput) {
        searchInput.value = "";
    }

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(function (button) {

        const isActive = button.dataset.category === "All";

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });

    applyFilters();
}


/**
 * Initializes menu search and category filtering.
 *
 * @returns {void}
 */
function initializeMenu() {

    const searchInput = document.getElementById("menu-search");
    const clearButton = document.getElementById("clear-filters");

    const categoryButtons =
        document.querySelectorAll(".filter-btn");

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            handleSearchInput
        );
    }

    categoryButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            handleCategoryClick
        );
    });

    if (clearButton) {
        clearButton.addEventListener(
            "click",
            clearFilters
        );
    }

    // Show all food items initially.
    applyFilters();
}


/* =========================================
   7. SAVE SHOPPING CART
   ========================================= */

/**
 * Saves the current cart in localStorage.
 *
 * @returns {boolean} Whether saving succeeded.
 *
 * Maps cannot be saved directly as JSON,
 * so we convert the cart into an array.
 */
function saveCart() {

    try {

        // Convert the Map into a JSON-friendly object.
        const cartData = {
            version: 1,
            items: Array.from(cart.entries())
        };

        const json = JSON.stringify(cartData);

        // Store the data in the browser.
        localStorage.setItem(CART_STORAGE_KEY, json);

        return true;

    } catch (error) {

        console.warn(
            "BiteMenu: Could not save cart.",
            error
        );

        return false;
    }
}


/* =========================================
   8. RESTORE SHOPPING CART
   ========================================= */

/**
 * Loads previously saved shopping cart data.
 *
 * @returns {boolean} Whether valid saved data
 * was successfully restored.
 *
 * Invalid food IDs and quantities are ignored
 * to prevent corrupted cart information.
 */
function loadCart() {

    try {

        // Find previously saved data.
        const saved = localStorage.getItem(CART_STORAGE_KEY);

        if (saved === null) {
            return false;
        }

        // Convert JSON text into JavaScript data.
        const data = JSON.parse(saved);

        // Validate the saved data structure.
        if (
            !data ||
            data.version !== 1 ||
            !Array.isArray(data.items)
        ) {
            console.warn("BiteMenu: Invalid saved cart.");
            return false;
        }

        const restored = new Map();

        // Inspect each stored food entry.
        for (const entry of data.items) {

            if (
                !Array.isArray(entry) ||
                entry.length !== 2
            ) {
                continue;
            }

            const [id, quantity] = entry;

            // Only accept real food IDs and safe quantities.
            if (
                !Number.isInteger(id) ||
                !findFoodById(id) ||
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > MAX_QUANTITY ||
                restored.has(id)
            ) {
                continue;
            }

            restored.set(id, quantity);
        }

        // Replace old cart contents.
        cart.clear();

        for (const [id, quantity] of restored) {
            cart.set(id, quantity);
        }

        return true;

    } catch (error) {

        console.warn(
            "BiteMenu: Could not restore cart.",
            error
        );

        return false;
    }
}


/* =========================================
   9. ADD AND MANAGE CART ITEMS
   ========================================= */

/**
 * Adds one food item to the shopping cart.
 *
 * @param {number} id - Unique food ID.
 * @returns {void}
 *
 * If the product already exists, its quantity
 * increases instead of creating another row.
 */
function addToCart(id) {

    const food = findFoodById(id);

    if (!food) {
        return;
    }

    const currentQuantity = cart.get(id) || 0;

    if (currentQuantity >= MAX_QUANTITY) {
        showCartMessage("Maximum quantity reached.");
        return;
    }

    cart.set(id, currentQuantity + 1);

    // NEW: Save the cart after adding an item.
    saveCart();

    renderCart();

    showCartMessage(`${food.name} added to your cart!`);
}


/**
 * Increases or decreases a cart item's quantity.
 *
 * @param {number} id - Food ID.
 * @param {number} change - Usually +1 or -1.
 * @returns {void}
 */
function changeQuantity(id, change) {

    const currentQuantity = cart.get(id);

    if (!currentQuantity) {
        return;
    }

    const newQuantity = currentQuantity + change;

    // Remove the item when quantity reaches zero.
    if (newQuantity <= 0) {

        cart.delete(id);

    } else if (newQuantity <= MAX_QUANTITY) {

        cart.set(id, newQuantity);

    } else {

        return;
    }

    // NEW: Save the changed quantity.
    saveCart();

    renderCart();
}


/**
 * Completely removes a food item from the cart.
 *
 * @param {number} id - Food ID.
 * @returns {void}
 */
function removeFromCart(id) {

    cart.delete(id);

    // NEW: Save after removing an item.
    saveCart();

    renderCart();

    showCartMessage("Item removed from your cart.");
}


/**
 * Removes every product from the shopping cart.
 *
 * @returns {void}
 */
function clearCart() {

    cart.clear();

    // NEW: Save the empty cart.
    saveCart();

    renderCart();

    showCartMessage("Your cart has been cleared.");
}


/* =========================================
   10. CART CALCULATIONS
   ========================================= */

/**
 * Calculates the number of items in the cart.
 *
 * @returns {number} Total quantity.
 *
 * Example:
 * 2 burgers + 3 coffees = 5 items.
 */
function calculateItemCount() {

    let count = 0;

    for (const quantity of cart.values()) {
        count += quantity;
    }

    return count;
}


/**
 * Calculates the total cost of the order.
 *
 * @returns {number} Total amount in pesos.
 *
 * Formula:
 * Total = sum of (price × quantity).
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


/* =========================================
   11. CART STATUS MESSAGES
   ========================================= */

/**
 * Displays feedback when the cart changes.
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


/* =========================================
   12. CREATE CART BUTTONS
   ========================================= */

/**
 * Creates a plus, minus, or remove button.
 *
 * @param {string} text - Button text.
 * @param {string} action - Button action.
 * @param {number} id - Food ID.
 * @param {boolean} disabled - Disabled state.
 * @returns {HTMLButtonElement} New button.
 */
function createCartButton(
    text,
    action,
    id,
    disabled = false
) {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "quantity-btn";
    button.textContent = text;

    button.dataset.action = action;
    button.dataset.id = String(id);

    button.disabled = disabled;

    const food = findFoodById(id);
    const name = food ? food.name : "item";

    const labels = {
        increase: `Increase ${name} quantity`,
        decrease: `Decrease ${name} quantity`,
        remove: `Remove ${name} from cart`
    };

    button.setAttribute(
        "aria-label",
        labels[action]
    );

    return button;
}


/* =========================================
   13. CREATE CART ROW
   ========================================= */

/**
 * Creates one product row in the cart.
 *
 * @param {object} food - Food information.
 * @param {number} quantity - Number ordered.
 * @returns {HTMLElement} Completed cart row.
 */
function createCartRow(food, quantity) {

    const row = document.createElement("div");
    row.className = "cart-item";

    // Product name and subtotal.
    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("strong");
    name.textContent = food.name;

    const subtotal = document.createElement("span");
    subtotal.textContent =
        formatPrice(food.price * quantity);

    details.append(name, subtotal);

    // Quantity adjustment controls.
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

    controls.append(
        decrease,
        amount,
        increase,
        remove
    );

    row.append(details, controls);

    return row;
}


/* =========================================
   14. DISPLAY SHOPPING CART
   ========================================= */

/**
 * Refreshes the complete shopping cart display.
 *
 * @returns {void}
 *
 * Updates:
 * - Product rows
 * - Total item count
 * - Overall order total
 * - Clear and Review button states
 */
function renderCart() {

    const container = document.getElementById("cart-items");
    const countElement = document.getElementById("cart-count");
    const totalElement = document.getElementById("cart-total");

    const clearButton = document.getElementById("clear-cart");
    const orderButton = document.getElementById("place-order");

    if (
        !container ||
        !countElement ||
        !totalElement ||
        !clearButton ||
        !orderButton
    ) {
        console.error("BiteMenu: Cart elements are missing.");
        return;
    }

    // Clear the old display.
    container.replaceChildren();

    const count = calculateItemCount();
    const total = calculateCartTotal();

    // Display updated totals.
    countElement.textContent =
        `${count} ${count === 1 ? "item" : "items"}`;

    totalElement.textContent = formatPrice(total);

    // Disable buttons if the cart is empty.
    clearButton.disabled = count === 0;
    orderButton.disabled = count === 0;

    if (count === 0) {

        const empty = document.createElement("p");
        empty.className = "cart-empty";

        empty.textContent =
            "Your cart is empty. Add something delicious!";

        container.append(empty);
        return;
    }

    // Create rows for each selected food.
    const fragment = document.createDocumentFragment();

    for (const [id, quantity] of cart) {

        const food = findFoodById(id);

        if (food) {
            fragment.append(
                createCartRow(food, quantity)
            );
        }
    }

    container.append(fragment);
}


/* =========================================
   15. SIMULATED ORDER SUMMARY
   ========================================= */

/**
 * Displays an order summary using an alert.
 *
 * @returns {void}
 *
 * This is only a demo.
 * No payment or order submission occurs.
 */
function reviewOrder() {

    if (cart.size === 0) {
        return;
    }

    const lines = [
        "BITEMENU — ORDER SUMMARY",
        ""
    ];

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


/* =========================================
   16. HANDLE MENU BUTTON CLICKS
   ========================================= */

/**
 * Detects Add to Cart clicks inside the menu grid.
 *
 * @param {MouseEvent} event - Browser click event.
 * @returns {void}
 *
 * Event delegation lets one listener handle
 * every dynamically generated food card.
 */
function handleMenuCartClick(event) {

    // Only process clicks originating from elements.
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(
        'button[data-action="add"]'
    );

    if (
        !button ||
        !event.currentTarget.contains(button)
    ) {
        return;
    }

    const id = Number(button.dataset.id);

    addToCart(id);
}


/* =========================================
   17. HANDLE CART BUTTON CLICKS
   ========================================= */

/**
 * Handles quantity and remove button actions.
 *
 * @param {MouseEvent} event - Browser click event.
 * @returns {void}
 */
function handleCartAction(event) {

    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(
        "button[data-action]"
    );

    if (
        !button ||
        !event.currentTarget.contains(button)
    ) {
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


/* =========================================
   18. INITIALIZE SHOPPING CART
   ========================================= */

/**
 * Connects cart buttons to their functions.
 *
 * @returns {void}
 *
 * Runs once when the website loads.
 */
function initializeCart() {

    const menuGrid = document.getElementById("menu-grid");
    const cartItems = document.getElementById("cart-items");

    const clearButton = document.getElementById("clear-cart");
    const orderButton = document.getElementById("place-order");

    // Handle Add to Cart buttons.
    if (menuGrid) {
        menuGrid.addEventListener(
            "click",
            handleMenuCartClick
        );
    }

    // Handle quantity adjustment buttons.
    if (cartItems) {
        cartItems.addEventListener(
            "click",
            handleCartAction
        );
    }

    // Handle Clear Cart button.
    if (clearButton) {
        clearButton.addEventListener(
            "click",
            clearCart
        );
    }

    // Handle Review Order button.
    if (orderButton) {
        orderButton.addEventListener(
            "click",
            reviewOrder
        );
    }

    // Display the restored or empty cart.
    renderCart();
}


/* =========================================
   19. START THE APPLICATION
   ========================================= */

/*
 * Initialization order is important:
 *
 * 1. Initialize menu search and filters.
 * 2. Restore saved shopping cart data.
 * 3. Register cart events and display cart.
 */

initializeMenu();

loadCart();

initializeCart();
