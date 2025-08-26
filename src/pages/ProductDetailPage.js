import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import StarRating from '../components/common/StarRating';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatPrice, calculateDiscountedPrice, getStockStatus, formatCategoryName } from '../utils/helpers';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, loading, error, loadProductById } = useProducts();
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProductById(id);
  }, [id, loadProductById]);

  useEffect(() => {
    if (currentProduct) {
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [currentProduct]);

  const handleAddToCart = async () => {
    if (!currentProduct || currentProduct.stock === 0) return;

    setAddingToCart(true);
    try {
      const success = addToCart(currentProduct, quantity);
      if (success) {
        // Show success feedback
        setTimeout(() => {
          setAddingToCart(false);
        }, 1000);
      } else {
        setAddingToCart(false);
        alert('Cannot add more items. Stock limit reached.');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner message="Loading product details..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage 
          message={error}
          onRetry={() => loadProductById(id)}
        />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="page-container">
        <ErrorMessage 
          title="Product Not Found"
          message="The product you're looking for doesn't exist or may have been removed."
          onRetry={() => navigate('/')}
        />
      </div>
    );
  }

  const discountedPriceINR = calculateDiscountedPrice(currentProduct.price, currentProduct.discountPercentage);
  const originalPriceINR = calculateDiscountedPrice(currentProduct.price, 0);
  const stockStatus = getStockStatus(currentProduct.stock);
  const images = currentProduct.images || [currentProduct.thumbnail];
  const inCart = isInCart(currentProduct.id);
  const cartQuantity = getCartItemQuantity(currentProduct.id);

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{formatCategoryName(currentProduct.category)}</span>
          <span>/</span>
          <span>{currentProduct.title}</span>
        </nav>

        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image-container">
              <img 
                src={images[selectedImage]} 
                alt={currentProduct.title}
                className="main-image"
              />
              {currentProduct.discountPercentage > 0 && (
                <div className="discount-badge">
                  -{Math.round(currentProduct.discountPercentage)}%
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${currentProduct.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            {currentProduct.brand && (
              <div className="product-brand">{currentProduct.brand}</div>
            )}

            <h1 className="product-title">{currentProduct.title}</h1>

            <div className="product-rating">
              <StarRating rating={currentProduct.rating} size="large" />
              <span className="rating-text">
                {(currentProduct.rating || 0).toFixed(1)} out of 5 stars
              </span>
            </div>

            <div className="product-pricing">
              <div className="price-container">
                <span className="current-price">{formatPrice(currentProduct.price)}</span>
                {currentProduct.discountPercentage > 0 && (
                  <span className="original-price">
                    {formatPrice(currentProduct.price / (1 - currentProduct.discountPercentage / 100))}
                  </span>
                )}
              </div>
              {currentProduct.discountPercentage > 0 && (
                <div className="savings-info">
                  You save {formatPrice((originalPriceINR - discountedPriceINR) / 83.12)} ({Math.round(currentProduct.discountPercentage)}% off)
                </div>
              )}
            </div>

            <div className={`stock-status ${stockStatus.class}`}>
              {stockStatus.text}
              {currentProduct.stock > 0 && currentProduct.stock <= 10 && (
                <span> - Only {currentProduct.stock} left!</span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{currentProduct.description}</p>
            </div>

            <div className="product-details">
              <h3>Product Details</h3>
              <div className="details-grid">
                {currentProduct.sku && (
                  <div className="detail-item">
                    <strong>SKU:</strong> <span>{currentProduct.sku}</span>
                  </div>
                )}
                <div className="detail-item">
                  <strong>Category:</strong> <span>{formatCategoryName(currentProduct.category)}</span>
                </div>
                {currentProduct.weight && (
                  <div className="detail-item">
                    <strong>Weight:</strong> <span>{currentProduct.weight} lbs</span>
                  </div>
                )}
                {currentProduct.warrantyInformation && (
                  <div className="detail-item">
                    <strong>Warranty:</strong> <span>{currentProduct.warrantyInformation}</span>
                  </div>
                )}
                {currentProduct.shippingInformation && (
                  <div className="detail-item">
                    <strong>Shipping:</strong> <span>{currentProduct.shippingInformation}</span>
                  </div>
                )}
                {currentProduct.returnPolicy && (
                  <div className="detail-item">
                    <strong>Returns:</strong> <span>{currentProduct.returnPolicy}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="purchase-section">
              {!inCart && currentProduct.stock > 0 && (
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    disabled={currentProduct.stock === 0}
                  >
                    {Array.from({length: Math.min(currentProduct.stock, 10)}, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                className={`add-to-cart-btn ${addingToCart ? 'adding' : ''} ${inCart ? 'in-cart' : ''}`}
                onClick={handleAddToCart}
                disabled={currentProduct.stock === 0 || addingToCart || inCart}
              >
                {addingToCart ? 'Adding...' : 
                 currentProduct.stock === 0 ? 'Out of Stock' : 
                 inCart ? `In Cart (${cartQuantity})` :
                 'Add to Cart'}
              </button>

              {inCart && (
                <Link to="/cart" className="view-cart-btn">
                  View Cart
                </Link>
              )}
            </div>

            {/* Customer Reviews */}
            {currentProduct.reviews && currentProduct.reviews.length > 0 && (
              <div className="product-reviews">
                <h3>Customer Reviews</h3>
                <div className="reviews-list">
                  {currentProduct.reviews.slice(0, 3).map((review, index) => (
                    <div key={index} className="review-item">
                      <div className="review-header">
                        <StarRating rating={review.rating} />
                        <span className="reviewer-name">{review.reviewerName}</span>
                        <span className="review-date">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;