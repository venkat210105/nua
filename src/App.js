import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Common navigation header component
import NavigationHeader from './components/common/NavigationHeader';

// Page components for routing
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';

import './App.css';

function App() {
  return (
    <div className="App">
      {/* Site-wide navigation header */}
      <NavigationHeader />

      {/* Main content area where routes are rendered */}
      <main className="main-content">
        <Routes>
          {/* Home page route */}
          <Route path="/" element={<HomePage />} />

          {/* Product detail page route with dynamic product ID */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Shopping cart page */}
          <Route path="/cart" element={<ShoppingCartPage />} />

          {/* Checkout page */}
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>

      {/* Footer for the application */}
      <footer className="app-footer">
        <div className="container">
          <p>
            &copy; nuacart Your E-Commerce Application | Prices in Indian Rupees (INR)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
