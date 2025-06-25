<template>
  <div class="layout-container flex h-full grow flex-col">
    <div class="px-40 flex flex-1 justify-center py-5">
      <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div class="flex p-4 @container">
          <div class="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
            <div class="flex gap-4">
              <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                   :style="`background-image: url('${profileImage}')`"></div>
              <div class="flex flex-col justify-center">
                <p class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Sophia Bennett</p>
                <p class="text-[#90adcb] text-base font-normal leading-normal">@sophiab</p>
              </div>
            </div>
            <button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#223649] text-white text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] @[480px]:w-auto">
              <span class="truncate">Follow</span>
            </button>
          </div>
        </div>

        <div class="pb-3">
          <div class="flex border-b border-[#314d68] px-4 gap-8">
            <router-link class="flex flex-col items-center justify-center border-b-[3px] border-b-[#0c7ff2] text-white pb-[13px] pt-4" to="#">
              <p class="text-white text-sm font-bold leading-normal tracking-[0.015em]">Overview</p>
            </router-link>
            <router-link class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#90adcb] pb-[13px] pt-4" to="#">
              <p class="text-[#90adcb] text-sm font-bold leading-normal tracking-[0.015em]">Playlists</p>
            </router-link>
            <router-link class="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#90adcb] pb-[13px] pt-4" to="#">
              <p class="text-[#90adcb] text-sm font-bold leading-normal tracking-[0.015em]">Likes</p>
            </router-link>
          </div>
        </div>

        <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Top Tracks</h2>
        <div v-for="track in topTracks" :key="track.id" class="flex items-center gap-4 bg-[#101a23] px-4 min-h-[72px] py-2">
          <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14" :style="`background-image: url('${track.image}')`"></div>
          <div class="flex flex-col justify-center">
            <p class="text-white text-base font-medium leading-normal line-clamp-1">{{ track.title }}</p>
            <p class="text-[#90adcb] text-sm font-normal leading-normal line-clamp-2">{{ track.artist }}</p>
          </div>
        </div>

        <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recently Played</h2>
        <div class="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div class="flex items-stretch p-4 gap-3">
            <div v-for="item in recentlyPlayed" :key="item.id" class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
              <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col" :style="`background-image: url('${item.image}')`"></div>
              <div>
                <p class="text-white text-base font-medium leading-normal">{{ item.title }}</p>
                <p class="text-[#90adcb] text-sm font-normal leading-normal">{{ item.artist }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJsEZecZE-1tF0oamJnA2LleJRUbzLOTlrGX9X7_8LaUormCQ4JIZdinN8JFFUvu1RkwpksdbyEpA2de3SYl1XyQ3-9esqPXJPmeZ9O2YaInc9E7vlIJE0tFJJmqZOxodgkPZDT2HEyNgsVh6rhHdVi6Pa6JE4_xhgRdonUY-e4YyDuKIte64xAy1HM5EpmByREALZmVBuJT9aTo0SGNA4TIJZjE2xL4xs0FBGpSNZ_QoAgDIoTaTD4njeQ-stETjbXNpkTiL-rHzE',
      topTracks: [
        { id: 1, title: 'Ho Hey', artist: 'The Lumineers', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs-HfcHor4Yr0p675Cb1954h9qZYll72Y7KxhMzZC23jnx6yOvApnoCcPe2CYhNXaGwYAWtUXZAXfhEriw69XcVL-BbrTQuG8e7cJ8_r0UHGIx2rZxEMCniPT-Sh_fTVB6uEznCJRCJZa_SXfbICpdAwccs3_-eVcDEzQGubUIXH3LpBoCqAtrEJ8t2eiV2Km3MhTAQgNPMm5u6wKF_FENQT_y6IxHIFHkFKhDODtCi9azFOFZmqI2wopCdHQdX8qbUGUXu5YS-O70' },
        // Add more tracks...
      ],
      recentlyPlayed: [
        { id: 1, title: 'Ho Hey', artist: 'The Lumineers', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE5Kkl-DWPYBAXMp3np3jcco0829f_reZ90vGtDNsoLgYHPQDnDogAi77EXjEXCib7UQL6L1hslz_0WnJTqq_4kM5KE87aKxF6ZThnjwaftvWQHPLDsggXvQEWub6lBdKkpe6G2Q8LIbAwD9JJ68x-5O8lqfUX0y2ITl4opyQ1-uFSwMhYbuS7tJXr543hNYfrZXP_eqV7FAiaMOo1ipFlK_GmVZR3ns5ooW6N11qhJjySmKq0NhFpwl2-ymCTXi24oXlV5_-AoMrN' },
        // Add more items...
      ]
    }
  }
}
</script>