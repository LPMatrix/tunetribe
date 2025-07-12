<template>
  <div v-if="playerState.isReady || playerState.error" class="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 z-50">
    <!-- Error State -->
    <div v-if="playerState.error" class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="text-red-400 text-sm">{{ playerState.error }}</span>
        <button @click="clearError" class="ml-auto text-red-400 hover:text-red-300">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Premium Required Message -->
    <div v-if="!playerState.isPremium && !playerState.error" class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-yellow-400 text-sm">Spotify Premium required for playback</span>
        </div>
        <router-link 
          to="/connect" 
          class="text-yellow-400 hover:text-yellow-300 text-xs underline"
        >
          Re-authorize
        </router-link>
      </div>
    </div>

    <!-- Player Controls -->
    <div v-if="playerState.isReady" class="flex items-center gap-4">
      <!-- Track Info -->
      <div v-if="playerState.currentTrack" class="flex items-center gap-3 min-w-0 flex-1">
        <div v-if="playerState.currentTrack.album?.images?.[0]" class="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
          <img :src="playerState.currentTrack.album.images[0].url" :alt="playerState.currentTrack.album.name" class="w-full h-full object-cover">
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-white text-sm font-medium truncate">{{ playerState.currentTrack.name }}</div>
          <div class="text-gray-400 text-xs truncate">
            {{ playerState.currentTrack.artists?.map(a => a.name).join(', ') }}
          </div>
        </div>
      </div>
      <div v-else class="flex-1">
        <div class="text-gray-400 text-sm">No track selected</div>
      </div>

      <!-- Playback Controls -->
      <div class="flex items-center gap-2">
        <button 
          @click="togglePlayback" 
          :disabled="!playerState.currentTrack"
          class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="playerState.isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="playerState.currentTrack" class="flex items-center gap-2 flex-1 max-w-md">
        <span class="text-xs text-gray-400 w-10 text-right">{{ formatTime(playerState.position) }}</span>
        <div class="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer" @click="seekToPosition">
          <div 
            class="h-full bg-white rounded-full transition-all duration-100"
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <span class="text-xs text-gray-400 w-10">{{ formatTime(playerState.duration) }}</span>
      </div>

      <!-- Volume Control -->
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.846 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.846l3.537-3.816a1 1 0 011.617.816zM16 8a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd" />
        </svg>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          :value="playerState.volume"
          @input="setVolume($event.target.value)"
          class="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { 
  playerState, 
  togglePlayback as togglePlaybackService, 
  seekToPosition as seekToPositionService,
  setVolume as setVolumeService
} from '../services/spotifyPlayer.js'

export default {
  name: 'PlayerBar',
  data() {
    return {
      playerState
    }
  },
  computed: {
    progressPercentage() {
      if (!this.playerState.duration) return 0
      return (this.playerState.position / this.playerState.duration) * 100
    }
  },
  methods: {
    async togglePlayback() {
      try {
        await togglePlaybackService()
      } catch (error) {
        console.error('Failed to toggle playback:', error)
      }
    },
    async seekToPosition(event) {
      if (!this.playerState.duration) return
      
      const rect = event.target.getBoundingClientRect()
      const percentage = (event.clientX - rect.left) / rect.width
      const position = percentage * this.playerState.duration
      
      try {
        await seekToPositionService(position)
      } catch (error) {
        console.error('Failed to seek:', error)
      }
    },
    async setVolume(volume) {
      try {
        await setVolumeService(parseFloat(volume))
      } catch (error) {
        console.error('Failed to set volume:', error)
      }
    },
    formatTime(ms) {
      const seconds = Math.floor(ms / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    },
    clearError() {
      this.playerState.error = null
    }
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  border: none;
}
</style>