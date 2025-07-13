<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style="animation-delay: 4s;"></div>
    </div>

    <!-- Hero Section -->
    <div class="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center">
          <!-- Logo/Brand Icon -->
          <div class="mb-8 animate-fade-in-up">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 3a1 1 0 0 0-1.196-.98l-10 2A1 1 0 0 0 6 5v6.114A4.369 4.369 0 0 0 5 11a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V5.82l8-1.6v5.894A4.369 4.369 0 0 0 10 10a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V4a1 1 0 0 0 1-1h6z"/>
              </svg>
            </div>
          </div>

          <h1 class="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up" style="animation-delay: 0.2s;">
            <span class="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Tune Tribe
            </span>
          </h1>
          
          <p class="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.4s;">
            Transform your team's shared music into 
            <span class="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
              curated monthly playlists
            </span>
            that tell your story
          </p>

          <!-- Stats Section -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 animate-fade-in-up" style="animation-delay: 0.6s;">
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white mb-2">{{ recentActivity?.totalTracks || '500+' }}</div>
              <div class="text-purple-300 text-sm uppercase tracking-wide">Curated Tracks</div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white mb-2">{{ playlists.length || '12' }}</div>
              <div class="text-purple-300 text-sm uppercase tracking-wide">Monthly Playlists</div>
            </div>
            <div class="text-center">
              <div class="text-3xl sm:text-4xl font-bold text-white mb-2">{{ recentActivity?.activeMembers || '25+' }}</div>
              <div class="text-purple-300 text-sm uppercase tracking-wide">Active Members</div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style="animation-delay: 0.8s;">
            <button
              @click="handleConnect"
              class="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/25"
            >
              <span>{{ isAuthenticated ? 'View Playlists' : 'Get Started' }}</span>
              <svg class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
              </svg>
            </button>
            <a
              href="/tracks"
              class="group inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20"
            >
              <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
              </svg>
              <span>Explore Music</span>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            How It <span class="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            Three simple steps to transform your team's music sharing into beautiful monthly playlists
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Step 1 -->
          <div class="group relative">
            <div class="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse-slow">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Share Your Tracks</h3>
              <p class="text-gray-300 leading-relaxed">
                Team members share their favorite songs through Telegram. Every track becomes part of your collective musical journey.
              </p>
              <div class="absolute top-4 right-4 text-6xl font-bold text-purple-500/20 group-hover:text-purple-400/30 transition-colors">
                01
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="group relative">
            <div class="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse-slow">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">AI Curation</h3>
              <p class="text-gray-300 leading-relaxed">
                Our intelligent system analyzes shared tracks, removes duplicates, and creates perfectly balanced playlists that flow naturally.
              </p>
              <div class="absolute top-4 right-4 text-6xl font-bold text-blue-500/20 group-hover:text-blue-400/30 transition-colors">
                02
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="group relative">
            <div class="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:animate-pulse-slow">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 0 0-1.196-.98l-10 2A1 1 0 0 0 6 5v6.114A4.369 4.369 0 0 0 5 11a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V5.82l8-1.6v5.894A4.369 4.369 0 0 0 10 10a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V4a1 1 0 0 0 1-1h6z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Monthly Playlists</h3>
              <p class="text-gray-300 leading-relaxed">
                Automatically generated Spotify playlists capture your team's musical evolution, creating a soundtrack to your shared experiences.
              </p>
              <div class="absolute top-4 right-4 text-6xl font-bold text-pink-500/20 group-hover:text-pink-400/30 transition-colors">
                03
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Call-to-Action -->
    <div class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-full h-full">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
      </div>
      
      <div class="relative max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 0 0-1.196-.98l-10 2A1 1 0 0 0 6 5v6.114A4.369 4.369 0 0 0 5 11a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V5.82l8-1.6v5.894A4.369 4.369 0 0 0 10 10a4 4 0 0 0 0 8c1.657 0 3-1.343 3-3s-1.343-3-3-3a3.96 3.96 0 0 0-2 .56V4a1 1 0 0 0 1-1h6z"/>
            </svg>
          </div>
        </div>
        
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
          Ready to Start Your
          <span class="block">Musical Journey?</span>
        </h2>
        
        <p class="text-xl sm:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join Tune Tribe today and turn your team's shared tracks into unforgettable playlists that tell your story.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/connect"
            class="group inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <span>Get Started Now</span>
            <svg class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12"></path>
            </svg>
          </a>
          <a
            href="/tracks"
            class="group inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          >
            <svg class="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
            </svg>
            <span>Explore Music</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../services/auth';
import playlistService from '../services/playlists';

export default {
  name: 'HomePage',
  data() {
    return {
      heroImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD7A3sfUYB014-2oevB1jvxwGHbtERS-70e6e6qFQw_LvRs3KrA1fUOVi7niTodfAf7WlXykypJYPV3AN2n5kWpquG4Le3qOZsAWK8X_NfoH9vd5wCHRAIJbqB7VbBpPW99lHrDuvdyELn5AXYpOlBecMdKKu3peruI05Om9pWptXq6dwauT6bBASuf918yT1nLB2c28h52XdnBO4xUTLHckhdTPe11qZGgmaBCnZ5lV01JaLb41iylFCvIMM7_e8fr617EuNzPg6CW',
      playlists: [],
      isAuthenticated: false,
      loading: true,
      authStatus: null,
      recentActivity: null
    };
  },
  async mounted() {
    await this.checkAuthStatus();
    await this.loadRecentPlaylists();
    await this.loadRecentActivity();
    this.loading = false;
  },
  methods: {
    async checkAuthStatus() {
      try {
        this.authStatus = await authService.getSpotifyAuthStatus();
        this.isAuthenticated = this.authStatus.authorized;
      } catch (error) {
        console.error('Failed to check auth status:', error);
        this.isAuthenticated = false;
      }
    },
    async loadRecentActivity() {
      try {
        const messages = await playlistService.getTelegramMessages();
        this.recentActivity = messages.stats;
      } catch (error) {
        console.error('Failed to load recent activity:', error);
      }
    },
    async handleConnect() {
      if (!this.isAuthenticated) {
        this.$router.push('/connect');
      } else {
        this.$router.push('/playlists');
      }
    }
  }
};
</script>

<style scoped>
/* Custom styles for enhanced hover effects and smooth scrolling */
.snap-x {
  scroll-snap-type: x mandatory;
}
.snap-center {
  scroll-snap-align: center;
}
</style>