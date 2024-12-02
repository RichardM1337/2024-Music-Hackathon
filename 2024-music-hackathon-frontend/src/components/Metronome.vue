<template>
  <div class=" w-[23rem] text-xl bg-cyan-700 w-[20rem] h-1/2 flex flex-col items-center text-center">
    <p>{{ tempo }}</p>
    <button class="mb-4 w-full bg-cyan-500 p-4" @click="playMetronome">{{ isPlaying ? 'Pause' : 'Play' }}</button>
    <div class="border-8 border-stone-300/50 rounded-xl p-2 bg-slate-200/50">
      <button class="bg-cyan-600 rounded-lg mx-2 p-2 text-lg" @click="incBPM">Increase BPM</button>
      <button class="bg-cyan-800 rounded-lg mx-2 p-2 text-lg" @click="decBPM">Decrease BPM</button>
      <p class="mt-6 text-4xl">{{ bpm }}</p>
      <p v-if="errMsg">{{ errMsg }}</p>
    </div>
  </div>
</template>

<script>
import Metronome from './Metronome.js'
export default {
  data() {
    return {
      metronome: null,
      tempo: null,
      isPlaying: false,
      bpm: 120,
      errMsg: null,
    }
  },
  mounted() {
    this.metronome = new Metronome(this.bpm)
  },
  methods: {
    playMetronome() {
      if (this.isPlaying) {
        this.metronome.stop()
      } else {
        this.metronome.start()
      }
      this.isPlaying = !this.isPlaying
    },
    incBPM() {
      if (this.bpm < 240) {
        this.errMsg = ''
        this.bpm++
        this.metronome.tempo = this.bpm
      } else {
        this.errMsg = 'bpm too high'
      }
    },

    decBPM() {
      if (this.bpm > 40) {
        this.errMsg = ''
        this.bpm--
        this.metronome.tempo = this.bpm
      } else {
        this.errMsg = 'bpm too low'
      }
    },
  },
}
</script>
