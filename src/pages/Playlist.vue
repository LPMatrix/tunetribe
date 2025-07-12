<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style="animation-delay: 4s;"></div>
    </div>

    <div class="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
      <div class="max-w-7xl mx-auto">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p class="text-white text-center">Loading playlist...</p>
          </div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30 max-w-md mx-auto">
            <div class="text-red-400 mb-6 text-lg">{{ error }}</div>
            <button @click="loadPlaylist" class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Try Again
            </button>
          </div>
        </div>
        
        <!-- Playlist Content -->
        <div v-else-if="playlist">
          <!-- Playlist Header -->
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div class="flex-1">
                <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  <span class="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                    {{ playlist.name }}
                  </span>
                </h1>
                <p class="text-gray-300 text-lg mb-4">{{ playlist.description || 'No description available' }}</p>
                <div class="flex items-center gap-4 text-purple-300">
                  <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ playlist.tracks?.total || 0 }} tracks
                  </span>
                  <span class="text-gray-400">•</span>
                  <span>{{ playlist.public ? 'Public' : 'Private' }}</span>
                </div>
              </div>
              <div class="flex flex-col sm:flex-row gap-4">
                <button @click="viewTracks" class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                    </svg>
                    View All Tracks
                  </span>
                </button>
              </div>
            </div>
            
            <!-- Playlist Cover -->
            <div v-if="playlist.images?.[0]?.url" class="mt-6">
              <div class="relative w-48 h-48 mx-auto lg:mx-0">
                <img :src="playlist.images[0].url" :alt="playlist.name" class="w-full h-full object-cover rounded-2xl shadow-2xl" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>

          <!-- Tracks Table -->
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            <div class="p-6 border-b border-white/10">
              <h2 class="text-2xl font-bold text-white mb-2">Track List</h2>
              <p class="text-gray-300">Preview of the first 20 tracks in this playlist</p>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-white/5 border-b border-white/10">
                    <th class="px-6 py-4 text-left text-purple-300 text-sm font-semibold uppercase tracking-wider w-16">#</th>
                    <th class="px-6 py-4 text-left text-purple-300 text-sm font-semibold uppercase tracking-wider min-w-[200px]">Title</th>
                    <th class="px-6 py-4 text-left text-purple-300 text-sm font-semibold uppercase tracking-wider min-w-[150px]">Artist</th>
                    <th class="px-6 py-4 text-left text-purple-300 text-sm font-semibold uppercase tracking-wider min-w-[150px]">Album</th>
                    <th class="px-6 py-4 text-left text-purple-300 text-sm font-semibold uppercase tracking-wider w-20">Duration</th>
                    <th class="px-6 py-4 text-left text-purple-300 text-sm font-semibold uppercase tracking-wider w-24">Play</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(track, index) in tracks" :key="track.id" class="border-b border-white/5 hover:bg-white/5 transition-colors duration-200">
                    <td class="px-6 py-4 text-gray-400 text-sm font-medium">{{ index + 1 }}</td>
                    <td class="px-6 py-4">
                      <div class="text-white font-medium text-sm leading-tight">{{ track.name || track.title }}</div>
                    </td>
                    <td class="px-6 py-4 text-gray-300 text-sm">{{ track.artists?.map(a => a.name).join(', ') || track.artist }}</td>
                    <td class="px-6 py-4 text-gray-300 text-sm">{{ track.album?.name || track.album }}</td>
                    <td class="px-6 py-4 text-gray-400 text-sm font-mono">{{ formatDuration(track.duration_ms) || track.duration }}</td>
                    <td class="px-6 py-4">
                      <PlayerControls :track="track" />
                    </td>
                  </tr>
                  
                  <!-- Empty state for no tracks -->
                  <tr v-if="tracks.length === 0">
                    <td colspan="6" class="px-6 py-12 text-center">
                      <div class="text-gray-400">
                        <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 3a1 1 0 0 0-1.196-.98l-10 2A1 1 0 0 0 6 5v6.114A4.369 4.369 0 0 0 5 11a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V5.82l8-1.6v5.894A4.369 4.369 0 0 0 10 10a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V4a1 1 0 0 0 1-1h6z"/>
                        </svg>
                        <p class="text-lg font-medium mb-2">No tracks found</p>
                        <p class="text-sm">This playlist appears to be empty</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 </template>

<script>
import playlistService from '../services/playlists';
import PlayerControls from '../components/PlayerControls.vue';

export default {
  name: 'PlaylistPage',
  components: {
    PlayerControls
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      playlist: null,
      tracks: []
    }
  },
  async mounted() {
    await this.loadPlaylist();
  },
  watch: {
    id: {
      handler() {
        this.loadPlaylist();
      },
      immediate: false
    }
  },
  methods: {
    async loadPlaylist() {
      this.loading = true;
      this.error = null;
      try {
        this.playlist = await playlistService.getPlaylist(this.id);
        // Load first 20 tracks for preview
        if (this.playlist.tracks?.items) {
          this.tracks = this.playlist.tracks.items.map(item => item.track).slice(0, 20);
        }
      } catch (error) {
        console.error('Failed to load playlist:', error);
        this.error = error.message || 'Failed to load playlist';
      } finally {
        this.loading = false;
      }
    },
    
    viewTracks() {
      this.$router.push(`/playlist/${this.id}/tracks`);
    },
    
    formatDuration(durationMs) {
      if (!durationMs) return '';
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
}
</script>

<style scoped>
/* Floating animation for background elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Fade in up animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

/* Custom scrollbar for webkit browsers */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>