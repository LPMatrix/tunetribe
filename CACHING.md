# Caching Implementation

This document describes the caching mechanisms implemented to reduce redundant API calls to Spotify.

## Frontend Caching (src/services/auth.js)

### Auth Status Cache
- **Purpose**: Reduces frequent calls to `/auth/spotify/status` endpoint
- **TTL**: 30 seconds
- **Cache Key**: Single auth status object
- **Invalidation**: Cleared when auth state changes (login, logout, token refresh)

### Methods:
- `getSpotifyAuthStatus()`: Returns cached status if valid, otherwise fetches fresh data
- `clearAuthCache()`: Manually clears the cache
- `forceRefreshAuthStatus()`: Bypasses cache and fetches fresh data

## Backend Caching

### Auth Route Caching (server/routes/auth.js)
- **Purpose**: Reduces file system reads and token validation calls
- **TTL**: 30 seconds
- **Cache Key**: Single auth status object
- **Invalidation**: Cleared when tokens are created, refreshed, or revoked

### Spotify Service Caching (server/services/spotify.js)

#### User Playlists Cache
- **Purpose**: Reduces calls to Spotify's `/me/playlists` endpoint
- **TTL**: 5 minutes (300,000ms)
- **Cache Key**: Single playlists array
- **Invalidation**: Cleared when new playlists are created

#### Track Details Cache
- **Purpose**: Reduces calls to Spotify's `/tracks/{id}` endpoint
- **TTL**: 1 hour (3,600,000ms)
- **Cache Key**: Track ID
- **Storage**: Map with track ID as key
- **Invalidation**: No automatic invalidation (track data rarely changes)

#### Search Results Cache
- **Purpose**: Reduces calls to Spotify's `/search` endpoint
- **TTL**: 10 minutes (600,000ms)
- **Cache Key**: `${query}:${limit}`
- **Storage**: Map with search parameters as key
- **Invalidation**: No automatic invalidation

## Cache Management

### Manual Cache Clearing
```javascript
// Frontend
authService.clearAuthCache();

// Backend
spotifyService.clearCache(); // Clears all Spotify caches
```

### Automatic Cache Invalidation
- Auth caches are cleared when authentication state changes
- User playlists cache is cleared when new playlists are created
- Track and search caches persist until TTL expires

## Benefits

1. **Reduced API Calls**: Significantly fewer requests to Spotify API
2. **Improved Performance**: Faster response times for cached data
3. **Rate Limit Protection**: Helps stay within Spotify's API rate limits
4. **Better User Experience**: Reduced loading times and smoother interactions

## Monitoring

To monitor cache effectiveness, check server logs for:
- Reduced frequency of "Making Spotify API request" messages
- Faster response times for repeated requests
- Lower overall API usage

## Configuration

Cache TTL values can be adjusted in the respective service files:
- Frontend auth cache: `src/services/auth.js` (authCache.ttl)
- Backend auth cache: `server/routes/auth.js` (authStatusCache.ttl)
- Spotify service caches: `server/services/spotify.js` (various TTL properties)