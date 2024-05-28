<template>
    <div>
      <input type="file" @change="handleFileUpload">      
    </div>
    <button @click="uploadFile" class="btnsubir">Upload</button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const selectedFile = ref(null);
  
  const handleFileUpload = (event) => {
    selectedFile.value = event.target.files[0];
  };
  
  const uploadFile = async () => {
    if (!selectedFile.value) {
      alert('Por favor, selecciona un archivo primero.');
      return;
    }
  
    let formData = new FormData();
    formData.append('file', selectedFile.value);
  
    let val = confirm("¿La imagen seleccionada es la correcta a subir?");
  
    if (val) {
      try {
        const response = await axios.post(/*'http://localhost:8000*/VITE_API_URL+'/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert("La imagen se subió correctamente");
        console.log(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error al subir el archivo');
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
  