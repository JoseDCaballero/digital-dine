<template>
    <div>
      <h1>Our available drinks</h1>
      <div v-if="images.length">
        <div v-for="(image, index) in images" :key="index" class="image-container">
          <img :src="image" alt="Imagen en buploads" />
        </div>
      </div>
      <div v-else>
        <p>No hay imágenes para mostrar.</p>
      </div>      
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const images = ref([]);
  
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/bfiles/');
      images.value = response.data;
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
    }
  };
  
  onMounted(() => {
    fetchImages();
  });
  </script>
  
  <style scoped>
  .image-container {
    display: inline-block;
    margin: 10px;
  }

  .image-container img {
  max-width: 200px;
  height: auto;
  display: block;
  border: 1px solid #000;
  padding: 10px;
  border-radius: 10px;
}
  </style>
  