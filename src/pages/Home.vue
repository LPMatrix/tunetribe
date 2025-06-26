<template>
  <div class="layout-container flex flex-col min-h-screen bg-gray-900 text-white">
    <!-- Hero Section -->
    <div class="relative flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
      <div
        class="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-6 bg-cover bg-center bg-no-repeat rounded-lg p-8 sm:p-12"
        :style="`background-image: url('${heroImage}');`"
      >
        <h1
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          Discover Your Team’s Soundtrack with Tune Tribe
        </h1>
        <p
          class="text-base sm:text-lg md:text-xl font-normal text-gray-200 max-w-2xl"
        >
          Tune Tribe crafts a unique monthly playlist from songs shared in your Telegram group. Connect, share, and vibe to your team’s musical pulse.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a
            href="/tracks"
            class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            Explore Playlists
          </a>
          <a
            href="/connect"
            class="inline-flex items-center justify-center px-6 py-3 bg-transparent border border-gray-300 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
          >
            Connect with Telegram
          </a>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="py-12 px-4 sm:px-6 lg:px-8 bg-gray-800">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-8">
          How Tune Tribe Works
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="flex flex-col gap-4 p-6 bg-gray-700 rounded-lg shadow-lg">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path
                  d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM96,184H80a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm0-32H80a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm0-32H80a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm80,64H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H112a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Join via Telegram</h3>
            <p class="text-gray-300 text-sm">
              Link your Telegram group to Tune Tribe. Share songs in your designated channel, and we’ll do the rest.
            </p>
          </div>
          <div class="flex flex-col gap-4 p-6 bg-gray-700 rounded-lg shadow-lg">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path
                  d="M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A48,48,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34ZM88,216a32,32,0,1,1,32-32A32,32,0,0,1,88,216ZM200,101.25l-64-19.2V50.75L200,70Z"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Smart Curation</h3>
            <p class="text-gray-300 text-sm">
              Our algorithm analyzes shared tracks to curate a diverse, team-inspired playlist every month.
            </p>
          </div>
          <div class="flex flex-col gap-4 p-6 bg-gray-700 rounded-lg shadow-lg">
            <div class="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path
                  d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"
                ></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Monthly Vibes</h3>
            <p class="text-gray-300 text-sm">
              Get a fresh playlist each month, tailored to your team’s evolving music taste.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Past Playlists Section -->
    <div class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-8">
          Relive Past Playlists
        </h2>
        <div class="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory">
          <div
            v-for="playlist in playlists"
            :key="playlist.month"
            class="flex-none w-48 sm:w-56 flex flex-col gap-4 rounded-lg snap-center"
          >
            <div
              class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              :style="`background-image: url('${playlist.image}');`"
            ></div>
            <div>
              <p class="text-base font-medium">{{ playlist.month }}</p>
              <p class="text-gray-400 text-sm">{{ playlist.tracks }} Tracks</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Call-to-Action -->
    <div class="py-12 px-4 sm:px-6 lg:px-8 bg-blue-600">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
          Ready to Start Your Musical Journey?
        </h2>
        <p class="text-base sm:text-lg text-gray-200 mb-6">
          Join Tune Tribe today and turn your team’s shared tracks into unforgettable playlists.
        </p>
        <a
          href="/connect天子"
          class="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg shadow-md transition-colors duration-200"
        >
          Get Started
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      heroImage:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD7A3sfUYB014-2oevB1jvxwGHbtERS-70e6e6qFQw_LvRs3KrA1fUOVi7niTodfAf7WlXykypJYPV3AN2n5kWpquG4Le3qOZsAWK8X_NfoH9vd5wCHRAIJbqB7VbBpPW99lHrDuvdyELn5AXYpOlBecMdKKu3peruI05Om9pWptXq6dwauT6bBASuf918yT1nLB2c28h52XdnBO4xUTLHckhdTPe11qZGgmaBCnZ5lV01JaLb41iylFCvIMM7_e8fr617EuNzPg6CW',
      playlists: [
        {
          month: 'October 2023',
          tracks: 30,
          image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuA4RzIGapsz-ultH_6JE3DpPvLJLhEckidp24n2pYi_qAJSTCQ8AXW-dyt0t4DRp_6jiM0vjxYyoZmqjA6gqMiEYpV4sNrpcCr-gPRFb390b2oKDH3x6FP6_wiJ-CdMZT5twYb0GkDKyUMyl_m29Cz9dxE1_Vr9ccX81iBicGakwtf7xJmUztGPhCNl750Y6OIsGh-DMRoOfZbQgs_s_9kTtpcCV_l9jf4LFgsINg-nQ0aLvxV6vXwGkI-84UTjVLwTRhX0Gq8t_3ZM',
        },
        {
          month: 'September 2023',
          tracks: 28,
          image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAR33X6r1Qwx7yeu5kj5yneCBf2Kt970tLaIWU_GBWmaftjFg-Qv7Sv_uGLw_AfsMesbPh4oCyvCryasuNTTs2dxkPm22uaVeTeP6Mn5eMp5neMlADUJlqg28snrbgbkOXndKMnPcT92xxmlIfXg2yAXi7WsAySO6eul8wrTI5XueMVgtXSHmaCN5ZUrq-bzXZQEu3kgSHWJ6WJo4q2gpA6wx03sHgjYfuqLHTM-fhZy-VrUkXgDRRBWMCJ-28IuNW04fuYTZWCVQf6',
        },
        {
          month: 'August 2023',
          tracks: 32,
          image:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDxVDmoT6pNPF2wU5ZNu6BJ0WGabc6l6_-cXI7s5DJ96f9I5PJ-I5GwBctXV_QHfasA7Ll-Ut4XU2MLRtHphCyWedIB6tssOgfrQ2GUEcEV4Hvid2zKARgFIr6W_cFmnirM2SbGL2lnL6K-PRRfvtYdylU5z_yHbpyO_LhdbXzPkcyBE55-o30z0I5h2j3x-xgOM-TtwjGhH21nOdCR2_nxPeRpE5WjF2S6-JbgiFst7ti-_fID-wvtEQNea0w8mraA1vdKOiA4ez0c',
        },
      ],
    };
  },
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