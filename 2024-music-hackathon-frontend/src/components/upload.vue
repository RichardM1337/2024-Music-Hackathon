<template>
    <div class="bg-slate-400 p-6 min-h-screen w-[45rem]">
      <h1 class="text-3xl font-bold">Upload your sheet music here!</h1>
      <div>
        <div class="my-8">
          <div>
            <form>
              <input
                type="file"
                id="media"
                accept="image/*"
                multiple
                @change="(event) => handelFileUpload(event)"
              />
              <div>
                <section>
                  <p>Minimum file size 50MB</p>
                </section>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div class="images">
            <div
              v-for="(src, index) in imageSrc"
              :key="index"
              class="images-lists"
            >
              <div class="image-container">
                <img :src="src" id="output" class="image-style" />
              </div>
              <div class="cross-icon" v-if="imageSrc">
                <button class="text-xl bg-gray-300 my-2 rounded-lg p-2" @click="removeItem(index)">Remove</button>
              </div>
  
              <p>
                {{ selectedFiles[index].name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref } from "vue";
  
  const form = ref({
    media: {},
  });
  
  const imageSrc = ref([]);
  
  const selectedFiles = ref([]);
  const handelFileUpload = (e) => {
    var files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
  
    for (let i = 0; i < files.length; i++) {
      selectedFiles.value.push(files[i]);
      const src = URL.createObjectURL(files[i]);
      imageSrc.value.push(src);
    }
    console.log(selectedFiles.value, "seldjhfdh fikes");
  
    form.value.media = e.target.files[0];
    console.log(form.value.media, "file upload");
  
    console.log("files already uploaded", imageSrc.value);
  };
  
  const removeItem = (index) => {
    imageSrc.value.splice(index, 1);
  };
  </script>