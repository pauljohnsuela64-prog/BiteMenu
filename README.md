
# 🍔 BiteMenu

An interactive, responsive restaurant menu and food-ordering
demo built with HTML, CSS, and vanilla JavaScript.

BiteMenu allows users to browse food items, search and filter
the menu, manage a shopping cart, and review their orders.

## 🌐 Live Website

**[Visit BiteMenu](https://pauljohnsuela64-prog.github.io/BiteMenu/)**

## ✨ Features

### Restaurant Menu
- Eight sample food items
- Burgers, pizzas, drinks, and desserts
- Food descriptions and prices in Philippine pesos
- Dynamic food cards generated using JavaScript
- Responsive desktop and mobile layouts

### Search and Filtering
- Live search by food name or description
- Category filtering
- Search and category filters work together
- Clear Filters button
- Result count and empty-state messages

### Shopping Cart
- Add products to the cart
- Increase and decrease quantities
- Remove individual products
- Clear the entire cart
- Automatic price and quantity calculations
- Simulated order summary

### Data Persistence
- Save cart contents using localStorage
- Restore cart contents after refreshing
- Validate saved food IDs and quantities
- Handle invalid or corrupted saved data

## 🛠 Technologies Used

| Technology | Purpose |
|------------|---------|
| HTML5 | Website structure |
| CSS3 | Styling and responsive design |
| JavaScript | Interactive functionality |
| localStorage | Shopping cart persistence |
| Git | Version control |
| GitHub | Source code hosting |
| GitHub Pages | Website deployment |

## 📁 Project Structure

```text
BiteMenu/
├── index.html
├── style.css
├── script.js
├── README.md
└── test/
    └── cart-tests.js
```

## 🚀 Getting Started

### Requirements

- Modern web browser
- Git
- Python 3 (for the local development server)
- VS Code (recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/pauljohnsuela64-prog/BiteMenu.git
```

2. Open the project folder:

```bash
cd BiteMenu
```

3. Start a local development server:

```bash
python -m http.server 5500
```

4. Open your browser:

```text
http://localhost:5500
```

## 🧪 Testing

BiteMenu includes browser-based JavaScript tests.

To run them:

1. Start the local development server.
2. Open the website in Chrome.
3. Press F12 and open the Sources tab.
4. Open Snippets and create a new snippet.
5. Copy the contents of `test/cart-tests.js`.
6. Run the snippet using Ctrl + Enter.
7. Review the results in the Console.

The tests cover:

- Shopping cart calculations
- Food ID lookup
- Currency formatting
- Cart persistence
- Invalid quantity handling
- Corrupted saved-data handling

## 📚 What I Learned

This project helped me practice:

- Semantic HTML elements
- CSS Flexbox and Grid
- Responsive web design
- JavaScript arrays, objects, and functions
- DOM manipulation
- Browser event handling
- Search and filtering logic
- Shopping cart state management
- localStorage and JSON
- Git and GitHub workflows
- Deployment using GitHub Pages

## ⚠️ Limitations

BiteMenu is an educational demonstration application.

- No real orders are submitted.
- No payment transactions are processed.
- No backend server or database is used.
- Shopping cart data is stored in the user's browser.
- Food items and prices are sample data.

## 👨‍💻 Developer

**Paul John A. Suela**

- GitHub: [pauljohnsuela64-prog](https://github.com/pauljohnsuela64-prog)
- Portfolio: [Personal Portfolio](https://pauljohn-portfolio.vercel.app/)

## 📌 Version

**BiteMenu v1.0.0**

Built for learning and practicing frontend web development.
