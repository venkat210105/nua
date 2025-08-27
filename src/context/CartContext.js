import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateDiscountedPrice, calculateGST } from '../utils/helpers';

// Create a context for the cart
const CartContext = createContext();

// Reducer to manage cart state actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Check if item already exists in cart
      const existingItem = state.items.find(item => item.id === action.product.id);
      if (existingItem) {
        // If exists, update quantity
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          )
        };
      }
      // If new, add item to cart
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: action.quantity }]
      };

    case 'REMOVE_FROM_CART':
      // Remove item by ID
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.productId)
      };

    case 'UPDATE_QUANTITY':
      // Remove item if quantity <= 0
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.productId)
        };
      }
      // Update item quantity
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      // Clear all items from cart
      return { ...state, items: [] };

    case 'LOAD_CART':
      // Load cart items from localStorage
      return { ...state, items: action.items || [] };

    default:
      return state;
  }
};

// Initial cart state
const initialState = { items: [] };

// CartProvider component wrapping the app
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shophub_react_cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', items: cartItems });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('shophub_react_cart', JSON.stringify(state.items));
  }, [state.items]);

  // Add item to cart with stock validation
  const addToCart = (product, quantity = 1) => {
    if (!product || quantity <= 0) return;

    const existingItem = state.items.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const totalQuantity = currentQuantity + quantity;

    if (totalQuantity > (product.stock || 0)) {
      console.warn(`Cannot add ${quantity} items. Only ${(product.stock || 0) - currentQuantity} available.`);
      return false;
    }

    dispatch({ type: 'ADD_TO_CART', product, quantity });
    return true;
  };

  // Remove item by productId
  const removeFromCart = (productId) => dispatch({ type: 'REMOVE_FROM_CART', productId });

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 0) return;
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  // Clear entire cart
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  // Calculate total cart value (INR)
  const getCartTotal = () => state.items.reduce((total, item) => {
    const priceInINR = calculateDiscountedPrice(item.price, item.discountPercentage);
    return total + (priceInINR * item.quantity);
  }, 0);

  // Total number of items in cart
  const getItemCount = () => state.items.reduce((total, item) => total + item.quantity, 0);

  // Subtotal before GST
  const getCartSubtotal = () => getCartTotal();

  // Calculate GST (default 18%)
  const getCartGST = () => calculateGST(getCartSubtotal());

  // Calculate grand total including GST
  const getCartGrandTotal = () => getCartSubtotal() + getCartGST();

  // Check if a product is already in cart
  const isInCart = (productId) => state.items.some(item => item.id === productId);

  // Get quantity of a specific cart item
  const getCartItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Context value exposing cart functions and state
  const value = {
    cartItems: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    getCartSubtotal,
    getCartGST,
    getCartGrandTotal,
    isInCart,
    getCartItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for consuming cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
