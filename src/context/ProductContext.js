import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { fetchProducts, fetchProductById, fetchCategories, fetchProductsByCategory } from '../services/apiService';

// Create context for products
const ProductContext = createContext();

// Reducer to manage product-related state
const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'SET_PRODUCTS':
      return { 
        ...state, 
        products: action.payload || [], 
        filteredProducts: action.payload || [], 
        loading: false, 
        error: null 
      };

    case 'SET_FILTERED_PRODUCTS':
      return { ...state, filteredProducts: action.payload || [] };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload || [] };

    case 'SET_CURRENT_PRODUCT':
      return { ...state, currentProduct: action.payload, loading: false };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };

    default:
      return state;
  }
};

// Initial state for product context
const initialState = {
  products: [],
  filteredProducts: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all'
};

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Load all products
  const loadProducts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await fetchProducts();
      const products = data?.products || [];
      dispatch({ type: 'SET_PRODUCTS', payload: products });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load products' });
    }
  }, []);

  // Load all categories
  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      const categories = Array.isArray(data) ? data : data?.categories || [];
      const validCategories = categories.filter(cat => typeof cat === 'string' && cat.trim() !== '');
      dispatch({ type: 'SET_CATEGORIES', payload: validCategories });
    } catch (error) {
      // Provide fallback categories if API fails
      const fallbackCategories = [
        'beauty', 'fragrances', 'furniture', 'groceries', 'home-decoration',
        'kitchen-accessories', 'laptops', 'mens-shirts', 'mens-shoes', 
        'mens-watches', 'mobile-accessories', 'motorcycle', 'skin-care',
        'smartphones', 'sports-accessories', 'sunglasses', 'tablets',
        'tops', 'vehicle', 'womens-bags', 'womens-dresses', 
        'womens-jewellery', 'womens-shoes', 'womens-watches'
      ];
      dispatch({ type: 'SET_CATEGORIES', payload: fallbackCategories });
    }
  }, []);

  // Load single product by ID
  const loadProductById = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const product = await fetchProductById(id);
      dispatch({ type: 'SET_CURRENT_PRODUCT', payload: product });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Product not found' });
    }
  }, []);

  // Filter products by category
  const filterByCategory = useCallback(async (category) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      if (!category || category === 'all') {
        dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: state.products });
      } else {
        const data = await fetchProductsByCategory(category);
        const productsInCategory = data?.products || [];
        dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: productsInCategory });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load category products' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.products]);

  // Search products by title and optionally filter by category
  const searchProducts = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    let filtered = [...state.products];

    if (query && query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(lowerQuery));
    }

    if (state.selectedCategory && state.selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === state.selectedCategory);
    }

    dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered });
  }, [state.products, state.selectedCategory]);

  // Sort filtered products
  const sortProducts = useCallback((sortBy) => {
    const sorted = [...(state.filteredProducts || [])];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name':
        sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'discount':
        sorted.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      default:
        break;
    }

    dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: sorted });
  }, [state.filteredProducts]);

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  // Expose state and actions
  const value = {
    ...state,
    loadProducts,
    loadCategories,
    loadProductById,
    searchProducts,
    filterByCategory,
    sortProducts,
    clearError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to consume product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
