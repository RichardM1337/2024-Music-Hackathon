<script setup lang="ts">
import { useSpeechRecognition } from '@vueuse/core'
import { ref, watch } from 'vue'

const lang = ref('en-US')
const recognizedText = ref('')
const speech = useSpeechRecognition({
  lang,
  continuous: true,
})

const { isListening, isSupported, stop, result } = speech

if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  recognition.lang = 'en-US' // Set the language

  recognition.onresult = (event) => {
    recognizedText.value = event.results[0][0].transcript
  }
} else {
  console.error('Speech recognition is not supported in this browser.')
}
function startRecognition() {
  this.recognition.start()
}
</script>

<template>
  <div>
    <div v-if="!isSupported">
      Your browser does not support SpeechRecognition API,
      <a href="https://caniuse.com/mdn-api_speechrecognition" target="_blank">more details</a>
    </div>
    <div v-else>
      <div space-x-4>
        <label class="radio">
          <input v-model="lang" value="en-US" type="radio" />
          <span>English (US)</span>
        </label>
      </div>
    </div>
    <div>
      <button @click="startRecognition">Start Listening</button>
      <p>{{ recognizedText }}</p>
    </div>
  </div>
</template>

<!-- <style scoped>
.tag {
  padding: 0.3rem 0.6rem;
  margin-right: 0.5rem;
  border-radius: 4px;
}
</style> -->

<style scoped lang="postcss">
input {
  --tw-ring-offset-width: 1px !important;
  --tw-ring-color: #8885 !important;
  --tw-ring-offset-color: transparent !important;
}

.radio {
  @apply inline-flex items-center my-auto cursor-pointer select-none;
}

.radio input {
  appearance: none;
  padding: 0;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  @apply bg-gray-400/30;
  @apply rounded-full h-4 w-4 select-none relative;
  @apply mr-1;
}

.radio input:checked::after {
  content: '';
  @apply absolute inset-[3px] rounded-full bg-primary;
}

.checkbox span {
  @apply ml-1.5 text-13px opacity-70;
}
</style>
