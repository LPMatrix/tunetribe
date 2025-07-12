import api from './api';

class PlaylistService {
  // Get all user playlists
  async getUserPlaylists() {
    try {
      const response = await api.get('/playlists');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch playlists: ${error.response?.data?.error || error.message}`);
    }
  }

  // Get specific playlist
  async getPlaylist(playlistId) {
    try {
      const response = await api.get(`/playlists/${playlistId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch playlist: ${error.response?.data?.error || error.message}`);
    }
  }



  // Add tracks to playlist
  async addTracksToPlaylist(playlistId, trackUris) {
    try {
      const response = await api.post(`/playlists/${playlistId}/tracks`, { trackUris });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add tracks: ${error.response?.data?.error || error.message}`);
    }
  }

  // Search for tracks
  async searchTracks(query, limit = 20) {
    try {
      const response = await api.get('/playlists/search/tracks', {
        params: { q: query, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search tracks: ${error.response?.data?.error || error.message}`);
    }
  }

  // Get track details
  async getTrackDetails(trackId) {
    try {
      const response = await api.get(`/playlists/tracks/${trackId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get track details: ${error.response?.data?.error || error.message}`);
    }
  }

  // Get multiple track details
  async getMultipleTrackDetails(trackIds) {
    try {
      const response = await api.post('/playlists/tracks/batch', { trackIds });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get track details: ${error.response?.data?.error || error.message}`);
    }
  }

  // Get Telegram messages
  async getTelegramMessages(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get('/playlists/telegram/messages', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get Telegram messages: ${error.response?.data?.error || error.message}`);
    }
  }

  // Get Spotify links from Telegram messages
  async getSpotifyLinksFromTelegram(startDate, endDate) {
    try {
      const response = await api.get('/playlists/telegram/spotify-links', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get Spotify links: ${error.response?.data?.error || error.message}`);
    }
  }

  // Helper method to get current month's Spotify links
  async getCurrentMonthSpotifyLinks() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    return this.getSpotifyLinksFromTelegram(
      startOfMonth.toISOString(),
      endOfMonth.toISOString()
    );
  }

  // Helper method to get last month's Spotify links
  async getLastMonthSpotifyLinks() {
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    
    return this.getSpotifyLinksFromTelegram(
      startOfLastMonth.toISOString(),
      endOfLastMonth.toISOString()
    );
  }

  // Helper method to get date range for specific month
  getMonthDateRange(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      monthName: startDate.toLocaleDateString('en-US', { month: 'long' }),
      year: year
    };
  }

  // Get available months with Spotify links
  async getAvailableMonths() {
    try {
      const messages = await this.getTelegramMessages();
      const monthsSet = new Set();
      
      messages.messages?.forEach(message => {
        if (message.spotify_links && message.spotify_links.length > 0) {
          const date = new Date(message.date);
          const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          monthsSet.add(monthKey);
        }
      });
      
      return Array.from(monthsSet)
        .sort()
        .reverse()
        .map(monthKey => {
          const [year, month] = monthKey.split('-');
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          return {
            key: monthKey,
            year: parseInt(year),
            month: parseInt(month),
            monthName: date.toLocaleDateString('en-US', { month: 'long' }),
            displayName: `${date.toLocaleDateString('en-US', { month: 'long' })} ${year}`
          };
        });
    } catch (error) {
      console.error('Failed to get available months:', error);
      return [];
    }
  }

  // Extract track ID from Spotify URL
  extractTrackId(spotifyUrl) {
    const trackMatch = spotifyUrl.match(/track\/([a-zA-Z0-9]+)/);
    return trackMatch ? trackMatch[1] : null;
  }

  // Extract playlist ID from Spotify URL
  extractPlaylistId(spotifyUrl) {
    const playlistMatch = spotifyUrl.match(/playlist\/([a-zA-Z0-9]+)/);
    return playlistMatch ? playlistMatch[1] : null;
  }

  // Format duration from milliseconds to MM:SS
  formatDuration(durationMs) {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Format track for display
  formatTrack(track) {
    return {
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      duration: this.formatDuration(track.duration_ms),
      image: track.album.images[0]?.url,
      external_url: track.external_urls.spotify,
      uri: track.uri
    };
  }

  // Format playlist for display
  formatPlaylist(playlist) {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      trackCount: playlist.tracks?.total || 0,
      image: playlist.images?.[0]?.url,
      external_url: playlist.external_urls?.spotify,
      owner: playlist.owner?.display_name,
      public: playlist.public,
      collaborative: playlist.collaborative
    };
  }
}

export default new PlaylistService();