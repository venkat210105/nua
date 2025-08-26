import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavigationHeader from './components/common/NavigationHeader';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <NavigationHeader />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 ShopHub - React E-Commerce Application | Prices in Indian Rupees (INR)</p>
        </div>
      </footer>
    </div>
  );
}

export default App;