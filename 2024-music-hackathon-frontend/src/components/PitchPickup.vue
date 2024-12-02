<template>
  <div class="flex flex-col items-center bg-red-600 text-white rounded-lg p-6 gap-4">
    <h2 class="text-xl font-semibold mb-4">Pitch Detector</h2>
    <div class="w-full flex justify-between gap-2">
      <button
        class="flex-1 bg-red-400 hover:bg-red-500 transition-all rounded-md px-4 py-4 disabled:hover:bg-red-400"
        @click="startRecording"
        :disabled="isRecording"
      >
        Start Recording
      </button>
      <button
        class="flex-1 bg-red-300 hover:bg-red-400 transition-all rounded-md px-4 py-4 disabled:hover:bg-red-300"
        @click="stopRecording"
        :disabled="!isRecording"
      >
        Stop Recording
      </button>
    </div>
    <div class="text-center space-y-2">
      <p v-if="msg" class="text-lg font-medium">{{ msg }}</p>
      <p v-if="pitchMsg" class="text-yellow-200">{{ pitchMsg }}</p>
      <p v-if="error" class="text-red-300 font-bold">Error: {{ error }}</p>
      <p v-if="transcript" class="text-sm text-gray-200">{{ transcript }}</p>
    </div>
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
      msg: 'Microphone Disabled',
      pitchMsg: '',
      meydaAnalyser: null,

      isSupported: false,
      // isListening: false,
      transcript: '',
      error: '',
      recognition: null, // WebSpeechAPI initialization
    }
  },
  methods: {

    initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition // isn't it funny how the speech recognition API built by mozilla isn't availble on firefox?
      if (!SpeechRecognition) {
        this.error = 'Speech Recognition API is not supported in this browser.'
        this.isSupported = false
        return
      }
      this.recognition = new SpeechRecognition()
      this.recognition.lang = 'en-US'
      this.recognition.continuous = true // keep going
      this.recognition.interimResults = false
      this.recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript // most likely interpretation of most recent word or phrase from a transcript
        this.transcript = result
      }
      this.recognition.onerror = (event) => {
        // error handling
        this.error = event.error
        this.isRecording = false
      }
      this.recognition.onend = () => {
        this.isRecording = false // stop listening when speech ends
      }
    },
  
    stopRecognition() {
      if (this.recognition) {
        this.recognition.stop()
      }
    },

    frequencyToPitch(frequency) {
      const A4 = 440 // a4 pitch
      const semitones = Math.round(12 * Math.log2(frequency / A4)) // diff b/w freq and 440 hz
      const pitchClasses = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
      const pitchIndex = (semitones + 1200) % 12 // round whatever semitones and divide by 12
      const octave = Math.floor(semitones / 12) + 4
      return `${pitchClasses[pitchIndex]} ${octave}` // one of the 12 pitches will be selected
    },
    async startRecording() {
      if (!this.recognition) {
        this.initSpeechRecognition() // initiallaize speech recognition or something
      }
      this.error = ''
      this.transcript = ''
      this.isListening = true
      this.recognition.start() // reset all variables

      this.isRecording = true
      this.msg = 'Microphone Enabled'
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
      // if (this.recognition) {
      //   this.recognition.stop()
      // }
      if (this.micInput, this.recognition) {
        const tracks = this.micInput.getTracks() // return the audio
        tracks.forEach((track) => track.stop())
        if (this.micContext) this.micContext.close()
        if (this.meydaAnalyzer) this.meydaAnalyzer.stop()
        this.isRecording = false
        this.msg = 'Microphone Disabled'
        this.pitchMsg = ''
        this.recognition.stop()
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

  mounted() {
    this.initSpeechRecognition()
  },
}
</script>
