// Utility functions for the React e-commerce app

// Currency conversion rate (updated as of August 2025)
const USD_TO_INR = 83.12;

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

export const formatCategoryName = (category) => {
  // Robust category name formatting with type checking
  if (!category || typeof category !== 'string') {
    return 'Uncategorized';
  }

  try {
    // Handle categories like "mens-shoes", "womens-bags", etc.
    return category
      .split('-')
      .map(word => {
        // Special handling for common prefixes
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

export const calculateDiscountedPrice = (priceInUSD, discountPercentage) => {
  const numPrice = parseFloat(priceInUSD) || 0;
  const numDiscount = parseFloat(discountPercentage) || 0;
  const priceInINR = numPrice * USD_TO_INR;

  return numDiscount > 0
    ? priceInINR * (1 - numDiscount / 100)
    : priceInINR;
};

export const getStockStatus = (stock) => {
  const numStock = parseInt(stock) || 0;

  if (numStock === 0) return { class: 'out-of-stock', text: 'Out of Stock' };
  if (numStock <= 10) return { class: 'low-stock', text: 'Low Stock' };
  return { class: 'in-stock', text: 'In Stock' };
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePinCode = (pinCode) => {
  if (!pinCode || typeof pinCode !== 'string') return false;
  // Indian PIN codes are exactly 6 digits, first digit can't be 0
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pinCode);
};

export const generateOrderNumber = () => {
  return 'SH' + Date.now().toString().slice(-8);
};

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

export const isValidNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const sanitizeString = (str, fallback = '') => {
  return (str && typeof str === 'string') ? str : fallback;
};

// Category-specific utilities
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

// Utility to get current exchange rate
export const getCurrentExchangeRate = () => {
  return USD_TO_INR;
};

// Utility to format price with original USD value shown
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

// Format Indian phone number
export const formatIndianPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Check if it's a valid Indian mobile number (10 digits starting with 6-9)
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  }

  return phone; // Return original if not valid
};

// Calculate tax for Indian context (18% GST)
export const calculateGST = (amount, gstRate = 0.18) => {
  const numAmount = parseFloat(amount) || 0;
  return numAmount * gstRate;
};

// Format address for Indian context
export const formatIndianAddress = (address) => {
  if (!address) return '';
  const { street, city, state, pinCode } = address;
  return [street, city, state, pinCode].filter(Boolean).join(', ');
};