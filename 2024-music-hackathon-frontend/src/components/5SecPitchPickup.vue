<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">
      start recording (5 second pitch pickup)
    </button>
    <p v-if="msg">{{ msg }}</p>
    <p v-if="pitchMsg">{{ pitchMsg }}</p>
  </div>
</template>

<script>
import * as Pitchfinder from 'pitchfinder'
export default {
  data() {
    return {
      isRecording: false,
      micInput: null,
      micContext: null,
      msg: '',
      pitchMsg: '',
      meydaAnalyser: null,
      pitches: [],
    }
  },
  methods: {
    frequencyToPitch(frequency) {
      const A4 = 440 // a4 pitch
      const semitones = Math.round(12 * Math.log2(frequency / A4)) // diff b/w freq and 440 hz
      const pitchClasses = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      const pitchIndex = (semitones + 1200) % 12 // round whatever semitones and divide by 12
      const octave = Math.floor(semitones / 12) + 4
      return `${pitchClasses[pitchIndex]} ${octave}` // one of the 12 pitches will be selected
    },
    async startRecording() {
      this.isRecording = true
      this.msg = 'mic on'
      try {
        this.micInput = await navigator.mediaDevices.getUserMedia({ video: false, audio: true }) //navigator.getUserMedia|| navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        this.micContext = new window.AudioContext() || new window.webkitAudioContext() // creates new audio node object
        const source = this.micContext.createMediaStreamSource(this.micInput)
        this.analyser = this.micContext.createAnalyser()
        this.analyser.fftSize = 4096 // watch this
        source.connect(this.analyser)
        this.pitchDetection(this.micContext)
        setTimeout(this.stopRecordingHandler, 5000)
      } catch (error) {
        console.error('Error accessing microphone:', error)
        this.msg = 'Error accessing microphone.'
      }
    },
    stopRecordingHandler() {
      console.log('5 seconds')
      const tracks = this.micInput.getTracks() // return the audio
      tracks.forEach((track) => track.stop())
      if (this.micContext) this.micContext.close()
      if (this.meydaAnalyzer) this.meydaAnalyzer.stop()
      this.isRecording = false
      this.msg = 'mic off'
      const avgPitch = this.pitches.reduce((a, b) => a + b) / this.pitches.length
      const frequency = this.frequencyToPitch(Number(avgPitch))
      this.pitchMsg = `The average pitch is ${frequency}, or ${avgPitch} hz `
    },
    pitchDetection() {
      const detectPitch = Pitchfinder.AMDF() // consider YIN for more accuracy
      const buffer = new Float32Array(this.analyser.fftSize) // creates a float32array based on FFT size
      const processAudio = () => {
        if (!this.isRecording) return
        this.analyser.getFloatTimeDomainData(buffer) // copies time-domain from float32array into other array
        const pitchFreq = detectPitch(buffer)
        if (pitchFreq) {
          this.pitchMsg = 'working...'
          this.pitches.push(pitchFreq)
        } else {
          this.pitchMsg = 'No pitch detected'
        }
        requestAnimationFrame(processAudio) // create an animation to shfufle through pitches
      }

      processAudio()
    },
  },
}
</script>
