<template>
  <div class="relative flex size-full min-h-screen flex-col bg-[#101a23] text-white" style='font-family: "Work Sans", "Noto Sans", sans-serif;'>
    <div class="flex-1 px-10 py-8 max-w-6xl mx-auto w-full">
      <div class="mb-8">
        <h2 class="text-[32px] font-bold leading-tight mb-2">October 2024 Playlist</h2>
        <p class="text-[#9daebe] text-sm">Enjoy the latest hits from our team's Telegram shares.</p>
      </div>

      <div class="bg-[#141a1f] rounded-xl p-6 mb-8">
        <div class="flex flex-col items-center">
          <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-64 mb-6"
               :style="`background-image: url('${playlistImage}')`"></div>
          
          <div class="text-center mb-6">
            <h3 class="text-[22px] font-bold leading-tight tracking-[-0.015em] mb-1">October 2024 Mix</h3>
            <!-- <p class="text-[#9daebe] text-base">Paystack Team</p> -->
          </div>
          
          <PlayerControls />
        </div>
      </div>

      <div>
        <h2 class="text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">Tracks</h2>
        
        <div class="bg-[#101a23] rounded-xl overflow-hidden">
          <div class="divide-y divide-[#314d68]">
            <div v-for="track in tracks" :key="track.id" class="flex items-center gap-4 p-4 hover:bg-[#1a2730] transition-colors cursor-pointer">
              <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 flex-shrink-0"
                   :style="`background-image: url('${track.image}')`"></div>
              <div class="flex-1 min-w-0">
                <p class="text-white text-sm font-medium truncate">{{ track.title }}</p>
                <p class="text-[#90aecb] text-sm truncate">{{ track.artist }}</p>
              </div>
              <div class="text-[#90aecb] text-sm">{{ track.duration }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerControls from '../components/PlayerControls.vue'

export default {
  name: 'TracksPage',
  components: {
    PlayerControls
  },
  data() {
    return {
      playlistImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2jfx5_smIuManktu25qwKK6qlqi_6S86Hay57rfLZPenhieK-U-Xgw6Uj93v5e6grjebe60bz295FWAdCoSwJKzqIFCg9FChu-KBGIvCoK73EPVQbIP7jr3Gs7o6uNluZ8qf1r_23e_pr_LXAgYTIgeh1e8DRPeEu1KrEZ525ZfjLqQ-eatY-utyiCsX1sldFEPbwGC5rnnfhFzaV94RPieMtcGOq1Xz3hQhA0penp22p3aP2jAPsliDYWK5nDo8N1b39y_kbpJyo',
      tracks: [
        { id: 1, title: 'Midnight Groove', artist: 'Stella Rivers', duration: '3:45', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlzoclJoPJ6obyBlW-sQ0FZiZzRFZegQDnq4AzjX-SQ-JSClVW6SbzkiB0SYG4yunW_Xlac1331PFD3m0QRGlKS7oXu85GB4I7oimPxgxxW5-TSEVPzra6wEUw_rlMOoENJiLCTzzrskvpMKEbMfB3Uj6RB61GdzYyOZboqLqT7ntD5NVdKIM2vg_En7kOorV5LKk0gSaDICLDMQp8K3qUhIanK0dr0-l6jaKmXHd2lOHyDzIKt3bMyOXOi0zEnC0ICSQH69Gvv9DN' },
        { id: 1, title: 'Midnight Groove', artist: 'Stella Rivers', duration: '3:45', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlzoclJoPJ6obyBlW-sQ0FZiZzRFZegQDnq4AzjX-SQ-JSClVW6SbzkiB0SYG4yunW_Xlac1331PFD3m0QRGlKS7oXu85GB4I7oimPxgxxW5-TSEVPzra6wEUw_rlMOoENJiLCTzzrskvpMKEbMfB3Uj6RB61GdzYyOZboqLqT7ntD5NVdKIM2vg_En7kOorV5LKk0gSaDICLDMQp8K3qUhIanK0dr0-l6jaKmXHd2lOHyDzIKt3bMyOXOi0zEnC0ICSQH69Gvv9DN' },
        { id: 1, title: 'Midnight Groove', artist: 'Stella Rivers', duration: '3:45', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlzoclJoPJ6obyBlW-sQ0FZiZzRFZegQDnq4AzjX-SQ-JSClVW6SbzkiB0SYG4yunW_Xlac1331PFD3m0QRGlKS7oXu85GB4I7oimPxgxxW5-TSEVPzra6wEUw_rlMOoENJiLCTzzrskvpMKEbMfB3Uj6RB61GdzYyOZboqLqT7ntD5NVdKIM2vg_En7kOorV5LKk0gSaDICLDMQp8K3qUhIanK0dr0-l6jaKmXHd2lOHyDzIKt3bMyOXOi0zEnC0ICSQH69Gvv9DN' },
        { id: 1, title: 'Midnight Groove', artist: 'Stella Rivers', duration: '3:45', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlzoclJoPJ6obyBlW-sQ0FZiZzRFZegQDnq4AzjX-SQ-JSClVW6SbzkiB0SYG4yunW_Xlac1331PFD3m0QRGlKS7oXu85GB4I7oimPxgxxW5-TSEVPzra6wEUw_rlMOoENJiLCTzzrskvpMKEbMfB3Uj6RB61GdzYyOZboqLqT7ntD5NVdKIM2vg_En7kOorV5LKk0gSaDICLDMQp8K3qUhIanK0dr0-l6jaKmXHd2lOHyDzIKt3bMyOXOi0zEnC0ICSQH69Gvv9DN' },

        // Add more tracks...
      ]
    }
  }
}
</script>