<template>
  <div class="bg-slate-400 p-6 min-h-screen w-[45rem]">
    <h1 class="text-3xl font-bold mb-6 text-center text-white">
      Upload Your Sheet Music Here!
    </h1>
    <div>
      <!-- File Upload Form -->
      <div class="my-8">
        <form>
          <!-- Drag and Drop Box -->
          <div
            class="bg-white border-4 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center"
            @drop.prevent="handleDrop"
            @dragover.prevent
          >
            <p class="text-gray-500 mb-4">
              Drag & drop your files here, or
            </p>
            <label
              for="media"
              class="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 transition"
            >
              Browse Files
            </label>
            <input
              type="file"
              id="media"
              accept="image/*"
              multiple
              class="hidden"
              @change="handelFileUpload"
            />
            <p class="text-sm text-gray-400 mt-4">
              Minimum file size: 50MB
            </p>
          </div>
        </form>
      </div>

      <!-- Display Uploaded Images -->
      <div>
        <div class="images">
          <div
            v-for="(src, index) in imageSrc"
            :key="index"
            class="images-lists mb-6"
          >
            <div class="image-container">
              <img
                :src="src"
                id="output"
                class="image-style rounded-lg w-full h-auto object-contain mb-4"
              />
            </div>
            <div class="cross-icon" v-if="imageSrc">
              <button
                class="text-xl bg-gray-300 my-2 rounded-lg p-2 hover:bg-gray-400 disabled:cursor-not-allowed"
                @click="removeItem(index)"
                :disabled="!src"
              >
                Remove
              </button>
            </div>
            <p class="text-sm text-gray-600 truncate">
              {{ selectedFiles[index]?.name }}
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