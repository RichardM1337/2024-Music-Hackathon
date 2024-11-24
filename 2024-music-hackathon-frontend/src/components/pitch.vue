<template>
    <div>
        <audio
            controls
            loop
            crossorigin="anonymous"
            id="audio"
            ref="audio"
            src="/test.mp3"
        ></audio>

        <button @click="record" ref="start">create context (or record whatever)</button>
        <button disabled>stop</button>
        <!-- <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1> -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTemplateRef } from 'vue';
import Meyda from 'meyda';

//const startButton = useTemplateRef('start')

function record(){
    const audioContext = new AudioContext();
    const htmlAudioElement = document.getElementById('audio')
    const source = audioContext.createMediaElementSource(htmlAudioElement);

    source.connect(audioContext.destination);
    //startButton.setAttribute("disabled", "disabled")

    
}
//const audioContext = new AudioContext();
// const htmlAudioElement = useTemplateRef('listen');
// const source = audioContext.createMediaElementSource(htmlAudioElement);

// source.connect(audioContext.destination);
// console.log(useTemplateRef('listen'))


// // on play the audio that has been loaded
// audioPlayer.onplay = () => {
//   // get a new AudioContext
//   const audioCtx = new AudioContext();
//   // get a source of the audio
//   const source = audioCtx.createMediaElementSource(audioPlayer);
//   // output the audio to the speakers
//   source.connect(audioCtx.destination);
//   }


</script>

<style scoped>

</style>