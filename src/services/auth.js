import api from './api';
import cache from './cache';

// Cache for auth status to reduce API calls
const authCache = {
  status: null,
  timestamp: 0,
  ttl: 30000 // 30 seconds cache
};

class AuthService {
  // Get Spotify authorization URL
  async getSpotifyAuthUrl() {
    try {
      const response = await api.get('/auth/spotify/authorize');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get authorization URL: ${error.response?.data?.error || error.message}`);
    }
  }

  // Handle Spotify OAuth callback
  async handleSpotifyCallback(code, state) {
    try {
      const response = await api.post('/auth/spotify/callback', { code, state });
      // Clear cache when auth status changes
      this.clearAuthCache();
      return response.data;
    } catch (error) {
      throw new Error(`Failed to handle callback: ${error.response?.data?.error || error.message}`);
    }
  }

  // Check Spotify authorization status with caching
  async getSpotifyAuthStatus() {
    // Check enhanced cache first
    const cached = cache.get('spotify_auth_status');
    if (cached) {
      return cached;
    }
    
    try {
      const response = await api.get('/auth/spotify/status');
      // Store in enhanced cache with auth dataType
      cache.set('spotify_auth_status', response.data, null, 'auth');
      return response.data;
    } catch (error) {
      console.error('Failed to get Spotify auth status:', error);
      throw error;
    }
  }

  // Get valid access token for player
  async getSpotifyAccessToken() {
    try {
      const response = await api.get('/auth/spotify/token');
      return response.data.access_token;
    } catch (error) {
      console.error('Failed to get Spotify access token:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please reconnect to Spotify.');
      }
      throw error;
    }
  }

  // Refresh Spotify token
  async refreshSpotifyToken() {
    try {
      const response = await api.post('/auth/spotify/refresh');
      // Clear cache when token is refreshed
      this.clearAuthCache();
      return response.data;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.response?.data?.error || error.message}`);
    }
  }

  // Revoke Spotify authorization
  async revokeSpotifyAuth() {
    try {
      const response = await api.post('/auth/spotify/revoke');
      // Clear cache when auth is revoked
      this.clearAuthCache();
      return response.data;
    } catch (error) {
      throw new Error(`Failed to revoke authorization: ${error.response?.data?.error || error.message}`);
    }
  }

  // Clear auth cache
  clearAuthCache() {
    // Clear both old and new cache systems for compatibility
    authCache.status = null;
    authCache.timestamp = 0;
    cache.del('spotify_auth_status');
  }

  // Force refresh auth status (bypass cache)
  async forceRefreshAuthStatus() {
    this.clearAuthCache();
    return await this.getSpotifyAuthStatus();
  }

  // Authorize with Spotify (opens popup window)
  async authorizeWithSpotify() {
    try {
      const { authUrl, state } = await this.getSpotifyAuthUrl();
      
      return new Promise((resolve, reject) => {
        // Open popup window
        const popup = window.open(
          authUrl,
          'spotify-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        // Check for popup blocked
        if (!popup) {
          reject(new Error('Popup blocked. Please allow popups for this site.'));
          return;
        }

        // Poll for popup closure or URL change
        const checkClosed = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(checkClosed);
              reject(new Error('Authorization cancelled by user'));
              return;
            }

            // Check if popup URL contains callback
            const popupUrl = popup.location.href;
            if (popupUrl.includes('/api/auth/spotify/callback')) {
              const urlParams = new URLSearchParams(popup.location.search);
              const code = urlParams.get('code');
              const returnedState = urlParams.get('state');
              
              popup.close();
              clearInterval(checkClosed);
              
              if (code) {
                this.handleSpotifyCallback(code, returnedState)
                  .then(resolve)
                  .catch(reject);
              } else {
                reject(new Error('No authorization code received'));
              }
            }
          } catch (error) {
            // Cross-origin error is expected, continue polling
          }
        }, 1000);

        // Timeout after 5 minutes
        setTimeout(() => {
          if (!popup.closed) {
            popup.close();
          }
          clearInterval(checkClosed);
          reject(new Error('Authorization timeout'));
        }, 300000);
      });
    } catch (error) {
      throw new Error(`Authorization failed: ${error.message}`);
    }
  }
}

export default new AuthService();