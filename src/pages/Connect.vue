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
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Connect Your Services
          </h1>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect Spotify and Telegram to start creating collaborative playlists with your team.
          </p>
        </div>
      </div>
    </div>

    <!-- Connection Status Cards -->
    <div class="relative z-10 flex-1 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Spotify Connection Card -->
          <div class="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 transform hover:scale-105 hover:border-green-500/30">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:animate-pulse-slow">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold group-hover:text-green-300 transition-colors duration-300">Spotify</h3>
                  <p class="text-gray-400 text-sm">Music streaming platform</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div :class="spotifyStatusClass" class="w-3 h-3 rounded-full"></div>
                <span class="text-sm font-medium" :class="spotifyStatusTextClass">
                  {{ spotifyStatusText }}
                </span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div v-if="!loading && authStatus">
                <div v-if="authStatus.authorized" class="space-y-3">
                  <div class="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-green-400 font-medium">Connected Successfully</span>
                    </div>
                    <p class="text-green-300 text-sm">
                      Token expires: {{ formatDate(authStatus.expiresAt) }}
                    </p>
                  </div>
                  
                  <div class="flex gap-2">
                    <button
                      @click="refreshToken"
                      :disabled="refreshing"
                      class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      {{ refreshing ? 'Refreshing...' : 'Refresh Token' }}
                    </button>

                    <button
                      @click="revokeAuth"
                      :disabled="revoking"
                      class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      {{ revoking ? 'Disconnecting...' : 'Disconnect' }}
                    </button>
                  </div>
                </div>
                
                <div v-else class="space-y-3">
                  <div class="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4">
                    <div class="flex items-center gap-2 mb-2">
                      <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-yellow-400 font-medium">Authorization Required</span>
                    </div>
                    <p class="text-yellow-300 text-sm">
                      Connect your Spotify account to create and manage playlists.
                    </p>
                  </div>
                  
                  <button
                    @click="connectSpotify"
                    :disabled="connecting"
                    class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg v-if="connecting" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ connecting ? 'Connecting...' : 'Connect Spotify' }}
                  </button>
                </div>
              </div>
              
              <div v-else-if="loading" class="animate-pulse">
                <div class="bg-gray-700 h-20 rounded-lg mb-3"></div>
                <div class="bg-gray-700 h-10 rounded-lg"></div>
              </div>
            </div>
          </div>

          <!-- Telegram Connection Card -->
          <div class="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-105 hover:border-blue-500/30">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center group-hover:animate-pulse-slow">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold group-hover:text-blue-300 transition-colors duration-300">Telegram</h3>
                  <p class="text-gray-400 text-sm">Bot integration</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div :class="telegramStatusClass" class="w-3 h-3 rounded-full"></div>
                <span class="text-sm font-medium" :class="telegramStatusTextClass">
                  {{ telegramStatusText }}
                </span>
              </div>
            </div>
            
            <div class="space-y-4">
              <div v-if="telegramStats" class="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-3">
                  <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-blue-400 font-medium">Bot Active</span>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="text-gray-400">Total Messages</p>
                    <p class="text-white font-medium">{{ telegramStats.totalMessages }}</p>
                  </div>
                  <div>
                    <p class="text-gray-400">Spotify Links</p>
                    <p class="text-white font-medium">{{ telegramStats.totalSpotifyLinks }}</p>
                  </div>
                </div>
              </div>
              
              <div v-else class="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <span class="text-gray-400 font-medium">Server Configuration</span>
                </div>
                <p class="text-gray-300 text-sm">
                  Telegram bot is configured on the server. No additional setup required.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div v-if="authStatus?.authorized" class="mt-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-xl">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">🎉 You're All Set!</h3>
            <p class="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              Your services are connected. You can now create playlists from your Telegram messages and start building your musical timeline.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/playlists"
              class="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              <svg class="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              View Playlists
            </router-link>

          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script>
import authService from '../services/auth';
import playlistService from '../services/playlists';

export default {
  name: 'ConnectPage',

  data() {
    return {
      loading: true,
      authStatus: null,
      telegramStats: null,
      connecting: false,
      refreshing: false,
      revoking: false,

    };
  },
  computed: {
    spotifyStatusClass() {
      if (this.loading) return 'bg-gray-500';
      return this.authStatus?.authorized ? 'bg-green-500' : 'bg-red-500';
    },
    spotifyStatusText() {
      if (this.loading) return 'Checking...';
      return this.authStatus?.authorized ? 'Connected' : 'Not Connected';
    },
    spotifyStatusTextClass() {
      if (this.loading) return 'text-gray-400';
      return this.authStatus?.authorized ? 'text-green-400' : 'text-red-400';
    },
    telegramStatusClass() {
      return this.telegramStats ? 'bg-green-500' : 'bg-yellow-500';
    },
    telegramStatusText() {
      return this.telegramStats ? 'Active' : 'Configured';
    },
    telegramStatusTextClass() {
      return this.telegramStats ? 'text-green-400' : 'text-yellow-400';
    }
  },
  async mounted() {
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    const authResult = urlParams.get('auth');
    const errorMessage = urlParams.get('message');
    
    if (authResult === 'success') {
      this.$toast?.success('Successfully connected to Spotify!');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authResult === 'error') {
      const message = errorMessage ? decodeURIComponent(errorMessage) : 'Failed to connect to Spotify';
      this.$toast?.error(message);
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    await this.loadConnectionStatus();
  },
  methods: {
    async loadConnectionStatus() {
      this.loading = true;
      try {
        // Check Spotify auth status
        this.authStatus = await authService.getSpotifyAuthStatus();
        
        // Load Telegram stats
        try {
          const messages = await playlistService.getTelegramMessages();
          this.telegramStats = messages.stats;
        } catch (error) {
          console.warn('Could not load Telegram stats:', error);
        }
      } catch (error) {
        console.error('Failed to load connection status:', error);
      } finally {
        this.loading = false;
      }
    },
    async connectSpotify() {
      this.connecting = true;
      try {
        await authService.authorizeWithSpotify();
        await this.loadConnectionStatus();
        this.$toast?.success('Successfully connected to Spotify!');
      } catch (error) {
        console.error('Failed to connect Spotify:', error);
        this.$toast?.error(error.message || 'Failed to connect to Spotify');
      } finally {
        this.connecting = false;
      }
    },

    async refreshToken() {
      this.refreshing = true;
      try {
        await authService.refreshSpotifyToken();
        await this.loadConnectionStatus();
        this.$toast?.success('Token refreshed successfully!');
      } catch (error) {
        console.error('Failed to refresh token:', error);
        this.$toast?.error(error.message || 'Failed to refresh token');
      } finally {
        this.refreshing = false;
      }
    },
    async revokeAuth() {
      if (!confirm('Are you sure you want to disconnect Spotify? You will need to re-authorize to use the service.')) {
        return;
      }
      
      this.revoking = true;
      try {
        await authService.revokeSpotifyAuth();
        await this.loadConnectionStatus();
        this.$toast?.success('Successfully disconnected from Spotify');
      } catch (error) {
        console.error('Failed to revoke authorization:', error);
        this.$toast?.error(error.message || 'Failed to disconnect');
      } finally {
        this.revoking = false;
      }
    },


    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
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
</style>