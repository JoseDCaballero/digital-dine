<template>
  <div class="card-container">
    <h1>Our available dishes</h1>
    <Loading v-if="loading" />
    <div v-else>
      <div v-if="images.length" class="card-wrapper">
        <div v-for="(image, index) in images" :key="index" class="card">
          <img :src="image.url" :alt="image.name" class="card-image" @click="expandImage(image.url)">
          <div class="card-content">
            <h3 class="card-title">{{ image.name }}</h3>
            <p class="card-description">{{ image.description }}</p>
            <p class="card-price">Price: ${{ image.price }}</p>
            <button class="add-to-cart-button" @click="addToCart(image)">Add to Cart</button>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No dishes available</p>
      </div>
    </div>
    <!-- Expanded Image Overlay -->
    <div v-if="expandedImage" class="expanded-image-overlay" @click="closeExpandedImage">
      <span class="close-icon">
        <!-- SVG for the close icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
      <img :src="expandedImage" alt="Expanded Image">
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
    const response = await axios.get(import.meta.env.VITE_API_URL + '/files/');
    images.value = response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    loading.value = false;
  }
};

const addToCart = (image) => {
  let conf = confirm(`¿Desea añadir ${image.name} al carrito por $${image.price}?`);
  if (conf) {
    alert(`${image.name} añadido al carrito.`);
  }
}

const expandImage = (imageUrl) => {
  expandedImage.value = imageUrl;
}

const closeExpandedImage = () => {
  expandedImage.value = null;
}

onMounted(() => {
  fetchImages();
});
</script>

<style scoped>
.card-container {
  padding: 20px;
}

.card-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.card {
  width: calc(25% - 10px); /* 4 tarjetas por fila */
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

@media screen and (max-width: 768px) {
  .card {
    width: calc(33.33% - 10px); /* 3 tarjetas por fila en pantallas medianas */
  }
}

@media screen and (max-width: 576px) {
  .card {
    width: calc(50% - 10px); /* 2 tarjetas por fila en pantallas pequeñas */
  }
}

.card-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
  cursor: pointer; 
}

.card-content {
  padding: 10px;
  text-align: center;
}

.card-title {
  margin-top: 0;
}

.card-description {
  font-size: 14px;
}

.card-price {
  font-weight: bold;
  margin-top: 10px;
}

.add-to-cart-button {
  display: block;
  width: 100%;
  padding: 8px 0;
  border: none;
  background-color: #007bff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.add-to-cart-button:hover {
  background-color: #0056b3;
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

.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
