import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Global CSS
import './index.css';

// Root App component
import App from './App';

// Context providers for state management
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

// Create the root React DOM node
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    {/* BrowserRouter enables routing throughout the app */}
    <BrowserRouter>
      {/* ProductProvider provides product-related state and actions */}
      <ProductProvider>
        {/* CartProvider provides cart-related state and actions */}
        <CartProvider>
          {/* Main App component */}
          <App />
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>
);
