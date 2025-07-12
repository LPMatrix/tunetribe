import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Connect from '../pages/Connect.vue';
import Playlists from '../pages/Playlists.vue';
import Playlist from '../pages/Playlist.vue';
import Tracks from '../pages/Tracks.vue';
import authService from '../services/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/connect',
    name: 'Connect',
    component: Connect
  },
  {
    path: '/playlists',
    name: 'Playlists',
    component: Playlists,
    meta: { requiresAuth: true }
  },
  {
    path: '/playlist/:id',
    name: 'Playlist',
    component: Playlist,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/playlist/:id/tracks',
    name: 'PlaylistTracks',
    component: Tracks,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => {
      // Handle Spotify OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      
      if (error) {
        console.error('OAuth error:', error);
        window.close();
        return;
      }
      
      if (code) {
        // Store the code for the parent window to handle
        window.opener?.postMessage({ type: 'spotify_auth_code', code }, window.location.origin);
        window.close();
      }
      
      return { template: '<div>Processing authentication...</div>' };
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard for protected routes
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const authStatus = await authService.getSpotifyAuthStatus();
      if (!authStatus.authorized) {
        // Redirect to connect page if not authorized
        next('/connect');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      next('/connect');
      return;
    }
  }
  next();
});

export default router;