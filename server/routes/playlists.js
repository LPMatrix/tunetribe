import express from 'express';
import spotifyService from '../services/spotify.js';
import { telegramService } from '../services/telegram.js';
const router = express.Router();

// Get all user playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await spotifyService.getUserPlaylists();
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ 
      error: 'Failed to fetch playlists',
      details: error.message 
    });
  }
});

// Get specific playlist
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await spotifyService.getPlaylist(id);
    res.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ 
      error: 'Failed to fetch playlist',
      details: error.message 
    });
  }
});



// Add tracks to existing playlist
router.post('/:id/tracks', async (req, res) => {
  try {
    const { id } = req.params;
    const { trackUris } = req.body;
    
    if (!trackUris || !Array.isArray(trackUris)) {
      return res.status(400).json({ 
        error: 'trackUris array is required' 
      });
    }

    await spotifyService.addTracksToPlaylist(id, trackUris);
    
    res.json({
      message: `Successfully added ${trackUris.length} tracks to playlist`,
      playlistId: id,
      tracksAdded: trackUris.length
    });
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    res.status(500).json({ 
      error: 'Failed to add tracks to playlist',
      details: error.message 
    });
  }
});

// Search for tracks
router.get('/search/tracks', async (req, res) => {
  try {
    const { q: query, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Search query is required' 
      });
    }

    const tracks = await spotifyService.searchTracks(query, parseInt(limit));
    
    res.json({
      tracks,
      query,
      total: tracks.length
    });
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).json({ 
      error: 'Failed to search tracks',
      details: error.message 
    });
  }
});

// Get Telegram messages with Spotify links
router.get('/telegram/messages', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (startDate && endDate) {
      const messages = await telegramService.getMessagesInDateRange(startDate, endDate);
      const spotifyLinks = await telegramService.getSpotifyLinksInDateRange(startDate, endDate);
      
      res.json({
        messages,
        spotifyLinks,
        period: { startDate, endDate },
        stats: {
          totalMessages: messages.length,
          messagesWithSpotify: messages.filter(msg => msg.spotify_links?.length > 0).length,
          totalSpotifyLinks: spotifyLinks.length
        }
      });
    } else {
      const messages = telegramService.getStoredMessages();
      const stats = telegramService.getMessageStats();
      
      res.json({
        messages,
        stats
      });
    }
  } catch (error) {
    console.error('Error fetching Telegram messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Telegram messages',
      details: error.message 
    });
  }
});

// Get Spotify links from Telegram messages in date range
router.get('/telegram/spotify-links', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'startDate and endDate are required' 
      });
    }

    const spotifyLinks = await telegramService.getSpotifyLinksInDateRange(startDate, endDate);
    
    // Group by contributor
    const contributors = {};
    spotifyLinks.forEach(link => {
      const contributorName = link.from.first_name || link.from.username || 'Unknown';
      if (!contributors[contributorName]) {
        contributors[contributorName] = {
          name: contributorName,
          tracks: [],
          count: 0
        };
      }
      contributors[contributorName].tracks.push(link);
      contributors[contributorName].count++;
    });
    
    res.json({
      spotifyLinks,
      contributors: Object.values(contributors),
      period: { startDate, endDate },
      stats: {
        totalLinks: spotifyLinks.length,
        uniqueContributors: Object.keys(contributors).length,
        trackLinks: spotifyLinks.filter(link => link.type === 'track').length,
        playlistLinks: spotifyLinks.filter(link => link.type === 'playlist').length,
        albumLinks: spotifyLinks.filter(link => link.type === 'album').length
      }
    });
  } catch (error) {
    console.error('Error fetching Spotify links:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Spotify links',
      details: error.message 
    });
  }
});

// Get track details
router.get('/tracks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const track = await spotifyService.getTrackDetails(id);
    
    if (!track) {
      return res.status(404).json({ 
        error: 'Track not found' 
      });
    }
    
    res.json(track);
  } catch (error) {
    console.error('Error fetching track details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch track details',
      details: error.message 
    });
  }
});

// Get multiple track details
router.post('/tracks/batch', async (req, res) => {
  try {
    const { trackIds } = req.body;
    
    if (!trackIds || !Array.isArray(trackIds)) {
      return res.status(400).json({ 
        error: 'trackIds array is required' 
      });
    }

    const tracks = await spotifyService.getTracksDetails(trackIds);
    
    res.json({
      tracks,
      requested: trackIds.length,
      found: tracks.length
    });
  } catch (error) {
    console.error('Error fetching track details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch track details',
      details: error.message 
    });
  }
});

export default router;