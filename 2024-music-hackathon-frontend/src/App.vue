<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import PitchPickup from '@/components/PitchPickup.vue'
import vexflow from '@/components/vexflow.vue';
import MicPickup from '@/components/MicPickup.vue'
import SpeechRecog from '@/components/SpeechRecog.vue'
import upload from '@/components/upload.vue'
import metronome from '@/components/Metronome.vue'
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
    <div class="flex justify-center">
    <div class="border-8 border-sky-100/70">
      <PitchPickup />
      <!-- <vexflow/>
      <MicPickup /> -->
      <metronome/>
      <!-- <SpeechRecog /> -->
      <!-- <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/mic">Mic</RouterLink>
        <RouterLink to="/pitch">Pitch</RouterLink>
      </nav> -->
    </div>
    
    <div class="border-8 border-sky-100/80">
      <upload />
    </div>

  </div>
  </header>

</template>

<style scoped>

</style>
