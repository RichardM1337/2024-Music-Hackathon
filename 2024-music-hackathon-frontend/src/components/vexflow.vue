<template>
   <div id="output"></div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;

    // Create an SVG renderer and attach it to the DIV element named "output".
    const div = document.getElementById("output");
    const renderer = new Renderer(div, Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 500);
    const context = renderer.getContext();

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Stave(10, 40, 400);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();
})

</script>

<style scoped>

</style>