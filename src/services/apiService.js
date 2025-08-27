// Base URL for the DummyJSON API
const API_BASE_URL = 'https://dummyjson.com';

// Default cache expiry time: 30 minutes
const CACHE_EXPIRY = 30 * 60 * 1000;

class ApiService {
  constructor() {
    // In-memory cache using a Map
    this.cache = new Map();
  }

  /**
   * Fetch data from API with caching and retry mechanism
   * @param {string} url - API endpoint
   * @param {string} cacheKey - Key used for caching
   * @param {number} expiry - Cache expiry time in milliseconds
   * @returns {Promise<any>} - Returns fetched data
   */
  async fetchWithCache(url, cacheKey, expiry = CACHE_EXPIRY) {
    // 1. Check memory cache first
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      // If cache is still valid, return cached data
      if (Date.now() - timestamp < expiry) {
        console.log(`Using cached data for ${cacheKey}`);
        return data;
      }
      // Cache expired, remove it
      this.cache.delete(cacheKey);
    }

    // 2. Check localStorage cache
    try {
      const cached = localStorage.getItem(`shophub_cache_${cacheKey}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < expiry) {
          console.log(`Using localStorage cache for ${cacheKey}`);
          // Store in memory cache as well for faster subsequent access
          this.cache.set(cacheKey, { data, timestamp });
          return data;
        }
        // Remove expired localStorage cache
        localStorage.removeItem(`shophub_cache_${cacheKey}`);
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    // 3. Fetch from API with retry logic
    let lastError;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Fetching from API: ${url} (attempt ${attempt}/${maxRetries})`);

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // If response is not OK, throw an error
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Parse response JSON
        const data = await response.json();
        const timestamp = Date.now();

        // Cache the data in memory and localStorage
        this.cache.set(cacheKey, { data, timestamp });
        try {
          localStorage.setItem(`shophub_cache_${cacheKey}`, JSON.stringify({ data, timestamp }));
        } catch (error) {
          console.warn('Cache write error:', error);
        }

        return data; // Return the fetched data
      } catch (error) {
        console.error(`API fetch attempt ${attempt} failed:`, error);
        lastError = error;

        // Wait before retry using exponential backoff
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    // All attempts failed, throw error
    throw new Error(`Failed to load data after ${maxRetries} attempts: ${lastError.message}`);
  }
}

// Singleton instance of ApiService
const apiService = new ApiService();

/**
 * Fetch a list of products with selected fields
 * @param {number} limit - Number of products to fetch
 */
export const fetchProducts = async (limit = 50) => {
  const url = `${API_BASE_URL}/products?limit=${limit}&select=id,title,price,thumbnail,category,rating,stock,discountPercentage,brand`;
  return apiService.fetchWithCache(url, 'products');
};

/**
 * Fetch details of a single product by ID
 * @param {number|string} id - Product ID
 */
export const fetchProductById = async (id) => {
  const url = `${API_BASE_URL}/products/${id}`;
  return apiService.fetchWithCache(url, `product_${id}`);
};

/**
 * Fetch all product categories
 * Cache expiry: 24 hours
 */
export const fetchCategories = async () => {
  const url = `${API_BASE_URL}/products/category-list`;
  return apiService.fetchWithCache(url, 'categories', 24 * 60 * 60 * 1000); // 24 hours
};

/**
 * Search products by query string
 * Cache expiry: 15 minutes
 * @param {string} query - Search query
 * @param {number} limit - Max results
 */
export const searchProducts = async (query, limit = 30) => {
  const url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  return apiService.fetchWithCache(url, `search_${query}`, 15 * 60 * 1000);
};

/**
 * Fetch products filtered by category
 * @param {string} category - Category name
 * @param {number} limit - Number of products
 */
export const fetchProductsByCategory = async (category, limit = 30) => {
  const url = `${API_BASE_URL}/products/category/${category}?limit=${limit}`;
  return apiService.fetchWithCache(url, `category_${category}`);
};
