import axios from 'axios';
import spotifyAuth from './spotify-auth.js';
import { generateCoverArt } from './cover-art.js';

class SpotifyService {
  constructor() {
    this.baseURL = 'https://api.spotify.com/v1';
    this._userId = null;
    
    // Cache for frequently accessed data
    this.cache = {
      userPlaylists: { data: null, timestamp: 0, ttl: 300000 }, // 5 minutes
      trackDetails: new Map(), // Track ID -> { data, timestamp }
      searchResults: new Map() // Query -> { data, timestamp }
    };
    this.trackCacheTtl = 3600000; // 1 hour for track details
    this.searchCacheTtl = 600000; // 10 minutes for search results
  }

  get userId() {
    if (!this._userId) {
      this._userId = process.env.SPOTIFY_USER_ID;
      
      // Check for placeholder values
      if (!this._userId || this._userId === 'your_spotify_user_id_here') {
        console.warn('⚠️  SPOTIFY_USER_ID is not set or using placeholder value.');
      }
    }
    return this._userId;
  }

  // Cache helper methods
  clearCache() {
    this.cache.userPlaylists = { data: null, timestamp: 0, ttl: 300000 };
    this.cache.trackDetails.clear();
    this.cache.searchResults.clear();
  }

  isValidCache(cacheItem, ttl) {
    return cacheItem && cacheItem.data && (Date.now() - cacheItem.timestamp) < ttl;
  }

  async makeSpotifyRequest(endpoint, options = {}) {
    try {
      const accessToken = await spotifyAuth.getValidAccessToken();
      const config = {
        ...options,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const response = await axios({
        url: `${this.baseURL}${endpoint}`,
        ...config
      });

      return response.data;
    } catch (error) {
      console.error(`Spotify API error for ${endpoint}:`, error.response?.data || error.message);
      throw new Error(`Spotify API request failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async createPlaylist(name, description = '', isPublic = true) {
    try {
      const playlist = await this.makeSpotifyRequest(`/users/${this.userId}/playlists`, {
        method: 'POST',
        data: {
          name,
          description,
          public: isPublic
        }
      });

      console.log(`✅ Created playlist: ${playlist.name} (${playlist.id})`);
      
      // Clear user playlists cache since a new playlist was created
      this.cache.userPlaylists = { data: null, timestamp: 0, ttl: 300000 };
      
      return playlist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  }

  async addTracksToPlaylist(playlistId, trackUris) {
    try {
      if (!trackUris || trackUris.length === 0) {
        console.log('No tracks to add to playlist');
        return;
      }

      // Spotify API allows max 100 tracks per request
      const batchSize = 100;
      const batches = [];
      
      for (let i = 0; i < trackUris.length; i += batchSize) {
        batches.push(trackUris.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        await this.makeSpotifyRequest(`/playlists/${playlistId}/tracks`, {
          method: 'POST',
          data: {
            uris: batch
          }
        });
      }

      console.log(`✅ Added ${trackUris.length} tracks to playlist ${playlistId}`);
    } catch (error) {
      console.error('Error adding tracks to playlist:', error);
      throw error;
    }
  }

  async getTrackDetails(trackId) {
    try {
      // Check cache first
      const cached = this.cache.trackDetails.get(trackId);
      if (this.isValidCache(cached, this.trackCacheTtl)) {
        return cached.data;
      }
      
      const trackData = await this.makeSpotifyRequest(`/tracks/${trackId}`);
      
      // Cache the result
      this.cache.trackDetails.set(trackId, {
        data: trackData,
        timestamp: Date.now()
      });
      
      return trackData;
    } catch (error) {
      console.error(`Error getting track details for ${trackId}:`, error);
      return null;
    }
  }

  async getTracksDetails(trackIds) {
    try {
      if (!trackIds || trackIds.length === 0) {
        return [];
      }

      // Spotify API allows max 50 tracks per request
      const batchSize = 50;
      const batches = [];
      
      for (let i = 0; i < trackIds.length; i += batchSize) {
        batches.push(trackIds.slice(i, i + batchSize));
      }

      const allTracks = [];
      for (const batch of batches) {
        const response = await this.makeSpotifyRequest(`/tracks?ids=${batch.join(',')}`);
        allTracks.push(...response.tracks.filter(track => track !== null));
      }

      return allTracks;
    } catch (error) {
      console.error('Error getting tracks details:', error);
      return [];
    }
  }

  async uploadPlaylistCoverArt(playlistId, imageBuffer) {
    try {
      const accessToken = await spotifyAuth.getValidAccessToken();
      
      await axios.put(`${this.baseURL}/playlists/${playlistId}/images`, imageBuffer, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'image/jpeg'
        }
      });

      console.log(`✅ Uploaded cover art for playlist ${playlistId}`);
    } catch (error) {
      console.error('Error uploading playlist cover art:', error);
      throw error;
    }
  }

  async createPlaylistWithTracks(name, trackUris, description = '', coverArtImages = []) {
    try {
      // Create the playlist
      const playlist = await this.createPlaylist(name, description);
      
      // Add tracks to the playlist
      if (trackUris && trackUris.length > 0) {
        await this.addTracksToPlaylist(playlist.id, trackUris);
      }

      // Generate and upload cover art if images are provided
      if (coverArtImages && coverArtImages.length > 0) {
        try {
          const coverArtBuffer = await generateCoverArt(coverArtImages, name);
          if (coverArtBuffer) {
            await this.uploadPlaylistCoverArt(playlist.id, coverArtBuffer);
          }
        } catch (coverError) {
          console.warn('Failed to generate/upload cover art:', coverError.message);
        }
      }

      return {
        ...playlist,
        trackCount: trackUris ? trackUris.length : 0
      };
    } catch (error) {
      console.error('Error creating playlist with tracks:', error);
      throw error;
    }
  }

  extractTrackId(spotifyUrl) {
    const trackMatch = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
    return trackMatch ? trackMatch[1] : null;
  }

  extractPlaylistId(spotifyUrl) {
    const playlistMatch = spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    return playlistMatch ? playlistMatch[1] : null;
  }

  async searchTracks(query, limit = 20) {
    try {
      const cacheKey = `${query}:${limit}`;
      
      // Check cache first
      const cached = this.cache.searchResults.get(cacheKey);
      if (this.isValidCache(cached, this.searchCacheTtl)) {
        return cached.data;
      }
      
      const response = await this.makeSpotifyRequest(`/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`);
      const tracks = response.tracks.items;
      
      // Cache the result
      this.cache.searchResults.set(cacheKey, {
        data: tracks,
        timestamp: Date.now()
      });
      
      return tracks;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  }

  async getPlaylist(playlistId) {
    try {
      return await this.makeSpotifyRequest(`/playlists/${playlistId}`);
    } catch (error) {
      console.error(`Error getting playlist ${playlistId}:`, error);
      throw error;
    }
  }

  async getUserPlaylists(limit = 50) {
    try {
      // Check cache first
      if (this.isValidCache(this.cache.userPlaylists, this.cache.userPlaylists.ttl)) {
        return this.cache.userPlaylists.data;
      }
      
      const response = await this.makeSpotifyRequest(`/me/playlists?limit=${limit}`);
      const playlists = response.items || [];
      
      // Cache the result
      this.cache.userPlaylists = {
        data: playlists,
        timestamp: Date.now(),
        ttl: 300000 // 5 minutes
      };
      
      return playlists;
    } catch (error) {
      console.error('Error getting user playlists:', error);
      throw error;
    }
  }


}

export default new SpotifyService();