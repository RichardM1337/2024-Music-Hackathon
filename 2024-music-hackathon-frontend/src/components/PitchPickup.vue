<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">start recording</button>
    <button @click="stopRecording" :disabled="!isRecording">stop recording</button>
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
      } catch (error) {
        console.error('Error accessing microphone:', error)
        this.msg = 'Error accessing microphone.'
      }
    },
    async stopRecording() {
      if (this.micInput) {
        const tracks = this.micInput.getTracks() // return the audio
        tracks.forEach((track) => track.stop())
        if (this.micContext) this.micContext.close()
        if (this.meydaAnalyzer) this.meydaAnalyzer.stop()
        this.isRecording = false
        this.msg = 'mic off'
        this.pitchMsg = ''
      }
    },
    pitchDetection() {
      const detectPitch = Pitchfinder.AMDF() // consider YIN for more accuracy
      const buffer = new Float32Array(this.analyser.fftSize) // creates a float32array based on FFT size
      const processAudio = () => {
        if (!this.isRecording) return
        this.analyser.getFloatTimeDomainData(buffer) // copies time-domain from float32array into other array
        const pitchFreq = detectPitch(buffer)
        console.log(pitchFreq)
        const frequency = this.frequencyToPitch(pitchFreq)
        if (pitchFreq) {
          this.pitchMsg = `Hz detected: ${pitchFreq.toFixed(2)} Hz
          Pitch Detected: ${frequency}`
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
