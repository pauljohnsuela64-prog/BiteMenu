
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
function renderMenu(items) {

    // Find the menu container in index.html.
    const menuGrid = document.getElementById("menu-grid");

    // Stop if the container does not exist.
    if (!menuGrid) {
        console.error("BiteMenu: Menu grid was not found.");
        return;
    }

    // Clear any existing food cards.
    menuGrid.replaceChildren();

    // Create a document fragment for the new cards.
    const fragment = document.createDocumentFragment();

    // Loop through each food item.
    items.forEach(function (item) {

        // Create a card from the food information.
        const card = createFoodCard(item);

        // Add the card to the fragment.
        fragment.append(card);
    });

    // Insert all cards into the menu at once.
    menuGrid.append(fragment);
}


/* =========================================
   5. INITIALIZE THE APPLICATION
   ========================================= */

// Display all food items when the page loads.
renderMenu(menuItems);
