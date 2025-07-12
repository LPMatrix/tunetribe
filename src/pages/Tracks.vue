<template>
  <div class="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden" style='font-family: "Work Sans", "Noto Sans", sans-serif;'>
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
      <div class="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -2s;"></div>
      <div class="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-float" style="animation-delay: -4s;"></div>
    </div>
    <div class="flex-1 px-10 py-8 max-w-6xl mx-auto w-full">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16 relative z-10">
        <div class="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20">
          <div class="flex flex-col items-center space-y-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p class="text-white/80">Loading playlist...</p>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16 relative z-10">
        <div class="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
          <div class="text-red-400 mb-4">{{ error }}</div>
          <button @click="loadPlaylistTracks" class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105">
            <i class="fas fa-redo mr-2"></i>
            Try Again
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div v-else-if="playlist" class="relative z-10 animate-fade-in-up">
        <div class="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-[32px] font-bold leading-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{{ playlist.name }}</h2>
            <button @click="goBackToPlaylist" class="bg-gradient-to-r from-gray-600/80 to-gray-700/80 hover:from-gray-700/90 hover:to-gray-800/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 border border-white/20">
              <i class="fas fa-arrow-left mr-2"></i>
              Back to Playlist
            </button>
          </div>
          <p class="text-white/70 text-sm">{{ playlist.description || 'All tracks from this playlist' }}</p>
        </div>

        <div class="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 mb-8">
          <div class="flex flex-col items-center">
            <div class="relative group">
              <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-64 mb-6 shadow-2xl border border-white/20"
                   :style="`background-image: url('${playlist.images?.[0]?.url || defaultPlaylistImage}')`"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
            
            <div class="text-center mb-6">
              <h3 class="text-[22px] font-bold leading-tight tracking-[-0.015em] mb-1 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{{ playlist.name }}</h3>
              <p class="text-white/70 text-base flex items-center justify-center">
                <i class="fas fa-music mr-2 text-purple-400"></i>
                {{ tracks.length }} tracks
              </p>
            </div>
            

          </div>
        </div>

         <div class="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 overflow-hidden">
           <div class="p-6 border-b border-white/20">
             <div class="flex items-center justify-between">
               <h2 class="text-[22px] font-bold leading-tight tracking-[-0.015em] bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent flex items-center">
                 <i class="fas fa-list-music mr-3 text-purple-400"></i>
                 Track List
               </h2>

             </div>
           </div>
           
           <div class="divide-y divide-white/10">
             <div v-if="tracks.length === 0" class="p-8 text-center">
               <div class="text-white/50 mb-2">
                 <i class="fas fa-music text-4xl mb-4"></i>
                 <p>No tracks found</p>
               </div>
             </div>
             <div v-for="(track, index) in tracks" :key="track.id || index" 
                   class="flex items-center gap-4 p-4 transition-all duration-200 group hover:bg-white/5">
                <div class="relative">
                  <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-xl w-12 h-12 flex-shrink-0 shadow-lg border border-white/20 transition-transform duration-200 group-hover:scale-105"
                       :style="`background-image: url('${track.album?.images?.[2]?.url || track.image || defaultTrackImage}')`"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-medium truncate transition-colors text-white group-hover:text-purple-200">{{ track.name || track.title }}</p>
                  </div>
                  <p class="text-white/60 text-sm truncate">{{ track.artists?.map(a => a.name).join(', ') || track.artist }}</p>
                </div>
                <div class="text-white/50 text-sm font-mono mr-4">{{ formatDuration(track.duration_ms) || track.duration }}</div>
                <PlayerControls :track="track" />
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
  name: 'TracksPage',
  components: {
    PlayerControls
  },
  props: {
    id: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      playlist: null,
      tracks: [],

      defaultPlaylistImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2jfx5_smIuManktu25qwKK6qlqi_6S86Hay57rfLZPenhieK-U-Xgw6Uj93v5e6grjebe60bz295FWAdCoSwJKzqIFCg9FChu-KBGIvCoK73EPVQbIP7jr3Gs7o6uNluZ8qf1r_23e_pr_LXAgYTIgeh1e8DRPeEu1KrEZ525ZfjLqQ-eatY-utyiCsX1sldFEPbwGC5rnnfhFzaV94RPieMtcGOq1Xz3hQhA0penp22p3aP2jAPsliDYWK5nDo8N1b39y_kbpJyo',
      defaultTrackImage: 'https://via.placeholder.com/64x64/333/fff?text=♪'
    }
  },
  async mounted() {
    if (this.id) {
      await this.loadPlaylistTracks();
    } else {
      // Fallback to hardcoded data if no ID provided (for standalone tracks page)
      this.loadFallbackData();
    }
  },

  watch: {
    id: {
      handler() {
        if (this.id) {
          this.loadPlaylistTracks();
        }
      },
      immediate: false
    }
  },
  methods: {
    async loadPlaylistTracks() {
      this.loading = true;
      this.error = null;
      try {
        this.playlist = await playlistService.getPlaylist(this.id);
        // Load all tracks from the playlist
        if (this.playlist.tracks?.items) {
          this.tracks = this.playlist.tracks.items.map(item => item.track);
        }
      } catch (error) {
        console.error('Failed to load playlist tracks:', error);
        this.error = error.message || 'Failed to load playlist tracks';
      } finally {
        this.loading = false;
      }
    },
    
    loadFallbackData() {
      // Fallback data for when accessed without playlist ID
      this.playlist = {
        name: 'October 2024 Playlist',
        description: 'Enjoy the latest hits from our team\'s Telegram shares.',
        images: [{ url: this.defaultPlaylistImage }]
      };
      this.tracks = [
        { id: 1, name: 'Midnight Groove', artists: [{ name: 'Stella Rivers' }], duration_ms: 225000, album: { images: [null, null, { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlzoclJoPJ6obyBlW-sQ0FZiZzRFZegQDnq4AzjX-SQ-JSClVW6SbzkiB0SYG4yunW_Xlac1331PFD3m0QRGlKS7oXu85GB4I7oimPxgxxW5-TSEVPzra6wEUw_rlMOoENJiLCTzzrskvpMKEbMfB3Uj6RB61GdzYyOZboqLqT7ntD5NVdKIM2vg_En7kOorV5LKk0gSaDICLDMQp8K3qUhIanK0dr0-l6jaKmXHd2lOHyDzIKt3bMyOXOi0zEnC0ICSQH69Gvv9DN' }] } },
        { id: 2, name: 'Electric Dreams', artists: [{ name: 'Leo Maxwell' }], duration_ms: 252000, album: { images: [null, null, { url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4RzIGapsz-ultH_6JE3DpPvLJLhEckidp24n2pYi_qAJSTCQ8AXW-dyt0t4DRp_6jiM0vjxYyoZmqjA6gqMiEYpV4sNrpcCr-gPRFb390b2oKDH3x6FP6_wiJ-CdMZT5twYb0GkDKyUMyl_m29Cz9dxE1_Vr9ccX81iBicGakwtf7xJmUztGPhCNl750Y6OIsGh-DMRoOfZbQgs_s_9kTtpcCV_l9jf4LFgsINg-nQ0aLvxV6vXwGkI-84UTjVLwTRhX0Gq8t_3ZM' }] } }
      ];
      this.loading = false;
    },
    
    goBackToPlaylist() {
      if (this.id) {
        this.$router.push(`/playlist/${this.id}`);
      } else {
        this.$router.push('/playlists');
      }
    },
    
    formatDuration(durationMs) {
      if (!durationMs) return '';
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    

  }
}
</script>

<style scoped>
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

/* Hide scrollbar */
::-webkit-scrollbar {
  display: none;
}

* {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>