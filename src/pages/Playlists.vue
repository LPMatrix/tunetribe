<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Header -->
    <div class="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div class="text-center sm:text-left">
            <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Your Playlists
            </h1>
            <p class="text-xl text-gray-300 max-w-2xl">
              Manage your Spotify playlists and add tracks from Telegram messages.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 animate-pulse">
            <div class="bg-gradient-to-br from-gray-700 to-gray-600 h-48 rounded-xl mb-6"></div>
            <div class="bg-gray-700 h-6 rounded-lg mb-3"></div>
            <div class="bg-gray-700 h-4 rounded-lg w-3/4 mb-4"></div>
            <div class="flex gap-3">
              <div class="flex-1 bg-gray-700 h-10 rounded-xl"></div>
              <div class="w-12 bg-gray-700 h-10 rounded-xl"></div>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <div class="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 max-w-md mx-auto">
            <div class="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-red-400 mb-3">Failed to Load Playlists</h3>
            <p class="text-red-300 text-sm mb-6 leading-relaxed">{{ error }}</p>
            <button
              @click="loadPlaylists"
              class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="playlists.length === 0" class="text-center py-16">
          <div class="max-w-md mx-auto">
            <div class="relative mb-8">
              <div class="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mx-auto flex items-center justify-center">
                <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">No Playlists Found</h3>
            <p class="text-gray-400 mb-8 text-lg leading-relaxed">
              You don't have any playlists yet. Your Spotify playlists will appear here.
            </p>
          </div>
        </div>

        <!-- Playlists Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="playlist in playlists"
            :key="playlist.id"
            class="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 transform hover:scale-105 hover:border-purple-500/30 cursor-pointer"
            @click="navigateToPlaylist(playlist.id)"
          >
            <!-- Playlist Cover -->
            <div class="relative aspect-square bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
              <img
                v-if="playlist.images?.[0]?.url"
                :src="playlist.images[0].url"
                :alt="playlist.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                <svg class="w-16 h-16 text-gray-400 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              
              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- TuneTribe Badge -->
              <div v-if="isTuneTribePlaylist(playlist)" class="absolute top-3 right-3">
                <span class="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  TuneTribe
                </span>
              </div>
            </div>

            <!-- Playlist Info -->
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 truncate group-hover:text-purple-300 transition-colors duration-300" :title="playlist.name">
                {{ playlist.name }}
              </h3>
              <p class="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                {{ playlist.description || 'No description' }}
              </p>
              
              <div class="flex items-center justify-between text-sm text-gray-400 mb-6">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  {{ playlist.tracks?.total || 0 }} tracks
                </span>
                <span v-if="playlist.public !== undefined" class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="playlist.public" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {{ playlist.public ? 'Public' : 'Private' }}
                </span>
              </div>

              <!-- Actions -->
              <div class="flex gap-3">
                <a
                  :href="playlist.external_urls?.spotify"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 text-sm shadow-lg hover:shadow-green-500/25"
                >
                  Open in Spotify
                </a>
                <button
                  @click="showAddTracksModal(playlist)"
                  class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                  title="Add tracks from Telegram"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Add Tracks Modal -->
    <div v-if="showAddTracksModalVisible" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <h3 class="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
          Add Tracks to "{{ selectedPlaylist?.name }}"
        </h3>
        
        <!-- Date Range Selection -->
        <div class="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-3">From Date</label>
            <input
              v-model="trackSelection.fromDate"
              type="date"
              class="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-3">To Date</label>
            <input
              v-model="trackSelection.toDate"
              type="date"
              class="w-full bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        <button
          @click="loadAvailableTracks"
          :disabled="loadingTracks"
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 mb-6"
        >
          {{ loadingTracks ? 'Loading...' : 'Load Available Tracks' }}
        </button>

        <!-- Available Tracks -->
        <div v-if="availableTracks.length > 0" class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <h4 class="text-lg font-bold text-white">Available Tracks ({{ availableTracks.length }})</h4>
            <div class="flex gap-3">
              <button
                @click="selectAllTracks"
                class="text-sm bg-gray-600/50 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Select All
              </button>
              <button
                @click="deselectAllTracks"
                class="text-sm bg-gray-600/50 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Deselect All
              </button>
            </div>
          </div>
          
          <div class="space-y-3 max-h-60 overflow-y-auto">
            <label
              v-for="track in availableTracks"
              :key="track.id"
              class="flex items-center p-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-xl hover:bg-gray-600/50 hover:border-purple-500/30 cursor-pointer transition-all duration-300"
            >
              <input
                v-model="selectedTracks"
                :value="track.id"
                type="checkbox"
                class="mr-4 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
              />
              <img
                v-if="track.album?.images?.[2]?.url"
                :src="track.album.images[2].url"
                :alt="track.name"
                class="w-12 h-12 rounded-lg mr-4 shadow-lg"
              />
              <div class="flex-1 min-w-0">
                <p class="font-semibold truncate text-white">{{ track.name }}</p>
                <p class="text-sm text-gray-400 truncate">
                  {{ track.artists?.map(a => a.name).join(', ') }}
                </p>
              </div>
            </label>
          </div>
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="showAddTracksModalVisible = false"
            class="flex-1 bg-gray-600/50 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            @click="addSelectedTracks"
            :disabled="addingTracks || selectedTracks.length === 0"
            class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            {{ addingTracks ? 'Adding...' : `Add ${selectedTracks.length} Tracks` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import playlistService from '../services/playlists';

export default {
  name: 'PlaylistsPage',
  data() {
    return {
      loading: true,
      error: null,
      playlists: [],
      
      // Create playlist modal
      showCreatePlaylistModal: false,
      creatingPlaylist: false,
      newPlaylist: {
        name: '',
        description: '',
        public: false
      },
      
      // Monthly playlist modal
      showMonthlyModal: false,
      creatingMonthlyPlaylist: false,
      monthlyPlaylist: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
      },
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      
      // Add tracks modal
      showAddTracksModalVisible: false,
      selectedPlaylist: null,
      loadingTracks: false,
      addingTracks: false,
      availableTracks: [],
      selectedTracks: [],
      trackSelection: {
        fromDate: '',
        toDate: ''
      }
    };
  },
  async mounted() {
    await this.loadPlaylists();
    this.setDefaultDateRange();
  },
  methods: {
    async loadPlaylists() {
      this.loading = true;
      this.error = null;
      try {
        this.playlists = await playlistService.getUserPlaylists();
      } catch (error) {
        console.error('Failed to load playlists:', error);
        this.error = error.message || 'Failed to load playlists';
      } finally {
        this.loading = false;
      }
    },
    
    async createPlaylist() {
      this.creatingPlaylist = true;
      try {
        const playlist = await playlistService.createPlaylist(
          this.newPlaylist.name,
          this.newPlaylist.description,
          this.newPlaylist.public
        );
        
        this.playlists.unshift(playlist);
        this.showCreatePlaylistModal = false;
        this.resetNewPlaylist();
        this.$toast?.success(`Created playlist: ${playlist.name}`);
      } catch (error) {
        console.error('Failed to create playlist:', error);
        this.$toast?.error(error.message || 'Failed to create playlist');
      } finally {
        this.creatingPlaylist = false;
      }
    },
    
    async createMonthlyPlaylist() {
      this.creatingMonthlyPlaylist = true;
      try {
        const result = await playlistService.createMonthlyPlaylist(
          this.monthlyPlaylist.year,
          this.monthlyPlaylist.month
        );
        
        if (result.playlist) {
          this.playlists.unshift(result.playlist);
          this.showMonthlyModal = false;
          this.$toast?.success(`Created playlist: ${result.playlist.name}`);
        } else {
          this.$toast?.info('No tracks found for the selected month');
        }
      } catch (error) {
        console.error('Failed to create monthly playlist:', error);
        this.$toast?.error(error.message || 'Failed to create monthly playlist');
      } finally {
        this.creatingMonthlyPlaylist = false;
      }
    },
    
    showAddTracksModal(playlist) {
      this.selectedPlaylist = playlist;
      this.showAddTracksModalVisible = true;
      this.availableTracks = [];
      this.selectedTracks = [];
    },
    
    async loadAvailableTracks() {
      if (!this.trackSelection.fromDate || !this.trackSelection.toDate) {
        this.$toast?.error('Please select both from and to dates');
        return;
      }
      
      this.loadingTracks = true;
      try {
        const links = await playlistService.getSpotifyLinksInRange(
          this.trackSelection.fromDate,
          this.trackSelection.toDate
        );
        
        if (links.length === 0) {
          this.$toast?.info('No Spotify links found in the selected date range');
          this.availableTracks = [];
          return;
        }
        
        const trackIds = links.map(link => playlistService.extractSpotifyId(link.url)).filter(Boolean);
        if (trackIds.length === 0) {
          this.$toast?.info('No valid track IDs found');
          this.availableTracks = [];
          return;
        }
        
        this.availableTracks = await playlistService.getTrackDetailsBatch(trackIds);
        this.selectedTracks = [];
      } catch (error) {
        console.error('Failed to load tracks:', error);
        this.$toast?.error(error.message || 'Failed to load tracks');
      } finally {
        this.loadingTracks = false;
      }
    },
    
    async addSelectedTracks() {
      if (this.selectedTracks.length === 0) return;
      
      this.addingTracks = true;
      try {
        await playlistService.addTracksToPlaylist(
          this.selectedPlaylist.id,
          this.selectedTracks
        );
        
        this.showAddTracksModalVisible = false;
        this.$toast?.success(`Added ${this.selectedTracks.length} tracks to ${this.selectedPlaylist.name}`);
        
        // Refresh playlists to update track counts
        await this.loadPlaylists();
      } catch (error) {
        console.error('Failed to add tracks:', error);
        this.$toast?.error(error.message || 'Failed to add tracks');
      } finally {
        this.addingTracks = false;
      }
    },
    
    selectAllTracks() {
      this.selectedTracks = this.availableTracks.map(track => track.id);
    },
    
    deselectAllTracks() {
      this.selectedTracks = [];
    },
    
    setDefaultDateRange() {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      this.trackSelection.fromDate = firstDayOfMonth.toISOString().split('T')[0];
      this.trackSelection.toDate = lastDayOfMonth.toISOString().split('T')[0];
    },
    
    resetNewPlaylist() {
      this.newPlaylist = {
        name: '',
        description: '',
        public: false
      };
    },
    
    isTuneTribePlaylist(playlist) {
      return playlist.name.toLowerCase().includes('tunetribe') || 
             playlist.description?.toLowerCase().includes('tunetribe');
    },
    
    navigateToPlaylist(playlistId) {
      this.$router.push(`/playlist/${playlistId}`);
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.6);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.8);
}
</style>