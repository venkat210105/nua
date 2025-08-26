import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>
);