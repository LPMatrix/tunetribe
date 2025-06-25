<template>
  <div class="layout-container flex h-full grow flex-col">
    <div class="px-40 flex flex-1 justify-center py-5">
      <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div class="flex flex-wrap justify-between gap-3 p-4">
          <h1 class="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">October 2023</h1>
        </div>

        <div class="px-4 py-3 @container">
          <div class="flex overflow-hidden rounded-lg border border-[#314d68] bg-[#101a23]">
            <table class="flex-1">
              <thead>
                <tr class="bg-[#182634]">
                  <th class="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">#</th>
                  <th class="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Title</th>
                  <th class="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Artist</th>
                  <th class="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Album</th>
                  <th class="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(track, index) in tracks" :key="track.id" class="border-t border-t-[#314d68]">
                  <td class="h-[72px] px-4 py-2 w-[400px] text-[#90adcb] text-sm font-normal leading-normal">{{ index + 1 }}</td>
                  <td class="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">{{ track.title }}</td>
                  <td class="h-[72px] px-4 py-2 w-[400px] text-[#90adcb] text-sm font-normal leading-normal">{{ track.artist }}</td>
                  <td class="h-[72px] px-4 py-2 w-[400px] text-[#90adcb] text-sm font-normal leading-normal">{{ track.album }}</td>
                  <td class="h-[72px] px-4 py-2 w-[400px] text-[#90adcb] text-sm font-normal leading-normal">{{ track.duration }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlaylistPage',
  data() {
    return {
      tracks: [
        { id: 1, title: 'Midnight Serenade', artist: 'Ava Sterling', album: 'City Lights', duration: '3:45' },
        { id: 2, title: 'Electric Dreams', artist: 'Leo Maxwell', album: 'Neon Nights', duration: '4:12' },
        // Add more tracks...
      ]
    }
  }
}
</script>