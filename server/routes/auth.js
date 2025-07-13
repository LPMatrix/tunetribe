import express from 'express';
import spotifyAuth from '../services/spotify-auth.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

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
    
    // Redirect to frontend with success message
    res.redirect(`http://localhost:5174/connect?auth=success`);
  } catch (error) {
    console.error('Error handling Spotify callback:', error);
    // Redirect to frontend with error
    res.redirect(`http://localhost:5174/connect?auth=error&message=${encodeURIComponent(error.message)}`);
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

// Check authorization status
router.get('/spotify/status', async (req, res) => {
  try {
    const isAuthorized = await spotifyAuth.isAuthorized();
    
    if (isAuthorized) {
      const tokens = await spotifyAuth.loadTokens();
      
      res.json({
        authorized: true,
        expiresAt: new Date(tokens.expires_at).toISOString(),
        message: 'Spotify authorization is active'
      });
    } else {
      res.json({
        authorized: false,
        message: 'Spotify authorization required'
      });
    }
  } catch (error) {
    console.error('Error checking authorization status:', error);
    res.status(500).json({ 
      error: 'Failed to check authorization status',
      details: error.message 
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