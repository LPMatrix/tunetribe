<template>
  <div class="layout-container flex h-full grow flex-col">
    <div class="px-40 flex flex-1 justify-center py-5">
      <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div class="flex flex-wrap justify-between gap-3 p-4">
          <div class="flex min-w-72 flex-col gap-3">
            <h1 class="text-white tracking-light text-[32px] font-bold leading-tight">October 2024 Playlist</h1>
            <p class="text-[#9daebe] text-sm font-normal leading-normal">Enjoy the latest hits from our team's Slack shares.</p>
          </div>
        </div>

        <div class="pb-3">
          <div class="flex border-b border-[#3d4d5c] px-4 gap-8">
            <router-link class="flex flex-col items-center justify-center border-b-[3px] border-b-[#dce8f3] text-white pb-[13px] pt-4" to="#">
              <p class="text-white text-sm font-bold leading-normal tracking-[0.015em]">Overview</p>
            </router-link>
            <router-link class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#9daebe] pb-[13px] pt-4" to="#">
              <p class="text-[#9daebe] text-sm font-bold leading-normal tracking-[0.015em]">Tracks</p>
            </router-link>
            <router-link class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#9daebe] pb-[13px] pt-4" to="#">
              <p class="text-[#9daebe] text-sm font-bold leading-normal tracking-[0.015em]">Related</p>
            </router-link>
          </div>
        </div>

        <div class="flex flex-col items-stretch gap-6 bg-[#141a1f] px-4 pb-4 pt-3 text-white">
          <div class="flex items-center justify-center py-7">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-64"
                 :style="`background-image: url('${albumArt}')`"></div>
          </div>
          <div class="text-center">
            <p class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] truncate">October 2024 Mix</p>
            <p class="text-[#9daebe] text-base font-normal leading-normal truncate">Paystack Team</p>
          </div>
          
          <PlayerControls />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayerControls from '../components/PlayerControls.vue'

export default {
  name: 'PlayerPage',
  components: {
    PlayerControls
  },
  data() {
    return {
      albumArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2jfx5_smIuManktu25qwKK6qlqi_6S86Hay57rfLZPenhieK-U-Xgw6Uj93v5e6grjebe60bz295FWAdCoSwJKzqIFCg9FChu-KBGIvCoK73EPVQbIP7jr3Gs7o6uNluZ8qf1r_23e_pr_LXAgYTIgeh1e8DRPeEu1KrEZ525ZfjLqQ-eatY-utyiCsX1sldFEPbwGC5rnnfhFzaV94RPieMtcGOq1Xz3hQhA0penp22p3aP2jAPsliDYWK5nDo8N1b39y_kbpJyo'
    }
  }
}
</script>