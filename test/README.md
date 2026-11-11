
# BiteMenu 🍔

BiteMenu is an interactive, responsive restaurant
menu and food-ordering demo built using HTML,
CSS, and vanilla JavaScript.

It demonstrates frontend web development,
DOM manipulation, data filtering, shopping cart
management, and browser-based data persistence.

## Features

- Responsive desktop and mobile design
- Dynamic food cards
- Eight sample menu items
- Search food by name or description
- Filter by food category
- Add food to shopping cart
- Increase and decrease quantities
- Remove items or clear the cart
- Calculate totals in Philippine pesos
- Save cart using localStorage
- Restore cart after refreshing
- Simulated order summary
- Automated JavaScript functional tests

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Git
- GitHub
- GitHub Pages

## Project Structure

BiteMenu/
├── index.html
├── style.css
├── script.js
├── README.md
└── tests/
    └── cart-tests.js

## Running Locally

1. Clone the repository.
2. Open the project folder in VS Code.
3. Open a terminal in the project folder.
4. Run:

   python -m http.server 5500

5. Visit http://localhost:5500

## Testing

1. Start the local HTTP server.
2. Open the website in Chrome.
3. Press F12 and open Console.
4. Execute:

   const s = document.createElement("script");
   s.src = "tests/cart-tests.js";
   document.body.append(s);

5. Review the PASS/FAIL results.

## How the Shopping Cart Works

Each product has a unique numeric ID.

The application uses a JavaScript Map to store
product IDs and quantities.

When a visitor modifies the cart, the application
updates the cart interface and saves its contents
to the browser's localStorage.

Prices are calculated from the current menu data.

## Limitations

- This is a demonstration application.
- No real orders are submitted.
- No real payments are processed.
- Cart data is stored only in the visitor's browser.
- There is no backend or database.

## Author

Paul John A. Suela

## Version

1.0.0
