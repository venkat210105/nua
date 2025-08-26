import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import { useProducts } from '../context/ProductContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatCategoryName } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import ProductCard from '../components/common/ProductCard';


const HomePage = () => {
  const {
    products,
    filteredProducts,
    categories,
    loading,
    error,
    selectedCategory,
    searchQuery,
    loadProducts,
    loadCategories,
    filterByCategory,
    sortProducts,
    clearError
  } = useProducts();

  const [sortBy, setSortBy] = useState('default');
  const navigate = useNavigate();

  useEffect(() => {
    if (products.length === 0) loadProducts();
    if (categories.length === 0) loadCategories();
  }, [products.length, categories.length, loadProducts, loadCategories]);

  const handleCategoryChange = (e) => {
    clearError();
    filterByCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
    sortProducts(sortValue);
  };

  const handleClearFilters = () => {
    filterByCategory('all');
    setSortBy('default');
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading && products.length === 0) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading amazing products..." size="large" />
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="page-container">
        <ErrorMessage
          message={error}
          onRetry={() => {
            clearError();
            loadProducts();
          }}
        />
      </div>
    );
  }

  return (
    <div className="homepage">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Discover Amazing Products</h1>
          <p className="page-subtitle">
            Shop from our curated collection of premium products with prices in Indian Rupees
          </p>
          {searchQuery && (
            <div className="search-results-info">
              <p>Search results for: <strong>"{searchQuery}"</strong></p>
            </div>
          )}
        </div>

        {/* Carousel Section */}
        <div className="product-carousel-section">
          <h2 className="carousel-title">Featured Products</h2>
          {loading && products.length === 0 ? (
            <LoadingSpinner message="Loading featured products..." />
          ) : (
            <Slider {...carouselSettings}>
              {products.slice(0, 10).map(product => (
                <div 
                  key={product.id} 
                  className="carousel-item"
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={product.thumbnail} 
                    alt={product.title} 
                    className="carousel-image"
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="filters-section">
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="category-filter">Category:</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={`${category}-${index}`} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sort-filter">Sort by:</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={handleSortChange}
                className="filter-select"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
                <option value="discount">Best Discount</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            <span className="results-count">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </span>
            {selectedCategory !== 'all' && (
              <span className="active-filter">
                in {formatCategoryName(selectedCategory)}
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 && !loading ? (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>
            <h3>No products found</h3>
            <p>
              {searchQuery
                ? `No products found for "${searchQuery}". Try different keywords or browse categories.`
                : 'Try adjusting your filters to find what you\'re looking for.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button className="clear-filters-btn" onClick={handleClearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {loading && products.length > 0 && (
              <div className="loading-more">
                <LoadingSpinner size="small" message="Loading more products..." />
              </div>
            )}
          </>
        )}

        {/* Features Section */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-truck"></i></div>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over ₹999</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-undo-alt"></i></div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-lock"></i></div>
              <h3>Secure Payment</h3>
              <p>Your payment information is safe</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-indian-rupee-sign"></i></div>
              <h3>INR Pricing</h3>
              <p>All prices in Indian Rupees</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
