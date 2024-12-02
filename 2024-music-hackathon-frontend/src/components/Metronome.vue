<template>
  <div>
    <p>{{ tempo }}</p>
    <button @click="playMetronome">{{ isPlaying ? 'Pause' : 'Play' }}</button>
    <div>
      <button @click="incBPM">increase bpm</button>
      <button @click="decBPM">decrease bpm</button>
      <p>{{ bpm }}</p>
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
