<template>
  <div>
    <h1>Our available dishes</h1>
    <div v-if="images.length">
      <div v-for="image in images" :key="image" class="image-container">
        <img :src="image" alt="Imagen">
      </div>
    </div>
    <div v-else>
      <p>No dishes available</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const images = ref([]);

const fetchImages = async () => {
  try {
    const response = await axios.get(/*'http://localhost:8000*/VITE_API_URL+'/files/');
    images.value = response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
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
