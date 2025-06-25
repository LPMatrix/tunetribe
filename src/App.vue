<template>
  <div class="relative flex size-full min-h-screen flex-col bg-[#101a23] dark group/design-root overflow-x-hidden" 
       :style='{ fontFamily: "\"Work Sans\", \"Noto Sans\", sans-serif" }'>
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700;900&family=Work+Sans:wght@400;500;700;900&display=swap');
</style>