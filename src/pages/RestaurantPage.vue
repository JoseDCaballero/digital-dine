<template>
  <div id="app">
    <h1>Restaurant categories</h1>
    <div v-if="categories.length" class="grid">
      <div class="card" v-for="category in categories" :key="category.id" @click="navigateToCategory(category.name)">
        <img :src="category.url" :alt="category.name" />
        <p>{{ category.name }}</p>
      </div>
    </div>
    <p v-else>No categories found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const categories = ref([]);
const router = useRouter();

const fetchCategories = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/categories/');
    categories.value = response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }
};

const navigateToCategory = (categoryName) => {
  "router.push({ name: 'CategoriesPage', params: { categoryName } });"
  router.push('/restaurant/'+categoryName);
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Dos columnas con el mismo ancho */
  gap: 0px;
  padding: 0px;
}

.card {
  text-align: center;
  padding: 10px;
}

.card:hover{
  cursor:pointer;
}

.card img {
  width: 400px; /* Ancho fijo para las imágenes */
  height: 300px; /* Altura fija para las imágenes */
  object-fit: cover; /* Ajustar la imagen manteniendo la proporción */
}

.card p {
  margin: 0;
  padding: 10px;
}
</style>