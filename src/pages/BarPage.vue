<template>
  <div>
    <h1>Our available drinks</h1>
    <Loading v-if="loading" />
    <div v-else>
      <div v-if="images.length">
        <div v-for="(image, index) in images" :key="index" class="image-container">
          <img :src="image" alt="Drink Image" @click="expandImage(image)">
          <p>Bebida</p>
          <p>Esta bebida sabe buena</p>
          <p>$250.00 MXN</p>
          <button class="cross-button" @click="addToCart"></button>
        </div>
      </div>
      <div v-else>
        <p>No drinks available</p>
      </div>
    </div>
    <!-- Expanded Image Overlay -->
    <div v-if="expandedImage" class="expanded-image-overlay" @click="closeExpandedImage">
      <img :src="expandedImage" alt="Expanded Drink Image">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Loading from '../components/Loading.vue';

const images = ref([]);
const expandedImage = ref(null);
const loading = ref(true);

const fetchImages = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/bfiles/');
    images.value = response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    loading.value = false;
  }
};

const addToCart = () => {
  let conf = confirm("¿Desea añadir ${{hdhdjs}}?")
  if (conf) {
    alert("Añadido ${{hdhdjs}}")
  }
}

const expandImage = (image) => {
  expandedImage.value = image;
}

const closeExpandedImage = () => {
  expandedImage.value = null;
}

onMounted(() => {
  fetchImages();
});
</script>

<style scoped>
.image-container {
  display: inline-block;
  margin: 10px;
  border: 1px solid #000;
}

.image-container img {
  /* max-width: 200px; */
  width: 35vh;
  height: 20vh;
  display: block;  
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.cross-button {
  width: 40px;
  height: 40px;
  border: none;
  position: relative;
  cursor: pointer;
  background-color: rgb(255, 255, 255);
}
  
.cross-button::before, .cross-button::after {
  content: '';
  position: absolute;
  background-color: #000;
}
  
.cross-button::before {
  width: 1px;
  height: 25px;
  top: 7px;
  left: 20px;
}
  
.cross-button::after {
  width: 25px;
  height: 1px;
  top: 20px;
  left: 7px;
}

.expanded-image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;  
}

.expanded-image-overlay img {
  max-width: 90%;
  max-height: 90%;
}
</style>
