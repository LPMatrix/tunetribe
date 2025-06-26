<template>
  <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#223649] px-10 py-3">
    <div class="flex items-center gap-4 text-white">
      <div class="size-4">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <router-link to="/" class="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Tune Tribe</router-link>
    </div>
    <div class="flex flex-1 justify-end gap-8">
      <div class="flex items-center gap-9">
        <router-link class="text-white text-sm font-medium leading-normal" to="/archive">Archive</router-link>
        <!-- <router-link class="text-white text-sm font-medium leading-normal" to="/playlist">Playlists</router-link> -->
      </div>
      <!-- <button
        class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#223649] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
      >
        <div class="text-white" data-icon="Bell" data-size="20px" data-weight="regular">
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
            <path
              d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
            />
          </svg>
        </div>
      </button> -->
      <router-link to="/profile">
        <div
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          :style='`background-image: url("${profileImage}")`'
        />
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfBs1Q4gX9jMcZB09N8HHX3yNxBrUopYdTsfbrAVp-VXAVkWhdb0lSjHrSGHYY_T2ne-nuztugGnRDh09WEvqPyoYPbY9gz01K4DZUrY6elpVdDzNa74p0Zucfe8tE3CAIpFFlSSbVxSbzUc6dKXeG-OHWJZXtBTJ2VW-_eZuV5ShpuMDhQo593eyBIn6KgNc-wBfRo-ADXSa88x4zOjCQAtt5R-D-ZrDOoMGpDDk9Eg-NxDyJKgiUEVKA0f9d8MMZ-P9-WmLGi0vC"
    }
  }
}
</script>