import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { validateEmail, validatePinCode, generateOrderNumber } from '../utils/helpers';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getItemCount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Store totals for order confirmation
  const [totals, setTotals] = useState({
    subtotal: 0,
    gst: 0,
    shippingCost: 0,
    finalTotal: 0
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) navigate('/cart');
  }, [cartItems.length, navigate, orderPlaced]);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName': return value.trim().length < 2 ? 'Full name must be at least 2 characters' : '';
      case 'email': return !validateEmail(value) ? 'Please enter a valid email address' : '';
      case 'phone': return !/^[6-9]\d{9}$/.test(value) ? 'Please enter a valid 10-digit mobile number' : '';
      case 'address': return value.trim().length < 10 ? 'Address must be at least 10 characters' : '';
      case 'city': return value.trim() === '' ? 'City is required' : '';
      case 'state': return value.trim() === '' ? 'State is required' : '';
      case 'pinCode': return !validatePinCode(value) ? 'PIN code must be 6 digits (first digit cannot be 0)' : '';
      default: return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === 'pinCode') {
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors = Object.keys(formData).reduce((acc, key) => {
      const error = validateField(key, formData[key]);
      if (error) acc[key] = error;
      return acc;
    }, {});
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Compute totals
  const computeTotals = (items) => {
    const itemTotals = items.map(item => {
      const priceINR = parseFloat(item.price) * 83.12 * (1 - (item.discountPercentage || 0) / 100);
      return priceINR * item.quantity;
    });
    const subtotal = itemTotals.reduce((sum, val) => sum + val, 0);
    const gst = subtotal * 0.18;
    const shippingCost = subtotal >= 999 ? 0 : 99;
    const finalTotal = subtotal + gst + shippingCost;
    return { subtotal, gst, shippingCost, finalTotal };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Calculate totals before clearing cart
      const calculatedTotals = computeTotals(cartItems);
      setTotals(calculatedTotals);

      await new Promise(resolve => setTimeout(resolve, 2500));
      const orderNum = generateOrderNumber();
      setOrderNumber(orderNum);

      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('Order processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // Use stored totals if order placed, else compute live
  const { subtotal, gst, shippingCost, finalTotal } = orderPlaced
    ? totals
    : computeTotals(cartItems);

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-confirmation">
            <div className="success-icon">✅</div>
            <h1>Order Confirmed!</h1>
            <p>Thank you for your order, {formData.fullName}!</p>

            <div className="order-details">
              <h3>Order #{orderNumber}</h3>
              <p>We'll send a confirmation email to <strong>{formData.email}</strong></p>
              <p>Your order will be shipped to:</p>
              <div className="shipping-address">
                {formData.address}<br />
                {formData.city}, {formData.state} - {formData.pinCode}
                {formData.phone && <><br />Phone: +91 {formData.phone}</>}
              </div>
              <div className="order-amount">
                <strong>Total Paid: {formatCurrency(finalTotal)}</strong>
              </div>
            </div>

            <button className="continue-shopping-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-content">
          <div className="checkout-form-section">
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={formErrors.fullName ? 'error' : ''}
                  required
                />
                {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
              </div>

              {/* Email and Phone */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={formErrors.email ? 'error' : ''}
                    required
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Mobile Number *</label>
                  <div className="phone-input-container">
                    <span className="country-code">+91</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={formErrors.phone ? 'error' : ''}
                      placeholder="9876543210"
                      maxLength="10"
                      required
                    />
                  </div>
                  {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={formErrors.address ? 'error' : ''}
                  placeholder="House/Flat No., Street Name, Area"
                  required
                />
                {formErrors.address && <span className="error-message">{formErrors.address}</span>}
              </div>

              {/* City, State, Pin */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={formErrors.city ? 'error' : ''}
                    required
                  />
                  {formErrors.city && <span className="error-message">{formErrors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={formErrors.state ? 'error' : ''}
                    required
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                  {formErrors.state && <span className="error-message">{formErrors.state}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="pinCode">PIN Code *</label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={formErrors.pinCode ? 'error' : ''}
                    placeholder="110001"
                    maxLength="6"
                    required
                  />
                  {formErrors.pinCode && <span className="error-message">{formErrors.pinCode}</span>}
                </div>
              </div>

              <button
                type="submit"
                className={`place-order-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing Order...' : `Place Order - ${formatCurrency(finalTotal)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="order-items">
                {cartItems.map((item, index) => {
                  const priceINR = parseFloat(item.price) * 83.12 * (1 - (item.discountPercentage || 0) / 100);
                  const lineTotal = priceINR * item.quantity;
                  return (
                    <div key={index} className="order-item">
                      <img src={item.thumbnail} alt={item.title} />
                      <div className="item-info">
                        <div className="item-name">{item.title}</div>
                        <div className="item-quantity">Qty: {item.quantity}</div>
                      </div>
                      <div className="item-price">{formatCurrency(lineTotal)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="order-totals">
                <div className="total-line">
                  <span>Subtotal ({getItemCount()} item{getItemCount() !== 1 ? 's' : ''})</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="total-line">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(gst)}</span>
                </div>
                <div className="total-line">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'free' : ''}>
                    {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="total-divider"></div>
                <div className="total-line final-total">
                  <span><strong>Grand Total</strong></span>
                  <span><strong>{formatCurrency(finalTotal)}</strong></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
