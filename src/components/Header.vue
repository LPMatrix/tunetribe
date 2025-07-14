<template>
  <header class="bg-gradient-to-r from-gray-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-sm border-b border-purple-500/20 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 3a1 1 0 0 0-1.196-.98l-10 2A1 1 0 0 0 6 5v6.114A4.369 4.369 0 0 0 5 11a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V5.82l8-1.6v5.894A4.369 4.369 0 0 0 10 10a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V4a1 1 0 0 0 1-1h6z"/>
            </svg>
          </div>
          <router-link 
            to="/" 
            class="text-white text-xl font-bold hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400 hover:bg-clip-text hover:text-transparent transition-all duration-200"
          >
            TuneTribe
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link 
            to="/" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/' }"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </router-link>
          
          <router-link 
            to="/connect" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/connect' }"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Connect
          </router-link>
          
          <router-link 
            to="/playlists" 
            class="nav-link"
            :class="{ 'nav-link-active': $route.path === '/playlists' }"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            Playlists
          </router-link>
        </nav>

        <!-- Connection Status & Profile -->
        <div class="flex items-center gap-4">
          <!-- Connection Status Indicator -->
          <div class="hidden sm:flex items-center gap-2">
            <div 
              :class="authStatus === true ? 'bg-green-400' : authStatus === false ? 'bg-red-400' : 'bg-yellow-400'" 
              class="w-2 h-2 rounded-full"
            ></div>
            <span class="text-sm text-purple-200">
              {{ authStatus === true ? 'Connected' : authStatus === false ? 'Disconnected' : 'Checking...' }}
            </span>
          </div>

          <!-- Mobile Menu Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-lg text-purple-300 hover:text-white hover:bg-purple-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!mobileMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-purple-500/30 py-4">
        <nav class="space-y-2">
          <router-link 
            to="/" 
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </router-link>
          
          <router-link 
            to="/connect" 
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/connect' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Connect
          </router-link>
          
          <router-link 
            to="/playlists" 
            @click="mobileMenuOpen = false"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': $route.path === '/playlists' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            Playlists
          </router-link>
        </nav>
        
        <!-- Mobile Connection Status -->
        <div class="mt-4 pt-4 border-t border-purple-500/30">
          <div class="flex items-center gap-3 px-3 py-2">
            <div 
              :class="authStatus === true ? 'bg-green-400' : authStatus === false ? 'bg-red-400' : 'bg-yellow-400'" 
              class="w-3 h-3 rounded-full"
            ></div>
            <span class="text-sm text-purple-200">
              Spotify {{ authStatus === true ? 'Connected' : authStatus === false ? 'Disconnected' : 'Checking...' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import authService from '../services/auth';

export default {
  name: 'AppHeader',
  data() {
    return {
      authStatus: null,
      mobileMenuOpen: false,
      authCheckInterval: null
    };
  },
  async mounted() {
    await this.checkAuthStatus();
    
    // Check auth status periodically (reduced frequency due to caching)
    this.authCheckInterval = setInterval(this.checkAuthStatus, 60000); // Check every 60 seconds
  },
  beforeUnmount() {
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval);
    }
  },
  methods: {
    async checkAuthStatus() {
      try {
        console.log('Header: Checking auth status...');
        const status = await authService.getSpotifyAuthStatus();
        console.log('Header: Auth status response:', status);
        this.authStatus = status.authorized;
        console.log('Header: Set authStatus to:', this.authStatus);
      } catch (error) {
        console.error('Header: Failed to check auth status:', error);
        this.authStatus = false;
      }
    }
  }
};
</script>

<style scoped>
/* Navigation Link Styles */
.nav-link {
  @apply flex items-center px-3 py-2 text-sm font-medium text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200;
}

.nav-link-active {
  @apply text-white bg-gradient-to-r from-purple-600/50 to-blue-600/50 backdrop-blur-sm border border-purple-500/30;
}

.mobile-nav-link {
  @apply flex items-center px-3 py-2 text-base font-medium text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200;
}

.mobile-nav-link-active {
  @apply text-white bg-gradient-to-r from-purple-600/50 to-blue-600/50 backdrop-blur-sm border border-purple-500/30;
}
</style>