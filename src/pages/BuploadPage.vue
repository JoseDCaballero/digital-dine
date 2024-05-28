<template>
    <div>
      <input type="file" @change="onFileChange" />      
    </div>
    <button @click="uploadFile" class="btnsubir">Upload</button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const selectedFile = ref(null);
  
  const onFileChange = (event) => {
    selectedFile.value = event.target.files[0];
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
        const response = await axios.post('http://localhost:8000/bupload/', formData, {
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
  .btnsubir {
    border: 2px solid #000;
    padding: 10px;
    border-radius: 30px;
    background-color: aqua;
  }
  
  .btnsubir:hover {
    cursor: pointer;
    background-color: rgb(0, 186, 186);
  }
  </style>
  