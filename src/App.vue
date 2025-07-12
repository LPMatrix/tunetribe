<template>
  <div id="app" class="min-h-screen bg-gray-900 text-white">
    <Header />
    <main class="flex-1 pb-20">
      <router-view />
    </main>
    
    <!-- Player Bar -->
    <PlayerBar />
    
    <!-- Toast Container -->
    <div id="toast-container" class="fixed top-4 right-4 z-50 space-y-2">
      <!-- Toasts will be dynamically added here -->
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import PlayerBar from './components/PlayerBar.vue';
import { initializePlayer } from './services/spotifyPlayer.js';
import authService from './services/auth.js';

export default {
  name: 'App',
  components: {
    Header,
    PlayerBar
  },
  async mounted() {
    // Simple toast system
    this.$toast = {
      success: (message) => this.showToast(message, 'success'),
      error: (message) => this.showToast(message, 'error'),
      info: (message) => this.showToast(message, 'info'),
      warning: (message) => this.showToast(message, 'warning')
    };
    
    // Make toast available globally
    this.$root.$toast = this.$toast;
    
    // Initialize Spotify player if user is authenticated
    try {
      const authStatus = await authService.getSpotifyAuthStatus();
      if (authStatus.access_token) {
        try {
          await initializePlayer();
          this.$toast.success('Spotify player ready!');
        } catch (error) {
          console.error('Failed to initialize Spotify player:', error);
          if (error.message.includes('Premium')) {
            this.$toast.warning('Spotify Premium required for playback');
          } else if (error.message.includes('access token')) {
            console.log('Access token issue, user may need to reconnect');
            // Don't show error toast for token issues, let user discover through UI
          } else {
            this.$toast.error('Failed to initialize player: ' + error.message);
          }
        }
      } else {
        console.log('User not authenticated with Spotify yet');
      }
    } catch (error) {
      console.log('No Spotify authentication available:', error.message);
    }
  },
  methods: {
    showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      
      const toast = document.createElement('div');
      const colors = {
        success: 'bg-green-600 border-green-500',
        error: 'bg-red-600 border-red-500',
        warning: 'bg-yellow-600 border-yellow-500',
        info: 'bg-blue-600 border-blue-500'
      };
      
      toast.className = `${colors[type]} border-l-4 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full opacity-0`;
      toast.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-white text-sm font-medium">${message}</span>
          <button class="ml-4 text-white hover:text-gray-200 focus:outline-none" onclick="this.parentElement.parentElement.remove()">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      `;
      
      container.appendChild(toast);
      
      // Animate in
      setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
      }, 100);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (toast.parentElement) {
          toast.classList.add('translate-x-full', 'opacity-0');
          setTimeout(() => {
            if (toast.parentElement) {
              toast.remove();
            }
          }, 300);
        }
      }, 5000);
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Focus styles */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Transition for all interactive elements */
button,
a,
input,
select,
textarea {
  transition: all 0.2s ease-in-out;
}
</style>