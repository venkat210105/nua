import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateDiscountedPrice, calculateGST } from '../utils/helpers';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: action.quantity }]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.productId)
      };

    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.productId)
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.items || []
      };

    default:
      return state;
  }
};

const initialState = {
  items: []
};

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

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shophub_react_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    if (!product || quantity <= 0) return;

    // Check stock availability
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

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 0) return;
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const priceInINR = calculateDiscountedPrice(item.price, item.discountPercentage);
      return total + (priceInINR * item.quantity);
    }, 0);
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return getCartTotal();
  };

  const getCartGST = () => {
    const subtotal = getCartSubtotal();
    return calculateGST(subtotal);
  };

  const getCartGrandTotal = () => {
    const subtotal = getCartSubtotal();
    const gst = getCartGST();
    return subtotal + gst;
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  const getCartItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};