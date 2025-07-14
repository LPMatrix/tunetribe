import cache from '../services/cache';
import authService from '../services/auth';
import playlistService from '../services/playlists';

/**
 * Cache warming utilities to preload critical data
 * This helps reduce initial load times and API calls
 */

// Warm auth status cache
const warmAuthCache = async () => {
  try {
    await authService.getSpotifyAuthStatus();
    console.log('✅ Auth cache warmed');
  } catch (error) {
    console.warn('⚠️ Failed to warm auth cache:', error.message);
  }
};

// Warm playlists cache
const warmPlaylistsCache = async () => {
  try {
    await playlistService.getUserPlaylists();
    console.log('✅ Playlists cache warmed');
  } catch (error) {
    console.warn('⚠️ Failed to warm playlists cache:', error.message);
  }
};

// Main cache warming function
export const warmCriticalCaches = async () => {
  console.log('🔥 Starting cache warming...');
  
  const warmingFunctions = [
    warmAuthCache,
    warmPlaylistsCache
  ];
  
  const results = await cache.warmCache(warmingFunctions);
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log(`🔥 Cache warming completed: ${successful} successful, ${failed} failed`);
  
  // Log cache statistics
  const stats = cache.getStats();
  console.log('📊 Cache stats after warming:', stats);
  
  return results;
};

// Utility to get cache performance metrics
export const getCacheMetrics = () => {
  return cache.getStats();
};

// Utility to reset cache metrics
export const resetCacheMetrics = () => {
  cache.resetStats();
  console.log('📊 Cache metrics reset');
};

export default {
  warmCriticalCaches,
  getCacheMetrics,
  resetCacheMetrics
};