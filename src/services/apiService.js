const API_BASE_URL = 'https://dummyjson.com';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

class ApiService {
  constructor() {
    this.cache = new Map();
  }

  async fetchWithCache(url, cacheKey, expiry = CACHE_EXPIRY) {
    // Check memory cache first
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < expiry) {
        console.log(`Using cached data for ${cacheKey}`);
        return data;
      }
      this.cache.delete(cacheKey);
    }

    // Check localStorage cache
    try {
      const cached = localStorage.getItem(`shophub_cache_${cacheKey}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < expiry) {
          console.log(`Using localStorage cache for ${cacheKey}`);
          this.cache.set(cacheKey, { data, timestamp });
          return data;
        }
        localStorage.removeItem(`shophub_cache_${cacheKey}`);
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    // Fetch from API with retry logic
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

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const timestamp = Date.now();

        // Cache in memory and localStorage
        this.cache.set(cacheKey, { data, timestamp });
        try {
          localStorage.setItem(`shophub_cache_${cacheKey}`, JSON.stringify({ data, timestamp }));
        } catch (error) {
          console.warn('Cache write error:', error);
        }

        return data;
      } catch (error) {
        console.error(`API fetch attempt ${attempt} failed:`, error);
        lastError = error;

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw new Error(`Failed to load data after ${maxRetries} attempts: ${lastError.message}`);
  }
}

const apiService = new ApiService();

export const fetchProducts = async (limit = 50) => {
  const url = `${API_BASE_URL}/products?limit=${limit}&select=id,title,price,thumbnail,category,rating,stock,discountPercentage,brand`;
  return apiService.fetchWithCache(url, 'products');
};

export const fetchProductById = async (id) => {
  const url = `${API_BASE_URL}/products/${id}`;
  return apiService.fetchWithCache(url, `product_${id}`);
};

export const fetchCategories = async () => {
  // FIXED: Use category-list endpoint which returns simple string array
  const url = `${API_BASE_URL}/products/category-list`;
  return apiService.fetchWithCache(url, 'categories', 24 * 60 * 60 * 1000); // 24 hours
};

export const searchProducts = async (query, limit = 30) => {
  const url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  return apiService.fetchWithCache(url, `search_${query}`, 15 * 60 * 1000); // 15 minutes
};

export const fetchProductsByCategory = async (category, limit = 30) => {
  const url = `${API_BASE_URL}/products/category/${category}?limit=${limit}`;
  return apiService.fetchWithCache(url, `category_${category}`);
};