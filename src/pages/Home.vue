<template>
  <div class="layout-container flex h-full grow flex-col">
    <div class="px-40 flex flex-1 justify-center py-5">
      <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div class="@container">
          <div class="@[480px]:p-4">
            <div
              class="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
              :style='`background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("${heroImage}")`'
            >
              <div class="flex flex-col gap-2 text-center">
                <h1
                  class="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                >
                  Your Monthly Mixtape, Automatically Generated
                </h1>
                <h2 class="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                  Tune Tribe curates a personalized playlist each month, featuring tracks shared by your team on Telegram. Discover new favorites and relive the soundtrack of
                  your workplace.
                </h2>
              </div>
              <a
                href="/tracks"
                class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#0c7ff2] text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
              >
                <span class="truncate">Listen Now</span>
              </a>
            </div>
          </div>
        </div>
        <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">How It Works</h2>
            <div class="flex flex-col gap-10 px-4 py-10 @container">
              <div class="flex flex-col gap-4">
                <h1
                  class="text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                >
                  Effortless Music Discovery
                </h1>
                <p class="text-white text-base font-normal leading-normal max-w-[720px]">
                  Tune Tribe simplifies music discovery within your team. No more manual playlist creation or missed recommendations. Just connect your Telegram workspace and let
                  the music flow.
                </p>
              </div>
              <div class="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                <div class="flex flex-1 gap-3 rounded-lg border border-[#314d68] bg-[#182634] p-4 flex-col">
                  <div class="text-white" data-icon="SlackLogo" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M221.13,128A32,32,0,0,0,184,76.31V56a32,32,0,0,0-56-21.13A32,32,0,0,0,76.31,72H56a32,32,0,0,0-21.13,56A32,32,0,0,0,72,179.69V200a32,32,0,0,0,56,21.13A32,32,0,0,0,179.69,184H200a32,32,0,0,0,21.13-56ZM72,152a16,16,0,1,1-16-16H72Zm48,48a16,16,0,0,1-32,0V152a16,16,0,0,1,16-16h16Zm0-80H56a16,16,0,0,1,0-32h48a16,16,0,0,1,16,16Zm0-48H104a16,16,0,1,1,16-16Zm16-16a16,16,0,0,1,32,0v48a16,16,0,0,1-16,16H136Zm16,160a16,16,0,0,1-16-16V184h16a16,16,0,0,1,0,32Zm48-48H152a16,16,0,0,1-16-16V136h64a16,16,0,0,1,0,32Zm0-48H184V104a16,16,0,1,1,16,16Z"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex flex-col gap-1">
                    <h2 class="text-white text-base font-bold leading-tight">Telegram Integration</h2>
                    <p class="text-[#90adcb] text-sm font-normal leading-normal">
                      Tune Tribe seamlessly integrates with your Telegram workspace, capturing music shared in designated channels.
                    </p>
                  </div>
                </div>
                <div class="flex flex-1 gap-3 rounded-lg border border-[#314d68] bg-[#182634] p-4 flex-col">
                  <div class="text-white" data-icon="MusicNote" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M210.3,56.34l-80-24A8,8,0,0,0,120,40V148.26A48,48,0,1,0,136,184V98.75l69.7,20.91A8,8,0,0,0,216,112V64A8,8,0,0,0,210.3,56.34ZM88,216a32,32,0,1,1,32-32A32,32,0,0,1,88,216ZM200,101.25l-64-19.2V50.75L200,70Z"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex flex-col gap-1">
                    <h2 class="text-white text-base font-bold leading-tight">Automatic Curation</h2>
                    <p class="text-[#90adcb] text-sm font-normal leading-normal">Our intelligent algorithm analyzes shared tracks to create a balanced and engaging mixtape.</p>
                  </div>
                </div>
                <div class="flex flex-1 gap-3 rounded-lg border border-[#314d68] bg-[#182634] p-4 flex-col">
                  <div class="text-white" data-icon="Play" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27ZM80,215.94V40l143.83,88Z"
                      ></path>
                    </svg>
                  </div>
                  <div class="flex flex-col gap-1">
                    <h2 class="text-white text-base font-bold leading-tight">Monthly Refresh</h2>
                    <p class="text-[#90adcb] text-sm font-normal leading-normal">Enjoy a fresh playlist every month, reflecting the evolving musical tastes of your team.</p>
                  </div>
                </div>
              </div>
            </div>
            <h2 class="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Past Playlists</h2>
            <div class="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
              <div class="flex items-stretch p-4 gap-3">
                <div class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA4RzIGapsz-ultH_6JE3DpPvLJLhEckidp24n2pYi_qAJSTCQ8AXW-dyt0t4DRp_6jiM0vjxYyoZmqjA6gqMiEYpV4sNrpcCr-gPRFb390b2oKDH3x6FP6_wiJ-CdMZT5twYb0GkDKyUMyl_m29Cz9dxE1_Vr9ccX81iBicGakwtf7xJmUztGPhCNl750Y6OIsGh-DMRoOfZbQgs_s_9kTtpcCV_l9jf4LFgsINg-nQ0aLvxV6vXwGkI-84UTjVLwTRhX0Gq8t_3ZM");'
                  ></div>
                  <div>
                    <p class="text-white text-base font-medium leading-normal">October 2023</p>
                    <p class="text-[#90adcb] text-sm font-normal leading-normal">30 Tracks</p>
                  </div>
                </div>
                <div class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAR33X6r1Qwx7yeu5kj5yneCBf2Kt970tLaIWU_GBWmaftjFg-Qv7Sv_uGLw_AfsMesbPh4oCyvCryasuNTTs2dxkPm22uaVeTeP6Mn5eMp5neMlADUJlqg28snrbgbkOXndKMnPcT92xxmlIfXg2yAXi7WsAySO6eul8wrTI5XueMVgtXSHmaCN5ZUrq-bzXZQEu3kgSHWJ6WJo4q2gpA6wx03sHgjYfuqLHTM-fhZy-VrUkXgDRRBWMCJ-28IuNW04fuYTZWCVQf6");'
                  ></div>
                  <div>
                    <p class="text-white text-base font-medium leading-normal">September 2023</p>
                    <p class="text-[#90adcb] text-sm font-normal leading-normal">28 Tracks</p>
                  </div>
                </div>
                <div class="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-40">
                  <div
                    class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex flex-col"
                    style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDxVDmoT6pNPF2wU5ZNu6BJ0WGabc6l6_-cXI7s5DJ96f9I5PJ-I5GwBctXV_QHfasA7Ll-Ut4XU2MLRtHphCyWedIB6tssOgfrQ2GUEcEV4Hvid2zKARgFIr6W_cFmnirM2SbGL2lnL6K-PRRfvtYdylU5z_yHbpyO_LhdbXzPkcyBE55-o30z0I5h2j3x-xgOM-TtwjGhH21nOdCR2_nxPeRpE5WjF2S6-JbgiFst7ti-_fID-wvtEQNea0w8mraA1vdKOiA4ez0c");'
                  ></div>
                  <div>
                    <p class="text-white text-base font-medium leading-normal">August 2023</p>
                    <p class="text-[#90adcb] text-sm font-normal leading-normal">32 Tracks</p>
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
  name: 'HomePage',
  data() {
    return {
      heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7A3sfUYB014-2oevB1jvxwGHbtERS-70e6e6qFQw_LvRs3KrA1fUOVi7niTodfAf7WlXykypJYPV3AN2n5kWpquG4Le3qOZsAWK8X_NfoH9vd5wCHRAIJbqB7VbBpPW99lHrDuvdyELn5AXYpOlBecMdKKu3peruI05Om9pWptXq6dwauT6bBASuf918yT1nLB2c28h52XdnBO4xUTLHckhdTPe11qZGgmaBCnZ5lV01JaLb41iylFCvIMM7_e8fr617EuNzPg6CW"
    }
  }
}
</script>