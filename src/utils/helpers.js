// Utility functions for the React e-commerce app

// Conversion rate from USD to INR (updated August 2025)
const USD_TO_INR = 83.12;

/**
 * Debounce function: limits how often a function can run
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Convert price in USD to INR and format it
 * @param {number|string} priceInUSD
 */
export const formatPrice = (priceInUSD) => {
  const numPrice = parseFloat(priceInUSD) || 0;
  const priceInINR = numPrice * USD_TO_INR;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceInINR);
};

/**
 * Format category names to a readable string
 * e.g., "mens-shoes" → "Men's Shoes"
 * @param {string} category
 */
export const formatCategoryName = (category) => {
  if (!category || typeof category !== 'string') return 'Uncategorized';

  try {
    return category
      .split('-')
      .map(word => {
        if (word === 'mens') return "Men's";
        if (word === 'womens') return "Women's";
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  } catch (error) {
    console.warn('Error formatting category name:', error);
    return 'Uncategorized';
  }
};

/**
 * Calculate discounted price in INR
 * @param {number} priceInUSD
 * @param {number} discountPercentage
 */
export const calculateDiscountedPrice = (priceInUSD, discountPercentage) => {
  const numPrice = parseFloat(priceInUSD) || 0;
  const numDiscount = parseFloat(discountPercentage) || 0;
  const priceInINR = numPrice * USD_TO_INR;

  return numDiscount > 0
    ? priceInINR * (1 - numDiscount / 100)
    : priceInINR;
};

/**
 * Get stock status based on quantity
 * @param {number} stock
 */
export const getStockStatus = (stock) => {
  const numStock = parseInt(stock) || 0;

  if (numStock === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
  if (numStock <= 10) return { class: 'low-stock', text: 'Low Stock' };
  return { class: 'in-stock', text: 'In Stock' };
};

/**
 * Validate email address
 * @param {string} email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate Indian PIN code (6 digits, first digit != 0)
 * @param {string} pinCode
 */
export const validatePinCode = (pinCode) => {
  if (!pinCode || typeof pinCode !== 'string') return false;
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pinCode);
};

/**
 * Generate unique order number (last 8 digits of timestamp)
 */
export const generateOrderNumber = () => {
  return 'SH' + Date.now().toString().slice(-8);
};

/**
 * Safely access nested object property
 * @param {Object} obj
 * @param {string} path - e.g., "user.address.city"
 * @param {any} defaultValue
 */
export const safelyAccessProperty = (obj, path, defaultValue = null) => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  } catch (error) {
    console.warn('Error accessing property:', error);
    return defaultValue;
  }
};

/**
 * Check if value is a valid number
 */
export const isValidNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Sanitize a string value, fallback if invalid
 */
export const sanitizeString = (str, fallback = '') => {
  return (str && typeof str === 'string') ? str : fallback;
};

/**
 * Map category code to display name
 * Fallback to formatCategoryName if unknown
 */
export const getCategoryDisplayName = (category) => {
  const categoryMap = {
    'beauty': 'Beauty',
    'fragrances': 'Fragrances',
    'furniture': 'Furniture',
    'groceries': 'Groceries',
    'home-decoration': 'Home Decoration',
    'kitchen-accessories': 'Kitchen Accessories',
    'laptops': 'Laptops',
    'mens-shirts': "Men's Shirts",
    'mens-shoes': "Men's Shoes",
    'mens-watches': "Men's Watches",
    'mobile-accessories': 'Mobile Accessories',
    'motorcycle': 'Motorcycle',
    'skin-care': 'Skin Care',
    'smartphones': 'Smartphones',
    'sports-accessories': 'Sports Accessories',
    'sunglasses': 'Sunglasses',
    'tablets': 'Tablets',
    'tops': 'Tops',
    'vehicle': 'Vehicle',
    'womens-bags': "Women's Bags",
    'womens-dresses': "Women's Dresses",
    'womens-jewellery': "Women's Jewellery",
    'womens-shoes': "Women's Shoes",
    'womens-watches': "Women's Watches"
  };

  return categoryMap[category] || formatCategoryName(category);
};

/**
 * Get current USD to INR exchange rate
 */
export const getCurrentExchangeRate = () => {
  return USD_TO_INR;
};

/**
 * Format price with both INR and USD
 */
export const formatPriceWithUSD = (priceInUSD) => {
  const numPrice = parseFloat(priceInUSD) || 0;
  const priceInINR = numPrice * USD_TO_INR;
  const formattedINR = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceInINR);

  const formattedUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(numPrice);

  return `${formattedINR} (${formattedUSD})`;
};

/**
 * Format Indian mobile number: +91 XXXXX XXXXX
 */
export const formatIndianPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  }
  return phone;
};

/**
 * Calculate GST for a given amount (default 18%)
 */
export const calculateGST = (amount, gstRate = 0.18) => {
  const numAmount = parseFloat(amount) || 0;
  return numAmount * gstRate;
};

/**
 * Format Indian address object into a single string
 */
export const formatIndianAddress = (address) => {
  if (!address) return '';
  const { street, city, state, pinCode } = address;
  return [street, city, state, pinCode].filter(Boolean).join(', ');
};
