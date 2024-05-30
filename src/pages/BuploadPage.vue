<template>
  <div class="container">
    <div v-if="imagePreview" class="image-preview">
      <img :src="imagePreview" alt="Vista previa de la imagen" class="preview-img"/>
    </div>
    <div class="upload-section">
      <input type="file" @change="onFileChange" id="file-upload" class="file-input">
      <label for="file-upload" class="file-label">Seleccionar archivo</label>
    </div>
    <button @click="uploadFile" class="btnsubir">Subir</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const selectedFile = ref(null);
const imagePreview = ref(null);

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile.value);
  }
};

const uploadFile = async () => {
  if (!selectedFile.value) {
    alert('Por favor, selecciona un archivo primero.');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  let conf = confirm("¿Se seleccionó la imagen correcta?");

  if (conf) {
    try {
      const response = await axios.post(import.meta.env.VITE_API_URL+'/bupload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Imagen subida correctamente");
    } catch (error) {
      alert("Error al subir el archivo");
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
  padding: 20px;
}

.upload-section {
  margin-bottom: 20px;
  position: relative;
}

.file-input {
  display: none;
}

.file-label {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.file-label:hover {
  background-color: #2980b9;
}

.image-preview {
  margin-bottom: 20px;
}

.preview-img {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btnsubir {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #2ecc71;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btnsubir:hover {
  background-color: #27ae60;
}
</style>