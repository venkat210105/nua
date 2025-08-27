import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import StarRating from './StarRating';
import { 
  formatPrice, 
  calculateDiscountedPrice, 
  getStockStatus, 
  formatCategoryName 
} from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart(); // Access cart context functions

  // Calculate prices in INR
  const discountedPriceINR = calculateDiscountedPrice(product.price, product.discountPercentage);
  const originalPriceINR = calculateDiscountedPrice(product.price, 0);

  // Determine stock status for badge display
  const stockStatus = getStockStatus(product.stock || 0);

  // Check if product is already in cart
  const inCart = isInCart(product.id);

  // Handler to add product to cart
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Prevent parent click handlers
    if (product.stock > 0 && !inCart) {
      const success = addToCart(product, 1); // Add one quantity
      if (!success) {
        console.warn('Failed to add item to cart - stock limit reached');
      }
    }
  };

  return (
    <div className="product-card">
      {/* Clicking on product navigates to product detail page */}
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.thumbnail || '/placeholder-image.jpg'} // Fallback image
            alt={product.title || 'Product'}
            className="product-image"
            loading="lazy" // Lazy loading for performance
          />
          {/* Discount badge if applicable */}
          {product.discountPercentage > 0 && (
            <div className="discount-badge">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}
          {/* Stock status badge */}
          <div className={`stock-badge ${stockStatus.class}`}>
            {stockStatus.text}
          </div>
        </div>

        <div className="product-info">
          {/* Display brand if available */}
          {product.brand && (
            <div className="product-brand">{product.brand}</div>
          )}

          {/* Product title */}
          <h3 className="product-title">{product.title || 'Untitled Product'}</h3>

          {/* Category name formatted */}
          <div className="product-category">
            {formatCategoryName(product.category)}
          </div>

          {/* Star rating component */}
          <div className="product-rating">
            <StarRating rating={product.rating || 0} />
            <span className="rating-text">({(product.rating || 0).toFixed(1)})</span>
          </div>

          {/* Price section */}
          <div className="product-pricing">
            <div className="price-container">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.discountPercentage > 0 && (
                <span className="original-price">
                  {formatPrice(product.price / (1 - product.discountPercentage / 100))}
                </span>
              )}
            </div>
            {product.discountPercentage > 0 && (
              <span className="savings">
                Save {formatPrice((originalPriceINR - discountedPriceINR) / 83.12)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons */}
      <div className="product-actions">
        <button
          className={`add-to-cart-btn ${inCart ? 'in-cart' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0 || inCart} // Disable if out of stock or already in cart
        >
          {!product.stock || product.stock === 0 
            ? 'Out of Stock' 
            : inCart 
            ? 'In Cart' 
            : 'Add to Cart'
          }
        </button>
        <Link to={`/product/${product.id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
