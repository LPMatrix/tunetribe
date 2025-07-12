import api from './api';

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
      return response.data;
    } catch (error) {
      throw new Error(`Failed to handle callback: ${error.response?.data?.error || error.message}`);
    }
  }

  // Check Spotify authorization status
  async getSpotifyAuthStatus() {
    try {
      const response = await api.get('/auth/spotify/status');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to check auth status: ${error.response?.data?.error || error.message}`);
    }
  }

  // Refresh Spotify token
  async refreshSpotifyToken() {
    try {
      const response = await api.post('/auth/spotify/refresh');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.response?.data?.error || error.message}`);
    }
  }

  // Revoke Spotify authorization
  async revokeSpotifyAuth() {
    try {
      const response = await api.post('/auth/spotify/revoke');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to revoke authorization: ${error.response?.data?.error || error.message}`);
    }
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