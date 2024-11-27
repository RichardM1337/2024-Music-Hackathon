<template>
  <div>
    <div>
      <label>
        Clef:
        <select v-model="clef">
          <option value="treble">Treble</option>
          <option value="bass">Bass</option>
          <option value="alto">Alto</option>
        </select>
      </label>
      <label>
        Time Signature:
        <input v-model="timeSignature" placeholder="e.g., 4/4" />
      </label>
      <label>
        Tempo (BPM):
        <input type="number" v-model.number="tempo" />
      </label>
      <button @click="renderSheet">Render Sheet</button>
      <button @click="playMusic">Play Music</button>
    </div>
    <div id="output"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Vex from "vexflow";
import * as Tone from "tone";

const clef = ref("treble");
const timeSignature = ref("4/4");
const tempo = ref(120);

const notes = [
  new Vex.Flow.StaveNote({ keys: ["c/4"], duration: "q" }),
  new Vex.Flow.StaveNote({ keys: ["d/4"], duration: "q" }),
  new Vex.Flow.StaveNote({ keys: ["e/4"], duration: "q" }),
  new Vex.Flow.StaveNote({ keys: ["f/4"], duration: "q" }),
];

let renderer;
let context;

onMounted(() => {
  const { Renderer } = Vex.Flow;
  const div = document.getElementById("output");
  renderer = new Renderer(div, Renderer.Backends.SVG);
  renderer.resize(500, 500);
  context = renderer.getContext();
});

function drawStave() {
  const { Stave, Voice, Formatter } = Vex.Flow;
  context.clear();
  const stave = new Vex.Flow.Stave(10, 40, 400);
  stave.addClef(clef.value).addTimeSignature(timeSignature.value);
  stave.setContext(context).draw();
  const voice = new Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);
  new Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);
}

function renderSheet() {
  drawStave();
}

function playMusic() {
  const synth = new Tone.Synth().toDestination();
  const now = Tone.now();
  notes.forEach((note, index) => {
    const key = note.keys[0];
    const [pitch, octave] = key.split("/");
    const noteName = `${pitch.toUpperCase()}${octave}`;
    const duration = note.duration === "q" ? "4n" : "8n"; 
    synth.triggerAttackRelease(noteName, duration, now + index * (60 / tempo.value));
  });
}
</script>


<style scoped></style>
