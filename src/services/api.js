import axios from 'axios';

// Request deduplication cache
const pendingRequests = new Map();

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000, // Increased timeout for retry scenarios
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to create request key for deduplication
const createRequestKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
};

// Retry logic with exponential backoff
const retryRequest = async (config, retryCount = 0) => {
  const maxRetries = 3;
  
  try {
    return await axios(config);
  } catch (error) {
    // Handle rate limiting (429) with retry
    if (error.response?.status === 429 && retryCount < maxRetries) {
      const retryAfter = parseInt(error.response.headers['retry-after']) || Math.pow(2, retryCount);
      const delay = Math.min(retryAfter * 1000, 30000); // Cap at 30 seconds
      
      console.warn(`Rate limited. Retrying in ${delay/1000}s (attempt ${retryCount + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(config, retryCount + 1);
    }
    
    // Handle temporary server errors (5xx) with retry
    if (error.response?.status >= 500 && retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      
      console.warn(`Server error. Retrying in ${delay/1000}s (attempt ${retryCount + 1}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(config, retryCount + 1);
    }
    
    throw error;
  }
};

// Request interceptor with deduplication
api.interceptors.request.use(
  (config) => {
    const requestKey = createRequestKey(config);
    
    // Check if identical request is already pending
    if (pendingRequests.has(requestKey)) {
      console.log(`Deduplicating request: ${config.method?.toUpperCase()} ${config.url}`);
      return pendingRequests.get(requestKey).then(() => config);
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    const requestKey = createRequestKey(response.config);
    pendingRequests.delete(requestKey); // Clean up pending request
    
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const requestKey = createRequestKey(error.config || {});
    pendingRequests.delete(requestKey); // Clean up pending request
    
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle rate limiting and server errors with retry
    if (error.response?.status === 429 || error.response?.status >= 500) {
      try {
        console.log('Attempting retry with exponential backoff...');
        const retryResponse = await retryRequest(error.config);
        return retryResponse;
      } catch (retryError) {
        console.error('All retry attempts failed:', retryError.response?.data || retryError.message);
        return Promise.reject(retryError);
      }
    }
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized access - may need to re-authenticate');
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API wrapper with request deduplication
const enhancedApi = {
  async get(url, config = {}) {
    const requestKey = createRequestKey({ method: 'get', url, ...config });
    
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }
    
    const promise = api.get(url, config);
    pendingRequests.set(requestKey, promise);
    
    try {
      const result = await promise;
      return result;
    } finally {
      pendingRequests.delete(requestKey);
    }
  },
  
  async post(url, data, config = {}) {
    return api.post(url, data, config);
  },
  
  async put(url, data, config = {}) {
    return api.put(url, data, config);
  },
  
  async delete(url, config = {}) {
    return api.delete(url, config);
  }
};

export default enhancedApi;