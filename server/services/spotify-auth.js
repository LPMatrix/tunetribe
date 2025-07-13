import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SpotifyAuth {
  constructor() {
    // Use the tokens file from the secure data directory
    this.tokensFile = path.join(__dirname, '../../data/spotify_tokens.json');
    this.scopes = [
      'playlist-modify-public',
      'playlist-modify-private',
      'ugc-image-upload',
      'streaming',
      'user-read-playback-state',
      'user-modify-playback-state'
    ].join(' ');
    
    // Initialize credentials lazily
    this._initialized = false;
  }

  _initializeCredentials() {
    if (this._initialized) return;
    
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    
    // Check for placeholder values
    if (!this.clientId || this.clientId === 'your_spotify_client_id_here') {
      console.warn('SPOTIFY_CLIENT_ID is not set or using placeholder value.');
    }
    if (!this.clientSecret || this.clientSecret === 'your_spotify_client_secret_here') {
      console.warn('SPOTIFY_CLIENT_SECRET is not set or using placeholder value.');
    }
    
    this._initialized = true;
  }

  generateState() {
    return crypto.randomBytes(16).toString('hex');
  }

  getAuthorizationURL() {
    this._initializeCredentials();
    const state = this.generateState();
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scopes,
      redirect_uri: this.redirectUri,
      state: state
    });
    
    return {
      url: `https://accounts.spotify.com/authorize?${params.toString()}`,
      state
    };
  }

  async exchangeCodeForTokens(code) {
    this._initializeCredentials();
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUri
        }), {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const tokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_at: Date.now() + (response.data.expires_in * 1000),
        token_type: response.data.token_type
      };

      await this.saveTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  async refreshAccessToken(refreshToken) {
    this._initializeCredentials();
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }), {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const tokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token || refreshToken,
        expires_at: Date.now() + (response.data.expires_in * 1000),
        token_type: response.data.token_type
      };

      await this.saveTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Error refreshing access token:', error.response?.data || error.message);
      throw new Error('Failed to refresh access token');
    }
  }

  async saveTokens(tokens) {
    try {
      // Convert timestamp to ISO string to match Go bot's format
      const tokensToSave = {
        ...tokens,
        expires_at: new Date(tokens.expires_at).toISOString()
      };
      
      const dataDir = path.dirname(this.tokensFile);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(this.tokensFile, JSON.stringify(tokensToSave, null, 2));
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw new Error('Failed to save tokens');
    }
  }

  async loadTokens() {
    try {
      const data = await fs.readFile(this.tokensFile, 'utf8');
      const tokens = JSON.parse(data);
      console.log('Loaded Spotify tokens from:', this.tokensFile);
      
      // Convert Go bot's ISO string expires_at to timestamp if needed
      if (tokens.expires_at && typeof tokens.expires_at === 'string') {
        tokens.expires_at = new Date(tokens.expires_at).getTime();
      }
      
      return tokens;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('No tokens file found at:', this.tokensFile);
        return null; // File doesn't exist
      }
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON in tokens file:', this.tokensFile);
        console.error('The tokens file may be corrupted. Please re-authorize.');
        return null;
      }
      console.error('Error reading tokens file:', error.message);
      throw new Error('Failed to load tokens');
    }
  }

  async getValidAccessToken() {
    try {
      const tokens = await this.loadTokens();
      if (!tokens) {
        console.error('No Spotify tokens found. Please authorize the application first.');
        console.log('Visit /auth/login to authorize the application with Spotify.');
        throw new Error('No tokens found. Please authorize first.');
      }

      if (!tokens.access_token || !tokens.refresh_token) {
        console.error('Invalid token structure. Missing access_token or refresh_token.');
        throw new Error('Invalid token structure. Please re-authorize.');
      }

      // Check if token is expired (with 5 minute buffer)
      const expiresAt = typeof tokens.expires_at === 'string' 
        ? new Date(tokens.expires_at).getTime() 
        : tokens.expires_at;
      
      if (Date.now() >= (expiresAt - 300000)) {
        console.log('🔄 Access token expired, refreshing...');
        try {
          const newTokens = await this.refreshAccessToken(tokens.refresh_token);
          console.log('Access token refreshed successfully.');
          return newTokens.access_token;
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError.message);
          console.log('Please re-authorize the application.');
          throw new Error('Token refresh failed. Please re-authorize.');
        }
      }

      console.log('Using valid access token.');
      return tokens.access_token;
    } catch (error) {
      console.error('Error getting valid access token:', error.message);
      throw error;
    }
  }

  async isAuthorized() {
    try {
      const tokens = await this.loadTokens();
      return tokens && tokens.access_token && tokens.refresh_token;
    } catch (error) {
      return false;
    }
  }
}

export default new SpotifyAuth();