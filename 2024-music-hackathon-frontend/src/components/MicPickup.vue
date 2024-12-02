<template>
  <div class="flex flex-col items-center bg-blue-600 text-white rounded-lg p-8 gap-6 w-full">
    <h2 class="text-xl font-semibold mb-4">Voice Playback</h2>
    <div class="flex justify-between gap-6 w-full">
      <button
        class="flex-1 bg-blue-500 hover:bg-blue-700 transition-all rounded-md px-4 py-4 disabled:hover:bg-blue-500"
        @click="startRecording"
        :disabled="isRecording"
      >
        Start Recording
      </button>
      <button
        class="flex-1 bg-blue-300 hover:bg-blue-500 transition-all rounded-md px-4 py-4 disabled:hover:bg-blue-300"
        @click="stopRecording"
        :disabled="!isRecording"
      >
        Stop Recording
      </button>
    </div>
    <div class="w-full text-center mt-6">
      <audio v-if="audioURL" :src="audioURL" controls class="w-full rounded-md shadow-md" />
    </div>
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
