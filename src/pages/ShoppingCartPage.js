import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, formatCategoryName } from '../utils/helpers';
import './ShoppingCartPage.css';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartSubtotal,
    getCartGST,
    getCartGrandTotal,
    getItemCount 
  } = useCart();

  const subtotal = getCartSubtotal();
  const gst = getCartGST();
  const grandTotal = getCartGrandTotal();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Add some amazing products to your cart to get started!</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-header">
              <h2>Cart Items ({getItemCount()} item{getItemCount() !== 1 ? 's' : ''})</h2>
            </div>

            <div className="cart-items-list">
              {cartItems.map(item => {
                const itemPrice = parseFloat(item.price) || 0;
                const discountedPriceINR = itemPrice * 83.12 * (1 - (item.discountPercentage || 0) / 100);
                const lineTotal = discountedPriceINR * item.quantity;

                return (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <Link to={`/product/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} />
                      </Link>
                    </div>

                    <div className="item-details">
                      <Link to={`/product/${item.id}`} className="item-title">
                        {item.title}
                      </Link>
                      {item.brand && (
                        <div className="item-brand">{item.brand}</div>
                      )}
                      <div className="item-category">
                        {formatCategoryName(item.category)}
                      </div>
                      <div className="item-price">
                        {formatPrice(itemPrice)} each
                        {item.discountPercentage > 0 && (
                          <span className="original-price">
                            {formatPrice(itemPrice / (1 - item.discountPercentage / 100))}
                          </span>
                        )}
                      </div>
                      {item.discountPercentage > 0 && (
                        <div className="item-savings">
                          {Math.round(item.discountPercentage)}% off
                        </div>
                      )}
                    </div>

                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock || 10)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <div className="line-total">
                        ₹{Math.round(lineTotal).toLocaleString('en-IN')}
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary">
              <h3>Order Summary</h3>

              <div className="summary-line">
                <span>Subtotal ({getItemCount()} item{getItemCount() !== 1 ? 's' : ''})</span>
                <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-line">
                <span>GST (18%)</span>
                <span>₹{Math.round(gst).toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-line shipping">
                <span>Shipping</span>
                <span className="free-shipping">
                  {subtotal >= 999 ? 'FREE' : '₹99'}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-line total">
                <span><strong>Grand Total</strong></span>
                <span><strong>₹{Math.round(grandTotal + (subtotal >= 999 * 83.12 ? 0 : 99)).toLocaleString('en-IN')}</strong></span>
              </div>

              <div className="shipping-info">
                {subtotal < 999 && (
                  <p className="shipping-notice">
                    Add ₹{Math.round((999) - subtotal).toLocaleString('en-IN')} more for FREE shipping
                  </p>
                )}
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>

              <Link to="/" className="continue-shopping-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;