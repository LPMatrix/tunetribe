<template>
  <div class="layout-container flex h-full grow flex-col  min-h-screen">
    <div class="px-4 md:px-40 flex flex-1 justify-center py-5">
      <div class="layout-content-container flex flex-col max-w-[1200px] flex-1">
        
        <!-- Enhanced Header with Stats -->
        <div class="header bg-white bg-opacity-10 backdrop-blur-lg rounded p-8 mb-8 border border-white border-opacity-20">
          <div class="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div class="team-avatar w-20 h-20 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {{ getInitials(profileName) }}
            </div>
            <div class="team-details text-center md:text-left">
              <h1 class="text-white text-4xl font-bold mb-2">{{ profileName }}</h1>
              <div class="team-meta text-white text-opacity-80 text-lg">
                <span>🎵 {{ activeMembers }} active members</span> • 
                <span>📅 Member since {{ memberSince }}</span>
              </div>
            </div>
          </div>
          
          <!-- Stats Grid -->
          <div class="stats-grid grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div class="stat-card bg-white bg-opacity-10 p-5 rounded text-center border border-white border-opacity-10">
              <div class="stat-number text-3xl font-bold text-yellow-300 mb-1">{{ stats.songsThisMonth }}</div>
              <div class="stat-label text-white text-opacity-80 text-sm">Songs This Month</div>
            </div>
            <div class="stat-card bg-white bg-opacity-10 p-5 rounded text-center border border-white border-opacity-10">
              <div class="stat-number text-3xl font-bold text-yellow-300 mb-1">{{ stats.playlistsCreated }}</div>
              <div class="stat-label text-white text-opacity-80 text-sm">Playlists Created</div>
            </div>
            <div class="stat-card bg-white bg-opacity-10 p-5 rounded text-center border border-white border-opacity-10">
              <div class="stat-number text-3xl font-bold text-yellow-300 mb-1">{{ stats.activeSharers }}</div>
              <div class="stat-label text-white text-opacity-80 text-sm">Active Sharers</div>
            </div>
            <div class="stat-card bg-white bg-opacity-10 p-5 rounded text-center border border-white border-opacity-10">
              <div class="stat-number text-3xl font-bold text-yellow-300 mb-1">{{ stats.totalPlays }}</div>
              <div class="stat-label text-white text-opacity-80 text-sm">Total Plays</div>
            </div>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="pb-3 mb-6">
          <div class="flex border-b border-gray-400 border-opacity-30 px-4 gap-8">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 transition-colors',
                activeTab === tab.id 
                  ? 'border-b-blue-400 text-white' 
                  : 'border-b-transparent text-blue-200 hover:text-white'
              ]"
            >
              <p :class="[
                'text-sm font-bold leading-normal tracking-[0.015em]',
                activeTab === tab.id ? 'text-white' : 'text-blue-200'
              ]">{{ tab.name }}</p>
            </button>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="main-content grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2 flex flex-col gap-8">
            
            <!-- Current Month Playlist (when on Overview tab) -->
            <div v-if="activeTab === 'overview'" class="card bg-gradient-to-r from-green-500 to-green-600 rounded p-8 text-white">
              <h2 class="text-white text-2xl font-bold mb-6 flex items-center gap-3">
                🎵 {{ currentPlaylist.title }}
              </h2>
              <div class="playlist-cover w-full h-48 bg-white bg-opacity-10 rounded mb-6 flex items-center justify-center text-5xl relative overflow-hidden">
                🎼
                <div class="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-20"></div>
              </div>
              <div class="playlist-info text-center">
                <div class="playlist-title text-xl font-bold mb-4">{{ currentPlaylist.name }}</div>
                <div class="playlist-stats flex justify-center gap-8 mb-6">
                  <div class="playlist-stat text-center">
                    <span class="playlist-stat-number text-2xl font-bold block">{{ currentPlaylist.songCount }}</span>
                    <span class="playlist-stat-label text-sm opacity-80">Songs</span>
                  </div>
                  <div class="playlist-stat text-center">
                    <span class="playlist-stat-number text-2xl font-bold block">{{ currentPlaylist.duration }}</span>
                    <span class="playlist-stat-label text-sm opacity-80">Duration</span>
                  </div>
                  <div class="playlist-stat text-center">
                    <span class="playlist-stat-number text-2xl font-bold block">{{ currentPlaylist.plays }}</span>
                    <span class="playlist-stat-label text-sm opacity-80">Plays</span>
                  </div>
                </div>
                <button class="btn bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all hover:transform hover:-translate-y-1">
                  🎧 Open in Spotify
                </button>
              </div>
            </div>

            <!-- Top Tracks / Recently Added -->
            <div class="card bg-white bg-opacity-95 rounded p-8 shadow-xl">
              <h2 v-if="activeTab === 'overview'" class="text-gray-800 text-2xl font-bold mb-6 flex items-center gap-3">
                🎵 Recently Added
              </h2>
              <h2 v-else-if="activeTab === 'playlists'" class="text-gray-800 text-2xl font-bold mb-6">
                Your Playlists
              </h2>
              <h2 v-else class="text-gray-800 text-2xl font-bold mb-6">
                Liked Songs
              </h2>
              
              <!-- Playlist Grid for Playlists tab -->
              <div v-if="activeTab === 'playlists'" class="playlists-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  v-for="playlist in userPlaylists" 
                  :key="playlist.id"
                  @click="openPlaylist(playlist)"
                  class="playlist-card bg-gray-50 rounded p-6 cursor-pointer hover:bg-gray-100 transition-colors hover:transform hover:-translate-y-1"
                >
                  <div class="playlist-cover w-full h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl mb-4 flex items-center justify-center text-3xl text-white">
                    🎼
                  </div>
                  <div class="playlist-title font-bold text-gray-800 mb-2">{{ playlist.name }}</div>
                  <div class="playlist-meta text-gray-600 text-sm">{{ playlist.trackCount }} tracks</div>
                </div>
              </div>
            </div>

            <!-- Archive (Overview only) -->
            <div v-if="activeTab === 'overview'" class="card bg-white bg-opacity-95 rounded p-8 shadow-xl">
              <h2 class="text-gray-800 text-2xl font-bold mb-6 flex items-center gap-3">
                📁 Playlist Archive
              </h2>
              <div class="archive-grid grid grid-cols-2 md:grid-cols-4 gap-5">
                <div 
                  v-for="archive in playlistArchive" 
                  :key="archive.month"
                  @click="openArchive(archive)"
                  class="archive-item bg-gray-50 rounded-xl p-5 text-center cursor-pointer hover:bg-gray-100 transition-all hover:transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div class="archive-month font-bold text-gray-800 mb-2">{{ archive.month }}</div>
                  <div class="archive-tracks text-gray-600 text-sm">{{ archive.trackCount }} tracks</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Sidebar -->
          <div class="right-column flex flex-col gap-8">
            
            <!-- Integration Status -->
            <div class="card bg-white bg-opacity-95 rounded p-6 shadow-xl">
              <h2 class="text-gray-800 text-xl font-bold mb-5 flex items-center gap-2">
                ⚙️ Integration Status
              </h2>
              <div class="integration-status flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-5">
                <div class="status-indicator w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div class="font-semibold text-gray-800">Connected</div>
                  <div class="text-sm text-gray-600">Bot is active in your Telegram group</div>
                </div>
              </div>
              
              <div class="text-sm mb-4 space-y-2">
                <div><strong>Telegram Group:</strong> {{ telegramGroup }}</div>
                <div><strong>Bot Status:</strong> <span class="text-green-500">●</span> Online</div>
                <div><strong>Last Activity:</strong> {{ lastActivity }}</div>
              </div>
              
              <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-300 w-full py-3 px-4 rounded font-semibold mb-3 transition-colors">
                📋 Copy Bot Link
              </button>
              <button class="btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white w-full py-3 px-4 rounded font-semibold transition-all hover:transform hover:-translate-y-1">
                🔧 Bot Settings
              </button>
            </div>

            <!-- Settings -->
            <div class="card bg-white bg-opacity-95 rounded p-6 shadow-xl">
              <h2 class="text-gray-800 text-xl font-bold mb-5 flex items-center gap-2">
                ⚙️ Team Settings
              </h2>
              
              <div class="settings-section space-y-4">
                <div 
                  v-for="setting in teamSettings" 
                  :key="setting.id"
                  class="settings-item flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div>
                    <div class="settings-label font-medium text-gray-800">{{ setting.label }}</div>
                    <div class="settings-description text-gray-600 text-sm mt-1">{{ setting.description }}</div>
                  </div>
                  <div 
                    @click="toggleSetting(setting)"
                    :class="[
                      'toggle-switch relative w-12 h-6 rounded-full cursor-pointer transition-colors',
                      setting.enabled ? 'bg-green-500' : 'bg-gray-300'
                    ]"
                  >
                    <div 
                      :class="[
                        'absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform',
                        setting.enabled ? 'transform translate-x-6 left-0.5' : 'left-0.5'
                      ]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Active Members -->
            <div class="card bg-white bg-opacity-95 rounded p-6 shadow-xl">
              <h2 class="text-gray-800 text-xl font-bold mb-5 flex items-center gap-2">
                👥 Active Members
              </h2>
              <div class="space-y-4 mb-5">
                <div 
                  v-for="member in teamMembers" 
                  :key="member.id"
                  class="flex items-center gap-3"
                >
                  <div :class="[
                    'w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm',
                    member.avatarColor
                  ]">
                    {{ getInitials(member.name) }}
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold text-gray-800">{{ member.name }}</div>
                    <div class="text-sm text-gray-600">{{ member.songsShared }} songs shared</div>
                  </div>
                </div>
              </div>
              <button class="btn bg-gray-200 text-gray-700 hover:bg-gray-300 w-full py-3 px-4 rounded font-semibold transition-colors">
                👥 Manage Members
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      // Profile data
      profileName: 'Design Team',
      activeMembers: 12,
      memberSince: 'Nov 2024',
      telegramGroup: 'Design Team Chat',
      lastActivity: '2 hours ago',
      
      // Active tab
      activeTab: 'overview',
      
      // Navigation tabs
      tabs: [
        { id: 'overview', name: 'Overview' },
        { id: 'playlists', name: 'Playlists' },
      ],
      
      // Stats
      stats: {
        songsThisMonth: 127,
        playlistsCreated: 6,
        activeSharers: 8,
        totalPlays: '2.4k'
      },
      
      // Current playlist
      currentPlaylist: {
        title: 'December 2024 Playlist',
        name: 'Design Team Vibes - December',
        songCount: 32,
        duration: '2h 18m',
        plays: 156
      },
      
      // Recent tracks
      recentTracks: [
        { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', timeAgo: '2 hours ago' },
        { id: 2, title: 'Levitating', artist: 'Dua Lipa', timeAgo: '5 hours ago' },
        { id: 3, title: 'Good 4 U', artist: 'Olivia Rodrigo', timeAgo: '1 day ago' },
        { id: 4, title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', timeAgo: '2 days ago' },
        { id: 5, title: 'Peaches', artist: 'Justin Bieber ft. Daniel Caesar', timeAgo: '3 days ago' }
      ],
      
      // Liked tracks
      likedTracks: [
        { id: 1, title: 'Ho Hey', artist: 'The Lumineers', timeAgo: '1 week ago' },
        { id: 2, title: 'Somebody That I Used to Know', artist: 'Gotye', timeAgo: '2 weeks ago' },
        { id: 3, title: 'Counting Stars', artist: 'OneRepublic', timeAgo: '1 month ago' },
        { id: 4, title: 'Radioactive', artist: 'Imagine Dragons', timeAgo: '1 month ago' }
      ],
      
      // User playlists
      userPlaylists: [
        { id: 1, name: 'December 2024 Playlist', trackCount: 32 },
        { id: 2, name: 'Chill Vibes', trackCount: 45 },
        { id: 3, name: 'Work Focus', trackCount: 28 },
        { id: 4, name: 'Friday Mix', trackCount: 38 },
        { id: 5, name: 'Road Trip Hits', trackCount: 52 },
        { id: 6, name: 'Late Night Sessions', trackCount: 24 }
      ],
      
      // Playlist archive
      playlistArchive: [
        { month: 'November 2024', trackCount: 28 },
        { month: 'October 2024', trackCount: 35 },
        { month: 'September 2024', trackCount: 22 },
        { month: 'August 2024', trackCount: 41 }
      ],
      
      // Team settings
      teamSettings: [
        { id: 1, label: 'Auto-Generate Playlists', description: 'Create monthly playlists automatically', enabled: true },
        { id: 2, label: 'Public Playlists', description: 'Make playlists discoverable by others', enabled: false },
        { id: 3, label: 'Duplicate Detection', description: 'Prevent duplicate songs in playlists', enabled: true },
        { id: 4, label: 'Notifications', description: 'Get notified when playlists are created', enabled: true }
      ],
      
      // Team members
      teamMembers: [
        { id: 1, name: 'Sarah Miller', songsShared: 15, avatarColor: 'bg-gradient-to-r from-red-400 to-yellow-400' },
        { id: 2, name: 'John Doe', songsShared: 12, avatarColor: 'bg-gradient-to-r from-blue-500 to-purple-600' },
        { id: 3, name: 'Alex Lee', songsShared: 8, avatarColor: 'bg-gradient-to-r from-teal-500 to-green-600' }
      ]
    }
  },
  methods: {
    getInitials(name) {
      return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    },
    
    toggleSetting(setting) {
      setting.enabled = !setting.enabled;
    },
    
    playTrack(track) {
      alert(`Playing: ${track.title} by ${track.artist}`);
    },
    
    openPlaylist(playlist) {
      alert(`Opening playlist: ${playlist.name}`);
    },
    
    openArchive(archive) {
      alert(`Opening playlist for ${archive.month}`);
    }
  }
}
</script>
