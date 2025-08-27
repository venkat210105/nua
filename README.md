NuaCart – Mini E-Commerce Application


GitHub Repo
A React-based mini e-commerce SPA consuming the DummyJSON API to display products, manage a shopping cart, and perform checkout. Developed as part of the SDE Developer Intern assignment with additional bonus enhancements.
________________________________________
Table of Contents
1.	Project Overview
2.	Tech Stack
3.	Functional Features
4.	Bonus Enhancements
5.	Folder Structure
6.	Setup & Run
7.	Screenshots
8.	Live Demo
9.	Future Enhancements
________________________________________
Project Overview
NuaCart is a modern single-page e-commerce application (SPA) built with React. It allows users to:
•	Browse products fetched from the DummyJSON live API.
•	Search for products and filter by category.
•	View detailed product information.
•	Add products to a shopping cart and manage quantities.
•	Checkout with a simple order form.
•	Persist cart state using localStorage.
The app emphasizes clean component hierarchy, responsive design, error handling, and efficient global state management with React Context.
________________________________________
Tech Stack
•	Frontend: React.js, React Router DOM
•	State Management: React Context API (CartContext and ProductContext)
•	Styling: CSS (modular per component)
•	API: DummyJSON API
•	Deployment: Vercel (frontend) / Render (optional backend if needed)
•	Tools: VS Code, Git, GitHub, Node.js, npm
________________________________________
Functional Features
1. Product Listing (/)
•	Displays all products in a responsive grid.
•	Each product card shows: image, title, brand, price, rating, discount badge, stock status.
•	Provides search (by product title) and category filter.
•	Handles loading states and fetch errors gracefully.
2. Product Detail (/product/:id)
•	Displays full product details: image(s), title, description, price, rating.
•	Allows Add to Cart with quantity selector (1–5).
•	Shows stock availability and discounted price.
3. Shopping Cart (/cart)
•	Lists all added items with thumbnail, title, price, quantity selector (1–10), and subtotal.
•	Allows quantity updates and item removal.
•	Displays grand total and a Proceed to Checkout button.
4. Checkout (/checkout)
•	Shows order summary with items and total.
•	Simple form to collect name, email, and address with validation.
•	Place Order clears the cart and shows confirmation.
5. State & Data Management
•	Global state with React Context (CartContext, ProductContext).
•	Caching: Products and cart are persisted in localStorage to avoid redundant fetches.
•	Error handling: Components show meaningful messages and retry options.
•	Debounced search for optimized performance.
________________________________________
Bonus Enhancements (beyond assignment)
•	Featured products section on homepage.
•	Display discount badges and stock status on product cards.
•	Show rating stars visually with half-stars.
•	Debounced live search for better UX.
•	Cart quantity limits enforced dynamically.
•	Fully responsive design for mobile and desktop.
•	Hosted on Vercel with live URL.
•	Clear, modular component structure for reusability.
•	Local caching of API responses to reduce network calls.
________________________________________
Folder Structure
public/
├── favicon.ico
├── index.html
└── manifest.json

src/
├── components/
│   └── common/
│       ├── ErrorMessage.css
│       ├── ErrorMessage.js
│       ├── LoadingSpinner.css
│       ├── LoadingSpinner.js
│       ├── NavigationHeader.css
│       ├── NavigationHeader.js
│       ├── ProductCard.css
│       ├── ProductCard.js
│       ├── StarRating.css
│       └── StarRating.js
├── context/
│   ├── CartContext.js
│   └── ProductContext.js
├── pages/
│   ├── CheckoutPage.css
│   ├── CheckoutPage.js
│   ├── HomePage.css
│   ├── HomePage.js
│   ├── ProductDetailPage.css
│   ├── ProductDetailPage.js
│   ├── ShoppingCartPage.css
│   └── ShoppingCartPage.js
├── services/
│   └── apiService.js
├── utils/
│   └── helpers.js
├── App.css
├── App.js
├── index.css
└── index.js

_redirects
.gitignore
package-lock.json
package.json
README.md
________________________________________
Setup & Run
# Clone the repository
git clone https://github.com/venkat210105/nua.git

# Navigate to project
cd nua

# Install dependencies
npm install

# Start development server
npm start
The app will run at http://localhost:3000.
________________________________________
Screenshots
Home Page – Product Listing
 
Product Detail Page
 
Shopping Cart Page
 
Checkout Page
 
Mobile Responsive View
 
________________________________________
Live Demo
•	Vercel: nua care your E-Commerce Store
https://nua-z9ys.vercel.app/
•	GitHub Repo: https://github.com/venkat210105/nua.git
________________________________________
Future Enhancements
•	Add user authentication for personalized carts.
•	Integrate payment gateway for real checkout.
•	Implement reviews and ratings for products.
•	Add wishlist feature.
•	Include pagination and advanced sorting/filtering.

