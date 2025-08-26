import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import StarRating from './StarRating';
import { formatPrice, calculateDiscountedPrice, getStockStatus, formatCategoryName } from '../../utils/helpers';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();

  const discountedPriceINR = calculateDiscountedPrice(product.price, product.discountPercentage);
  const originalPriceINR = calculateDiscountedPrice(product.price, 0);
  const stockStatus = getStockStatus(product.stock || 0);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0 && !inCart) {
      const success = addToCart(product, 1);
      if (!success) {
        console.warn('Failed to add item to cart - stock limit reached');
      }
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.thumbnail || '/placeholder-image.jpg'} 
            alt={product.title || 'Product'}
            className="product-image"
            loading="lazy"
          />
          {product.discountPercentage > 0 && (
            <div className="discount-badge">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}
          <div className={`stock-badge ${stockStatus.class}`}>
            {stockStatus.text}
          </div>
        </div>

        <div className="product-info">
          {product.brand && (
            <div className="product-brand">{product.brand}</div>
          )}

          <h3 className="product-title">{product.title || 'Untitled Product'}</h3>

          <div className="product-category">
            {formatCategoryName(product.category)}
          </div>

          <div className="product-rating">
            <StarRating rating={product.rating || 0} />
            <span className="rating-text">({(product.rating || 0).toFixed(1)})</span>
          </div>

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

      <div className="product-actions">
        <button
          className={`add-to-cart-btn ${inCart ? 'in-cart' : ''}`}
          onClick={handleAddToCart}
          disabled={!product.stock || product.stock === 0 || inCart}
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