<template>
  <div class="flex items-center justify-center gap-6 pt-1">
    <button class="flex shrink-0 items-center justify-center rounded-full size-10 text-[#dce8f3]">
      <div class="text-inherit" data-icon="SkipBack" data-size="32px" data-weight="fill">
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M208,47.88V208.12a16,16,0,0,1-24.43,13.43L64,146.77V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0v69.23L183.57,34.45A15.95,15.95,0,0,1,208,47.88Z"></path>
        </svg>
      </div>
    </button>
    <button class="flex shrink-0 items-center justify-center rounded-full size-10 text-[#dce8f3]">
      <div class="text-inherit" data-icon="Rewind" data-size="32px" data-weight="fill">
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
          <path
            d="M232,71.84V184.16a15.92,15.92,0,0,1-24.48,13.34L128,146.86v37.3a15.92,15.92,0,0,1-24.48,13.34L15.33,141.34a15.8,15.8,0,0,1,0-26.68L103.52,58.5A15.91,15.91,0,0,1,128,71.84v37.3L207.52,58.5A15.91,15.91,0,0,1,232,71.84Z"
          ></path>
        </svg>
      </div>
    </button>
    <button class="flex shrink-0 items-center justify-center rounded-full size-16 bg-[#dce8f3] text-[#141a1f]">
      <div class="text-inherit" data-icon="Play" data-size="32px" data-weight="fill">
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
          <path
            d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"
          ></path>
        </svg>
      </div>
    </button>
    <button class="flex shrink-0 items-center justify-center rounded-full size-10 text-[#dce8f3]">
      <div class="text-inherit" data-icon="FastForward" data-size="32px" data-weight="fill">
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
          <path
            d="M248,128a15.76,15.76,0,0,1-7.33,13.34L152.48,197.5A15.91,15.91,0,0,1,128,184.16v-37.3L48.48,197.5A15.91,15.91,0,0,1,24,184.16V71.84A15.91,15.91,0,0,1,48.48,58.5L128,109.14V71.84A15.91,15.91,0,0,1,152.48,58.5l88.19,56.16A15.76,15.76,0,0,1,248,128Z"
          ></path>
        </svg>
      </div>
    </button>
    <button class="flex shrink-0 items-center justify-center rounded-full size-10 text-[#dce8f3]">
      <div class="text-inherit" data-icon="SkipForward" data-size="32px" data-weight="fill">
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M208,40V216a8,8,0,0,1-16,0V146.77L72.43,221.55A15.95,15.95,0,0,1,48,208.12V47.88A15.95,15.95,0,0,1,72.43,34.45L192,109.23V40a8,8,0,0,1,16,0Z"></path>
        </svg>
      </div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PlayerControls'
}
</script>