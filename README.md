NuaCart – Mini E-Commerce React App

Live Demo:

Vercel Deployment

Render Deployment

Project Overview

NuaCart is a fully functional mini e-commerce application built with React. It consumes a public e-commerce API and implements a modern single-page application (SPA) structure with routing, global state management, and responsive design.

The project includes complete shopping cart functionality, checkout flow, search and filter options, and handles loading states, errors, and edge cases effectively.

Features
Core Features

Product Listing (/)

Responsive grid layout displaying products (image, title, price).

Search by product title with debounced input.

Filter products by category.

Featured products section (bonus enhancement).

Loading and error handling with LoadingSpinner and ErrorMessage.

Product Detail (/product/:id)

Detailed product view: images, title, description, price, rating.

Add to cart with quantity selector (1–5).

Shopping Cart (/cart)

List of added items: thumbnail, title, unit price, quantity selector (1–10), subtotal.

Remove items and update quantity dynamically.

Grand total, GST calculation, and "Proceed to Checkout" button.

Checkout (/checkout)

Order summary with all items and totals.

Simple form: name, email, address with validation (email, PIN code).

Placing an order clears the cart and shows a confirmation message.

State Management

CartContext and ProductContext manage global application state.

Cart persists in localStorage.

Search, category filter, and sort functionalities implemented in the context.

Data Caching

Product lists and details cached in memory and localStorage to reduce API calls.

Bonus Enhancements

Featured products section on the homepage.

Price formatting with USD → INR conversion and discount display.

Stock status indicators (In Stock / Low Stock / Out of Stock).

Rating component with full, half, and empty stars.

Responsive mobile navigation menu with toggle.

Hosted on Vercel and Render.

Polished UI/UX with reusable components.

Project Structure
public/
    ├── favicon.ico
    ├── index.html
    └── manifest.json
src/
    ├── components/
        └── common/             # Reusable UI components
    ├── context/                # Global state (Cart & Product)
    ├── pages/                  # Individual page components
    ├── services/               # API service functions
    ├── utils/                  # Helper functions (formatting, discount, GST)
    ├── App.js                  # Main app with routing
    ├── index.js                # App entry point
    └── *.css                   # Styling files
_redirects
.gitignore
package.json
package-lock.json
README.md

Tech Stack

Frontend: React, React Router

State Management: Context API

API: Public e-commerce API (Fake Store API or similar)

Hosting: Vercel & Render

Styling: CSS modules, responsive design

Setup & Run

Clone the repository:

git clone https://github.com/your-username/nuacart.git
cd nuacart


Install dependencies:

npm install


Run the development server:

npm start


Open http://localhost:3000
 in your browser.

Design Decisions & Trade-offs

Used Context API instead of Redux for simplicity and faster setup.

Cart persisted in localStorage to maintain state across reloads.

Debounced search implemented for better performance on large datasets.

Basic checkout form validation implemented; no real payment integration.

Featured products and bonus UI enhancements added to improve UX.

Future Improvements

Implement full authentication and user profiles.

Integrate payment gateway for real checkout.

Add pagination and infinite scrolling for product lists.

Unit and integration tests for components and contexts.

![NuaCart Screenshot](https://github.com/user-attachments/assets/229bfb81-80b2-4b8b-8c4f-83c03b43d6f1)

<img width="1763" height="870" alt="image" src="https://github.com/user-attachments/assets/1e76cf1b-8943-4a1d-a273-1d9ade68220a" />
![Cart](https://github.com/user-attachments/assets/1e76cf1b-8943-4a1d-a273-1d9ade68220a)

![Cart](https://github.com/user-attachments/assets/8f0d20b1-23b7-4221-8459-30ae27c7afcc)



![Check out Screenshot](https://github.com/user-attachments/assets/d40001e8-a0c1-423b-9f43-4ba1df0029a8)

![Confirmation Page Screenshot](https://github.com/user-attachments/assets/2c96f6c7-a63e-446e-a02e-c7dd54188392)




