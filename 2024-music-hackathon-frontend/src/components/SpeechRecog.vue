<template>
  <div>
    <h1>Speech Recognition App</h1>
    <button @click="startRecognition" :disabled="isListening">Start Listening</button>
    <button @click="stopRecognition" :disabled="!isListening">Stop Listening</button>
    <p v-if="error" class="error">Error: {{ error }}</p>
    <p v-if="transcript">{{ transcript }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSupported: false,
      isListening: false,
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
        this.isListening = false
      }
      this.recognition.onend = () => {
        this.isListening = false // stop listening when speech ends
      }
    },
    startRecognition() {
      if (!this.recognition) {
        this.initSpeechRecognition() // initiallaize speech recognition or something
      }
      this.error = ''
      this.transcript = ''
      this.isListening = true
      this.recognition.start() // reset all variables
    },
    stopRecognition() {
      if (this.recognition) {
        this.recognition.stop()
      }
    },
  },
  mounted() {
    this.initSpeechRecognition()
  },
}
</script>

<style>
.error {
  color: red;
  font-weight: bold;
}
</style>
