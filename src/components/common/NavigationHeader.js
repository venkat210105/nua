import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
import { debounce } from '../../utils/helpers';
import './NavigationHeader.css';

const NavigationHeader = () => {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Debounced search function
  // Debounced search function
const debouncedSearch = useCallback(
  debounce(async (query) => {
    if (query.trim()) {
      setIsSearching(true);
      try {
        await searchProducts(query);
        navigate('/');
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      // Reset to all products if query is empty
      try {
        await searchProducts(''); // or fetchAllProducts() if you have that
        navigate('/');
      } catch (error) {
        console.error('Reset search failed:', error);
      }
    }
  }, 300),
  [searchProducts, navigate]
);




  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery);
      navigate('/');
      searchInputRef.current?.blur();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navigation-header')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const cartItemCount = getItemCount();

  return (
    <header className="navigation-header">
      <div className="container">
        <div className="nav-content">
          {/* Brand Logo */}
          <div className="brand-section">
            <Link to="/" className="brand-logo">
              nua cart
            </Link>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-container">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Search for products, brands, categories..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {isSearching && <div className="search-loading">Searching...</div>}
                <button type="submit" className="search-button" disabled={isSearching}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links */}
          <nav className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="cart-icon-container">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="m1 1 4 4 15 4-2 7H6"></path>
                </svg>
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </div>
              <span className="nav-text">Cart</span>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;