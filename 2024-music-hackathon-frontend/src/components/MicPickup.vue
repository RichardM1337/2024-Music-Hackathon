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
      globalStream: null,
      mediaRecorder: null,
      isRecording: false,
      audioChunks: [],
      audioURL: null,
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
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
          this.audioURL = URL.createObjectURL(audioBlob)
          this.recording = false
        }
      }
    },
  },
}
</script>
