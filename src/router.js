import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Archive from './pages/Archive.vue'
import Player from './pages/Player.vue'
import Playlist from './pages/Playlist.vue'
import Playlists from './pages/Playlists.vue'
import Profile from './pages/Profile.vue'
import Tracks from './pages/Tracks.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/archive', component: Archive },
  { path: '/player', component: Player },
  { path: '/playlist/:id', component: Playlist, props: true },
  { path: '/playlist/:id/tracks', component: Tracks, props: true },
  { path: '/playlists', component: Playlists },
  { path: '/profile', component: Profile },
  { path: '/tracks', component: Tracks }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router