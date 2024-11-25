<template>
  <div>
    <button @click="startRecording" :disabled="isRecording">start recording</button>
    <button @click="stopRecording" :disabled="!isRecording">stop recording</button>
    <audio v-if="audioURL" :src="audioURL" controls></audio>
    <button @click="playAudio(3)" :disabled="!audioBlob">click me</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      globalStream: null,
      mediaRecorder: null,
      isRecording: false,
      audioChunks: [],
      audioBlob: null,
      audioURL: null,
      keyToPitch: {
        a: -12,
        s: -7,
        d: -5,
        f: -3,
        g: 0,
        h: 3,
        j: 5,
        k: 7,
        l: 12,
      },
    }
  },
  methods: {
    /* initMicPickup() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.')
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
          })
          .then((stream) => {
            this.globalStream = stream
          })
          .catch((err) => {
            console.error(`The following getUserMedia error occurred: ${err}`)
          })
      } else {
        console.log('getUserMedia not supported on your browser!')
      }
    }, */
    async startRecording() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.ondataavailable = (event) => {
          this.audioChunks.push(event.data)
        }
        this.mediaRecorder.start()
        this.isRecording = true
      } catch (error) {
        console.error('error accessing mic', error)
      }
    },
    async stopRecording() {
      if (this.mediaRecorder) {
        this.mediaRecorder.stop()
        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
          this.audioURL = URL.createObjectURL(this.audioBlob)
          this.recording = false
        }
      }
    },
    async playAudio(playbackrate) {
      const audioContext = new AudioContext()
      const audioBuffer = await this.blobToAudioContext(this.audioBlob, audioContext)
      const src = audioContext.createBufferSource()
      src.buffer = audioBuffer
      src.playbackRate.value = playbackrate
      src.connect(audioContext.destination)
      src.start()
    },
    async blobToAudioContext(blob, context) {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const arrayBuffer = reader.result
          const audioBuffer = await context.decodeAudioData(arrayBuffer)
          resolve(audioBuffer)
        }
        reader.readAsArrayBuffer(blob)
      })
    },
  },
  keyDownHandler(event) {
    const semitone = this.keyToPitch[event.key]
    if (semitone !== undefined) {
      const playbackRate = Math.pow(2, semitone) / 12
      this.playAudio(playbackRate)
    }
  },
  mounted() {
    window.addEventListener('keydown', this.keyDownHandler)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.keyDownHandler)
  },
}
</script>
