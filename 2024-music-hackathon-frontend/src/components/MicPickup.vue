<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">start recording</button>
    <button @click="stopRecording" :disabled="!isRecording">stop recording</button>
    <audio v-if="audioURL" :src="audioURL" controls></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      globalStream: null, // mic stream
      mediaRecorder: null, // audio recording
      isRecording: false,
      audioChunks: [], // data chunks
      audioBlob: null, // compressed audio
      audioURL: null, // playback
      keyToPitch: {
        q: -12,
        w: -11,
        e: -10,
        r: -9,
        t: -8,
        y: -7,
        u: -6,
        i: -5,
        o: -4,
        p: -3,
        a: -2,
        s: -1,
        d: 0,
        f: 1,
        g: 2,
        h: 3,
        j: 4,
        k: 5,
        l: 6,
        z: 7,
        x: 8,
        c: 9,
        v: 10,
        b: 11,
        n: 12,
      },
    }
  },
  methods: {
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          // access to mic, stream of data
          audio: true,
        })
        this.mediaRecorder = new MediaRecorder(stream) // stream into chunks
        this.audioChunks = []
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data)
        }
        this.mediaRecorder.start()
        this.isRecording = true
      } catch (error) {
        console.error('error accessing mic', error)
      }
    },
    stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' }) // combine chunks to single file
          this.audioURL = URL.createObjectURL(this.audioBlob) // temp URL for playback
          this.isRecording = false
        }
      }
    },
    async playAudio(playbackRate) {
      if (!this.audioBlob) return
      const audioContext = new AudioContext() // advanced processing
      const audioBuffer = await this.blobToAudioContext(this.audioBlob, audioContext) // blob to context
      const src = audioContext.createBufferSource() // playback, 'source node'
      src.buffer = audioBuffer
      src.playbackRate.value = playbackRate
      src.connect(audioContext.destination)
      src.start()
    },
    blobToAudioContext(blob, context) {
      // converts blob into buffer
      return new Promise((resolve) => {
        const reader = new FileReader() // binary data reader
        reader.onloadend = async () => {
          const arrayBuffer = reader.result // buffer
          const audioBuffer = await context.decodeAudioData(arrayBuffer) //buffer decoded
          resolve(audioBuffer)
        }
        reader.readAsArrayBuffer(blob)
      })
    },
    keyDownHandler(event) {
      const semitone = this.keyToPitch[event.key]
      console.log(event.key)
      if (semitone !== undefined) {
        const playbackRate = Math.pow(2, semitone / 12)
        this.playAudio(playbackRate)
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.keyDownHandler)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyDownHandler)
  },
}
</script>
