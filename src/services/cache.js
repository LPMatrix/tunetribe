// Use localStorage for persistent caching across page refreshes
const CACHE_PREFIX = 'tunetribe_cache_';

const set = (key, value, ttl = 60000) => {
  const expires = Date.now() + ttl;
  const cacheData = { value, expires };
  
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to set cache in localStorage:', error);
    // Fallback to in-memory cache if localStorage fails
    if (!window._tuneTribeMemoryCache) {
      window._tuneTribeMemoryCache = new Map();
    }
    window._tuneTribeMemoryCache.set(key, cacheData);
  }
};

const get = (key) => {
  let cached = null;
  
  try {
    const stored = localStorage.getItem(CACHE_PREFIX + key);
    if (stored) {
      cached = JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to get cache from localStorage:', error);
    // Fallback to in-memory cache
    if (window._tuneTribeMemoryCache) {
      cached = window._tuneTribeMemoryCache.get(key);
    }
  }
  
  if (!cached) {
    return null;
  }

  if (Date.now() > cached.expires) {
    del(key); // Clean up expired cache
    return null;
  }

  return cached.value;
};

const del = (key) => {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.warn('Failed to delete cache from localStorage:', error);
  }
  
  // Also remove from memory cache if it exists
  if (window._tuneTribeMemoryCache) {
    window._tuneTribeMemoryCache.delete(key);
  }
};

const clear = () => {
  try {
    // Clear all TuneTribe cache entries from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear cache from localStorage:', error);
  }
  
  // Also clear memory cache if it exists
  if (window._tuneTribeMemoryCache) {
    window._tuneTribeMemoryCache.clear();
  }
};

export default {
  set,
  get,
  del,
  clear,
};