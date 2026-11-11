
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
    content.append(category, title, description, price);

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

