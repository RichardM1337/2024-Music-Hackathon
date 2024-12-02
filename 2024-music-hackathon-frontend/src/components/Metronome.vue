<template>
  <div class="flex flex-col items-center bg-cyan-600 text-white rounded-lg p-6 gap-4">
    <h2 class="text-xl font-semibold mb-4">Metronome</h2>
    <p class="text-2xl font-semibold">{{ tempo }}</p>
    <button
      class="w-full bg-cyan-500 hover:bg-cyan-700 transition-all rounded-md px-4 py-2 font-medium"
      @click="playMetronome"
    >
      {{ isPlaying ? 'Pause' : 'Play' }}
    </button>
    <div class="w-full bg-cyan-100 text-cyan-800 rounded-md p-4 shadow-inner">
      <div class="flex justify-between gap-2 mb-4">
        <button
          class="flex-1 bg-cyan-500 hover:bg-cyan-600 rounded-md px-3 py-2"
          @click="incBPM"
        >
          Increase BPM
        </button>
        <button
          class="flex-1 bg-cyan-700 hover:bg-cyan-800 rounded-md px-3 py-2"
          @click="decBPM"
        >
          Decrease BPM
        </button>
      </div>
      <p class="text-4xl font-bold text-center">{{ bpm }}</p>
      <p v-if="errMsg" class="text-red-500 text-sm mt-2 text-center">{{ errMsg }}</p>
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
