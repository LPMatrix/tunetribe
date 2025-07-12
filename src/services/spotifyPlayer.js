import { ref, reactive } from 'vue'
import authService from './auth.js'

// Player state
export const playerState = reactive({
  isReady: false,
  isPlaying: false,
  currentTrack: null,
  position: 0,
  duration: 0,
  volume: 0.5,
  deviceId: null,
  isPremium: false,
  error: null
})

// Player instance
let player = null
let spotifyToken = null

// Initialize the Spotify Web Playback SDK
export const initializePlayer = async () => {
  return new Promise((resolve, reject) => {
    // Wait for Spotify SDK to load
    window.onSpotifyWebPlaybackSDKReady = async () => {
      try {
        const authStatus = await authService.getSpotifyAuthStatus()
        spotifyToken = authStatus.access_token
        
        if (!spotifyToken) {
          reject(new Error('No Spotify access token available'))
          return
        }
      } catch (error) {
        reject(new Error('Failed to get Spotify token: ' + error.message))
        return
      }

      player = new window.Spotify.Player({
        name: 'Tune Tribe Web Player',
        getOAuthToken: cb => {
          cb(spotifyToken)
        },
        volume: playerState.volume
      })

      // Error handling
      player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message)
        playerState.error = message
        reject(new Error(message))
      })

      player.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message)
        playerState.error = 'Authentication failed. Please reconnect to Spotify.'
        reject(new Error(message))
      })

      player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message)
        playerState.error = 'Spotify Premium required for playback.'
        playerState.isPremium = false
        // Don't reject here, let the player initialize but mark as non-premium
        console.warn('Player initialized but Premium account required for playback')
      })

      player.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message)
        playerState.error = message
      })

      // Playback status updates
      player.addListener('player_state_changed', (state) => {
        if (!state) return

        playerState.isPlaying = !state.paused
        playerState.position = state.position
        playerState.duration = state.duration
        
        if (state.track_window.current_track) {
          playerState.currentTrack = {
            id: state.track_window.current_track.id,
            name: state.track_window.current_track.name,
            artists: state.track_window.current_track.artists,
            album: state.track_window.current_track.album,
            uri: state.track_window.current_track.uri
          }
        }
      })

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id)
        playerState.deviceId = device_id
        playerState.isReady = true
        playerState.isPremium = true
        playerState.error = null
        resolve(device_id)
      })

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id)
        playerState.isReady = false
      })

      // Connect to the player!
      player.connect()
    }

    // If SDK is already loaded
    if (window.Spotify) {
      window.onSpotifyWebPlaybackSDKReady()
    }
  })
}

// Play a track
export const playTrack = async (trackUri) => {
  if (!player || !playerState.deviceId || !spotifyToken) {
    throw new Error('Player not ready')
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${playerState.deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: [trackUri]
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      }
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to play track')
    }
  } catch (error) {
    console.error('Error playing track:', error)
    playerState.error = error.message
    throw error
  }
}

// Toggle play/pause
export const togglePlayback = async () => {
  if (!player) {
    throw new Error('Player not ready')
  }

  try {
    await player.togglePlay()
  } catch (error) {
    console.error('Error toggling playback:', error)
    playerState.error = error.message
    throw error
  }
}

// Seek to position
export const seekToPosition = async (positionMs) => {
  if (!player) {
    throw new Error('Player not ready')
  }

  try {
    await player.seek(positionMs)
  } catch (error) {
    console.error('Error seeking:', error)
    playerState.error = error.message
    throw error
  }
}

// Set volume
export const setVolume = async (volume) => {
  if (!player) {
    throw new Error('Player not ready')
  }

  try {
    await player.setVolume(volume)
    playerState.volume = volume
  } catch (error) {
    console.error('Error setting volume:', error)
    playerState.error = error.message
    throw error
  }
}

// Get current state
export const getCurrentState = async () => {
  if (!player) {
    return null
  }

  try {
    return await player.getCurrentState()
  } catch (error) {
    console.error('Error getting current state:', error)
    return null
  }
}

// Disconnect player
export const disconnectPlayer = () => {
  if (player) {
    player.disconnect()
    player = null
  }
  
  playerState.isReady = false
  playerState.isPlaying = false
  playerState.currentTrack = null
  playerState.deviceId = null
  playerState.error = null
}

// Check if track is currently playing
export const isTrackPlaying = (trackUri) => {
  return playerState.currentTrack?.uri === trackUri && playerState.isPlaying
}

// Check if track is current (but may be paused)
export const isCurrentTrack = (trackUri) => {
  return playerState.currentTrack?.uri === trackUri
}