import express from 'express';
import spotifyAuth from '../services/spotify-auth.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// Cache for auth status to reduce file system calls
const authStatusCache = {
  data: null,
  timestamp: 0,
  ttl: 30000 // 30 seconds cache
};

// Helper function to clear auth cache
function clearAuthCache() {
  authStatusCache.data = null;
  authStatusCache.timestamp = 0;
}

// Get Spotify authorization URL
router.get('/spotify/authorize', async (req, res) => {
  try {
    const { url, state } = spotifyAuth.getAuthorizationURL();
    res.json({ 
      authUrl: url, 
      state,
      message: 'Visit the authorization URL to grant access to Spotify' 
    });
  } catch (error) {
    console.error('Error generating authorization URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate authorization URL',
      details: error.message 
    });
  }
});

// Handle Spotify OAuth callback (GET - from Spotify redirect)
router.get('/spotify/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    if (error) {
      return res.status(400).json({ 
        error: `Spotify authorization error: ${error}` 
      });
    }
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Authorization code is required' 
      });
    }

    const tokens = await spotifyAuth.exchangeCodeForTokens(code);
    
    // Clear auth cache when new tokens are obtained
    clearAuthCache();
    
    // Redirect to frontend with success message
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      throw new Error('FRONTEND_URL environment variable is not set');
    }
    res.redirect(`${frontendUrl}/connect?auth=success`);
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    // Redirect to frontend with error
    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      console.error('FRONTEND_URL environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error: FRONTEND_URL not set' });
    }
    res.redirect(`${frontendUrl}/connect?auth=error&message=${encodeURIComponent(error.message)}`);
  }
});

// Handle Spotify OAuth callback (POST - for manual API calls)
router.post('/spotify/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        error: 'Authorization code is required' 
      });
    }

    const tokens = await spotifyAuth.exchangeCodeForTokens(code);
    
    // Clear auth cache when new tokens are obtained
    clearAuthCache();
    
    res.json({ 
      message: 'Successfully authorized with Spotify',
      authorized: true,
      expiresAt: new Date(tokens.expires_at).toISOString()
    });
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    res.status(500).json({ 
      error: 'Failed to exchange authorization code',
      details: error.message 
    });
  }
});

// Check authorization status with caching
router.get('/spotify/status', async (req, res) => {
  try {
    const now = Date.now();
    
    // Return cached result if still valid
    if (authStatusCache.data && (now - authStatusCache.timestamp) < authStatusCache.ttl) {
      return res.json(authStatusCache.data);
    }
    
    const isAuthorized = await spotifyAuth.isAuthorized();
    let responseData;
    
    if (isAuthorized) {
      const tokens = await spotifyAuth.loadTokens();
      
      responseData = {
        authorized: true,
        expiresAt: new Date(tokens.expires_at).toISOString(),
        message: 'Spotify authorization is active'
      };
    } else {
      responseData = {
        authorized: false,
        message: 'Spotify authorization required'
      };
    }
    
    // Update cache
    authStatusCache.data = responseData;
    authStatusCache.timestamp = now;
    
    res.json(responseData);
  } catch (error) {
    console.error('Error checking authorization status:', error);
    res.status(500).json({ 
      error: 'Failed to check authorization status',
      details: error.message 
    });
  }
});

// Get valid access token for player
router.get('/spotify/token', async (req, res) => {
  try {
    const accessToken = await spotifyAuth.getValidAccessToken();
    res.json({ 
      access_token: accessToken,
      message: 'Valid access token retrieved'
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(401).json({ 
      error: 'Failed to get valid access token',
      details: error.message,
      requiresAuth: true
    });
  }
});

// Refresh Spotify token
router.post('/spotify/refresh', async (req, res) => {
  try {
    const tokens = await spotifyAuth.loadTokens();
    
    if (!tokens || !tokens.refresh_token) {
      return res.status(400).json({ 
        error: 'No refresh token available. Please re-authorize.' 
      });
    }

    const newTokens = await spotifyAuth.refreshAccessToken(tokens.refresh_token);
    
    // Clear auth cache when tokens are refreshed
    clearAuthCache();
    
    res.json({ 
      message: 'Successfully refreshed Spotify token',
      expiresAt: new Date(newTokens.expires_at).toISOString()
    });
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    res.status(500).json({ 
      error: 'Failed to refresh token',
      details: error.message 
    });
  }
});



// Revoke authorization (clear stored tokens)
router.post('/spotify/revoke', async (req, res) => {
  try {
    // Use the same tokens file path as SpotifyAuth class
    const tokensFile = path.join(__dirname, '../../data/spotify_tokens.json');
    
    try {
      await fs.unlink(tokensFile);
    } catch (error) {
      // File might not exist, which is fine
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
    
    // Clear auth cache when authorization is revoked
    clearAuthCache();
    
    res.json({ 
      message: 'Successfully revoked Spotify authorization. Please re-authorize to enable track playback.',
      authorized: false 
    });
  } catch (error) {
    console.error('Error revoking authorization:', error);
    res.status(500).json({ 
      error: 'Failed to revoke authorization',
      details: error.message 
    });
  }
});

export default router;