<template>
  <div id="app">
    <h1>Categorias del restaurante</h1>
    <Loadi v-if="loading" />
    <div v-else>
      <div v-if="categories.length" class="grid">
        <div class="card" v-for="category in categories" :key="category.id" @click="navigateToCategory(category.name)">
          <img :src="category.url" :alt="category.name" />
          <p>{{ category.name }}</p>
        </div>
      </div>
      <p v-else>No categories found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Loadi from '../components/Loadi.vue';

const categories = ref([]);
const router = useRouter();

const loading = ref(true);

const fetchCategories = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL + '/categories/');
    categories.value = response.data;
  } catch (error) {
    console.error("There was an error!", error);
  }finally {
    loading.value = false;
  }
};

const navigateToCategory = (categoryName) => {
  router.push('/restaurant/' + categoryName);
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* Dos columnas con el mismo ancho */
  gap: 10px;
  /* Espacio entre los elementos */
  padding: 10px;
}

.card {
  text-align: center;
  padding: 10px;
}

.card:hover {
  cursor: pointer;
}

.card img {
  width: 100%;
  /* Ancho del 100% para ajustarse al contenedor */
  height: 200px;
  /* Altura fija para las imágenes */
  object-fit: cover;
  /* Ajustar la imagen manteniendo la proporción */
}

.card p {
  margin: 0;
  padding: 10px;
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    /* Mantener dos columnas en dispositivos móviles */
    gap: 10px;
    /* Espacio entre los elementos */
    padding: 10px;
  }

  .card img {
    height: 150px;
    /* Ajustar la altura para dispositivos móviles */
  }
}
</style>
