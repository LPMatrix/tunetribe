// Use localStorage for persistent caching across page refreshes
const CACHE_PREFIX = 'tunetribe_cache_';
const MAX_CACHE_SIZE = 100; // Maximum number of cached items
const CACHE_VERSION = '1.0'; // For cache invalidation on updates

// Environment-specific cache TTL configurations
const getCacheTTL = (dataType) => {
  const isProduction = import.meta.env.PROD;
  const baseTTL = {
    playlists: isProduction ? 300000 : 60000,    // 5min prod, 1min dev
    tracks: isProduction ? 600000 : 120000,      // 10min prod, 2min dev
    auth: 60000,                                 // Always 60 seconds
    search: isProduction ? 180000 : 60000,      // 3min prod, 1min dev
    user: isProduction ? 600000 : 300000        // 10min prod, 5min dev
  };
  return baseTTL[dataType] || 60000;
};

// Cache analytics for monitoring
const cacheStats = {
  hits: 0,
  misses: 0,
  sets: 0,
  deletes: 0
};

// Cleanup old entries to prevent localStorage from growing too large
const cleanupOldEntries = () => {
  try {
    const keys = Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX))
      .map(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          return { key, expires: data.expires || 0 };
        } catch {
          return { key, expires: 0 }; // Invalid entries get lowest priority
        }
      })
      .sort((a, b) => a.expires - b.expires);
      
    if (keys.length > MAX_CACHE_SIZE) {
      const toRemove = keys.slice(0, keys.length - MAX_CACHE_SIZE);
      toRemove.forEach(item => {
        localStorage.removeItem(item.key);
        cacheStats.deletes++;
      });
      console.log(`Cache cleanup: removed ${toRemove.length} old entries`);
    }
  } catch (error) {
    console.warn('Cache cleanup failed:', error);
  }
};

const set = (key, value, ttl, dataType = 'default') => {
  // Use smart TTL if not provided
  const finalTTL = ttl || getCacheTTL(dataType);
  const expires = Date.now() + finalTTL;
  const cacheData = { value, expires, version: CACHE_VERSION, dataType };
  
  try {
    // Cleanup before adding new entries
    if (Math.random() < 0.1) { // 10% chance to trigger cleanup
      cleanupOldEntries();
    }
    
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    cacheStats.sets++;
  } catch (error) {
    console.warn('Failed to set cache in localStorage:', error);
    // Fallback to in-memory cache if localStorage fails
    if (!window._tuneTribeMemoryCache) {
      window._tuneTribeMemoryCache = new Map();
    }
    window._tuneTribeMemoryCache.set(key, cacheData);
    cacheStats.sets++;
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
  
  if (cached) {
    // Check version compatibility
    if (cached.version !== CACHE_VERSION) {
      del(key);
      cacheStats.misses++;
      return null;
    }
    
    // Check if not expired
    if (cached.expires > Date.now()) {
      cacheStats.hits++;
      return cached.value;
    }
    
    // Clean up expired cache
    del(key);
  }
  
  cacheStats.misses++;
  return null;
};

const del = (key) => {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
    cacheStats.deletes++;
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
    // Remove all cache entries from localStorage
    const keysToRemove = Object.keys(localStorage)
      .filter(key => key.startsWith(CACHE_PREFIX));
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    cacheStats.deletes += keysToRemove.length;
  } catch (error) {
    console.warn('Failed to clear cache from localStorage:', error);
  }
  
  // Also clear memory cache if it exists
  if (window._tuneTribeMemoryCache) {
    window._tuneTribeMemoryCache.clear();
  }
};

// Get cache statistics for monitoring
const getStats = () => {
  const hitRate = cacheStats.hits + cacheStats.misses > 0 
    ? (cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100).toFixed(2)
    : 0;
    
  return {
    ...cacheStats,
    hitRate: `${hitRate}%`,
    totalEntries: Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX)).length
  };
};

// Reset cache statistics
const resetStats = () => {
  cacheStats.hits = 0;
  cacheStats.misses = 0;
  cacheStats.sets = 0;
  cacheStats.deletes = 0;
};

// Cache warming utility for critical data
const warmCache = async (warmingFunctions = []) => {
  console.log('Starting cache warming...');
  const results = await Promise.allSettled(warmingFunctions.map(fn => fn()));
  const successful = results.filter(r => r.status === 'fulfilled').length;
  console.log(`Cache warming completed: ${successful}/${warmingFunctions.length} successful`);
  return results;
};

// Batch cache operations for efficiency
const setBatch = (entries) => {
  entries.forEach(({ key, value, ttl, dataType }) => {
    set(key, value, ttl, dataType);
  });
};

export default {
  set,
  get,
  del,
  clear,
  getStats,
  resetStats,
  warmCache,
  setBatch,
};