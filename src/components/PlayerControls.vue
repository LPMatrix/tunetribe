<template>
  <div class="flex items-center gap-2">
    <!-- Play/Pause Button -->
    <button
      @click="handlePlayClick"
      :disabled="!playerState.isReady || !playerState.isPremium"
      :class="[
        'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
        isCurrentTrack(track.uri) 
          ? 'bg-green-500 text-white hover:bg-green-600' 
          : 'bg-white text-black hover:bg-gray-200',
        (!playerState.isReady || !playerState.isPremium) 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105'
      ]"
      :title="getButtonTitle()"
    >
      <!-- Loading spinner -->
      <div v-if="isLoading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      
      <!-- Play/Pause icons -->
      <template v-else>
        <svg v-if="isTrackPlaying(track.uri)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
      </template>
    </button>

    <!-- Spotify Link Button (fallback) -->
    <a
      v-if="!playerState.isPremium && track.external_urls?.spotify"
      :href="track.external_urls.spotify"
      target="_blank"
      rel="noopener noreferrer"
      class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-all duration-200 hover:scale-105"
      title="Open in Spotify"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    </a>

    <!-- Premium Required Icon -->
    <div
      v-if="!playerState.isPremium && !track.external_urls?.spotify"
      class="w-8 h-8 rounded-full bg-gray-600 text-gray-400 flex items-center justify-center"
      title="Spotify Premium required"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script>
import { 
  playerState, 
  playTrack, 
  togglePlayback,
  isTrackPlaying,
  isCurrentTrack
} from '../services/spotifyPlayer.js'

export default {
  name: 'PlayerControls',
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      playerState,
      isLoading: false
    }
  },
  methods: {
    async handlePlayClick() {
      if (!this.playerState.isReady || !this.playerState.isPremium) {
        return
      }

      this.isLoading = true
      
      try {
        if (this.isCurrentTrack(this.track.uri)) {
          // If this track is current, toggle play/pause
          await togglePlayback()
        } else {
          // If different track, play it
          await playTrack(this.track.uri)
        }
      } catch (error) {
        console.error('Failed to control playback:', error)
        // Show error in player state
        this.playerState.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    isTrackPlaying,
    isCurrentTrack,
    getButtonTitle() {
      if (!this.playerState.isReady) {
        return 'Player not ready'
      }
      if (!this.playerState.isPremium) {
        return 'Spotify Premium required'
      }
      if (this.isCurrentTrack(this.track.uri)) {
        return this.playerState.isPlaying ? 'Pause' : 'Resume'
      }
      return 'Play'
    }
  }
}
</script>